/**
 * Server locale dell'API di prenotazione, per provare il flusso senza Vercel.
 *
 *   MAIL_PROVIDER=console node scripts/dev-api.mjs
 *   -> POST http://localhost:4174/api/prenotazioni
 *
 * Con MAIL_PROVIDER=console le email non partono davvero: vengono stampate.
 * Per una prova reale servono RESEND_API_KEY, MAIL_FROM e BOOKING_NOTIFY_EMAIL.
 */
import http from 'node:http';
import { handleBooking, corsHeaders } from '../api/_lib/handler.mjs';
import { getDayOccupied } from '../api/_lib/availability.mjs';
import { verifyToken } from '../api/_lib/token.mjs';
import { statoPrenotazione, cancella, sposta } from '../api/_lib/manage.mjs';
import { notificaAnnullamento, notificaSpostamento } from '../api/_lib/notify.mjs';

const PORT = Number(process.env.PORT || 4174);
const GIORNO_RE = /^\d{4}-\d{2}-\d{2}$/;
const ORA_RE = /^\d{2}:\d{2}$/;

const json = (res, status, body) => res.writeHead(status, { 'Content-Type': 'application/json' }).end(JSON.stringify(body));
const leggiCorpo = async (req) => {
  let raw = '';
  for await (const c of req) raw += c;
  try {
    return raw ? JSON.parse(raw) : {};
  } catch {
    return null;
  }
};

const server = http.createServer(async (req, res) => {
  const origin = req.headers.origin || '';
  const cors = corsHeaders(origin);
  for (const [k, v] of Object.entries(cors)) res.setHeader(k, v);

  if (req.method === 'OPTIONS') {
    res.writeHead(204).end();
    return;
  }

  const url = new URL(req.url, 'http://localhost');

  if (req.method === 'GET' && url.pathname === '/api/disponibilita') {
    const giorno = url.searchParams.get('giorno') || '';
    if (!GIORNO_RE.test(giorno)) return json(res, 400, { ok: false, error: 'giorno_non_valido' });
    const occupato = await getDayOccupied(giorno);
    return json(res, 200, { ok: true, giorno, occupati: Object.keys(occupato) });
  }

  if (req.method === 'GET' && url.pathname === '/api/prenotazione') {
    const b = url.searchParams.get('b') || '';
    const t = url.searchParams.get('t') || '';
    if (!b || !verifyToken(b, t)) return json(res, 403, { ok: false, error: 'token_non_valido' });
    const stato = await statoPrenotazione(b);
    return json(res, stato.ok ? 200 : 404, stato);
  }

  if (req.method === 'POST' && url.pathname === '/api/prenotazione-cancella') {
    const body = await leggiCorpo(req);
    if (body === null) return json(res, 400, { ok: false, error: 'bad_json' });
    const { b, t } = body;
    if (!b || !verifyToken(b, t)) return json(res, 403, { ok: false, error: 'token_non_valido' });
    const esito = await cancella(b);
    if (!esito.ok) {
      const status = esito.error === 'non_trovata' ? 404 : esito.error === 'fuori_finestra' ? 409 : 422;
      return json(res, status, esito);
    }
    await notificaAnnullamento(esito.record).catch((e) => console.error('CANCELLAZIONE_MAIL_ERRORE', e));
    return json(res, 200, { ok: true });
  }

  if (req.method === 'POST' && url.pathname === '/api/prenotazione-sposta') {
    const body = await leggiCorpo(req);
    if (body === null) return json(res, 400, { ok: false, error: 'bad_json' });
    const { b, t, data, ora } = body;
    if (!b || !verifyToken(b, t)) return json(res, 403, { ok: false, error: 'token_non_valido' });
    if (!GIORNO_RE.test(data || '') || !ORA_RE.test(ora || '')) return json(res, 400, { ok: false, error: 'dati_non_validi' });
    const esito = await sposta(b, data, ora);
    if (!esito.ok) {
      const status =
        esito.error === 'non_trovata' ? 404 : esito.error === 'fuori_finestra' || esito.error === 'slot_occupato' ? 409 : 422;
      return json(res, status, esito);
    }
    await notificaSpostamento(esito.record, esito.precedente).catch((e) => console.error('SPOSTAMENTO_MAIL_ERRORE', e));
    return json(res, 200, { ok: true, data: esito.record.data_richiesta, ora: esito.record.ora_richiesta });
  }

  if (req.method !== 'POST' || url.pathname !== '/api/prenotazioni') {
    return json(res, 404, { ok: false, error: 'not_found' });
  }

  const body = await leggiCorpo(req);
  if (body === null) return json(res, 400, { ok: false, error: 'bad_json' });

  const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || req.socket.remoteAddress || 'locale';
  try {
    const out = await handleBooking(body, { ip, userAgent: req.headers['user-agent'] || '' });
    return json(res, out.status, out.body);
  } catch (e) {
    console.error('BOOKING_FATAL', e);
    return json(res, 500, { ok: false, error: 'server_error', message: 'Errore imprevisto.' });
  }
});

server.listen(PORT, () => {
  console.log(`API di prenotazione su http://localhost:${PORT}/api/prenotazioni`);
  console.log(`API di disponibilita' su http://localhost:${PORT}/api/disponibilita?giorno=AAAA-MM-GG`);
  console.log(`API di autogestione su http://localhost:${PORT}/api/prenotazione?b=...&t=...`);
  console.log(`provider email: ${process.env.MAIL_PROVIDER || 'console'}`);
});
