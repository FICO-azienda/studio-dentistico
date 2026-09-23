/**
 * Archivio delle richieste di appuntamento.
 *
 * Regola non negoziabile: la richiesta viene salvata PRIMA di tentare l'invio
 * delle email. Se il servizio email cade, i dati del paziente non si perdono.
 *
 * Adattatori disponibili, scelti con la variabile d'ambiente BOOKING_STORE:
 *   log   (predefinito) una riga JSON su stdout, recuperabile dai log della
 *         piattaforma, PIU' un file locale (.data/prenotazioni.json) usato
 *         come archivio interrogabile in sviluppo, dove non c'e' un vero KV.
 *   kv    Vercel KV / Upstash Redis via REST (KV_REST_API_URL, KV_REST_API_TOKEN)
 *   http  POST a un endpoint proprio (BOOKING_WEBHOOK_URL, BOOKING_WEBHOOK_TOKEN).
 *         Sola scrittura: getBooking/updateBooking non sono disponibili in
 *         questa modalita' (il webhook e' un sistema esterno, non lo si
 *         puo' interrogare da qui) — l'autogestione (annulla/sposta) resta
 *         quindi non disponibile finche' non si passa a 'kv'.
 *
 * Schema del record:
 *   booking_id, nome, cognome, email, telefono, tipo_visita, riepilogo_servizio,
 *   priority, tags, modalita, canale_contatto, fascia_contatto, data_richiesta,
 *   ora_richiesta, seconda_preferenza, messaggio, status, created_at
 */
import fs from 'node:fs';
import path from 'node:path';
import { kvCredenziali, assertArchivioAffidabile } from './kv-config.mjs';

const FILE_STORE = path.resolve(process.cwd(), '.data', 'prenotazioni.json');

function fileLeggiTutto() {
  try {
    return JSON.parse(fs.readFileSync(FILE_STORE, 'utf8'));
  } catch {
    return {};
  }
}

function fileScrivi(record) {
  const db = fileLeggiTutto();
  db[record.booking_id] = record;
  fs.mkdirSync(path.dirname(FILE_STORE), { recursive: true });
  fs.writeFileSync(FILE_STORE, JSON.stringify(db, null, 2));
}

export const STATI = ['PENDING', 'CONFIRMED', 'RESCHEDULED', 'CANCELLED', 'COMPLETED'];

/**
 * Codice richiesta leggibile e univoco: APT-2026-000124.
 * Il progressivo arriva dal contatore dell'archivio quando disponibile,
 * altrimenti da un numero casuale: resta comunque identificabile.
 */
export function buildBookingId(progressivo, { year = new Date().getFullYear() } = {}) {
  const n = Number.isFinite(progressivo) && progressivo > 0
    ? progressivo
    : Math.floor(Math.random() * 900000) + 100000;
  return `APT-${year}-${String(n).padStart(6, '0')}`;
}

/** Trasforma i dati validati nel record da archiviare. */
export function buildRecord(data, { bookingId, ip = '', userAgent = '', now = new Date() }) {
  const seconda = data.secondaData
    ? data.secondaData + (data.secondaOra ? ' ' + data.secondaOra : '')
    : '';
  return {
    booking_id: bookingId,
    nome: data.nome,
    cognome: data.cognome,
    email: data.email,
    telefono: data.telefono,
    tipo_visita: data.tipoVisitaLabel,
    tipo_visita_slug: data.tipoVisita,
    // risposte alle domande condizionali del servizio scelto
    riepilogo_servizio: data.riepilogoServizio || [],
    risposte: data.risposte || {},
    // classificazione interna, non e' una diagnosi e non viene mostrata al paziente
    priority: data.priorita || 'normal',
    tags: data.tags || [],
    modalita: data.modalita,
    canale_contatto: data.canale || '',
    fascia_contatto: data.fascia || '',
    professionista: data.dottore,
    data_richiesta: data.dataRichiesta,
    ora_richiesta: data.oraRichiesta,
    seconda_preferenza: seconda,
    messaggio: data.messaggio,
    lingua: data.lang || 'it',
    consenso_privacy: data.privacy,
    consenso_comunicazioni: data.comunicazioni,
    status: 'PENDING',
    created_at: now.toISOString(),
    origine: { ip, user_agent: String(userAgent || '').slice(0, 200) }
  };
}

/** La riga di log e' sempre scritta: e' l'ultima rete se tutto il resto fallisce. */
function logRecord(record) {
  // una riga sola, parsabile: facile da estrarre dai log della piattaforma
  console.log('BOOKING ' + JSON.stringify(record));
}

