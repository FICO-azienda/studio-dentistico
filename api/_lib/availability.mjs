/**
 * Disponibilita' reale degli slot di prenotazione.
 *
 * Fonte di verita': le prenotazioni CONFERMATE dalla segreteria, non le
 * semplici richieste — coerente con la dicitura gia' mostrata nel wizard
 * ("gli orari mostrati sono indicativi: la segreteria conferma la
 * disponibilita' effettiva"). Uno slot diventa occupato quando lo studio
 * invia la conferma (scripts/invia-conferma.mjs), non quando arriva la
 * richiesta: cosi' una richiesta abbandonata non blocca per sempre un
 * orario, e non serve un meccanismo di scadenza separato.
 *
 * Un giorno e' un'unica voce nell'archivio: { "08:30": "APT-2026-000124", ... }.
 * Un servizio con slotCount > 1 occupa piu' orari consecutivi dell'elenco
 * content/orari.json a partire da quello scelto.
 *
 * Adattatori, sugli stessi BOOKING_STORE dell'archivio prenotazioni:
 *   kv    Vercel KV / Upstash Redis via REST (KV_REST_API_URL/TOKEN)
 *   log   e fallback senza KV: file locale su disco (utile in sviluppo)
 *   http  un webhook e' scrittura sola: qui la disponibilita' resta
 *         permissiva (nessuno slot risulta occupato), come prima di questa
 *         funzionalita' — chi usa quella modalita' gestisce il calendario
 *         altrove.
 *
 * Limite noto: lettura e scrittura del giorno non sono atomiche. Per una
 * conferma alla volta fatta da una segreteria non e' un problema reale; con
 * piu' operatori simultanei servirebbe una vera transazione lato KV.
 */
import fs from 'node:fs';
import path from 'node:path';
import { orari } from './orari.mjs';
import { giornoChiuso } from './chiusure.mjs';
import { kvCredenziali, assertArchivioAffidabile } from './kv-config.mjs';

const FILE_STORE = path.resolve(process.cwd(), '.data', 'disponibilita.json');

function fileLeggiTutto() {
  try {
    return JSON.parse(fs.readFileSync(FILE_STORE, 'utf8'));
  } catch {
    return {};
  }
}

function fileScriviTutto(db) {
  fs.mkdirSync(path.dirname(FILE_STORE), { recursive: true });
  fs.writeFileSync(FILE_STORE, JSON.stringify(db, null, 2));
}

async function kvGetDay(dataIso, env) {
  const { url, token } = kvCredenziali(env);
  const res = await fetch(url + '/get/' + encodeURIComponent('day:' + dataIso), {
    headers: { Authorization: 'Bearer ' + token }
  });
  if (!res.ok) return {};
  const j = await res.json();
  if (!j.result) return {};
  try {
    return JSON.parse(j.result);
  } catch {
    return {};
  }
}

async function kvSetDay(dataIso, giorno, env) {
  const { url, token } = kvCredenziali(env);
  const res = await fetch(url + '/set/' + encodeURIComponent('day:' + dataIso), {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' },
    body: JSON.stringify(JSON.stringify(giorno))
  });
  if (!res.ok) throw new Error('KV set giorno ' + res.status);
}

/** Legge la mappa {orario: booking_id} occupata per una data. */
export async function getDayOccupied(dataIso, env = process.env) {
  const kind = env.BOOKING_STORE || 'log';
  if (kind === 'kv') return kvGetDay(dataIso, env);
  if (kind === 'http') return {}; // sola scrittura: nessuna disponibilita' da leggere qui
  assertArchivioAffidabile(kind, env);
  return fileLeggiTutto()[dataIso] || {};
}

/** Gli orari consecutivi richiesti da un servizio a partire da uno di inizio, o null se non c'e' spazio. */
export function slotsRichiesti(oraInizio, slotCount = 1) {
  const i = orari.indexOf(oraInizio);
  if (i === -1 || i + slotCount > orari.length) return null;
  return orari.slice(i, i + slotCount);
}

/**
 * Verifica e, se libero, occupa lo slot per una prenotazione confermata.
 * Ritorna { ok: true } oppure { ok: false, motivo: 'orario_non_valido' | 'occupato' | 'giorno_chiuso' }.
 * In modalita' 'http' non fa nulla e restituisce sempre ok (nessuna
 * disponibilita' gestita qui, vedi commento in cima al file).
 */
export async function reserveSlots(dataIso, oraInizio, slotCount, bookingId, env = process.env) {
  if (giornoChiuso(dataIso)) return { ok: false, motivo: 'giorno_chiuso' };
  const richiesti = slotsRichiesti(oraInizio, slotCount);
  if (!richiesti) return { ok: false, motivo: 'orario_non_valido' };

  const kind = env.BOOKING_STORE || 'log';
  if (kind === 'http') return { ok: true, skip: true };
  assertArchivioAffidabile(kind, env);

  const giorno = kind === 'kv' ? await kvGetDay(dataIso, env) : fileLeggiTutto()[dataIso] || {};
  for (const o of richiesti) {
    if (giorno[o] && giorno[o] !== bookingId) return { ok: false, motivo: 'occupato', orario: o };
  }
  for (const o of richiesti) giorno[o] = bookingId;

  if (kind === 'kv') {
    await kvSetDay(dataIso, giorno, env);
  } else {
    const db = fileLeggiTutto();
    db[dataIso] = giorno;
    fileScriviTutto(db);
  }
  return { ok: true, orari: richiesti };
}

/** Libera tutti gli slot occupati da una prenotazione in una data (cancellazione o spostamento). */
export async function releaseSlots(dataIso, bookingId, env = process.env) {
  const kind = env.BOOKING_STORE || 'log';
  if (kind === 'http') return;
  assertArchivioAffidabile(kind, env);

  const giorno = kind === 'kv' ? await kvGetDay(dataIso, env) : fileLeggiTutto()[dataIso] || {};
  let cambiato = false;
  for (const o of Object.keys(giorno)) {
    if (giorno[o] === bookingId) {
      delete giorno[o];
      cambiato = true;
    }
  }
  if (!cambiato) return;

  if (kind === 'kv') {
    await kvSetDay(dataIso, giorno, env);
  } else {
    const db = fileLeggiTutto();
    db[dataIso] = giorno;
    fileScriviTutto(db);
  }
}
