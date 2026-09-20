/**
 * Test del flusso di prenotazione.  node --test tests/
 *
 * Coprono gli scenari richiesti: prenotazione normale, con e senza messaggio,
 * senza seconda preferenza, email non valida, data mancante, guasto del
 * servizio email, invio da mobile, doppio click.
 */
import test from 'node:test';
import assert from 'node:assert/strict';

import { handleBooking } from '../api/_lib/handler.mjs';
import { validateBooking, looksLikeSpam, checkDate } from '../api/_lib/validate.mjs';
import { buildBookingId, buildRecord } from '../api/_lib/store.mjs';
import { emailPaziente, emailStudio } from '../api/_lib/templates.mjs';
import { rateLimit, _reset } from '../api/_lib/ratelimit.mjs';

// niente email vere durante i test
const ENV = { MAIL_PROVIDER: 'console', BOOKING_STORE: 'log', BOOKING_NOTIFY_EMAIL: 'studio@example.it' };
const ENV_MAIL_ROTTA = { ...ENV, MAIL_PROVIDER: 'resend' }; // senza chiave: fallisce

/** Domani, saltando la domenica (lo studio e' chiuso). */
function domani(from = new Date()) {
  const d = new Date(from);
  d.setDate(d.getDate() + 1);
  if (d.getDay() === 0) d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
}

const base = () => ({
  nome: 'Mario',
  cognome: 'Rossi',
  email: 'mario.rossi@example.com',
  telefono: '+39 340 1234567',
  tipoVisita: 'prima-visita',
  dataRichiesta: domani(),
  oraRichiesta: '11:30',
  privacy: true
});

let ipSeq = 0;
const ctx = (extra = {}) => ({ ip: 'test-' + ++ipSeq, userAgent: 'node-test', env: ENV, ...extra });

test.beforeEach(() => _reset());

/* -- 1. prenotazione normale --------------------------------------------- */
test('prenotazione valida: 201, codice richiesta, stato PENDING', async () => {
  const r = await handleBooking(base(), ctx());
  assert.equal(r.status, 201);
  assert.equal(r.body.ok, true);
  assert.match(r.body.bookingId, /^APT-\d{4}-\d{6}$/);
  assert.equal(r.body.status, 'PENDING');
  assert.equal(r.body.emailSent, true);
  assert.equal(r.body.studioNotified, true);
});

/* -- 2. con messaggio ----------------------------------------------------- */
test('messaggio del paziente conservato e ripulito', async () => {
  const v = validateBooking({ ...base(), messaggio: '  Ho   un dolore\n\n\n\nda due giorni  ' });
  assert.equal(v.ok, true);
  assert.equal(v.data.messaggio, 'Ho un dolore\n\nda due giorni');
});

/* -- 3. senza messaggio --------------------------------------------------- */
test('senza messaggio la richiesta resta valida e le email mostrano un trattino', async () => {
  const v = validateBooking(base());
  assert.equal(v.ok, true);
  assert.equal(v.data.messaggio, '');
  const rec = buildRecord(v.data, { bookingId: 'APT-2026-000001' });
  assert.match(emailPaziente(rec).text, /Messaggio: —/);
});

/* -- 4. seconda preferenza assente o incompleta --------------------------- */
test('seconda preferenza facoltativa', async () => {
  const v = validateBooking(base());
  assert.equal(v.ok, true);
  assert.equal(v.data.secondaData, '');
  const rec = buildRecord(v.data, { bookingId: 'APT-2026-000002' });
  assert.equal(rec.seconda_preferenza, '');
  assert.match(emailPaziente(rec).html, /Seconda preferenza/);
});

test('orario secondario senza giorno e\' un errore', () => {
  const v = validateBooking({ ...base(), secondaOra: '15:00' });
  assert.equal(v.ok, false);
  assert.ok(v.errors.secondaData);
});

test('seconda preferenza completa finisce nel record', () => {
  const g = domani(new Date(Date.now() + 86400000));
  const v = validateBooking({ ...base(), secondaData: g, secondaOra: '09:15' });
  assert.equal(v.ok, true);
  const rec = buildRecord(v.data, { bookingId: 'APT-2026-000003' });
  assert.equal(rec.seconda_preferenza, g + ' 09:15');
});

/* -- 5. email non valida -------------------------------------------------- */
test('email non valida: 422 e campo segnalato', async () => {
  const r = await handleBooking({ ...base(), email: 'mario.rossi@' }, ctx());
  assert.equal(r.status, 422);
  assert.equal(r.body.ok, false);
  assert.ok(r.body.fields.email);
  assert.equal(r.body.bookingId, undefined);
});

/* -- 6. data non selezionata o non valida --------------------------------- */
test('data mancante: 422', async () => {
  const r = await handleBooking({ ...base(), dataRichiesta: '' }, ctx());
  assert.equal(r.status, 422);
  assert.ok(r.body.fields.dataRichiesta);
});

test('data nel passato rifiutata', () => {
  assert.equal(checkDate('2020-01-02'), 'data nel passato');
});

test('domenica rifiutata', () => {
  // 27 settembre 2026 e' una domenica
  assert.equal(checkDate('2026-09-27', { today: new Date('2026-09-01T12:00:00Z') }), "la domenica lo studio e' chiuso");
});

test('orario non valido rifiutato', async () => {
  const r = await handleBooking({ ...base(), oraRichiesta: '25:00' }, ctx());
  assert.equal(r.status, 422);
  assert.ok(r.body.fields.oraRichiesta);
});

test('privacy non accettata: 422', async () => {
  const r = await handleBooking({ ...base(), privacy: false }, ctx());
  assert.equal(r.status, 422);
  assert.ok(r.body.fields.privacy);
});

