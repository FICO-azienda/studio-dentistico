/**
 * Invia al paziente l'email di conferma, dopo che lo studio ha accettato la
 * richiesta e verificato la disponibilita'.
 *
 * E' l'unico messaggio in cui si usa la parola "confermato": le email
 * automatiche della richiesta dicono soltanto che e' stata ricevuta.
 *
 *   node scripts/invia-conferma.mjs richiesta.json
 *   node scripts/invia-conferma.mjs richiesta.json --professionista "Dr. Andrea Vitali" \
 *        --nota "Porta la panoramica che hai fatto a marzo." --data 2026-11-24 --ora 15:30
 *   node scripts/invia-conferma.mjs richiesta.json --anteprima conferma.html
 *
 * Il file JSON e' il record salvato dall'archivio (una riga BOOKING dei log).
 * Con --anteprima non invia nulla e scrive l'HTML su file.
 */
import fs from 'node:fs';
import { emailConferma } from '../api/_lib/templates.mjs';
import { sendMail } from '../api/_lib/mail.mjs';
import { mittente, studio } from '../api/_lib/studio.mjs';
import { icsAttachment } from '../api/_lib/ics.mjs';
import { reserveSlots } from '../api/_lib/availability.mjs';
import { byService } from '../api/_lib/flows.mjs';
import { updateBooking } from '../api/_lib/store.mjs';

const argv = process.argv.slice(2);
const file = argv.find((a) => !a.startsWith('--'));
const opt = (nome, def = '') => {
  const i = argv.indexOf('--' + nome);
  return i >= 0 && argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[i + 1] : def;
};

if (!file) {
  console.error('Uso: node scripts/invia-conferma.mjs <richiesta.json> [--data] [--ora] [--professionista] [--nota] [--anteprima file.html]');
  process.exit(1);
}

const raw = fs.readFileSync(file, 'utf8').replace(/^BOOKING\s+/, '');
const record = JSON.parse(raw);

// lo studio puo' confermare una data diversa da quella richiesta
if (opt('data')) record.data_richiesta = opt('data');
if (opt('ora')) record.ora_richiesta = opt('ora');
record.status = 'CONFIRMED';

const mail = emailConferma(record, {
  professionista: opt('professionista'),
  note: opt('nota')
});

const invito = icsAttachment(record, studio, {
  professionista: opt('professionista'),
  durataMin: Number(opt('durata', '60')),
  sequence: Number(opt('revisione', '0'))
});

const anteprima = opt('anteprima');
if (anteprima) {
  fs.writeFileSync(anteprima, mail.html);
  fs.writeFileSync(anteprima.replace(/\.html?$/, '') + '.txt', mail.text);
  fs.writeFileSync(anteprima.replace(/\.html?$/, '') + '.ics', invito.content);
  console.log('anteprima scritta:', anteprima, '+ invito .ics');
  process.exit(0);
}

// occupa gli slot PRIMA di inviare: se sono gia' presi non si manda una
// conferma doppia. Un servizio con slotCount > 1 occupa piu' orari consecutivi.
const slotCount = byService[record.tipo_visita_slug]?.slotCount || 1;
const prenotato = await reserveSlots(record.data_richiesta, record.ora_richiesta, slotCount, record.booking_id);
if (!prenotato.ok) {
  console.error(
    prenotato.motivo === 'occupato'
      ? `slot gia' occupato (${prenotato.orario}): scegli un altro orario con --ora, oppure verifica manualmente.`
      : `orario non valido per ${slotCount} slot da ${record.data_richiesta} ${record.ora_richiesta}: non c'e' spazio prima della chiusura.`
  );
  process.exit(3);
}

// scrive la conferma nell'archivio: senza questo passaggio l'autogestione
// online (annulla/sposta) vedrebbe ancora lo stato PENDING della richiesta.
const revisione = Number(opt('revisione', '0'));
const aggiornato = await updateBooking(record.booking_id, {
  status: 'CONFIRMED',
  data_richiesta: record.data_richiesta,
  ora_richiesta: record.ora_richiesta,
  professionista: opt('professionista') || record.professionista,
  ics_sequence: revisione,
  confirmed_at: new Date().toISOString()
});
if (!aggiornato) {
  console.warn(
    "attenzione: la conferma non e' stata scritta nell'archivio (record non trovato, o BOOKING_STORE=http). " +
      "L'email parte comunque, ma l'autogestione online potrebbe non trovare questa prenotazione."
  );
}

const esito = await sendMail(
  { from: mittente, to: record.email, replyTo: studio.email || undefined, ...mail, attachments: [invito] },
  process.env
);

if (esito.ok) {
  console.log(`conferma inviata a ${record.email} (${record.booking_id}) via ${esito.provider}`);
} else {
  console.error(`invio fallito: ${esito.error}`);
  process.exit(2);
}
