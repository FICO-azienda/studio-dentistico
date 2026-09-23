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

const PORT = Number(process.env.PORT || 4174);
const GIORNO_RE = /^\d{4}-\d{2}-\d{2}$/;

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
    if (!GIORNO_RE.test(giorno)) {
      res.writeHead(400, { 'Content-Type': 'application/json' }).end(JSON.stringify({ ok: false, error: 'giorno_non_valido' }));
      return;
    }
    const occupato = await getDayOccupied(giorno);
    res.writeHead(200, { 'Content-Type': 'application/json' }).end(JSON.stringify({ ok: true, giorno, occupati: Object.keys(occupato) }));
    return;
  }

  if (req.method !== 'POST' || url.pathname !== '/api/prenotazioni') {
    res.writeHead(404, { 'Content-Type': 'application/json' }).end(JSON.stringify({ ok: false, error: 'not_found' }));
    return;
  }

  let raw = '';
  for await (const c of req) raw += c;
  let body;
  try {
    body = raw ? JSON.parse(raw) : {};
  } catch {
    res.writeHead(400, { 'Content-Type': 'application/json' }).end(JSON.stringify({ ok: false, error: 'bad_json' }));
    return;
  }

  const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || req.socket.remoteAddress || 'locale';
  try {
    const out = await handleBooking(body, { ip, userAgent: req.headers['user-agent'] || '' });
    const headers = { 'Content-Type': 'application/json', ...(out.headers || {}) };
    res.writeHead(out.status, headers).end(JSON.stringify(out.body));
  } catch (e) {
    console.error('BOOKING_FATAL', e);
    res.writeHead(500, { 'Content-Type': 'application/json' }).end(
      JSON.stringify({ ok: false, error: 'server_error', message: 'Errore imprevisto.' })
    );
  }
});

server.listen(PORT, () => {
  console.log(`API di prenotazione su http://localhost:${PORT}/api/prenotazioni`);
  console.log(`API di disponibilita' su http://localhost:${PORT}/api/disponibilita?giorno=AAAA-MM-GG`);
  console.log(`provider email: ${process.env.MAIL_PROVIDER || 'console'}`);
});
