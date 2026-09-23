/**
 * Funzione serverless per l'annullamento lato staff — runtime Node di Vercel.
 *
 * Endpoint: POST /api/staff/cancella  { bookingId }
 * Header:   Authorization: Bearer <STAFF_TOKEN>
 *
 * Come l'annullamento self-service (api/prenotazione-cancella.js) ma con
 * forza:true: bypassa la regola delle 24 ore, la valvola per i casi
 * approvati per telefono o email (vedi api/_lib/manage.mjs).
 */
import { corsHeaders } from '../_lib/handler.mjs';
import { staffTokenValido, estraiToken } from '../_lib/staff-auth.mjs';
import { cancella } from '../_lib/manage.mjs';
import { notificaAnnullamento } from '../_lib/notify.mjs';

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
    const esito = await cancella(bookingId, { forza: true });
    if (!esito.ok) {
      const status = esito.error === 'non_trovata' ? 404 : 422;
      return res.status(status).json(esito);
    }
    await notificaAnnullamento(esito.record).catch((e) =>
      console.error('STAFF_CANCELLAZIONE_MAIL_ERRORE ' + JSON.stringify({ bookingId, error: String(e?.message || e) }))
    );
    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error('STAFF_CANCELLA_FATAL ' + JSON.stringify({ bookingId, error: String(e?.stack || e) }));
    return res.status(500).json({ ok: false, error: 'server_error' });
  }
}
