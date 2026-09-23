/**
 * Template delle email di prenotazione: HTML e testo semplice.
 *
 * Scelte tecniche dettate dai client di posta, non dal gusto:
 * - tabelle e attributi inline, perche' Outlook ignora gran parte del CSS
 * - nessun font remoto: Georgia e Helvetica sono ovunque
 * - larghezza massima 600px con immagini fluide, leggibile da smartphone
 * - nessuna immagine indispensabile: se il client le blocca si legge tutto
 *
 * Nota privacy: nelle email finisce solo quanto serve a fissare un
 * appuntamento. Il campo messaggio e' scritto dal paziente e puo' contenere
 * dati personali: non viene mai inoltrato a terzi ne' usato altrove.
 */
import { studio } from './studio.mjs';
import { dateIt } from './validate.mjs';
import { manageUrl } from './token.mjs';

const NAVY = '#1c4569';
const NAVY_DARK = '#0b2440';
const LINE = '#d7dce2';
const INK = '#343434';
const MUTED = '#5f6b78';

export const escapeHtml = (v = '') =>
  String(v)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const nl2br = (v = '') => escapeHtml(v).replace(/\n/g, '<br>');

/** Riga "etichetta / valore" del riepilogo. */
const row = (label, value, { mono = false } = {}) => `
<tr>
  <td style="padding:10px 0;border-bottom:1px solid ${LINE};font:400 12px/1.4 Helvetica,Arial,sans-serif;letter-spacing:.08em;text-transform:uppercase;color:${MUTED};width:42%;vertical-align:top">${escapeHtml(label)}</td>
  <td style="padding:10px 0;border-bottom:1px solid ${LINE};font:${mono ? '600' : '400'} 15px/1.5 Helvetica,Arial,sans-serif;color:${INK};vertical-align:top">${value}</td>
</tr>`;

const button = (href, label, { light = false } = {}) => `
<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 8px 8px 0;display:inline-block">
  <tr><td bgcolor="${light ? '#ffffff' : NAVY}" style="border-radius:999px;border:1px solid ${NAVY}">
    <a href="${escapeHtml(href)}" style="display:inline-block;padding:13px 26px;font:500 12px/1 Helvetica,Arial,sans-serif;letter-spacing:.14em;text-transform:uppercase;color:${light ? NAVY : '#ffffff'};text-decoration:none">${escapeHtml(label)}</a>
  </td></tr>
</table>`;

const shell = (titolo, contenuto, { preheader = '' } = {}) => `<!DOCTYPE html>
<html lang="it">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="x-apple-disable-message-reformatting">
<title>${escapeHtml(titolo)}</title>
</head>
<body style="margin:0;padding:0;background:#f7f7f5">
<div style="display:none;max-height:0;overflow:hidden;opacity:0">${escapeHtml(preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f7f7f5">
  <tr><td align="center" style="padding:28px 12px">
    <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;background:#ffffff;border:1px solid ${LINE}">
      <tr><td style="padding:28px 32px;border-bottom:1px solid ${LINE}">
        <span style="font:400 22px/1 Georgia,'Times New Roman',serif;letter-spacing:.06em;text-transform:uppercase;color:${NAVY}">${escapeHtml(studio.nome.replace(/^Studio\s+/i, ''))}</span>
        <span style="font:500 9px/1 Helvetica,Arial,sans-serif;letter-spacing:.22em;text-transform:uppercase;color:${MUTED};padding-left:8px">Studio Odontoiatrico</span>
      </td></tr>
      <tr><td style="padding:32px">${contenuto}</td></tr>
      <tr><td style="padding:24px 32px;border-top:1px solid ${LINE};background:#f7f7f5">
        <p style="margin:0 0 6px;font:400 14px/1.6 Helvetica,Arial,sans-serif;color:${INK}"><strong style="font-weight:600">${escapeHtml(studio.nome)}</strong></p>
        <p style="margin:0;font:400 13px/1.7 Helvetica,Arial,sans-serif;color:${MUTED}">
          ${escapeHtml(studio.indirizzo)}<br>
          ${studio.telefono ? `<a href="tel:${escapeHtml(studio.telefonoHref)}" style="color:${NAVY};text-decoration:none">${escapeHtml(studio.telefono)}</a> · ` : ''}
          ${studio.email ? `<a href="mailto:${escapeHtml(studio.email)}" style="color:${NAVY};text-decoration:none">${escapeHtml(studio.email)}</a>` : ''}
        </p>
      </td></tr>
    </table>
    <p style="max-width:600px;margin:16px auto 0;font:400 11px/1.6 Helvetica,Arial,sans-serif;color:${MUTED};text-align:center">
      Questa email è stata generata automaticamente in seguito a una richiesta effettuata tramite il nostro sito.
    </p>
  </td></tr>
</table>
</body>
</html>`;

