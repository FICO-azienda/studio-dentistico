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
import { emailPaziente, emailStudio, emailConferma } from '../api/_lib/templates.mjs';
import { buildIcs, localeToUtc } from '../api/_lib/ics.mjs';
import { studio } from '../api/_lib/studio.mjs';
import { rateLimit, _reset } from '../api/_lib/ratelimit.mjs';
import { byService, visibleQuestions, computePriority, computeTags, buildSummary, validateAnswers } from '../api/_lib/flows.mjs';
import { giornoChiuso } from '../api/_lib/chiusure.mjs';
import { reserveSlots, releaseSlots, getDayOccupied } from '../api/_lib/availability.mjs';
import { saveBooking, getBooking } from '../api/_lib/store.mjs';
import { sposta } from '../api/_lib/manage.mjs';
import { kvCredenziali, assertArchivioAffidabile } from '../api/_lib/kv-config.mjs';

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
  servizio: 'prima-visita',
  risposte: {
    'prima-volta': 'si',
    motivo: 'controllo-generale',
    dolore: 'no',
    'ultima-visita': 'meno-di-6-mesi-fa'
  },
  modalita: 'prenota',
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
/* -- logica condizionale per servizio ------------------------------------- */
test('le domande non pertinenti vengono saltate', () => {
  const s = byService.implantologia;
  const senza = visibleQuestions(s, {}).map((q) => q.id);
  const con = visibleQuestions(s, { estratto: 'si' }).map((q) => q.id);
  assert.ok(!senza.includes('da-quanto'), 'se non si sa se il dente e\' estratto, non si chiede da quanto');
  assert.ok(con.includes('da-quanto'));
});

test('ogni servizio ha da una a cinque domande', () => {
  for (const s of Object.values(byService)) {
    assert.ok(s.questions.length >= 1 && s.questions.length <= 5, `${s.id}: ${s.questions.length} domande`);
  }
});

test('priorita\' interna calcolata dalle risposte, non dal client', () => {
  assert.equal(computePriority(byService['controllo-generale'], { segnalazione: 'no' }), 'normal');
  assert.equal(computePriority(byService['controllo-generale'], { segnalazione: 'dolore' }), 'high');
  assert.equal(computePriority(byService.urgenza, { problema: 'gonfiore' }), 'high');
  assert.equal(computePriority(byService.trauma, {}), 'urgent');
  assert.equal(computePriority(byService['dente-del-giudizio'], { apertura: 'si-importante' }), 'urgent');
});

test('tag automatici: servizio piu\' eventuali tag delle risposte', () => {
  assert.deepEqual(computeTags(byService.igiene, {}), ['SERVICE_HYGIENE']);
  assert.deepEqual(computeTags(byService.ortodonzia, { 'per-chi': 'figlio' }), ['SERVICE_ORTHODONTICS', 'SERVICE_PEDIATRIC']);
});

test('riepilogo: una riga per domanda pertinente', () => {
  const s = byService.sbiancamento;
  const a = { 'gia-fatto': 'mai', obiettivo: 'ridurre-macchie', sensibilita: 'no', tempi: 'non-ho-fretta' };
  const r = buildSummary(s, a);
  assert.equal(r.length, 4);
  assert.equal(r[1].value, 'Ridurre macchie');
});

test('risposta non prevista dalla configurazione: rifiutata', () => {
  const r = validateAnswers('igiene', { 'ultima-igiene': 'inventata', problemi: ['nessuno'], dispositivi: 'no' });
  assert.equal(r.ok, false);
  assert.ok(r.errors['ultima-igiene']);
});

test('richiesta di richiamata: niente data, servono canale e fascia', async () => {
  const b = { ...base(), email: 'richiamata@example.com', modalita: 'ricontatto', dataRichiesta: '', oraRichiesta: '' };
  const senza = await handleBooking(b, ctx());
  assert.equal(senza.status, 422);
  assert.ok(senza.body.fields.canale);

  const con = await handleBooking({ ...b, canale: 'whatsapp', fascia: 'pomeriggio' }, ctx());
  assert.equal(con.status, 201);
  assert.equal(con.body.riepilogo.modalita, 'ricontatto');
});

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
  assert.match(subject, /^Nuova richiesta Prima visita — Mario Rossi — /);
  assert.ok(html.includes('tel:'));
  assert.ok(html.includes('mailto:'));
  assert.ok(html.includes('wa.me'));
  assert.ok(html.includes('PENDING'));
  assert.ok(html.includes('SERVICE_FIRST_VISIT'), 'i tag interni compaiono nella mail allo studio');
});

test('oggetto in evidenza quando la priorita\' e\' alta o urgente', () => {
  const v = validateBooking({ ...base(), servizio: 'trauma', risposte: { quando: 'meno-di-2-ore-fa', cosa: ['dente-perso'] } });
  assert.equal(v.ok, true);
  const rec = buildRecord(v.data, { bookingId: 'APT-2026-000008' });
  assert.equal(rec.priority, 'urgent');
  assert.match(emailStudio(rec).subject, /^\[URGENTE\] /);
  // al paziente non viene mai mostrata la classificazione interna
  const p = emailPaziente(rec);
  assert.ok(!/URGENTE|priorit/i.test(p.text));
});

