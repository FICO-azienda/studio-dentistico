/**
 * Funzione serverless per confermare una richiesta — runtime Node di Vercel.
 *
 * Endpoint: POST /api/staff/conferma  { bookingId, professionista?, nota?, data?, ora? }
 * Header:   Authorization: Bearer <STAFF_TOKEN>
 *
 * Equivalente web di scripts/invia-conferma.mjs: occupa lo slot, salva lo
 * stato CONFIRMED e invia al paziente l'email con l'invito .ics. Funziona
 * solo su richieste PENDING.
 */
import { corsHeaders } from '../_lib/handler.mjs';
import { staffTokenValido, estraiToken } from '../_lib/staff-auth.mjs';
import { confermaPrenotazione } from '../_lib/confirm.mjs';

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
  if (!bookingId) return res.status(400).json({ ok: false, error: 'bookingId_mancante' });
  const data = body.data ? String(body.data) : undefined;
  const ora = body.ora ? String(body.ora) : undefined;
  if ((data && !GIORNO_RE.test(data)) || (ora && !ORA_RE.test(ora))) {
    return res.status(400).json({ ok: false, error: 'dati_non_validi' });
  }

  try {
    const esito = await confermaPrenotazione(bookingId, {
      professionista: String(body.professionista || ''),
      nota: String(body.nota || ''),
      data,
      ora
    });
    if (!esito.ok) {
      const status =
        esito.error === 'non_trovata'
          ? 404
          : ['occupato', 'giorno_chiuso'].includes(esito.error)
            ? 409
            : esito.error === 'stato_non_confermabile'
              ? 422
              : 400;
      return res.status(status).json(esito);
    }
    return res.status(200).json({ ok: true, record: esito.record, emailSent: esito.emailSent });
  } catch (e) {
    console.error('STAFF_CONFERMA_FATAL ' + JSON.stringify({ bookingId, error: String(e?.stack || e) }));
    return res.status(500).json({ ok: false, error: 'server_error' });
  }
}
