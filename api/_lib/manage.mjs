/**
 * Autogestione della prenotazione: stato, cancellazione, spostamento.
 *
 * Regola delle 24 ore: il paziente puo' annullare o spostare da solo finche'
 * mancano almeno 24 ore all'appuntamento originale. Sotto quella soglia
 * l'azione self-service e' bloccata: a quel punto liberare uno slot ha un
 * costo reale per lo studio (difficile riassegnarlo in tempo), quindi serve
 * una decisione umana — il paziente chiama o scrive, lo studio valuta.
 *
 * Lo staff puo' sempre forzare l'operazione (scripts/gestisci-prenotazione.mjs),
 * 24 ore o no: e' la valvola per i casi approvati per telefono o email.
 */
import { getBooking, updateBooking } from './store.mjs';
import { localeToUtc } from './ics.mjs';
import { releaseSlots, reserveSlots } from './availability.mjs';
import { byService } from './flows.mjs';

const slotCountDi = (r) => byService[r.tipo_visita_slug]?.slotCount || 1;

const ORE_FINESTRA = 24;
const STATI_GESTIBILI = ['PENDING', 'CONFIRMED', 'RESCHEDULED'];

/** Ore mancanti all'inizio dell'appuntamento (puo' essere negativo se e' gia' passato). */
export function orePrimaAppuntamento(record, now = new Date()) {
  if (!record?.data_richiesta || !record?.ora_richiesta) return -Infinity;
  const inizio = localeToUtc(record.data_richiesta, record.ora_richiesta);
  return (inizio.getTime() - now.getTime()) / (60 * 60 * 1000);
}

export function selfServiceConsentita(record, now = new Date()) {
  return orePrimaAppuntamento(record, now) >= ORE_FINESTRA;
}

/** Stato pubblico di una prenotazione, per la pagina di autogestione. */
export async function statoPrenotazione(bookingId, env = process.env, now = new Date()) {
  const r = await getBooking(bookingId, env);
  if (!r) return { ok: false, error: 'non_trovata' };
  const gestibile = STATI_GESTIBILI.includes(r.status);
  return {
    ok: true,
    booking_id: r.booking_id,
    nome: r.nome,
    tipo_visita: r.tipo_visita,
    tipo_visita_slug: r.tipo_visita_slug,
    data: r.data_richiesta,
    ora: r.ora_richiesta,
    status: r.status,
    lingua: r.lingua || 'it',
    slotCount: slotCountDi(r),
    gestibile,
    selfService: gestibile && selfServiceConsentita(r, now)
  };
}

/**
 * Cancella una prenotazione e libera i suoi slot.
 * `forza` bypassa la regola delle 24 ore (solo lato staff).
 */
export async function cancella(bookingId, { forza = false, env = process.env, now = new Date() } = {}) {
  const r = await getBooking(bookingId, env);
  if (!r) return { ok: false, error: 'non_trovata' };
  if (!STATI_GESTIBILI.includes(r.status)) return { ok: false, error: 'stato_non_gestibile', record: r };
  if (!forza && !selfServiceConsentita(r, now)) return { ok: false, error: 'fuori_finestra', record: r };

  await releaseSlots(r.data_richiesta, r.booking_id, env);
  const aggiornato = await updateBooking(bookingId, { status: 'CANCELLED', cancelled_at: now.toISOString() }, env);
  return { ok: true, record: aggiornato, precedente: r };
}

/**
 * Sposta una prenotazione su un nuovo giorno/orario, mantenendo lo stesso
 * numero di slot del servizio originale. Se il nuovo orario non e' libero,
 * non tocca nulla: riprende la posizione precedente e segnala il conflitto.
 * `forza` bypassa la regola delle 24 ore, calcolata sull'appuntamento
 * ORIGINALE (e' quello a determinare se serve una decisione umana).
 */
export async function sposta(bookingId, nuovaData, nuovaOra, { forza = false, env = process.env, now = new Date() } = {}) {
  const r = await getBooking(bookingId, env);
  if (!r) return { ok: false, error: 'non_trovata' };
  if (!STATI_GESTIBILI.includes(r.status)) return { ok: false, error: 'stato_non_gestibile', record: r };
  if (!forza && !selfServiceConsentita(r, now)) return { ok: false, error: 'fuori_finestra', record: r };

  const slotCount = slotCountDi(r);
  await releaseSlots(r.data_richiesta, r.booking_id, env);
  const esito = await reserveSlots(nuovaData, nuovaOra, slotCount, r.booking_id, env);
  if (!esito.ok) {
    await reserveSlots(r.data_richiesta, r.ora_richiesta, slotCount, r.booking_id, env); // ripristina: non si lascia un buco senza motivo
    const error = esito.motivo === 'occupato' ? 'slot_occupato' : esito.motivo === 'giorno_chiuso' ? 'giorno_chiuso' : 'orario_non_valido';
    return { ok: false, error, record: r };
  }

  const aggiornato = await updateBooking(
    bookingId,
    {
      data_richiesta: nuovaData,
      ora_richiesta: nuovaOra,
      status: 'RESCHEDULED',
      rescheduled_at: now.toISOString(),
      ics_sequence: (r.ics_sequence || 0) + 1
    },
    env
  );
  return { ok: true, record: aggiornato, precedente: r };
}
