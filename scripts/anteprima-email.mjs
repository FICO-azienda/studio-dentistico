/**
 * Genera le anteprime delle tre email, in HTML e in testo semplice, senza
 * inviare nulla. Utile per rileggerle dopo una modifica ai template.
 *
 *   npm run email:preview        -> dist/_email/
 *   node scripts/anteprima-email.mjs --out anteprime
 */
import fs from 'node:fs';
import path from 'node:path';
import { validateBooking } from '../api/_lib/validate.mjs';
import { buildRecord } from '../api/_lib/store.mjs';
import { emailPaziente, emailStudio, emailConferma } from '../api/_lib/templates.mjs';

const argv = process.argv.slice(2);
const i = argv.indexOf('--out');
const OUT = i >= 0 && argv[i + 1] ? argv[i + 1] : path.join('dist', '_email');
fs.mkdirSync(OUT, { recursive: true });

// richiesta di esempio: implantologia, percorso completo con seconda preferenza
const v = validateBooking(
  {
    nome: 'Giulia',
    cognome: 'Bianchi',
    email: 'giulia.bianchi@example.com',
    telefono: '+39 333 111 2223',
    servizio: 'implantologia',
    risposte: {
      'quanti-denti': '1',
      estratto: 'si',
      'da-quanto': '6-12-mesi',
      esami: 'si',
      'preventivo-ricevuto': 'no'
    },
    modalita: 'prenota',
    dottore: 'Dr. Andrea Vitali',
    dataRichiesta: '2026-11-24',
    oraRichiesta: '15:30',
    secondaData: '2026-11-26',
    secondaOra: '16:30',
    messaggio: 'Ho perso un molare inferiore circa un anno fa.\nVorrei capire se posso mettere un impianto.',
    privacy: true,
    comunicazioni: true
  },
  { today: new Date('2026-09-20T12:00:00Z') }
);

if (!v.ok) {
  console.error('esempio non valido:', v.errors);
  process.exit(1);
}

const record = buildRecord(v.data, { bookingId: 'APT-2026-000124', now: new Date('2026-09-20T15:30:00Z') });

const pezzi = [
  ['1-studio', emailStudio(record)],
  ['2-paziente-richiesta', emailPaziente(record)]
];

// stato dopo l'accettazione da parte della segreteria
const confermato = { ...record, status: 'CONFIRMED' };
pezzi.push([
  '3-paziente-conferma',
  emailConferma(confermato, { professionista: 'Dr. Andrea Vitali', note: 'Porta la TC che hai fatto a marzo.' })
]);

for (const [nome, mail] of pezzi) {
  fs.writeFileSync(path.join(OUT, nome + '.html'), mail.html);
  fs.writeFileSync(path.join(OUT, nome + '.txt'), mail.text);
  console.log(nome.padEnd(22) + '| ' + mail.subject);
}
console.log('\nanteprime in ' + OUT);
