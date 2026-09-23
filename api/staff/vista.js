/**
 * Funzione serverless per segnare una prenotazione come vista — runtime
 * Node di Vercel.
 *
 * Endpoint: POST /api/staff/vista  { bookingId }
 * Header:   Authorization: Bearer <STAFF_TOKEN>
 *
 * Non cambia lo stato della prenotazione: serve solo a far sparire
 * l'indicatore "da rivedere" dalla dashboard per le prenotazioni confermate
 * automaticamente (vedi api/_lib/handler.mjs). Le prenotazioni confermate a
 * mano (da qui o da scripts/invia-conferma.mjs) sono gia' considerate viste.
 */
import { corsHeaders } from '../_lib/handler.mjs';
import { staffTokenValido, estraiToken } from '../_lib/staff-auth.mjs';
import { updateBooking } from '../_lib/store.mjs';

export const config = { runtime: 'nodejs' };

const leggiCorpo = async (req) => {
  if (req.body && typeof req.body === 'object') return req.body;
  let raw = '';
  for await (const chunk of req) raw += chunk;
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export default async function handler(req, res) {
  const origin = req.headers.origin || '';
  const cors = corsHeaders(origin);
  for (const [k, v] of Object.entries(cors)) res.setHeader(k, v);

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST, OPTIONS');
    return res.status(405).json({ ok: false, error: 'method_not_allowed' });
  }

  if (!staffTokenValido(estraiToken(req), process.env)) {
    return res.status(401).json({ ok: false, error: 'non_autorizzato' });
  }

  const body = await leggiCorpo(req);
  if (body === null) return res.status(400).json({ ok: false, error: 'bad_json' });
  const bookingId = String(body.bookingId || '').slice(0, 40);
  if (!bookingId) return res.status(400).json({ ok: false, error: 'bookingId_mancante' });

  try {
    const aggiornato = await updateBooking(bookingId, { staff_reviewed: true });
    if (!aggiornato) return res.status(404).json({ ok: false, error: 'non_trovata' });
    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error('STAFF_VISTA_FATAL ' + JSON.stringify({ bookingId, error: String(e?.stack || e) }));
    return res.status(500).json({ ok: false, error: 'server_error' });
  }
}