/* -- stringhe delle email, per lingua del paziente ------------------------ */
const L = {
  it: {
    subjReceived: (n) => `Richiesta di appuntamento ricevuta — ${n}`,
    subjConfirmed: (d, o, n) => `Appuntamento confermato — ${d} alle ${o} — ${n}`,
    received: 'Richiesta ricevuta',
    hi: (n) => `Ciao ${n},`,
    intro: (n) => `abbiamo ricevuto correttamente la tua richiesta di appuntamento presso ${n}. Di seguito trovi il riepilogo.`,
    notConfirmed:
      'La richiesta è stata inviata correttamente. Il nostro team ti contatterà per confermare definitivamente giorno e orario dell&#39;appuntamento.',
    contactCta: 'Contatta lo studio',
    changeNote: (c) => `Se hai necessità di modificare o annullare la richiesta, rispondi a questa email indicando il codice ${c}.`,
    auto: 'Questa email è stata generata automaticamente in seguito a una richiesta effettuata tramite il nostro sito.',
    preheaderReceived: (c) => `Richiesta ${c} ricevuta. Ti contatteremo per confermare giorno e orario.`,
    rows: {
      code: 'Codice richiesta',
      name: 'Nome',
      treatment: 'Trattamento / motivo',
      date: 'Data richiesta',
      time: 'Orario richiesto',
      second: 'Seconda preferenza',
      mode: 'Modalità',
      callback: 'Richiamata',
      channel: 'Canale preferito',
      window: 'Fascia oraria',
      professional: 'Professionista',
      phone: 'Telefono',
      email: 'Email',
      message: 'Messaggio',
      receivedAt: 'Ricevuta il',
      where: 'Dove',
      studioNote: 'Nota dello studio'
    },
    confirmLabel: 'Appuntamento confermato',
    confirmTitle: (n) => `Ti aspettiamo, ${n}.`,
    confirmIntro: 'Abbiamo verificato la disponibilità e il tuo appuntamento è confermato. Ecco i dettagli.',
    when: 'Quando',
    at: 'alle',
    invite:
      'A questa email è allegato l&#39;invito per il calendario: aprilo e l&#39;appuntamento entra in agenda con i promemoria il giorno prima e due ore prima.',
    calendarCta: 'Aggiungi a Google Calendar',
    directionsCta: 'Indicazioni stradali',
    beforeLabel: 'Prima di venire',
    before:
      'Porta un documento d&#39;identità, la tessera sanitaria, eventuali radiografie precedenti e l&#39;elenco dei farmaci che assumi. Arriva cinque minuti prima: servono per l&#39;accettazione.',
    cancelNote: (tel) =>
      `Se non puoi presentarti, avvisaci con almeno 24 ore di anticipo chiamando ${tel}: quel posto viene offerto a un altro paziente.`,
    preheaderConfirmed: (d, o) => `Appuntamento confermato per ${d} alle ${o}.`,
    manageCta: 'Gestisci la tua prenotazione',
    manageIntro:
      'Hai bisogno di annullare o spostare? Puoi farlo online, gratuitamente, fino a 24 ore prima dell&#39;appuntamento.',
    lateNote: (tel, email) =>
      `Se mancano meno di 24 ore, la modifica online non è più disponibile: chiamaci al ${tel} oppure scrivici a ${email} e valutiamo insieme se è possibile.`,
    cancelLabel: 'Appuntamento annullato',
    cancelTitle: (n) => `Appuntamento annullato, ${n}.`,
    cancelIntro: 'Come richiesto, il tuo appuntamento è stato annullato e lo slot è stato liberato.',
    subjCancelled: (d, o, n) => `Appuntamento annullato — ${d} alle ${o} — ${n}`,
    preheaderCancelled: (d, o) => `Appuntamento del ${d} alle ${o} annullato.`,
    bookAgainCta: 'Prenota un nuovo appuntamento',
    wasNote: (d, o) => `In precedenza era fissato per ${d} alle ${o}.`
  },
  en: {
    subjReceived: (n) => `Appointment request received — ${n}`,
    subjConfirmed: (d, o, n) => `Appointment confirmed — ${d} at ${o} — ${n}`,
    received: 'Request received',
    hi: (n) => `Hello ${n},`,
    intro: (n) => `we have received your appointment request at ${n}. Here is a summary.`,
    notConfirmed:
      'Your request has been sent successfully. Our team will contact you to confirm the date and time of your appointment.',
    contactCta: 'Contact the practice',
    changeNote: (c) => `If you need to change or cancel your request, reply to this email quoting reference ${c}.`,
    auto: 'This email was generated automatically following a request made through our website.',
    preheaderReceived: (c) => `Request ${c} received. We will contact you to confirm the date and time.`,
    rows: {
      code: 'Request reference',
      name: 'Name',
      treatment: 'Treatment / reason',
      date: 'Requested date',
      time: 'Requested time',
      second: 'Second preference',
      mode: 'Format',
      callback: 'Call back',
      channel: 'Preferred channel',
      window: 'Preferred time',
      professional: 'Practitioner',
      phone: 'Phone',
      email: 'Email',
      message: 'Message',
      receivedAt: 'Received on',
      where: 'Where',
      studioNote: 'Note from the practice'
    },
    confirmLabel: 'Appointment confirmed',
    confirmTitle: (n) => `We look forward to seeing you, ${n}.`,
    confirmIntro: 'We have checked availability and your appointment is confirmed. Here are the details.',
    when: 'When',
    at: 'at',
    invite:
      'A calendar invitation is attached to this email: open it and the appointment goes straight into your diary, with reminders the day before and two hours ahead.',
    calendarCta: 'Add to Google Calendar',
    directionsCta: 'Directions',
    beforeLabel: 'Before you come',
    before:
      'Please bring photo ID, your health card, any previous radiographs and a list of the medicines you take. Arrive five minutes early for check-in.',
    cancelNote: (tel) =>
      `If you cannot attend, please let us know at least 24 hours in advance by calling ${tel}: the slot is offered to another patient.`,
    preheaderConfirmed: (d, o) => `Appointment confirmed for ${d} at ${o}.`,
    manageCta: 'Manage your appointment',
    manageIntro: 'Need to cancel or reschedule? You can do it online, free of charge, up to 24 hours before your appointment.',
    lateNote: (tel, email) =>
      `If less than 24 hours remain, the online change is no longer available: call us on ${tel} or write to ${email} and we will see what is possible.`,
    cancelLabel: 'Appointment cancelled',
    cancelTitle: (n) => `Appointment cancelled, ${n}.`,
    cancelIntro: 'As requested, your appointment has been cancelled and the slot has been freed.',
    subjCancelled: (d, o, n) => `Appointment cancelled — ${d} at ${o} — ${n}`,
    preheaderCancelled: (d, o) => `Appointment on ${d} at ${o} cancelled.`,
    bookAgainCta: 'Book a new appointment',
    wasNote: (d, o) => `It was previously scheduled for ${d} at ${o}.`
  }
};

