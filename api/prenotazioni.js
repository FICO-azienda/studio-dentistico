/**
 * Funzione serverless per le richieste di appuntamento — runtime Node di Vercel.
 * Tutta la logica sta in _lib/: qui si traducono soltanto richiesta e risposta.
 *
 * Endpoint: POST /api/prenotazioni
 *
 * Variabili d'ambiente (Vercel -> Settings -> Environment Variables):
 *   MAIL_PROVIDER        resend | sendgrid | postmark | console
 *   RESEND_API_KEY       chiave del provider (mai nel codice, mai nel front-end)
 *   MAIL_FROM            "Studio Liddi <prenotazioni@dominio.it>" (dominio verificato)
 *   BOOKING_NOTIFY_EMAIL indirizzo interno che riceve le notifiche
 *   ALLOWED_ORIGINS      https://fico-azienda.github.io (separati da virgola)
 *   BOOKING_STORE        log | kv | http
 *   RATELIMIT_MAX        richieste per IP ogni 10 minuti (predefinito 5)
 */
import { handleBooking, corsHeaders } from './_lib/handler.mjs';

export const config = { runtime: 'nodejs' };

const leggiCorpo = async (req) => {
  if (req.body && typeof req.body === 'object') return req.body;
  let raw = '';
  for await (const chunk of req) raw += chunk;
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch {
    return null; // corpo non valido
  }
};

const clientIp = (req) =>
  (req.headers['x-forwarded-for'] || '').split(',')[0].trim() ||
  req.headers['x-real-ip'] ||
  req.socket?.remoteAddress ||
  'sconosciuto';

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
  if (body === null) {
    return res.status(400).json({ ok: false, error: 'bad_json', message: 'Richiesta non leggibile.' });
  }

  try {
    const out = await handleBooking(body, {
      ip: clientIp(req),
      userAgent: req.headers['user-agent'] || ''
    });
    if (out.headers) for (const [k, v] of Object.entries(out.headers)) res.setHeader(k, v);
    return res.status(out.status).json(out.body);
  } catch (e) {
    // errore imprevisto: si registra tutto, ma al paziente non si mostra mai
    // una falsa conferma
    console.error('BOOKING_FATAL ' + JSON.stringify({ error: String(e?.stack || e) }));
    return res.status(500).json({
      ok: false,
      error: 'server_error',
      message: 'Non siamo riusciti a registrare la richiesta. Riprova oppure contatta direttamente lo studio.'
    });
  }
}
