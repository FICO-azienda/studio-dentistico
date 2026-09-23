/**
 * Annulla o sposta una prenotazione da riga di comando, forzando la regola
 * delle 24 ore: serve per i casi che il paziente non può più gestire da
 * solo online (meno di 24 ore all'appuntamento) e che lo studio ha
 * approvato per telefono o email.
 *
 *   node scripts/gestisci-prenotazione.mjs APT-2026-000124 --annulla
 *   node scripts/gestisci-prenotazione.mjs APT-2026-000124 --sposta --data 2026-11-26 --ora 15:00
 *
 * Richiede BOOKING_STORE=kv (o il file locale .data/prenotazioni.json in
 * modalità 'log', usato in sviluppo) per trovare la prenotazione: in
 * modalità 'http' l'archivio non è interrogabile da qui.
 */
import { cancella, sposta } from '../api/_lib/manage.mjs';
import { notificaAnnullamento, notificaSpostamento } from '../api/_lib/notify.mjs';

const argv = process.argv.slice(2);
const bookingId = argv.find((a) => !a.startsWith('--'));
const has = (nome) => argv.includes('--' + nome);
const opt = (nome, def = '') => {
  const i = argv.indexOf('--' + nome);
  return i >= 0 && argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[i + 1] : def;
};

if (!bookingId || (!has('annulla') && !has('sposta'))) {
  console.error(
    'Uso:\n' +
      '  node scripts/gestisci-prenotazione.mjs <booking_id> --annulla\n' +
      '  node scripts/gestisci-prenotazione.mjs <booking_id> --sposta --data AAAA-MM-GG --ora HH:MM'
  );
  process.exit(1);
}

if (has('annulla')) {
  const esito = await cancella(bookingId, { forza: true });
  if (!esito.ok) {
    console.error(`impossibile annullare: ${esito.error}`);
    process.exit(2);
  }
  await notificaAnnullamento(esito.record);
  console.log(`prenotazione ${bookingId} annullata e slot liberato.`);
  process.exit(0);
}

const nuovaData = opt('data');
const nuovaOra = opt('ora');
if (!nuovaData || !nuovaOra) {
  console.error('--sposta richiede --data AAAA-MM-GG e --ora HH:MM');
  process.exit(1);
}

const esito = await sposta(bookingId, nuovaData, nuovaOra, { forza: true });
if (!esito.ok) {
  console.error(
    esito.error === 'slot_occupato'
      ? `il nuovo orario (${nuovaData} ${nuovaOra}) è già occupato: scegline un altro.`
      : `impossibile spostare: ${esito.error}`
  );
  process.exit(2);
}
await notificaSpostamento(esito.record, esito.precedente);
console.log(`prenotazione ${bookingId} spostata a ${nuovaData} ${nuovaOra}.`);
