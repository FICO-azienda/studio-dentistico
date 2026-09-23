/**
 * Conferma una richiesta PENDING dall'interfaccia web dello staff: stessa
 * operazione di scripts/invia-conferma.mjs, ma a partire da un booking_id
 * gia' nell'archivio invece che da un file esportato dai log. I due percorsi
 * restano separati perche' rispondono a esigenze diverse: il CLI serve anche
 * quando l'archivio non e' interrogabile (es. BOOKING_STORE=http, o un
 * record recuperato a mano dai log), il web invece lavora sempre su un
 * record che la dashboard ha appena letto dall'archivio.
 */
import { emailConferma } from './templates.mjs';
import { sendMail } from './mail.mjs';
import { mittente, studio } from './studio.mjs';
import { icsAttachment } from './ics.mjs';
import { reserveSlots } from './availability.mjs';
import { byService } from './flows.mjs';
import { getBooking, updateBooking } from './store.mjs';

const STATI_CONFERMABILI = ['PENDING'];

/**
 * Ritorna { ok: true, record, emailSent } oppure
 * { ok: false, error: 'non_trovata' | 'stato_non_confermabile' | 'occupato' | 'giorno_chiuso' | 'orario_non_valido', record? }.
 */
export async function confermaPrenotazione(
  bookingId,
  { professionista = '', nota = '', data, ora, durataMin = 60, env = process.env, now = new Date() } = {}
) {
  const r = await getBooking(bookingId, env);
  if (!r) return { ok: false, error: 'non_trovata' };
  if (!STATI_CONFERMABILI.includes(r.status)) return { ok: false, error: 'stato_non_confermabile', record: r };

  const nuovaData = data || r.data_richiesta;
  const nuovaOra = ora || r.ora_richiesta;

  const slotCount = byService[r.tipo_visita_slug]?.slotCount || 1;
  const prenotato = await reserveSlots(nuovaData, nuovaOra, slotCount, bookingId, env);
  if (!prenotato.ok) return { ok: false, error: prenotato.motivo, record: r };

  const aggiornato = await updateBooking(
    bookingId,
    {
      status: 'CONFIRMED',
      data_richiesta: nuovaData,
      ora_richiesta: nuovaOra,
      professionista: professionista || r.professionista,
      ics_sequence: 0,
      confirmed_at: now.toISOString()
    },
    env
  );

  const mail = emailConferma(aggiornato, { professionista, note: nota });
  const invito = icsAttachment(aggiornato, studio, { professionista, durataMin, sequence: 0 });
  const esito = await sendMail(
    { from: mittente, to: aggiornato.email, replyTo: studio.email || undefined, ...mail, attachments: [invito] },
    env
  );

  return { ok: true, record: aggiornato, emailSent: esito.ok };
}
