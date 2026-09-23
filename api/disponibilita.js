/**
 * Funzione serverless per la disponibilita' degli slot — runtime Node di Vercel.
 *
 * Endpoint: GET /api/disponibilita?giorno=2026-11-24
 * Risposta: { ok: true, giorno, occupati: ["08:30", "10:00", ...] }
 *
 * Sola lettura: la scrittura avviene quando lo studio conferma un
 * appuntamento (scripts/invia-conferma.mjs), non da qui.
 */
import { getDayOccupied } from './_lib/availability.mjs';
import { giornoChiuso } from './_lib/chiusure.mjs';
import { corsHeaders } from './_lib/handler.mjs';

export const config = { runtime: 'nodejs' };

const GIORNO_RE = /^\d{4}-\d{2}-\d{2}$/;

export default async function handler(req, res) {
  const origin = req.headers.origin || '';
  const cors = corsHeaders(origin);
  for (const [k, v] of Object.entries(cors)) res.setHeader(k, v);

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET, OPTIONS');
    return res.status(405).json({ ok: false, error: 'method_not_allowed' });
  }

  const giorno = String(req.query.giorno || '').slice(0, 10);
  if (!GIORNO_RE.test(giorno)) {
    return res.status(400).json({ ok: false, error: 'giorno_non_valido' });
  }

  try {
    const chiuso = giornoChiuso(giorno);
    const occupato = chiuso ? {} : await getDayOccupied(giorno);
    return res.status(200).json({ ok: true, giorno, chiuso, occupati: Object.keys(occupato) });
  } catch (e) {
    console.error('DISPONIBILITA_FATAL ' + JSON.stringify({ giorno, error: String(e?.stack || e) }));
    return res.status(500).json({ ok: false, error: 'server_error' });
  }
}
