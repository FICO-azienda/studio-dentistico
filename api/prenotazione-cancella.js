/**
 * Funzione serverless per l'annullamento self-service — runtime Node di Vercel.
 *
 * Endpoint: POST /api/prenotazione-cancella  { b, t }
 * Consentito solo se mancano almeno 24 ore all'appuntamento (vedi
 * api/_lib/manage.mjs): sotto quella soglia risponde 409 e il paziente va
 * indirizzato a chiamare o scrivere allo studio.
 */
import { corsHeaders } from './_lib/handler.mjs';
import { verifyToken } from './_lib/token.mjs';
import { cancella } from './_lib/manage.mjs';
import { notificaAnnullamento } from './_lib/notify.mjs';

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

  const body = await leggiCorpo(req);
  if (body === null) return res.status(400).json({ ok: false, error: 'bad_json' });

  const bookingId = String(body.b || '').slice(0, 40);
  const token = String(body.t || '').slice(0, 64);
  if (!bookingId || !verifyToken(bookingId, token)) {
    return res.status(403).json({ ok: false, error: 'token_non_valido' });
  }

  try {
    const esito = await cancella(bookingId);
    if (!esito.ok) {
      const status = esito.error === 'non_trovata' ? 404 : esito.error === 'fuori_finestra' ? 409 : 422;
      return res.status(status).json(esito);
    }
    await notificaAnnullamento(esito.record).catch((e) =>
      console.error('CANCELLAZIONE_MAIL_ERRORE ' + JSON.stringify({ bookingId, error: String(e?.message || e) }))
    );
    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error('PRENOTAZIONE_CANCELLA_FATAL ' + JSON.stringify({ bookingId, error: String(e?.stack || e) }));
    return res.status(500).json({ ok: false, error: 'server_error' });
  }
}