test('codice richiesta nel formato previsto', () => {
  assert.equal(buildBookingId(124, { year: 2026 }), 'APT-2026-000124');
  assert.match(buildBookingId(null, { year: 2026 }), /^APT-2026-\d{6}$/);
});

/* -- email di conferma ------------------------------------------------------ */
test('la conferma e\' l\'unica email che dice "confermato"', () => {
  const v = validateBooking(base());
  const rec = buildRecord(v.data, { bookingId: 'APT-2026-000009' });

  // prima dell'accettazione: mai la parola confermato su giorno e orario
  assert.ok(!/confermato/i.test(emailPaziente(rec).subject));

  rec.status = 'CONFIRMED';
  const c = emailConferma(rec, { professionista: 'Dr. Andrea Vitali', note: 'Porta la panoramica.' });
  assert.match(c.subject, /^Appuntamento confermato — /);
  assert.ok(c.text.includes('APT-2026-000009'));
  assert.ok(c.html.includes('calendar.google.com'), 'c\'e\' il link per il calendario');
  assert.ok(c.html.includes('google.com/maps'), 'ci sono le indicazioni stradali');
  assert.ok(c.html.includes('Porta la panoramica.'), 'la nota dello studio compare');
  assert.ok(/24 ore/.test(c.text), 'si ricorda la disdetta con preavviso');
});

test('la conferma non espone priorita\' o tag interni', () => {
  const v = validateBooking({ ...base(), servizio: 'urgenza', risposte: { problema: 'dolore-forte', 'da-quanto': 'da-oggi', intensita: '9-10', gonfiore: 'si' } });
  const rec = buildRecord(v.data, { bookingId: 'APT-2026-000010' });
  const c = emailConferma(rec);
  assert.ok(!/SERVICE_|priorit|URGENTE/i.test(c.text));
});

/* -- lingua del paziente ---------------------------------------------------- */
test('le email al paziente seguono la lingua del sito che ha usato', () => {
  const v = validateBooking({ ...base(), lang: 'en' });
  assert.equal(v.ok, true);
  assert.equal(v.data.lang, 'en');
  const rec = buildRecord(v.data, { bookingId: 'APT-2026-000020' });
  assert.equal(rec.lingua, 'en');

  const p = emailPaziente(rec);
  assert.match(p.subject, /^Appointment request received/);
  assert.ok(/Hello Mario/.test(p.text));
  assert.ok(!/Ciao|riepilogo/.test(p.text), 'nessun residuo italiano');

  const c = emailConferma(rec);
  assert.match(c.subject, /^Appointment confirmed/);

  // la notifica interna resta in italiano: la legge la segreteria
  assert.match(emailStudio(rec).subject, /^Nuova richiesta/);
});

test('il riepilogo del servizio e\' tradotto per il paziente inglese', () => {
  const v = validateBooking({ ...base(), lang: 'en' });
  assert.equal(v.data.riepilogoServizio[0].label, 'Is this your first time at our practice?');
});

test('lingua non riconosciuta: si resta in italiano', () => {
  const v = validateBooking({ ...base(), lang: 'de' });
  assert.equal(v.data.lang, 'it');
});

/* -- invito calendario ------------------------------------------------------ */
test('l\'invito .ics converte l\'ora locale tenendo conto dell\'ora legale', () => {
  // 24 novembre: ora solare, Roma e' UTC+1
  assert.equal(localeToUtc('2026-11-24', '15:30').toISOString(), '2026-11-24T14:30:00.000Z');
  // 24 giugno: ora legale, Roma e' UTC+2
  assert.equal(localeToUtc('2026-06-24', '15:30').toISOString(), '2026-06-24T13:30:00.000Z');
});

test('l\'invito .ics e\' valido e contiene l\'appuntamento', () => {
  const v = validateBooking(base());
  const rec = buildRecord(v.data, { bookingId: 'APT-2026-000011' });
  const ics = buildIcs(rec, studio, { professionista: 'Dr. Andrea Vitali' });
  // le righe lunghe sono spezzate come prescrive lo standard: si ricompongono
  const piatto = ics.replace(/\r\n /g, '');

  assert.ok(ics.startsWith('BEGIN:VCALENDAR'));
  assert.ok(ics.trimEnd().endsWith('END:VCALENDAR'));
  assert.ok(ics.includes('METHOD:REQUEST'), 'e\' un invito, non un semplice evento');
  assert.ok(piatto.includes('UID:APT-2026-000011@'), 'UID legato al codice richiesta');
  assert.ok(ics.includes('STATUS:CONFIRMED'));
  assert.ok(ics.includes('TRIGGER:-P1D') && ics.includes('TRIGGER:-PT2H'), 'due promemoria');
  assert.ok(piatto.includes('mailto:' + rec.email), 'il paziente e\' invitato');
  assert.ok(/DTSTART:\d{8}T\d{6}Z/.test(ics) && /DTEND:\d{8}T\d{6}Z/.test(ics));
  // le righe iCalendar non superano i 75 ottetti
  for (const riga of ics.split('\r\n')) {
    assert.ok(Buffer.byteLength(riga, 'utf8') <= 75, 'riga troppo lunga: ' + riga.slice(0, 40));
  }
  // terminatori di riga CRLF come prescrive lo standard
  assert.ok(!/[^\r]\n/.test(ics), 'tutte le righe finiscono con CRLF');
});

