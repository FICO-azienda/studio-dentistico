/**
 * Invio email tramite provider HTTP. Nessuna chiave nel codice: tutto da
 * variabili d'ambiente, lette solo lato server.
 *
 * Provider supportati (MAIL_PROVIDER): resend | sendgrid | postmark | console
 * "console" non invia nulla e stampa l'email: serve ai test e allo sviluppo.
 */

const timeoutFetch = async (url, options, ms = 10000) => {
  const ac = new AbortController();
  const t = setTimeout(() => ac.abort(), ms);
  try {
    return await fetch(url, { ...options, signal: ac.signal });
  } finally {
    clearTimeout(t);
  }
};

async function viaResend(msg, env) {
  const key = env.RESEND_API_KEY;
  if (!key) throw new Error('RESEND_API_KEY mancante');
  const res = await timeoutFetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + key, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: msg.from,
      to: [msg.to],
      reply_to: msg.replyTo || undefined,
      subject: msg.subject,
      html: msg.html,
      text: msg.text
    })
  });
  if (!res.ok) throw new Error('Resend ' + res.status + ' ' + (await res.text()).slice(0, 200));
  const j = await res.json().catch(() => ({}));
  return { id: j.id || null };
}

async function viaSendgrid(msg, env) {
  const key = env.SENDGRID_API_KEY;
  if (!key) throw new Error('SENDGRID_API_KEY mancante');
  const res = await timeoutFetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + key, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      personalizations: [{ to: [{ email: msg.to }] }],
      from: { email: msg.from.replace(/.*<|>.*/g, '') || msg.from, name: msg.from.replace(/\s*<.*/, '') },
      reply_to: msg.replyTo ? { email: msg.replyTo } : undefined,
      subject: msg.subject,
      content: [
        { type: 'text/plain', value: msg.text },
        { type: 'text/html', value: msg.html }
      ]
    })
  });
  if (!res.ok) throw new Error('SendGrid ' + res.status + ' ' + (await res.text()).slice(0, 200));
  return { id: res.headers.get('x-message-id') };
}

async function viaPostmark(msg, env) {
  const key = env.POSTMARK_TOKEN;
  if (!key) throw new Error('POSTMARK_TOKEN mancante');
  const res = await timeoutFetch('https://api.postmarkapp.com/email', {
    method: 'POST',
    headers: { 'X-Postmark-Server-Token': key, 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      From: msg.from,
      To: msg.to,
      ReplyTo: msg.replyTo || undefined,
      Subject: msg.subject,
      HtmlBody: msg.html,
      TextBody: msg.text,
      MessageStream: env.POSTMARK_STREAM || 'outbound'
    })
  });
  if (!res.ok) throw new Error('Postmark ' + res.status + ' ' + (await res.text()).slice(0, 200));
  const j = await res.json().catch(() => ({}));
  return { id: j.MessageID || null };
}

function viaConsole(msg) {
  console.log('MAIL (console) ' + JSON.stringify({ to: msg.to, subject: msg.subject, bytes: msg.html.length }));
  return { id: 'console-' + Date.now() };
}

const PROVIDERS = {
  resend: viaResend,
  sendgrid: viaSendgrid,
  postmark: viaPostmark,
  console: viaConsole
};

/**
 * Invia un messaggio. Non solleva: restituisce sempre un esito, perche' un
 * problema del servizio email non deve far perdere la richiesta del paziente.
 */
export async function sendMail(msg, env = process.env) {
  const name = env.MAIL_PROVIDER || 'console';
  const fn = PROVIDERS[name];
  if (!fn) return { ok: false, provider: name, error: 'provider sconosciuto: ' + name };
  try {
    const res = await fn(msg, env);
    return { ok: true, provider: name, id: res?.id ?? null };
  } catch (e) {
    const error = String(e?.message || e);
    console.error('MAIL_ERROR ' + JSON.stringify({ to: msg.to, subject: msg.subject, provider: name, error }));
    return { ok: false, provider: name, error };
  }
}
