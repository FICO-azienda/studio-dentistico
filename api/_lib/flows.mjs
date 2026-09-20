/**
 * Motore dei percorsi di prenotazione.
 *
 * Tutta la logica condizionale vive in content/booking-flows.json: qui c'e'
 * solo il codice che la interpreta. Aggiungere un servizio significa
 * aggiungere un oggetto al file, mai toccare questo modulo.
 *
 * Lo stesso motore gira sul server (validazione, priorita', tag, riepilogo) e,
 * nella parte di sola visibilita' delle domande, nel browser.
 *
 * Le domande raccolgono informazioni preliminari. Non producono una diagnosi,
 * non propongono terapie: priorita' e tag servono soltanto a far organizzare
 * le richieste alla segreteria.
 */
import fs from 'node:fs';
import path from 'node:path';

function carica(relativo, obbligatorio = true) {
  const candidati = [
    path.resolve(process.cwd(), 'content', relativo),
    path.resolve(import.meta.dirname, '..', '..', 'content', relativo)
  ];
  for (const p of candidati) {
    try {
      return JSON.parse(fs.readFileSync(p, 'utf8'));
    } catch {
      /* prova il successivo */
    }
  }
  if (obbligatorio) throw new Error('content/' + relativo + ' non trovato');
  return null;
}

export const slug = (s) =>
  String(s)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48);

const PESO = { normal: 0, high: 1, urgent: 2 };
export const maxPriority = (a, b) => (PESO[b] > PESO[a] ? b : a);

/** Opzione in forma breve (stringa) o estesa (oggetto) -> forma normalizzata. */
const normOption = (o) => {
  if (typeof o === 'string') return { v: slug(o), l: o };
  return { v: o.v || slug(o.l), l: o.l, priority: o.priority, tag: o.tag, goto: o.goto };
};

const normQuestion = (q) => ({
  id: q.id,
  q: q.q,
  type: q.type || 'single',
  when: q.when || null,
  note: q.note || '',
  placeholder: q.placeholder || '',
  options: (q.options || []).map(normOption)
});

function normalizza(raw) {
  const services = raw.services.map((s) => ({
    id: s.id,
    group: s.group,
    label: s.label,
    hint: s.hint || '',
    tag: s.tag,
    note: s.note || '',
    priority: s.priority || 'normal',
    featured: !!s.featured,
    questions: s.questions.map(normQuestion)
  }));
  return {
    ...raw,
    services,
    tail: {
      modeQuestion: normQuestion(raw.tail.modeQuestion),
      channelQuestion: normQuestion(raw.tail.channelQuestion),
      windowQuestion: normQuestion(raw.tail.windowQuestion)
    }
  };
}

export const flows = normalizza(carica('booking-flows.json'));

/** Traduzione inglese: solo etichette, i valori restano identificatori stabili. */
const EN = carica(path.join('en', 'booking-flows.json'), false);

/**
 * Versione tradotta della configurazione. Cio' che non e' tradotto resta in
 * italiano, cosi' un servizio nuovo funziona comunque in entrambe le lingue.
 */
export function flowsFor(lang = 'it') {
  if (lang !== 'en' || !EN) return flows;
  const comuni = EN.common || {};
  const trS = EN.services || {};

  const opz = (o, mappa) => ({ ...o, l: mappa?.[o.v] || comuni[o.v] || o.l });
  const dom = (q, trQ) => ({
    ...q,
    q: trQ?.q || q.q,
    note: trQ?.note ?? q.note,
    placeholder: trQ?.placeholder ?? q.placeholder,
    options: q.options.map((o) => opz(o, trQ?.o))
  });

  return {
    ...flows,
    chooseLabel: EN.chooseLabel || flows.chooseLabel,
    chooseHint: EN.chooseHint || flows.chooseHint,
    searchPlaceholder: EN.searchPlaceholder || flows.searchPlaceholder,
    featuredLabel: EN.featuredLabel || flows.featuredLabel,
    moreLabel: EN.moreLabel || flows.moreLabel,
    moreHint: EN.moreHint || flows.moreHint,
    emptyLabel: EN.emptyLabel || flows.emptyLabel,
    groups: flows.groups.map((g) => ({ ...g, label: EN.groups?.[g.id] || g.label })),
    tail: {
      modeQuestion: dom(flows.tail.modeQuestion, EN.tail?.modalita),
      channelQuestion: dom(flows.tail.channelQuestion, EN.tail?.canale),
      windowQuestion: dom(flows.tail.windowQuestion, EN.tail?.fascia)
    },
    services: flows.services.map((s) => {
      const tr = trS[s.id];
      return {
        ...s,
        label: tr?.label || s.label,
        hint: tr?.hint ?? s.hint,
        note: tr?.note ?? s.note,
        questions: s.questions.map((q) => dom(q, tr?.q?.[q.id]))
      };
    })
  };
}
export const byService = Object.fromEntries(flows.services.map((s) => [s.id, s]));

