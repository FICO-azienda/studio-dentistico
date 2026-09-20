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

const NAVY = '#123355';
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

const CANALE = { telefono: 'Telefono', whatsapp: 'WhatsApp', email: 'Email' };
const FASCIA = { mattina: 'Mattina', 'pausa-pranzo': 'Pausa pranzo', pomeriggio: 'Pomeriggio', sera: 'Sera' };
const PRIORITA = { normal: 'Normale', high: 'Alta', urgent: 'Urgente' };

/** Righe generate dalle domande del servizio scelto. */
const righeServizio = (r) =>
  (r.riepilogo_servizio || []).map((x) => row(x.label, escapeHtml(x.value))).join('');

/** Riepilogo condiviso dalle due email. */
function riepilogo(r, { perStudio = false } = {}) {
  const seconda = r.seconda_preferenza
    ? escapeHtml(dateIt(r.seconda_preferenza.slice(0, 10))) +
      (r.seconda_preferenza.length > 10 ? ' alle ' + escapeHtml(r.seconda_preferenza.slice(11)) : '')
    : '—';
  return `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top:1px solid ${LINE}">
  ${row('Codice richiesta', `<span style="font-family:'SFMono-Regular',Menlo,Consolas,monospace;letter-spacing:.04em">${escapeHtml(r.booking_id)}</span>`, { mono: true })}
  ${row('Nome', escapeHtml(r.nome + ' ' + r.cognome))}
  ${row('Trattamento / motivo', escapeHtml(r.tipo_visita))}
  ${righeServizio(r)}
  ${
    r.modalita === 'ricontatto'
      ? row('Modalita', 'Richiamata') +
        row('Canale preferito', escapeHtml(CANALE[r.canale_contatto] || r.canale_contatto || '—')) +
        row('Fascia oraria', escapeHtml(FASCIA[r.fascia_contatto] || r.fascia_contatto || '—'))
      : row('Data richiesta', escapeHtml(dateIt(r.data_richiesta))) +
        row('Orario richiesto', escapeHtml(r.ora_richiesta)) +
        row('Seconda preferenza', seconda)
  }
  ${row('Professionista', escapeHtml(r.professionista))}
  ${row('Telefono', `<a href="tel:${escapeHtml(r.telefono.replace(/\s/g, ''))}" style="color:${NAVY};text-decoration:none">${escapeHtml(r.telefono)}</a>`)}
  ${row('Email', `<a href="mailto:${escapeHtml(r.email)}" style="color:${NAVY};text-decoration:none">${escapeHtml(r.email)}</a>`)}
  ${row('Messaggio', r.messaggio ? nl2br(r.messaggio) : '—')}
  ${perStudio ? row('Ricevuta il', escapeHtml(new Date(r.created_at).toLocaleString('it-IT', { timeZone: 'Europe/Rome' }))) : ''}
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
  const contatto = studio.whatsappHref
    ? 'https://wa.me/' + studio.whatsappHref
    : 'tel:' + studio.telefonoHref;

  const html = shell(
    'Richiesta di appuntamento ricevuta',
    `
<p style="margin:0 0 6px;font:500 11px/1 Helvetica,Arial,sans-serif;letter-spacing:.18em;text-transform:uppercase;color:${MUTED}">Richiesta ricevuta</p>
<h1 style="margin:0 0 18px;font:400 30px/1.15 Georgia,'Times New Roman',serif;color:${NAVY}">Ciao ${escapeHtml(r.nome)},</h1>
<p style="margin:0 0 22px;font:400 16px/1.65 Helvetica,Arial,sans-serif;color:${INK}">
  abbiamo ricevuto correttamente la tua richiesta di appuntamento presso ${escapeHtml(studio.nome)}.
  Di seguito trovi il riepilogo.
</p>
${riepilogo(r)}
<p style="margin:24px 0 24px;padding:16px 18px;background:#f7f7f5;font:400 15px/1.6 Helvetica,Arial,sans-serif;color:${INK}">
  La richiesta è stata inviata correttamente. Il nostro team ti contatterà per confermare
  definitivamente giorno e orario dell&#39;appuntamento.
</p>
${button(contatto, 'Contatta lo studio')}
<p style="margin:18px 0 0;font:400 13px/1.7 Helvetica,Arial,sans-serif;color:${MUTED}">
  Se hai necessità di modificare o annullare la richiesta, rispondi a questa email
  indicando il codice ${escapeHtml(r.booking_id)}.
</p>`,
    { preheader: `Richiesta ${r.booking_id} ricevuta. Ti contatteremo per confermare giorno e orario.` }
  );

  const text = [
    `Ciao ${r.nome},`,
    '',
    `abbiamo ricevuto correttamente la tua richiesta di appuntamento presso ${studio.nome}.`,
    'Di seguito trovi il riepilogo della richiesta:',
    '',
    riepilogoTesto(r),
    '',
    'La richiesta è stata inviata correttamente. Il nostro team ti contatterà per',
    "confermare definitivamente giorno e orario dell'appuntamento.",
    '',
    studio.telefono ? 'Contatta lo studio: ' + studio.telefono : '',
    studio.whatsapp ? 'WhatsApp: ' + studio.whatsapp : '',
    '',
    studio.nome,
    studio.indirizzo,
    [studio.telefono, studio.email].filter(Boolean).join(' · '),
    '',
    'Questa email è stata generata automaticamente in seguito a una richiesta',
    'effettuata tramite il nostro sito.'
  ]
    .filter((l) => l !== undefined)
    .join('\n');

  return {
    subject: `Richiesta di appuntamento ricevuta — ${studio.nome}`,
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
    'Appuntamento confermato',
    `
<p style="margin:0 0 6px;font:500 11px/1 Helvetica,Arial,sans-serif;letter-spacing:.18em;text-transform:uppercase;color:${MUTED}">Appuntamento confermato</p>
<h1 style="margin:0 0 18px;font:400 30px/1.15 Georgia,'Times New Roman',serif;color:${NAVY}">Ti aspettiamo, ${escapeHtml(r.nome)}.</h1>
<p style="margin:0 0 22px;font:400 16px/1.65 Helvetica,Arial,sans-serif;color:${INK}">
  Abbiamo verificato la disponibilit&agrave; e il tuo appuntamento &egrave; confermato.
  Ecco i dettagli.
</p>

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 24px">
  <tr><td bgcolor="#f7f7f5" style="padding:22px 24px;border-left:3px solid ${NAVY}">
    <p style="margin:0;font:500 11px/1 Helvetica,Arial,sans-serif;letter-spacing:.18em;text-transform:uppercase;color:${MUTED}">Quando</p>
    <p style="margin:8px 0 0;font:400 26px/1.25 Georgia,'Times New Roman',serif;color:${NAVY}">
      ${escapeHtml(dateIt(r.data_richiesta))}<br>alle ${escapeHtml(r.ora_richiesta)}
    </p>
  </td></tr>
</table>

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top:1px solid ${LINE}">
  ${row('Trattamento', escapeHtml(r.tipo_visita))}
  ${prof ? row('Professionista', escapeHtml(prof)) : ''}
  ${row('Dove', escapeHtml(studio.indirizzo))}
  ${row('Codice richiesta', `<span style="font-family:'SFMono-Regular',Menlo,Consolas,monospace;letter-spacing:.04em">${escapeHtml(r.booking_id)}</span>`, { mono: true })}
  ${note ? row('Nota dello studio', nl2br(note)) : ''}
</table>

<p style="margin:26px 0 10px;font:500 11px/1 Helvetica,Arial,sans-serif;letter-spacing:.18em;text-transform:uppercase;color:${MUTED}">Prima di venire</p>
<p style="margin:0 0 20px;font:400 15px/1.7 Helvetica,Arial,sans-serif;color:${INK}">
  Porta un documento d&#39;identit&agrave;, la tessera sanitaria, eventuali radiografie precedenti
  e l&#39;elenco dei farmaci che assumi. Arriva cinque minuti prima: servono per l&#39;accettazione.
</p>

${button(calendario, 'Aggiungi al calendario')}
${button(mappa, 'Indicazioni stradali', { light: true })}

<p style="margin:20px 0 0;font:400 13px/1.7 Helvetica,Arial,sans-serif;color:${MUTED}">
  Se non puoi presentarti, avvisaci con almeno 24 ore di anticipo chiamando
  ${studio.telefono ? `<a href="tel:${escapeHtml(studio.telefonoHref)}" style="color:${NAVY}">${escapeHtml(studio.telefono)}</a>` : 'lo studio'}:
  quel posto viene offerto a un altro paziente.
</p>`,
    { preheader: `Appuntamento confermato per ${dateIt(r.data_richiesta)} alle ${r.ora_richiesta}.` }
  );

  const text = [
    `Ti aspettiamo, ${r.nome}.`,
    '',
    'Abbiamo verificato la disponibilita e il tuo appuntamento e confermato.',
    '',
    'Quando: ' + dateIt(r.data_richiesta) + ' alle ' + r.ora_richiesta,
    'Trattamento: ' + r.tipo_visita,
    prof ? 'Professionista: ' + prof : '',
    'Dove: ' + studio.indirizzo,
    'Codice richiesta: ' + r.booking_id,
    note ? 'Nota dello studio: ' + note : '',
    '',
    "Porta un documento d'identita, la tessera sanitaria, eventuali radiografie",
    "precedenti e l'elenco dei farmaci che assumi. Arriva cinque minuti prima.",
    '',
    'Se non puoi presentarti avvisaci con almeno 24 ore di anticipo: ' + studio.telefono,
    '',
    studio.nome,
    studio.indirizzo,
    [studio.telefono, studio.email].filter(Boolean).join(' - ')
  ]
    .filter((l) => l !== '')
    .join('\n');

  return {
    subject: `Appuntamento confermato — ${dateIt(r.data_richiesta)} alle ${r.ora_richiesta} — ${studio.nome}`,
    html,
    text
  };
}
