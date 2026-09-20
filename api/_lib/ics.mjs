/**
 * Invito calendario in formato iCalendar (RFC 5545).
 *
 * Perche' un allegato e non solo un link: un sito non puo' scrivere
 * nell'agenda di una persona senza il suo account. Lo standard e' l'invito
 * .ics con METHOD:REQUEST — Gmail, Apple Mail e Outlook lo riconoscono e
 * mostrano l'evento gia' pronto, con un solo tocco per accettarlo. Il link a
 * Google Calendar resta come alternativa per chi legge da webmail.
 *
 * L'UID coincide con il codice richiesta: se lo studio sposta l'appuntamento e
 * reinvia l'invito con SEQUENCE piu' alta, il calendario aggiorna l'evento
 * esistente invece di crearne un altro.
 */

/** Offset di un fuso in minuti per un preciso istante (gestisce l'ora legale). */
function offsetMinuti(data, timeZone) {
  const dtf = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
  const p = Object.fromEntries(dtf.formatToParts(data).map((x) => [x.type, x.value]));
  const comeUtc = Date.UTC(p.year, p.month - 1, p.day, p.hour === '24' ? 0 : p.hour, p.minute, p.second);
  return (comeUtc - data.getTime()) / 60000;
}

/** "2026-11-24" + "15:30" nel fuso indicato -> istante UTC. */
export function localeToUtc(iso, ora, timeZone = 'Europe/Rome') {
  const [y, m, d] = iso.split('-').map(Number);
  const [hh, mm] = ora.split(':').map(Number);
  // prima ipotesi: gli stessi numeri letti come UTC, poi si corregge l'offset
  const tentativo = new Date(Date.UTC(y, m - 1, d, hh, mm, 0));
  const off = offsetMinuti(tentativo, timeZone);
  return new Date(tentativo.getTime() - off * 60000);
}

const stampa = (d) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');

/** Le righe iCalendar non superano i 75 ottetti: si spezzano con uno spazio. */
const piega = (riga) => {
  const out = [];
  let resto = riga;
  while (Buffer.byteLength(resto, 'utf8') > 75) {
    let taglio = 75;
    while (Buffer.byteLength(resto.slice(0, taglio), 'utf8') > 75) taglio--;
    out.push(resto.slice(0, taglio));
    resto = ' ' + resto.slice(taglio);
  }
  out.push(resto);
  return out.join('\r\n');
};

const esc = (s = '') =>
  String(s).replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');

/**
 * @param {object} r        record della richiesta (gia' confermata)
 * @param {object} studio   dati dello studio
 * @param {object} opt      { durataMin, professionista, sequence, metodo }
 * @returns {string} contenuto del file .ics
 */
export function buildIcs(r, studio, opt = {}) {
  const { durataMin = 60, professionista = '', sequence = 0, metodo = 'REQUEST' } = opt;

  const inizio = localeToUtc(r.data_richiesta, r.ora_richiesta);
  const fine = new Date(inizio.getTime() + durataMin * 60000);
  const adesso = new Date();

  const titolo = `${r.tipo_visita} — ${studio.nome}`;
  const descrizione = [
    `Appuntamento confermato presso ${studio.nome}.`,
    professionista ? `Professionista: ${professionista}` : '',
    `Codice richiesta: ${r.booking_id}`,
    '',
    "Porta un documento d'identita, la tessera sanitaria, eventuali radiografie precedenti e l'elenco dei farmaci che assumi.",
    `Per modifiche o disdette: ${studio.telefono}`
  ]
    .filter(Boolean)
    .join('\n');

  const righe = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//' + studio.nome + '//Appuntamenti//IT',
    'CALSCALE:GREGORIAN',
    'METHOD:' + metodo,
    'BEGIN:VEVENT',
    'UID:' + r.booking_id + '@' + (studio.sito || 'studio').replace(/^https?:\/\//, '').replace(/\/.*$/, ''),
    'SEQUENCE:' + sequence,
    'DTSTAMP:' + stampa(adesso),
    'DTSTART:' + stampa(inizio),
    'DTEND:' + stampa(fine),
    'SUMMARY:' + esc(titolo),
    'DESCRIPTION:' + esc(descrizione),
    'LOCATION:' + esc(studio.indirizzo),
    'STATUS:CONFIRMED',
    'TRANSP:OPAQUE',
    studio.email ? `ORGANIZER;CN=${esc(studio.nome)}:mailto:${studio.email}` : '',
    `ATTENDEE;CN=${esc(r.nome + ' ' + r.cognome)};RSVP=TRUE;PARTSTAT=NEEDS-ACTION:mailto:${r.email}`,
    // promemoria: il giorno prima e due ore prima
    'BEGIN:VALARM',
    'TRIGGER:-P1D',
    'ACTION:DISPLAY',
    'DESCRIPTION:' + esc('Domani: ' + titolo),
    'END:VALARM',
    'BEGIN:VALARM',
    'TRIGGER:-PT2H',
    'ACTION:DISPLAY',
    'DESCRIPTION:' + esc('Fra due ore: ' + titolo),
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR'
  ].filter(Boolean);

  return righe.map(piega).join('\r\n') + '\r\n';
}

/** Allegato pronto per il provider email. */
export const icsAttachment = (r, studio, opt) => ({
  filename: `appuntamento-${r.booking_id}.ics`,
  contentType: 'text/calendar; charset=utf-8; method=' + (opt?.metodo || 'REQUEST'),
  content: buildIcs(r, studio, opt)
});