const tr = (r) => L[r?.lingua === 'en' ? 'en' : 'it'];
const dataLoc = (r, iso) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso || '')) return iso;
  return new Date(iso + 'T12:00:00Z').toLocaleDateString(r?.lingua === 'en' ? 'en-GB' : 'it-IT', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC'
  });
};

const CANALE = { telefono: 'Telefono', whatsapp: 'WhatsApp', email: 'Email' };
const FASCIA = { mattina: 'Mattina', 'pausa-pranzo': 'Pausa pranzo', pomeriggio: 'Pomeriggio', sera: 'Sera' };
const PRIORITA = { normal: 'Normale', high: 'Alta', urgent: 'Urgente' };

/** Righe generate dalle domande del servizio scelto. */
const righeServizio = (r) =>
  (r.riepilogo_servizio || []).map((x) => row(x.label, escapeHtml(x.value))).join('');

/** Riepilogo condiviso dalle due email. */
function riepilogo(r, { perStudio = false } = {}) {
  const T = perStudio ? L.it : tr(r);
  const R = T.rows;
  const D = (iso) => (perStudio ? dateIt(iso) : dataLoc(r, iso));
  const seconda = r.seconda_preferenza
    ? escapeHtml(D(r.seconda_preferenza.slice(0, 10))) +
      (r.seconda_preferenza.length > 10 ? ' ' + T.at + ' ' + escapeHtml(r.seconda_preferenza.slice(11)) : '')
    : '—';
  return `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top:1px solid ${LINE}">
  ${row(R.code, `<span style="font-family:'SFMono-Regular',Menlo,Consolas,monospace;letter-spacing:.04em">${escapeHtml(r.booking_id)}</span>`, { mono: true })}
  ${row(R.name, escapeHtml(r.nome + ' ' + r.cognome))}
  ${row(R.treatment, escapeHtml(r.tipo_visita))}
  ${righeServizio(r)}
  ${
    r.modalita === 'ricontatto'
      ? row(R.mode, R.callback) +
        row(R.channel, escapeHtml(CANALE[r.canale_contatto] || r.canale_contatto || '—')) +
        row(R.window, escapeHtml(FASCIA[r.fascia_contatto] || r.fascia_contatto || '—'))
      : row(R.date, escapeHtml(D(r.data_richiesta))) +
        row(R.time, escapeHtml(r.ora_richiesta)) +
        row(R.second, seconda)
  }
  ${row(R.professional, escapeHtml(r.professionista))}
  ${row(R.phone, `<a href="tel:${escapeHtml(r.telefono.replace(/\s/g, ''))}" style="color:${NAVY};text-decoration:none">${escapeHtml(r.telefono)}</a>`)}
  ${row(R.email, `<a href="mailto:${escapeHtml(r.email)}" style="color:${NAVY};text-decoration:none">${escapeHtml(r.email)}</a>`)}
  ${row(R.message, r.messaggio ? nl2br(r.messaggio) : '—')}
  ${perStudio ? row(R.receivedAt, escapeHtml(new Date(r.created_at).toLocaleString('it-IT', { timeZone: 'Europe/Rome' }))) : ''}
</table>`;
}

