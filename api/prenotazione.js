/**
 * Funzione serverless per lo stato di una prenotazione — runtime Node di Vercel.
 *
 * Endpoint: GET /api/prenotazione?b=APT-2026-000124&t=<token>
 * Usato dalla pagina di autogestione per sapere cosa mostrare: i dettagli
 * dell'appuntamento e se l'azione self-service (annulla/sposta) e' ancora
 * consentita (regola delle 24 ore, vedi api/_lib/manage.mjs).
 */
import { corsHeaders } from './_lib/handler.mjs';
import { verifyToken } from './_lib/token.mjs';
import { statoPrenotazione } from './_lib/manage.mjs';

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

  const bookingId = String(req.query.b || '').slice(0, 40);
  const token = String(req.query.t || '').slice(0, 64);
  if (!bookingId || !verifyToken(bookingId, token)) {
    return res.status(403).json({ ok: false, error: 'token_non_valido' });
  }

  try {
    const stato = await statoPrenotazione(bookingId);
    return res.status(stato.ok ? 200 : 404).json(stato);
  } catch (e) {
    console.error('PRENOTAZIONE_STATO_FATAL ' + JSON.stringify({ bookingId, error: String(e?.stack || e) }));
    return res.status(500).json({ ok: false, error: 'server_error' });
  }
}
