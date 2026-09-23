/**
 * Funzione serverless per lo spostamento self-service — runtime Node di Vercel.
 *
 * Endpoint: POST /api/prenotazione-sposta  { b, t, data, ora }
 * Stesse regole dell'annullamento (finestra di 24 ore sull'appuntamento
 * originale) piu' il controllo di disponibilita' del nuovo orario, con lo
 * stesso numero di slot del servizio prenotato.
 */
import { corsHeaders } from './_lib/handler.mjs';
import { verifyToken } from './_lib/token.mjs';
import { sposta } from './_lib/manage.mjs';
import { notificaSpostamento } from './_lib/notify.mjs';

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

  const body = await leggiCorpo(req);
  if (body === null) return res.status(400).json({ ok: false, error: 'bad_json' });

  const bookingId = String(body.b || '').slice(0, 40);
  const token = String(body.t || '').slice(0, 64);
  const nuovaData = String(body.data || '');
  const nuovaOra = String(body.ora || '');
  if (!bookingId || !verifyToken(bookingId, token)) {
    return res.status(403).json({ ok: false, error: 'token_non_valido' });
  }
  if (!GIORNO_RE.test(nuovaData) || !ORA_RE.test(nuovaOra)) {
    return res.status(400).json({ ok: false, error: 'dati_non_validi' });
  }

  try {
    const esito = await sposta(bookingId, nuovaData, nuovaOra);
    if (!esito.ok) {
      const status =
        esito.error === 'non_trovata' ? 404 : esito.error === 'fuori_finestra' ? 409 : esito.error === 'slot_occupato' ? 409 : 422;
      return res.status(status).json(esito);
    }
    await notificaSpostamento(esito.record, esito.precedente).catch((e) =>
      console.error('SPOSTAMENTO_MAIL_ERRORE ' + JSON.stringify({ bookingId, error: String(e?.message || e) }))
    );
    return res.status(200).json({ ok: true, data: esito.record.data_richiesta, ora: esito.record.ora_richiesta });
  } catch (e) {
    console.error('PRENOTAZIONE_SPOSTA_FATAL ' + JSON.stringify({ bookingId, error: String(e?.stack || e) }));
    return res.status(500).json({ ok: false, error: 'server_error' });
  }
}
