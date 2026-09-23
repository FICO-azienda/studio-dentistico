/**
 * Funzione serverless per lo spostamento lato staff — runtime Node di Vercel.
 *
 * Endpoint: POST /api/staff/sposta  { bookingId, data, ora }
 * Header:   Authorization: Bearer <STAFF_TOKEN>
 *
 * Come lo spostamento self-service (api/prenotazione-sposta.js) ma con
 * forza:true: bypassa la regola delle 24 ore. Il nuovo orario deve comunque
 * essere libero e non cadere in un giorno di chiusura.
 */
import { corsHeaders } from '../_lib/handler.mjs';
import { staffTokenValido, estraiToken } from '../_lib/staff-auth.mjs';
import { sposta } from '../_lib/manage.mjs';
import { notificaSpostamento } from '../_lib/notify.mjs';

export const config = { runtime: 'nodejs' };

const GIORNO_RE = /^\d{4}-\d{2}-\d{2}$/;
const ORA_RE = /^\d{2}:\d{2}$/;

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
  const nuovaData = String(body.data || '');
  const nuovaOra = String(body.ora || '');
  if (!bookingId) return res.status(400).json({ ok: false, error: 'bookingId_mancante' });
  if (!GIORNO_RE.test(nuovaData) || !ORA_RE.test(nuovaOra)) {
    return res.status(400).json({ ok: false, error: 'dati_non_validi' });
  }

  try {
    const esito = await sposta(bookingId, nuovaData, nuovaOra, { forza: true });
    if (!esito.ok) {
      const status =
        esito.error === 'non_trovata' ? 404 : ['slot_occupato', 'giorno_chiuso'].includes(esito.error) ? 409 : 422;
      return res.status(status).json(esito);
    }
    await notificaSpostamento(esito.record, esito.precedente).catch((e) =>
      console.error('STAFF_SPOSTAMENTO_MAIL_ERRORE ' + JSON.stringify({ bookingId, error: String(e?.message || e) }))
    );
    return res.status(200).json({ ok: true, data: esito.record.data_richiesta, ora: esito.record.ora_richiesta });
  } catch (e) {
    console.error('STAFF_SPOSTA_FATAL ' + JSON.stringify({ bookingId, error: String(e?.stack || e) }));
    return res.status(500).json({ ok: false, error: 'server_error' });
  }
}
