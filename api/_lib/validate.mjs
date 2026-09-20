/**
 * Validazione e sanitizzazione lato server delle richieste di appuntamento.
 * Non si fida mai del client: il browser puo' essere aggirato.
 */

export const VISIT_TYPES = [
  { value: 'prima-visita', label: 'Prima visita' },
  { value: 'igiene', label: 'Igiene dentale' },
  { value: 'controllo', label: 'Controllo' },
  { value: 'ortodonzia', label: 'Ortodonzia' },
  { value: 'implantologia', label: 'Implantologia' },
  { value: 'estetica', label: 'Estetica dentale' },
  { value: 'urgenza', label: 'Urgenza' },
  { value: 'altro', label: 'Altro' }
];

const LABELS = Object.fromEntries(VISIT_TYPES.map((t) => [t.value, t.label]));

const LIMITS = {
  nome: 60,
  cognome: 60,
  email: 140,
  telefono: 30,
  dottore: 80,
  ora: 5,
  messaggio: 1500
};

// caratteri di controllo (esclusi tab e a capo, gestiti a parte)
const CTRL = new RegExp('[\\u0000-\\u0008\\u000B\\u000C\\u000E-\\u001F\\u007F]', 'g');

/** Rimuove caratteri di controllo, normalizza gli spazi e taglia alla lunghezza massima. */
export const clean = (value, max = 200) =>
  String(value ?? '')
    .replace(CTRL, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, max);

/** Il messaggio puo' contenere a capo: li conserva, ma non piu' di due di fila. */
export const cleanMultiline = (value, max = 1500) =>
  String(value ?? '')
    .replace(CTRL, '')
    .replace(/\r\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .split('\n')
    .map((l) => l.replace(/[ \t]+/g, ' ').trim())
    .join('\n')
    .trim()
    .slice(0, max);

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;
const PHONE_RE = /^[+(\d][\d\s()./-]{5,}$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/;

/** La data deve essere valida, non nel passato, non oltre un anno, non di domenica. */
export function checkDate(value, { today = new Date() } = {}) {
  if (!DATE_RE.test(value)) return 'formato non valido';
  const d = new Date(value + 'T12:00:00Z');
  if (Number.isNaN(d.getTime())) return 'data inesistente';
  if (d.toISOString().slice(0, 10) !== value) return 'data inesistente';
  const start = new Date(today);
  start.setHours(0, 0, 0, 0);
  if (d < start) return 'data nel passato';
  const max = new Date(start);
  max.setFullYear(max.getFullYear() + 1);
  if (d > max) return 'data troppo lontana';
  if (d.getUTCDay() === 0) return 'la domenica lo studio e\' chiuso';
  return null;
}

/**
 * Valida il corpo della richiesta.
 * @returns {{ok: true, data: object} | {ok: false, errors: Record<string,string>}}
 */
export function validateBooking(body = {}, opts = {}) {
  const errors = {};
  const d = {};

  d.nome = clean(body.nome, LIMITS.nome);
  if (d.nome.length < 2) errors.nome = 'Inserisci il tuo nome.';

  d.cognome = clean(body.cognome, LIMITS.cognome);
  if (d.cognome.length < 2) errors.cognome = 'Inserisci il tuo cognome.';

  d.email = clean(body.email, LIMITS.email).toLowerCase();
  if (!EMAIL_RE.test(d.email)) errors.email = 'Inserisci un indirizzo email valido.';

  d.telefono = clean(body.telefono, LIMITS.telefono);
  const cifre = d.telefono.replace(/\D/g, '');
  if (!PHONE_RE.test(d.telefono) || cifre.length < 6 || cifre.length > 15) {
    errors.telefono = 'Inserisci un numero di telefono valido.';
  }

  d.tipoVisita = clean(body.tipoVisita, 40);
  if (!LABELS[d.tipoVisita]) errors.tipoVisita = 'Scegli il tipo di visita.';
  d.tipoVisitaLabel = LABELS[d.tipoVisita] || '';

  d.dataRichiesta = clean(body.dataRichiesta, 10);
  const dataErr = checkDate(d.dataRichiesta, opts);
  if (dataErr) errors.dataRichiesta = 'Scegli una data valida: ' + dataErr + '.';

  d.oraRichiesta = clean(body.oraRichiesta, LIMITS.ora);
  if (!TIME_RE.test(d.oraRichiesta)) errors.oraRichiesta = 'Scegli un orario.';

  // seconda preferenza: facoltativa, ma se c'e' deve essere coerente
  d.secondaData = clean(body.secondaData, 10);
  d.secondaOra = clean(body.secondaOra, LIMITS.ora);
  if (d.secondaData) {
    const e = checkDate(d.secondaData, opts);
    if (e) errors.secondaData = 'Seconda preferenza non valida: ' + e + '.';
  }
  if (d.secondaOra && !TIME_RE.test(d.secondaOra)) errors.secondaOra = 'Secondo orario non valido.';
  if (d.secondaOra && !d.secondaData) errors.secondaData = 'Indica anche il giorno della seconda preferenza.';

  d.dottore = clean(body.dottore, LIMITS.dottore) || 'Nessuna preferenza';
  d.messaggio = cleanMultiline(body.messaggio, LIMITS.messaggio);

  d.privacy = body.privacy === true || body.privacy === 'on' || body.privacy === 'true';
  if (!d.privacy) errors.privacy = "Per proseguire devi accettare l'informativa privacy.";

  d.comunicazioni = body.comunicazioni === true || body.comunicazioni === 'on' || body.comunicazioni === 'true';

  return Object.keys(errors).length ? { ok: false, errors } : { ok: true, data: d };
}

/** Anti-spam: campo esca invisibile, tempo minimo di compilazione, link nel testo. */
export function looksLikeSpam(body = {}, { minMs = 2500, now = Date.now() } = {}) {
  if (clean(body.azienda, 100)) return 'honeypot';
  const started = Number(body.startedAt);
  if (Number.isFinite(started) && started > 0 && now - started < minMs) return 'compilazione troppo rapida';
  const testo = String(body.messaggio ?? '') + ' ' + String(body.nome ?? '') + ' ' + String(body.cognome ?? '');
  if (/(https?:\/\/|\[url=|<a\s)/i.test(testo)) return 'link nel testo';
  return null;
}

/** Formatta una data ISO in italiano leggibile. */
export const dateIt = (iso) => {
  if (!DATE_RE.test(iso)) return iso;
  return new Date(iso + 'T12:00:00Z').toLocaleDateString('it-IT', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC'
  });
};
