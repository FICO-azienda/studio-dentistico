/**
 * Orchestrazione della richiesta di appuntamento, indipendente dalla
 * piattaforma: riceve un oggetto semplice e restituisce { status, body }.
 * Gli adattatori (Vercel, Netlify, Workers) si limitano a tradurre.
 *
 * Ordine delle operazioni, scelto apposta:
 *   1. anti-spam e limite di frequenza  (scarta presto cio' che non serve)
 *   2. validazione lato server          (non ci si fida del browser)
 *   3. salvataggio della richiesta      (PRIMA delle email: non si perde nulla)
 *   4. invio delle due email            (se fallisce, la richiesta resta salva)
 */
import { validateBooking, looksLikeSpam } from './validate.mjs';
import { rateLimit } from './ratelimit.mjs';
import { buildBookingId, buildRecord, saveBooking, nextProgressivo } from './store.mjs';
import { emailPaziente, emailStudio } from './templates.mjs';
import { sendMail } from './mail.mjs';
import { studio, destinatarioStudio, mittente } from './studio.mjs';

/**
 * Doppio invio della stessa richiesta: si risponde con lo stesso codice.
 * `recenti` copre i reinvii ravvicinati, `inCorso` quelli simultanei — due
 * click veloci partono insieme e senza questa mappa creerebbero due
 * prenotazioni distinte.
 */
const recenti = new Map();
const inCorso = new Map();
const DEDUPE_MS = 90 * 1000;

const chiave = (d) => [d.email, d.modalita, d.dataRichiesta, d.oraRichiesta, d.tipoVisita].join('|');

function dedupe(d, now) {
  for (const [k, v] of recenti) if (now - v.at > DEDUPE_MS) recenti.delete(k);
  return recenti.get(chiave(d)) || null;
}

export async function handleBooking(body, ctx = {}) {
  const { ip = 'sconosciuto', userAgent = '', env = process.env, now = Date.now() } = ctx;

  // 1. anti-spam: si risponde 200 senza fare nulla, per non istruire i bot
  const spam = looksLikeSpam(body, { now });
  if (spam) {
    console.warn('BOOKING_SPAM ' + JSON.stringify({ ip, motivo: spam }));
    return { status: 200, body: { ok: true, bookingId: null, ignored: true } };
  }

  // 2. limite di frequenza per indirizzo IP
  const rl = await rateLimit(ip, { max: Number(env.RATELIMIT_MAX || 5), env, now });
  if (!rl.allowed) {
    return {
      status: 429,
      headers: { 'Retry-After': String(rl.retryAfter) },
      body: {
        ok: false,
        error: 'rate_limited',
        message: 'Hai inviato troppe richieste ravvicinate. Riprova tra qualche minuto oppure chiamaci.'
      }
    };
  }

  // 3. validazione
  const v = validateBooking(body, { today: new Date(now) });
  if (!v.ok) {
    return {
      status: 422,
      body: {
        ok: false,
        error: 'validation',
        message: 'Alcuni dati non sono validi. Controlla i campi evidenziati.',
        fields: v.errors
      }
    };
  }
  const data = v.data;

  // reinvio ravvicinato: stesso codice, nessuna prenotazione duplicata
  const gia = dedupe(data, now);
  if (gia) {
    return { status: 200, body: { ok: true, bookingId: gia.bookingId, emailSent: gia.emailSent, duplicate: true } };
  }

  // invio simultaneo (doppio click): ci si aggancia all'elaborazione in corso
  const k = chiave(data);
  const pendente = inCorso.get(k);
  if (pendente) {
    const esito = await pendente;
    return { status: 200, body: { ...esito.body, duplicate: true } };
  }

  const lavoro = elabora(data, { ip, userAgent, env, now, k });
  inCorso.set(k, lavoro);
  try {
    return await lavoro;
  } finally {
    inCorso.delete(k);
  }
}

/** Codice richiesta, salvataggio e invio delle email. */
async function elabora(data, { ip, userAgent, env, now, k }) {
  // 4. codice richiesta e salvataggio, prima di qualunque email
  const progressivo = await nextProgressivo(env).catch(() => null);
  const bookingId = buildBookingId(progressivo, { year: new Date(now).getFullYear() });
  const record = buildRecord(data, { bookingId, ip, userAgent, now: new Date(now) });
  const salvataggio = await saveBooking(record, env);

  // 5. email: al paziente e allo studio, in parallelo
  const alPaziente = emailPaziente(record);
  const alloStudio = emailStudio(record);

  const [esitoPaziente, esitoStudio] = await Promise.all([
    sendMail({ from: mittente, to: record.email, replyTo: studio.email || undefined, ...alPaziente }, env),
    destinatarioStudio
      ? sendMail({ from: mittente, to: destinatarioStudio, replyTo: record.email, ...alloStudio }, env)
      : Promise.resolve({ ok: false, error: 'destinatario studio non configurato' })
  ]);

  if (!esitoPaziente.ok || !esitoStudio.ok) {
    console.error(
      'BOOKING_MAIL_PARZIALE ' +
        JSON.stringify({
          booking_id: bookingId,
          paziente: esitoPaziente.ok ? 'ok' : esitoPaziente.error,
          studio: esitoStudio.ok ? 'ok' : esitoStudio.error
        })
    );
  }

  recenti.set(k, { at: now, bookingId, emailSent: esitoPaziente.ok });

  return {
    status: 201,
    body: {
      ok: true,
      bookingId,
      status: record.status,
      // il front-end usa questo per non promettere un'email che non e' partita
      emailSent: esitoPaziente.ok,
      studioNotified: esitoStudio.ok,
      stored: salvataggio.saved,
      riepilogo: {
        nome: record.nome,
        servizio: record.tipo_visita,
        modalita: record.modalita,
        data: record.data_richiesta,
        ora: record.ora_richiesta
      }
      // priorita' e tag restano interni: non vengono restituiti al browser
    }
  };
}

/** Intestazioni CORS: il sito statico puo' stare su un dominio diverso dall'API. */
export function corsHeaders(origin, env = process.env) {
  const consentiti = (env.ALLOWED_ORIGINS || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  const ok = consentiti.length === 0 || consentiti.includes(origin);
  return {
    'Access-Control-Allow-Origin': ok && origin ? origin : consentiti[0] || '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin'
  };
}