test('reinviando l\'invito con SEQUENCE piu\' alta si aggiorna l\'evento', () => {
  const v = validateBooking(base());
  const rec = buildRecord(v.data, { bookingId: 'APT-2026-000012' });
  const primo = buildIcs(rec, studio, { sequence: 0 });
  const secondo = buildIcs({ ...rec, ora_richiesta: '16:30' }, studio, { sequence: 1 });
  assert.ok(primo.includes('SEQUENCE:0'));
  assert.ok(secondo.includes('SEQUENCE:1'));
  const uid = (t) => t.match(/UID:(.+)/)[1];
  assert.equal(uid(primo), uid(secondo), 'stesso UID: il calendario aggiorna invece di duplicare');
});

/* -- versione testuale ------------------------------------------------------ */
test('ogni email ha anche la versione in testo semplice', () => {
  const v = validateBooking(base());
  const rec = buildRecord(v.data, { bookingId: 'APT-2026-000007' });
  for (const mail of [emailPaziente(rec), emailStudio(rec), emailConferma(rec)]) {
    assert.ok(mail.text.length > 120);
    assert.ok(!mail.text.includes('<'), 'il testo semplice non contiene marcatura');
  }
});

/* -- giornate di chiusura ---------------------------------------------------- */
test('giornoChiuso riconosce domenica, un festivo esplicito e un periodo di ferie', () => {
  assert.equal(giornoChiuso('2026-09-27'), true, 'domenica');
  assert.equal(giornoChiuso('2026-12-25'), true, 'festivo in content/chiusure.json');
  assert.equal(giornoChiuso('2026-08-15'), true, 'dentro il periodo di ferie estive');
  assert.equal(giornoChiuso('2026-09-28'), false, 'lunedì normale');
});

test('reserveSlots rifiuta un giorno di chiusura e non occupa nulla', async () => {
  const esito = await reserveSlots('2026-12-25', '10:00', 1, 'TEST-CHIUSO-1', ENV);
  assert.equal(esito.ok, false);
  assert.equal(esito.motivo, 'giorno_chiuso');
  assert.deepEqual(await getDayOccupied('2026-12-25', ENV), {});
});

test('sposta() rifiuta lo spostamento su un giorno di chiusura, anche forzato dallo staff, e lascia intatto lo slot originale', async () => {
  const bookingId = buildBookingId(999001);
  const record = buildRecord(base(), { bookingId });
  record.status = 'CONFIRMED';
  await saveBooking(record, ENV);
  await reserveSlots(record.data_richiesta, record.ora_richiesta, 1, bookingId, ENV);

  const esito = await sposta(bookingId, '2026-12-25', '10:00', { forza: true, env: ENV });
  assert.equal(esito.ok, false);
  assert.equal(esito.error, 'giorno_chiuso');

  const occupatiOriginale = await getDayOccupied(record.data_richiesta, ENV);
  assert.equal(occupatiOriginale[record.ora_richiesta], bookingId);

  await releaseSlots(record.data_richiesta, bookingId, ENV);
});

/* -- configurazione dell'archivio: fallire in modo rumoroso, non in silenzio - */
test('BOOKING_STORE=kv senza credenziali: errore chiaro, non un archivio che sembra vuoto', () => {
  assert.throws(() => kvCredenziali({}), /KV_REST_API_URL/);
});

test('getDayOccupied e getBooking rifiutano BOOKING_STORE=kv senza credenziali invece di rispondere "niente trovato"', async () => {
  const envRotto = { ...ENV, BOOKING_STORE: 'kv' };
  await assert.rejects(() => getDayOccupied('2026-09-28', envRotto), /KV_REST_API_URL/);
  await assert.rejects(() => getBooking('APT-2026-000001', envRotto), /KV_REST_API_URL/);
});

test('assertArchivioAffidabile blocca la modalità "log" su un vero deployment Vercel, non in sviluppo locale', () => {
  assert.throws(() => assertArchivioAffidabile('log', { VERCEL_ENV: 'production' }), /BOOKING_STORE/);
  assert.throws(() => assertArchivioAffidabile('log', { VERCEL_ENV: 'preview' }), /BOOKING_STORE/);
  assert.doesNotThrow(() => assertArchivioAffidabile('log', { VERCEL_ENV: 'development' }));
  assert.doesNotThrow(() => assertArchivioAffidabile('log', {})); // sviluppo locale senza Vercel
  assert.doesNotThrow(() => assertArchivioAffidabile('kv', { VERCEL_ENV: 'production' })); // non riguarda kv/http
});
