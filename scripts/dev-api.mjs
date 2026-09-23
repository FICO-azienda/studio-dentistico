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
import { giornoChiuso } from '../api/_lib/chiusure.mjs';
import { verifyToken } from '../api/_lib/token.mjs';
import { listBookings, updateBooking } from '../api/_lib/store.mjs';
import { statoPrenotazione, cancella, sposta } from '../api/_lib/manage.mjs';
import { notificaAnnullamento, notificaSpostamento } from '../api/_lib/notify.mjs';
import { staffTokenValido, estraiToken } from '../api/_lib/staff-auth.mjs';
import { confermaPrenotazione } from '../api/_lib/confirm.mjs';

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

const route = async (req, res) => {
  const url = new URL(req.url, 'http://localhost');

  if (req.method === 'GET' && url.pathname === '/api/disponibilita') {
    const giorno = url.searchParams.get('giorno') || '';
    if (!GIORNO_RE.test(giorno)) return json(res, 400, { ok: false, error: 'giorno_non_valido' });
    const chiuso = giornoChiuso(giorno);
    const occupato = chiuso ? {} : await getDayOccupied(giorno);
    return json(res, 200, { ok: true, giorno, chiuso, occupati: Object.keys(occupato) });
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
        esito.error === 'non_trovata'
          ? 404
          : ['fuori_finestra', 'slot_occupato', 'giorno_chiuso'].includes(esito.error)
            ? 409
            : 422;
      return json(res, status, esito);
    }
    await notificaSpostamento(esito.record, esito.precedente).catch((e) => console.error('SPOSTAMENTO_MAIL_ERRORE', e));
    return json(res, 200, { ok: true, data: esito.record.data_richiesta, ora: esito.record.ora_richiesta });
  }

  if (url.pathname.startsWith('/api/staff/')) {
    if (!staffTokenValido(estraiToken(req))) return json(res, 401, { ok: false, error: 'non_autorizzato' });

    if (req.method === 'GET' && url.pathname === '/api/staff/prenotazioni') {
      const kind = process.env.BOOKING_STORE || 'log';
      if (kind === 'http') return json(res, 200, { ok: true, prenotazioni: [], nota: 'BOOKING_STORE=http non supporta la lettura: elenco non disponibile.' });
      const prenotazioni = await listBookings();
      return json(res, 200, { ok: true, prenotazioni });
    }

    if (req.method === 'POST' && url.pathname === '/api/staff/conferma') {
      const body = await leggiCorpo(req);
      if (body === null) return json(res, 400, { ok: false, error: 'bad_json' });
      const bookingId = String(body.bookingId || '');
      if (!bookingId) return json(res, 400, { ok: false, error: 'bookingId_mancante' });
      const data = body.data ? String(body.data) : undefined;
      const ora = body.ora ? String(body.ora) : undefined;
      if ((data && !GIORNO_RE.test(data)) || (ora && !ORA_RE.test(ora))) return json(res, 400, { ok: false, error: 'dati_non_validi' });
      const esito = await confermaPrenotazione(bookingId, { professionista: String(body.professionista || ''), nota: String(body.nota || ''), data, ora });
      if (!esito.ok) {
        const status =
          esito.error === 'non_trovata'
            ? 404
            : ['occupato', 'giorno_chiuso'].includes(esito.error)
              ? 409
              : esito.error === 'stato_non_confermabile'
                ? 422
                : 400;
        return json(res, status, esito);
      }
      return json(res, 200, { ok: true, record: esito.record, emailSent: esito.emailSent });
    }

    if (req.method === 'POST' && url.pathname === '/api/staff/cancella') {
      const body = await leggiCorpo(req);
      if (body === null) return json(res, 400, { ok: false, error: 'bad_json' });
      const bookingId = String(body.bookingId || '');
      if (!bookingId) return json(res, 400, { ok: false, error: 'bookingId_mancante' });
      const esito = await cancella(bookingId, { forza: true });
      if (!esito.ok) return json(res, esito.error === 'non_trovata' ? 404 : 422, esito);
      await notificaAnnullamento(esito.record).catch((e) => console.error('STAFF_CANCELLAZIONE_MAIL_ERRORE', e));
      return json(res, 200, { ok: true });
    }

    if (req.method === 'POST' && url.pathname === '/api/staff/sposta') {
      const body = await leggiCorpo(req);
      if (body === null) return json(res, 400, { ok: false, error: 'bad_json' });
      const bookingId = String(body.bookingId || '');
      const data = String(body.data || '');
      const ora = String(body.ora || '');
      if (!bookingId) return json(res, 400, { ok: false, error: 'bookingId_mancante' });
      if (!GIORNO_RE.test(data) || !ORA_RE.test(ora)) return json(res, 400, { ok: false, error: 'dati_non_validi' });
      const esito = await sposta(bookingId, data, ora, { forza: true });
      if (!esito.ok) {
        const status = esito.error === 'non_trovata' ? 404 : ['slot_occupato', 'giorno_chiuso'].includes(esito.error) ? 409 : 422;
        return json(res, status, esito);
      }
      await notificaSpostamento(esito.record, esito.precedente).catch((e) => console.error('STAFF_SPOSTAMENTO_MAIL_ERRORE', e));
      return json(res, 200, { ok: true, data: esito.record.data_richiesta, ora: esito.record.ora_richiesta });
    }

    if (req.method === 'POST' && url.pathname === '/api/staff/vista') {
      const body = await leggiCorpo(req);
      if (body === null) return json(res, 400, { ok: false, error: 'bad_json' });
      const bookingId = String(body.bookingId || '');
      if (!bookingId) return json(res, 400, { ok: false, error: 'bookingId_mancante' });
      const aggiornato = await updateBooking(bookingId, { staff_reviewed: true });
      if (!aggiornato) return json(res, 404, { ok: false, error: 'non_trovata' });
      return json(res, 200, { ok: true });
    }

    return json(res, 404, { ok: false, error: 'not_found' });
  }

  if (req.method !== 'POST' || url.pathname !== '/api/prenotazioni') {
    return json(res, 404, { ok: false, error: 'not_found' });
  }

  const body = await leggiCorpo(req);
  if (body === null) return json(res, 400, { ok: false, error: 'bad_json' });

  const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || req.socket.remoteAddress || 'locale';
  const out = await handleBooking(body, { ip, userAgent: req.headers['user-agent'] || '' });
  return json(res, out.status, out.body);
};

const server = http.createServer(async (req, res) => {
  const origin = req.headers.origin || '';
  const cors = corsHeaders(origin);
  for (const [k, v] of Object.entries(cors)) res.setHeader(k, v);

  if (req.method === 'OPTIONS') {
    res.writeHead(204).end();
    return;
  }

  try {
    await route(req, res);
  } catch (e) {
    console.error('API_FATAL', e);
    if (!res.headersSent) json(res, 500, { ok: false, error: 'server_error', message: 'Errore imprevisto.' });
  }
});

server.listen(PORT, () => {
  console.log(`API di prenotazione su http://localhost:${PORT}/api/prenotazioni`);
  console.log(`API di disponibilità su http://localhost:${PORT}/api/disponibilita?giorno=AAAA-MM-GG`);
  console.log(`API di autogestione su http://localhost:${PORT}/api/prenotazione?b=...&t=...`);
  console.log(`provider email: ${process.env.MAIL_PROVIDER || 'console'}`);
});