/* -- 7. guasto del servizio email ----------------------------------------- */
test('email non inviata: la richiesta resta registrata, nessuna falsa conferma', async () => {
  const r = await handleBooking({ ...base(), email: 'mail.rotta@example.com' }, ctx({ env: ENV_MAIL_ROTTA }));
  assert.equal(r.status, 201, 'la richiesta viene comunque accettata');
  assert.equal(r.body.ok, true);
  assert.match(r.body.bookingId, /^APT-/);
  assert.equal(r.body.emailSent, false, 'il front-end non deve promettere un\'email mai partita');
  assert.equal(r.body.stored, true, 'i dati non si perdono');
});

/* -- 8. invio da mobile ---------------------------------------------------- */
test('invio da smartphone: stesso esito', async () => {
  const ua = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15';
  const r = await handleBooking({ ...base(), email: 'da.mobile@example.com' }, ctx({ userAgent: ua }));
  assert.equal(r.status, 201);
  assert.equal(r.body.ok, true);
});

/* -- 9. doppio click ------------------------------------------------------- */
test('doppio invio ravvicinato: un solo codice richiesta', async () => {
  const c = ctx();
  const body = { ...base(), email: 'doppio.click@example.com' };
  const [a, b] = await Promise.all([handleBooking(body, c), handleBooking(body, c)]);
  assert.equal(a.body.ok, true);
  assert.equal(b.body.ok, true);
  assert.equal(a.body.bookingId, b.body.bookingId, 'due click simultanei, una sola prenotazione');
  assert.ok(a.body.duplicate || b.body.duplicate, 'il secondo invio e\' riconosciuto come duplicato');

  const terzo = await handleBooking(body, c);
  assert.equal(terzo.body.duplicate, true);
  assert.equal(terzo.body.bookingId, a.body.bookingId);
});

/* -- anti-spam e limite di frequenza --------------------------------------- */
test('campo esca compilato: ignorata senza dirlo al bot', async () => {
  const r = await handleBooking({ ...base(), azienda: 'SEO Agency' }, ctx());
  assert.equal(r.status, 200);
  assert.equal(r.body.ignored, true);
  assert.equal(r.body.bookingId, null);
});

test('compilazione istantanea considerata automatica', () => {
  assert.equal(looksLikeSpam({ startedAt: Date.now() - 100 }), 'compilazione troppo rapida');
  assert.equal(looksLikeSpam({ startedAt: Date.now() - 60000 }), null);
});

test('link nel messaggio bloccato', () => {
  assert.equal(looksLikeSpam({ messaggio: 'visita https://spam.example' }), 'link nel testo');
});

test('oltre il limite di frequenza: 429 con Retry-After', async () => {
  const c = ctx();
  for (let i = 0; i < 5; i++) {
    await handleBooking({ ...base(), email: `u${i}@example.com` }, c);
  }
  const r = await handleBooking({ ...base(), email: 'sesto@example.com' }, c);
  assert.equal(r.status, 429);
  assert.equal(r.body.error, 'rate_limited');
  assert.ok(Number(r.headers['Retry-After']) > 0);
});

test('il limite e\' per indirizzo IP, non globale', async () => {
  const r1 = await rateLimit('ip-a', { max: 1 });
  const r2 = await rateLimit('ip-a', { max: 1 });
  const r3 = await rateLimit('ip-b', { max: 1 });
  assert.equal(r1.allowed, true);
  assert.equal(r2.allowed, false);
  assert.equal(r3.allowed, true);
});

/* -- sanitizzazione e contenuto delle email -------------------------------- */
test('HTML nei campi neutralizzato nelle email', () => {
  const v = validateBooking({ ...base(), nome: 'Mario', messaggio: '<script>alert(1)</script> ciao' });
  const rec = buildRecord(v.data, { bookingId: 'APT-2026-000004' });
  const html = emailPaziente(rec).html;
  assert.ok(!html.includes('<script>'), 'nessun tag eseguibile nell\'email');
  assert.ok(html.includes('&lt;script&gt;'));
});

test('email al paziente: niente parola "confermato" su giorno e orario', () => {
  const v = validateBooking(base());
  const rec = buildRecord(v.data, { bookingId: 'APT-2026-000005' });
  const { subject, html, text } = emailPaziente(rec);
  assert.match(subject, /Richiesta di appuntamento ricevuta/);
  assert.ok(/ricevuto correttamente la tua richiesta/.test(text));
  assert.ok(!/appuntamento e' confermato|appuntamento è confermato/i.test(text));
  assert.ok(html.includes(rec.booking_id), 'il codice richiesta compare nell\'email');
});

test('email allo studio: oggetto riconoscibile e azioni rapide', () => {
  const v = validateBooking(base());
  const rec = buildRecord(v.data, { bookingId: 'APT-2026-000006' });
  const { subject, html } = emailStudio(rec);
  assert.match(subject, /^Nuova richiesta appuntamento — Mario Rossi — /);
  assert.ok(html.includes('tel:'));
  assert.ok(html.includes('mailto:'));
  assert.ok(html.includes('wa.me'));
  assert.ok(html.includes('PENDING'));
});

test('codice richiesta nel formato previsto', () => {
  assert.equal(buildBookingId(124, { year: 2026 }), 'APT-2026-000124');
  assert.match(buildBookingId(null, { year: 2026 }), /^APT-2026-\d{6}$/);
});

/* -- versione testuale ------------------------------------------------------ */
test('ogni email ha anche la versione in testo semplice', () => {
  const v = validateBooking(base());
  const rec = buildRecord(v.data, { bookingId: 'APT-2026-000007' });
  for (const mail of [emailPaziente(rec), emailStudio(rec)]) {
    assert.ok(mail.text.length > 120);
    assert.ok(!mail.text.includes('<'), 'il testo semplice non contiene marcatura');
  }
});