const riepilogoTesto = (r, { perStudio = false } = {}) =>
  [
    'Codice richiesta: ' + r.booking_id,
    'Nome: ' + r.nome + ' ' + r.cognome,
    'Trattamento / motivo: ' + r.tipo_visita,
    ...(r.riepilogo_servizio || []).map((x) => x.label + ': ' + x.value),
    ...(r.modalita === 'ricontatto'
      ? [
          'Modalita: richiamata',
          'Canale preferito: ' + (CANALE[r.canale_contatto] || '—'),
          'Fascia oraria: ' + (FASCIA[r.fascia_contatto] || '—')
        ]
      : [
          'Data richiesta: ' + dateIt(r.data_richiesta),
          'Orario richiesto: ' + r.ora_richiesta,
          'Seconda preferenza: ' + (r.seconda_preferenza ? dateIt(r.seconda_preferenza.slice(0, 10)) + (r.seconda_preferenza.length > 10 ? ' alle ' + r.seconda_preferenza.slice(11) : '') : '—')
        ]),
    'Professionista: ' + r.professionista,
    'Telefono: ' + r.telefono,
    'Email: ' + r.email,
    'Messaggio: ' + (r.messaggio || '—'),
    perStudio ? 'Ricevuta il: ' + new Date(r.created_at).toLocaleString('it-IT', { timeZone: 'Europe/Rome' }) : ''
  ]
    .filter(Boolean)
    .join('\n');

