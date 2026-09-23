/**
 * Token di gestione prenotazione: firma HMAC del booking_id, senza stato.
 *
 * Non serve archiviare il token da nessuna parte: chiunque abbia il link
 * ricevuto via email puo' dimostrare di essere il titolare della
 * prenotazione perche' solo il server conosce BOOKING_TOKEN_SECRET. Il
 * token resta valido finche' la prenotazione esiste (niente scadenza
 * separata da gestire): a cancellazione avvenuta, l'azione successiva
 * fallisce comunque perche' lo stato non e' piu' gestibile.
 */
import { createHmac, timingSafeEqual } from 'node:crypto';
import { studio } from './studio.mjs';
import { ROUTES } from '../../src/build/i18n.mjs';

const secret = (env) => env.BOOKING_TOKEN_SECRET || env.MAIL_FROM || 'dev-secret-non-usare-in-produzione';

const firma = (bookingId, env) =>
  createHmac('sha256', secret(env)).update(bookingId).digest('base64url').slice(0, 24);

export function mintToken(bookingId, env = process.env) {
  return firma(bookingId, env);
}

export function verifyToken(bookingId, token, env = process.env) {
  if (!bookingId || !token) return false;
  const atteso = firma(bookingId, env);
  const a = Buffer.from(atteso);
  const b = Buffer.from(String(token));
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

/** URL della pagina di autogestione per un booking, nella lingua del paziente. */
export function manageUrl(bookingId, lang = 'it', env = process.env) {
  const base = studio.sito.replace(/\/$/, '');
  const r = ROUTES[lang] || ROUTES.it;
  const token = mintToken(bookingId, env);
  return `${base}/${lang}/${r.manage}/?b=${encodeURIComponent(bookingId)}&t=${encodeURIComponent(token)}`;
}