async function kvSave(record, env) {
  const { url, token } = kvCredenziali(env);
  const headers = { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' };
  // contatore progressivo + record + indice cronologico, in tre chiamate
  const key = 'booking:' + record.booking_id;
  const res = await fetch(url + '/set/' + encodeURIComponent(key), {
    method: 'POST',
    headers,
    body: JSON.stringify(record)
  });
  if (!res.ok) throw new Error('KV set ' + res.status);
  await fetch(url + '/lpush/bookings/' + encodeURIComponent(record.booking_id), { method: 'POST', headers }).catch(() => {});
}

async function kvGet(bookingId, env) {
  const { url, token } = kvCredenziali(env);
  const res = await fetch(url + '/get/' + encodeURIComponent('booking:' + bookingId), {
    headers: { Authorization: 'Bearer ' + token }
  });
  if (!res.ok) return null;
  const j = await res.json();
  if (!j.result) return null;
  try {
    return JSON.parse(j.result);
  } catch {
    return null;
  }
}

async function kvNextId(env) {
  const url = env.KV_REST_API_URL;
  const token = env.KV_REST_API_TOKEN;
  if (!url || !token) return null;
  try {
    const res = await fetch(url + '/incr/booking:counter', {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + token }
    });
    if (!res.ok) return null;
    const j = await res.json();
    return Number(j.result) || null;
  } catch {
    return null;
  }
}

async function httpSave(record, env) {
  const url = env.BOOKING_WEBHOOK_URL;
  if (!url) throw new Error('webhook non configurato');
  const headers = { 'Content-Type': 'application/json' };
  if (env.BOOKING_WEBHOOK_TOKEN) headers.Authorization = 'Bearer ' + env.BOOKING_WEBHOOK_TOKEN;
  const res = await fetch(url, { method: 'POST', headers, body: JSON.stringify(record) });
  if (!res.ok) throw new Error('webhook ' + res.status);
}

/** Chiede all'archivio il prossimo progressivo. Se non e' possibile, restituisce null. */
export async function nextProgressivo(env = process.env) {
  if ((env.BOOKING_STORE || 'log') === 'kv') return kvNextId(env);
  return null;
}

/**
 * Salva il record. Non solleva mai: se l'adattatore fallisce restituisce
 * { saved: false, error } ma la riga di log e' comunque stata scritta.
 */
export async function saveBooking(record, env = process.env) {
  logRecord(record); // scritto per primo e sempre: e' la vera ultima rete, vedi commento sopra
  const kind = env.BOOKING_STORE || 'log';
  try {
    if (kind === 'log') fileScrivi(record);
    else if (kind === 'kv') await kvSave(record, env);
    else if (kind === 'http') await httpSave(record, env);
    else throw new Error('archivio sconosciuto: ' + kind);
    return { saved: true, store: kind };
  } catch (e) {
    // un fallimento qui (es. filesystem non scrivibile su un deployment
    // serverless) non deve far fallire la richiesta: il record e' comunque
    // nei log della piattaforma, recuperabile a mano se serve
    console.error('BOOKING_STORE_ERROR ' + JSON.stringify({ booking_id: record.booking_id, store: kind, error: String(e.message || e) }));
    return { saved: false, store: kind, error: String(e.message || e) };
  }
}

/** Legge un record esistente per booking_id. Ritorna null se non trovato o non leggibile (modalita' 'http'). */
export async function getBooking(bookingId, env = process.env) {
  const kind = env.BOOKING_STORE || 'log';
  if (kind === 'kv') return kvGet(bookingId, env);
  if (kind === 'http') return null;
  assertArchivioAffidabile(kind, env);
  return fileLeggiTutto()[bookingId] || null;
}

/**
 * Applica una modifica a un record esistente (es. cancellazione, spostamento)
 * e lo riscrive. Ritorna il record aggiornato, o null se non trovato o se
 * l'archivio non supporta la lettura (modalita' 'http').
 */
export async function updateBooking(bookingId, patch, env = process.env) {
  const attuale = await getBooking(bookingId, env);
  if (!attuale) return null;
  const aggiornato = { ...attuale, ...patch };
  logRecord({ ...aggiornato, evento: 'AGGIORNAMENTO' });
  const kind = env.BOOKING_STORE || 'log';
  if (kind === 'kv') await kvSave(aggiornato, env);
  else fileScrivi(aggiornato);
  return aggiornato;
}