/* ------------------------------------------------------------------ */
/* Email 1 — conferma di ricezione al paziente                         */
/* Mai la parola "confermato" riferita a giorno e orario: la richiesta  */
/* e' ricevuta, non ancora verificata dalla segreteria.                */
/* ------------------------------------------------------------------ */
export function emailPaziente(r) {
  const T = tr(r);
  const contatto = studio.whatsappHref
    ? 'https://wa.me/' + studio.whatsappHref
    : 'tel:' + studio.telefonoHref;

  const html = shell(
    T.received,
    `
<p style="margin:0 0 6px;font:500 11px/1 Helvetica,Arial,sans-serif;letter-spacing:.18em;text-transform:uppercase;color:${MUTED}">${escapeHtml(T.received)}</p>
<h1 style="margin:0 0 18px;font:400 30px/1.15 Georgia,'Times New Roman',serif;color:${NAVY}">${escapeHtml(T.hi(r.nome))}</h1>
<p style="margin:0 0 22px;font:400 16px/1.65 Helvetica,Arial,sans-serif;color:${INK}">
  ${escapeHtml(T.intro(studio.nome))}
</p>
${riepilogo(r)}
<p style="margin:24px 0 24px;padding:16px 18px;background:#f7f7f5;font:400 15px/1.6 Helvetica,Arial,sans-serif;color:${INK}">
  ${T.notConfirmed}
</p>
${button(contatto, T.contactCta)}
<p style="margin:18px 0 0;font:400 13px/1.7 Helvetica,Arial,sans-serif;color:${MUTED}">
  ${escapeHtml(T.changeNote(r.booking_id))}
</p>`,
    { preheader: T.preheaderReceived(r.booking_id) }
  );

  const text = [
    T.hi(r.nome),
    '',
    T.intro(studio.nome).replace(/&#39;/g, "'"),
    '',
    riepilogoTesto(r),
    '',
    'La richiesta è stata inviata correttamente. Il nostro team ti contatterà per',
    "confermare definitivamente giorno e orario dell'appuntamento.",
    '',
    studio.telefono ? T.contactCta + ': ' + studio.telefono : '',
    studio.whatsapp ? 'WhatsApp: ' + studio.whatsapp : '',
    '',
    studio.nome,
    studio.indirizzo,
    [studio.telefono, studio.email].filter(Boolean).join(' · '),
    '',
    T.auto
  ]
    .filter((l) => l !== undefined)
    .join('\n');

  return {
    subject: T.subjReceived(studio.nome),
    html,
    text
  };
}

/* ------------------------------------------------------------------ */
/* Email 2 — notifica interna allo studio                              */
/* ------------------------------------------------------------------ */
export function emailStudio(r) {
  const tel = r.telefono.replace(/\s/g, '');
  const wa = tel.replace(/[^\d]/g, '').replace(/^00/, '');

  const html = shell(
    'Nuova richiesta di appuntamento',
    `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 22px">
  <tr><td bgcolor="${NAVY_DARK}" style="padding:16px 20px">
    <p style="margin:0;font:500 11px/1 Helvetica,Arial,sans-serif;letter-spacing:.2em;text-transform:uppercase;color:#9dbada">Sito web</p>
    <p style="margin:6px 0 0;font:400 22px/1.2 Georgia,'Times New Roman',serif;color:#ffffff">${escapeHtml(r.tipo_visita || 'Nuova richiesta')}</p>
    <p style="margin:8px 0 0;font:500 11px/1.5 Helvetica,Arial,sans-serif;letter-spacing:.12em;text-transform:uppercase;color:${r.priority === 'urgent' ? '#ffb4a8' : r.priority === 'high' ? '#ffd9a8' : '#9dbada'}">
      Priorità interna: ${escapeHtml(PRIORITA[r.priority] || 'Normale')}${r.modalita === 'ricontatto' ? ' · richiamata' : ''}
    </p>
  </td></tr>
</table>
<p style="margin:0 0 18px;font:400 12px/1.6 Helvetica,Arial,sans-serif;color:${MUTED}">
  La priorità è una classificazione interna per organizzare le richieste, ricavata dalle
  risposte del paziente. Non è una diagnosi e non è stata mostrata al paziente.
</p>
${riepilogo(r, { perStudio: true })}
<p style="margin:24px 0 10px;font:500 11px/1 Helvetica,Arial,sans-serif;letter-spacing:.18em;text-transform:uppercase;color:${MUTED}">Azioni rapide</p>
${button('tel:' + tel, 'Chiama il cliente')}
${button('mailto:' + r.email, 'Invia email', { light: true })}
${wa ? button('https://wa.me/' + wa, 'WhatsApp', { light: true }) : ''}
<p style="margin:20px 0 0;font:400 13px/1.7 Helvetica,Arial,sans-serif;color:${MUTED}">
  Tag: <strong style="color:${INK}">${escapeHtml((r.tags || []).join(' · ') || '—')}</strong><br>
  Stato attuale della richiesta: <strong style="color:${INK}">PENDING</strong>.
  Va confermata contattando il paziente: l&#39;email che ha ricevuto non conferma giorno e orario.
</p>`,
    { preheader: `${r.nome} ${r.cognome} — ${r.tipo_visita} — ${dateIt(r.data_richiesta)} ${r.ora_richiesta}` }
  );

  const text = [
    'NUOVA RICHIESTA DI APPUNTAMENTO',
    'Servizio: ' + r.tipo_visita,
    'Priorità interna: ' + (PRIORITA[r.priority] || 'Normale') + (r.modalita === 'ricontatto' ? ' - richiamata' : ''),
    'Tag: ' + ((r.tags || []).join(' ') || '-'),
    '',
    riepilogoTesto(r, { perStudio: true }),
    '',
    'Stato: PENDING — da confermare contattando il paziente.',
    '',
    'Chiama: ' + r.telefono,
    'Email: ' + r.email,
    wa ? 'WhatsApp: https://wa.me/' + wa : ''
  ]
    .filter(Boolean)
    .join('\n');

  const quando = r.modalita === 'ricontatto' ? 'richiamata' : dateIt(r.data_richiesta);
  const urgente = r.priority === 'urgent' ? '[URGENTE] ' : r.priority === 'high' ? '[PRIORITA ALTA] ' : '';

  return {
    subject: `${urgente}Nuova richiesta ${r.tipo_visita} — ${r.nome} ${r.cognome} — ${quando}`,
    html,
    text
  };
}


/* ------------------------------------------------------------------ */
/* Email 3 — conferma, dopo che lo studio ha accettato la richiesta    */
/* Questa e' l'unica email in cui si puo' dire "confermato", perche'   */
/* la segreteria ha verificato la disponibilita'.                      */
/* ------------------------------------------------------------------ */
export function emailConferma(r, { professionista = '', note = '' } = {}) {
  const T = tr(r);
  const prof = professionista || r.professionista || '';
  const mappa =
    'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(studio.indirizzo);

  // link al calendario: niente allegati, funziona ovunque
  const inizio = (r.data_richiesta || '').replace(/-/g, '') + 'T' + (r.ora_richiesta || '09:00').replace(':', '') + '00';
  const fineOra = String(Math.min(23, Number((r.ora_richiesta || '09:00').slice(0, 2)) + 1)).padStart(2, '0');
  const fine = (r.data_richiesta || '').replace(/-/g, '') + 'T' + fineOra + (r.ora_richiesta || '09:00').slice(3) + '00';
  const calendario =
    'https://calendar.google.com/calendar/render?action=TEMPLATE' +
    '&text=' + encodeURIComponent(`${r.tipo_visita} — ${studio.nome}`) +
    '&dates=' + inizio + '/' + fine +
    '&location=' + encodeURIComponent(studio.indirizzo) +
    '&details=' + encodeURIComponent(`Codice richiesta ${r.booking_id}. Per modifiche: ${studio.telefono}`);

  const html = shell(
    T.confirmLabel,
    `
<p style="margin:0 0 6px;font:500 11px/1 Helvetica,Arial,sans-serif;letter-spacing:.18em;text-transform:uppercase;color:${MUTED}">${escapeHtml(T.confirmLabel)}</p>
<h1 style="margin:0 0 18px;font:400 30px/1.15 Georgia,'Times New Roman',serif;color:${NAVY}">${escapeHtml(T.confirmTitle(r.nome))}</h1>
<p style="margin:0 0 22px;font:400 16px/1.65 Helvetica,Arial,sans-serif;color:${INK}">${escapeHtml(T.confirmIntro)}</p>

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 24px">
  <tr><td bgcolor="#f7f7f5" style="padding:22px 24px;border-left:3px solid ${NAVY}">
    <p style="margin:0;font:500 11px/1 Helvetica,Arial,sans-serif;letter-spacing:.18em;text-transform:uppercase;color:${MUTED}">${escapeHtml(T.when)}</p>
    <p style="margin:8px 0 0;font:400 26px/1.25 Georgia,'Times New Roman',serif;color:${NAVY}">
      ${escapeHtml(dataLoc(r, r.data_richiesta))}<br>${escapeHtml(T.at)} ${escapeHtml(r.ora_richiesta)}
    </p>
  </td></tr>
</table>

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top:1px solid ${LINE}">
  ${row(T.rows.treatment, escapeHtml(r.tipo_visita))}
  ${prof ? row(T.rows.professional, escapeHtml(prof)) : ''}
  ${row(T.rows.where, escapeHtml(studio.indirizzo))}
  ${row(T.rows.code, `<span style="font-family:'SFMono-Regular',Menlo,Consolas,monospace;letter-spacing:.04em">${escapeHtml(r.booking_id)}</span>`, { mono: true })}
  ${note ? row(T.rows.studioNote, nl2br(note)) : ''}
</table>

<p style="margin:26px 0 10px;font:500 11px/1 Helvetica,Arial,sans-serif;letter-spacing:.18em;text-transform:uppercase;color:${MUTED}">${escapeHtml(T.beforeLabel)}</p>
<p style="margin:0 0 20px;font:400 15px/1.7 Helvetica,Arial,sans-serif;color:${INK}">
  ${T.before}
</p>

<p style="margin:0 0 14px;font:400 15px/1.7 Helvetica,Arial,sans-serif;color:${INK}">
  ${T.invite}
</p>
${button(calendario, T.calendarCta)}
${button(mappa, T.directionsCta, { light: true })}

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:28px 0 0">
  <tr><td style="padding:20px 22px;border:1px solid ${LINE}">
    <p style="margin:0 0 10px;font:400 14px/1.6 Helvetica,Arial,sans-serif;color:${INK}">${T.manageIntro}</p>
    ${button(manageUrl(r.booking_id, r.lingua === 'en' ? 'en' : 'it'), T.manageCta, { light: true })}
    <p style="margin:14px 0 0;font:400 13px/1.7 Helvetica,Arial,sans-serif;color:${MUTED}">
      ${T.lateNote(
        studio.telefono
          ? `<a href="tel:${escapeHtml(studio.telefonoHref)}" style="color:${NAVY}">${escapeHtml(studio.telefono)}</a>`
          : studio.nome,
        studio.email
          ? `<a href="mailto:${escapeHtml(studio.email)}" style="color:${NAVY}">${escapeHtml(studio.email)}</a>`
          : ''
      )}
    </p>
  </td></tr>
</table>`,
    { preheader: T.preheaderConfirmed(dataLoc(r, r.data_richiesta), r.ora_richiesta) }
  );

  const text = [
    T.confirmTitle(r.nome),
    '',
    T.confirmIntro,
    '',
    T.when + ': ' + dataLoc(r, r.data_richiesta) + ' ' + T.at + ' ' + r.ora_richiesta,
    T.rows.treatment + ': ' + r.tipo_visita,
    prof ? T.rows.professional + ': ' + prof : '',
    T.rows.where + ': ' + studio.indirizzo,
    T.rows.code + ': ' + r.booking_id,
    note ? T.rows.studioNote + ': ' + note : '',
    '',
    T.invite.replace(/&#39;/g, "'"),
    '',
    T.before.replace(/&#39;/g, "'").replace(/&agrave;/g, 'a'),
    '',
    T.manageIntro.replace(/&#39;/g, "'") + ' ' + manageUrl(r.booking_id, r.lingua === 'en' ? 'en' : 'it'),
    T.lateNote(studio.telefono, studio.email).replace(/<[^>]+>/g, ''),
    '',
    studio.nome,
    studio.indirizzo,
    [studio.telefono, studio.email].filter(Boolean).join(' - ')
  ]
    .filter((l) => l !== '')
    .join('\n');

  return {
    subject: T.subjConfirmed(dataLoc(r, r.data_richiesta), r.ora_richiesta, studio.nome),
    html,
    text
  };
}

/* ------------------------------------------------------------------ */
/* Email 4 — annullamento, su richiesta del paziente o dello studio    */
/* ------------------------------------------------------------------ */
export function emailAnnullamento(r) {
  const T = tr(r);
  const html = shell(
    T.cancelLabel,
    `
<p style="margin:0 0 6px;font:500 11px/1 Helvetica,Arial,sans-serif;letter-spacing:.18em;text-transform:uppercase;color:${MUTED}">${escapeHtml(T.cancelLabel)}</p>
<h1 style="margin:0 0 18px;font:400 30px/1.15 Georgia,'Times New Roman',serif;color:${NAVY}">${escapeHtml(T.cancelTitle(r.nome))}</h1>
<p style="margin:0 0 22px;font:400 16px/1.65 Helvetica,Arial,sans-serif;color:${INK}">${escapeHtml(T.cancelIntro)}</p>

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top:1px solid ${LINE}">
  ${row(T.when, escapeHtml(dataLoc(r, r.data_richiesta)) + ' ' + escapeHtml(T.at) + ' ' + escapeHtml(r.ora_richiesta))}
  ${row(T.rows.treatment, escapeHtml(r.tipo_visita))}
  ${row(T.rows.code, `<span style="font-family:'SFMono-Regular',Menlo,Consolas,monospace;letter-spacing:.04em">${escapeHtml(r.booking_id)}</span>`, { mono: true })}
</table>

${button(studio.sito ? `${studio.sito}/${r.lingua === 'en' ? 'en' : 'it'}/` : '#', T.bookAgainCta)}`,
    { preheader: T.preheaderCancelled(dataLoc(r, r.data_richiesta), r.ora_richiesta) }
  );

  const text = [
    T.cancelTitle(r.nome),
    '',
    T.cancelIntro,
    '',
    T.wasNote(dataLoc(r, r.data_richiesta), r.ora_richiesta),
    T.rows.treatment + ': ' + r.tipo_visita,
    T.rows.code + ': ' + r.booking_id,
    '',
    studio.nome,
    studio.indirizzo,
    [studio.telefono, studio.email].filter(Boolean).join(' - ')
  ]
    .filter((l) => l !== '')
    .join('\n');

  return {
    subject: T.subjCancelled(dataLoc(r, r.data_richiesta), r.ora_richiesta, studio.nome),
    html,
    text
  };
}

/* ------------------------------------------------------------------ */
/* Notifica interna breve per lo studio: conferme, spostamenti e       */
/* annullamenti. Sempre in italiano: e' per lo staff, non per il       */
/* paziente, e la lingua del paziente non c'entra.                     */
/* ------------------------------------------------------------------ */
export function emailInternaBreve(titolo, righe) {
  const html = shell(
    titolo,
    `
<h1 style="margin:0 0 18px;font:400 26px/1.2 Georgia,'Times New Roman',serif;color:${NAVY}">${escapeHtml(titolo)}</h1>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top:1px solid ${LINE}">
  ${righe.map(([k, v]) => row(k, escapeHtml(String(v)))).join('')}
</table>`,
    { preheader: titolo }
  );
  const text = [titolo, '', ...righe.map(([k, v]) => `${k}: ${v}`)].join('\n');
  return { subject: `[${studio.nome}] ${titolo}`, html, text };
}
