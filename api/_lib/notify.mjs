/**
 * Email da inviare dopo un annullamento o uno spostamento: al paziente e,
 * in forma breve, allo studio. Usato sia dagli endpoint self-service sia
 * dallo script che lo staff lancia per i casi approvati fuori dalla
 * finestra delle 24 ore.
 */
import { emailAnnullamento, emailConferma, emailInternaBreve } from './templates.mjs';
import { sendMail } from './mail.mjs';
import { mittente, studio, destinatarioStudio } from './studio.mjs';
import { icsAttachment } from './ics.mjs';
import { dateIt } from './validate.mjs';

export async function notificaAnnullamento(record, env = process.env) {
  const mail = emailAnnullamento(record);
  const alPaziente = await sendMail({ from: mittente, to: record.email, replyTo: studio.email || undefined, ...mail }, env);

  if (destinatarioStudio) {
    const interna = emailInternaBreve('Prenotazione annullata', [
      ['Paziente', `${record.nome} ${record.cognome}`],
      ['Trattamento', record.tipo_visita],
      ['Era fissato per', `${dateIt(record.data_richiesta)} alle ${record.ora_richiesta}`],
      ['Codice', record.booking_id]
    ]);
    await sendMail({ from: mittente, to: destinatarioStudio, ...interna }, env).catch(() => {});
  }
  return alPaziente;
}

export async function notificaSpostamento(record, precedente, { professionista = '', env = process.env } = {}) {
  const mail = emailConferma(record, {
    professionista: professionista || record.professionista,
    note: `Appuntamento spostato su richiesta dal ${dateIt(precedente.data_richiesta)} alle ${precedente.ora_richiesta}.`
  });
  const invito = icsAttachment(record, studio, {
    professionista: professionista || record.professionista,
    sequence: record.ics_sequence || 1
  });
  const alPaziente = await sendMail(
    { from: mittente, to: record.email, replyTo: studio.email || undefined, ...mail, attachments: [invito] },
    env
  );

  if (destinatarioStudio) {
    const interna = emailInternaBreve('Prenotazione spostata', [
      ['Paziente', `${record.nome} ${record.cognome}`],
      ['Trattamento', record.tipo_visita],
      ['Nuovo orario', `${dateIt(record.data_richiesta)} alle ${record.ora_richiesta}`],
      ['Era fissato per', `${dateIt(precedente.data_richiesta)} alle ${precedente.ora_richiesta}`],
      ['Codice', record.booking_id]
    ]);
    await sendMail({ from: mittente, to: destinatarioStudio, ...interna }, env).catch(() => {});
  }
  return alPaziente;
}
