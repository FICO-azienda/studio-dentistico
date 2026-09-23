/**
 * Funzione serverless per l'elenco delle prenotazioni — runtime Node di Vercel.
 *
 * Endpoint: GET /api/staff/prenotazioni
 * Header:   Authorization: Bearer <STAFF_TOKEN>
 * Risposta: { ok: true, prenotazioni: [...] } — piu' recenti prima.
 *
 * Non disponibile in modalita' BOOKING_STORE=http (sola scrittura, vedi
 * api/_lib/store.mjs): in quel caso torna un elenco vuoto con una nota.
 */
import { corsHeaders } from '../_lib/handler.mjs';
import { staffTokenValido, estraiToken } from '../_lib/staff-auth.mjs';
import { listBookings } from '../_lib/store.mjs';

export const config = { runtime: 'nodejs' };

export default async function handler(req, res) {
  const origin = req.headers.origin || '';
  const cors = corsHeaders(origin);
  for (const [k, v] of Object.entries(cors)) res.setHeader(k, v);

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET, OPTIONS');
    return res.status(405).json({ ok: false, error: 'method_not_allowed' });
  }

  if (!staffTokenValido(estraiToken(req), process.env)) {
    return res.status(401).json({ ok: false, error: 'non_autorizzato' });
  }

  try {
    const kind = process.env.BOOKING_STORE || 'log';
    if (kind === 'http') {
      return res.status(200).json({ ok: true, prenotazioni: [], nota: 'BOOKING_STORE=http non supporta la lettura: elenco non disponibile.' });
    }
    const prenotazioni = await listBookings();
    return res.status(200).json({ ok: true, prenotazioni });
  } catch (e) {
    console.error('STAFF_LISTA_FATAL ' + JSON.stringify({ error: String(e?.stack || e) }));
    return res.status(500).json({ ok: false, error: 'server_error' });
  }
}