/**
 * Una domanda e' pertinente solo se la sua condizione e' soddisfatta.
 * Formato: { q: "idDomanda", in: [valori] } oppure { q, not: [valori] }.
 * Se la condizione non e' soddisfatta la domanda viene saltata: e' la regola
 * "non mostrare mai domande inutili".
 */
export function isVisible(question, answers = {}) {
  const w = question.when;
  if (!w) return true;
  const val = answers[w.q];
  const lista = Array.isArray(val) ? val : val ? [val] : [];
  if (w.in) return lista.some((v) => w.in.includes(v));
  if (w.not) return lista.length > 0 && !lista.some((v) => w.not.includes(v));
  return true;
}

/** Domande effettivamente da porre, nell'ordine, date le risposte finora. */
export const visibleQuestions = (service, answers = {}) =>
  service.questions.filter((q) => isVisible(q, answers));

const selezionate = (question, answers) => {
  const val = answers[question.id];
  const lista = Array.isArray(val) ? val : val ? [val] : [];
  return lista.map((v) => question.options.find((o) => o.v === v)).filter(Boolean);
};

/** Priorita' interna: base del servizio, innalzata dalle risposte scelte. */
export function computePriority(service, answers = {}) {
  let p = service.priority || 'normal';
  for (const q of visibleQuestions(service, answers)) {
    for (const o of selezionate(q, answers)) if (o.priority) p = maxPriority(p, o.priority);
  }
  return p;
}

/** Tag interni per l'organizzazione delle richieste. */
export function computeTags(service, answers = {}) {
  const tags = new Set([service.tag]);
  for (const q of visibleQuestions(service, answers)) {
    for (const o of selezionate(q, answers)) if (o.tag) tags.add(o.tag);
  }
  return [...tags];
}

/** Riepilogo leggibile: una riga per domanda pertinente. */
export function buildSummary(service, answers = {}, lang = 'it') {
  if (lang === 'en') {
    const f = flowsFor('en');
    service = f.services.find((s) => s.id === service.id) || service;
  }
  const righe = [];
  for (const q of visibleQuestions(service, answers)) {
    const val = answers[q.id];
    if (q.type === 'text') {
      if (val) righe.push({ label: q.q, value: String(val) });
      continue;
    }
    const scelte = selezionate(q, answers);
    if (scelte.length) righe.push({ label: q.q, value: scelte.map((o) => o.l).join(', ') });
  }
  return righe;
}

/**
 * Validazione delle risposte: ogni domanda pertinente deve avere una risposta
 * ammessa dalla configurazione. Il client puo' essere aggirato, la
 * configurazione no.
 */
export function validateAnswers(serviceId, answers = {}) {
  const service = byService[serviceId];
  if (!service) return { ok: false, errors: { servizio: 'Servizio non riconosciuto.' } };

  const errors = {};
  const puliti = {};

  for (const q of visibleQuestions(service, answers)) {
    const val = answers[q.id];

    if (q.type === 'text') {
      const t = String(val ?? '').replace(/\s+/g, ' ').trim().slice(0, 600);
      if (t.length < 3) errors[q.id] = 'Scrivi qualche parola in più.';
      else puliti[q.id] = t;
      continue;
    }

    const lista = Array.isArray(val) ? val : val ? [val] : [];
    const ammessi = lista.filter((v) => q.options.some((o) => o.v === v));
    if (!ammessi.length) {
      errors[q.id] = 'Scegli una risposta.';
      continue;
    }
    if (q.type === 'multi') puliti[q.id] = ammessi;
    else puliti[q.id] = ammessi[0];
  }

  return Object.keys(errors).length ? { ok: false, errors } : { ok: true, answers: puliti, service };
}

/** Configurazione alleggerita da consegnare al browser, nella lingua richiesta. */
export const clientConfig = (lang = 'it') => {
  const f = flowsFor(lang);
  return {
  chooseLabel: f.chooseLabel,
  chooseHint: f.chooseHint,
  searchPlaceholder: f.searchPlaceholder,
  featuredLabel: f.featuredLabel,
  moreLabel: f.moreLabel,
  moreHint: f.moreHint,
  emptyLabel: f.emptyLabel,
  groups: f.groups,
  tail: f.tail,
  services: f.services.map((s) => ({
    id: s.id,
    group: s.group,
    featured: !!s.featured,
    label: s.label,
    hint: s.hint,
    note: s.note,
    questions: s.questions.map((q) => ({
      id: q.id,
      q: q.q,
      type: q.type,
      when: q.when,
      note: q.note,
      placeholder: q.placeholder,
      // priorita' e tag restano sul server: non servono al browser
      options: q.options.map((o) => ({ v: o.v, l: o.l, goto: o.goto }))
    }))
  }))
  };
};
