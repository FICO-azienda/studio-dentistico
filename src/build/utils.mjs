import fs from 'node:fs';
import path from 'node:path';
import { setLang, getLang, ROUTES, t } from './i18n.mjs';

export const ROOT = path.resolve(import.meta.dirname, '..', '..');
const leggi = (f, dir = 'content') => JSON.parse(fs.readFileSync(path.join(ROOT, dir, f), 'utf8'));

/** Traduzione opzionale: se il file non c'e', si resta in italiano. */
const leggiEn = (f) => {
  try {
    return leggi(f, path.join('content', 'en'));
  } catch {
    return null;
  }
};

/* -- contenuti di base (italiano) ----------------------------------------- */
const BASE = {
  site: leggi('site.json'),
  images: leggi('images.json'),
  team: leggi('team.json'),
  treatments: leggi('treatments.json'),
  technologies: leggi('technologies.json'),
  journal: leggi('journal.json'),
  cases: leggi('cases.json'),
  faqs: leggi('faq.json'),
  reviews: leggi('reviews.json')
};

/* -- traduzioni ------------------------------------------------------------ */
const EN = {
  site: leggiEn('site.json'),
  team: leggiEn('team.json'),
  treatments: leggiEn('treatments.json'),
  technologies: leggiEn('technologies.json'),
  journal: leggiEn('journal.json'),
  cases: leggiEn('cases.json'),
  faqs: leggiEn('faq.json'),
  reviews: leggiEn('reviews.json')
};

/** Fusione superficiale: la traduzione sovrascrive solo i campi presenti. */
const fondi = (base, tr) => (tr ? { ...base, ...tr } : base);

/** Elenco tradotto tramite una mappa chiave -> traduzione. */
const fondiElenco = (elenco, mappa, chiave = 'slug') =>
  mappa ? elenco.map((x) => fondi(x, mappa[x[chiave]])) : elenco;

/* -- binding vivi: cambiano quando cambia la lingua ------------------------ */
export let site = BASE.site;
export let images = BASE.images;
export let team = BASE.team;
export let treatments = BASE.treatments;
export let technologies = BASE.technologies;
export let journal = BASE.journal;
export let cases = BASE.cases;
export let faqs = BASE.faqs;
export let reviews = BASE.reviews;

export let byTreatment = {};
export let byPerson = {};
export let byTech = {};
export let byCategory = {};

/** Segmenti degli indirizzi nella lingua corrente, gia' con lo slash finale. */
export let PATH = {};

/**
 * Imposta la lingua e ricostruisce i contenuti.
 * I moduli che importano queste variabili vedono i nuovi valori: in ESM le
 * esportazioni `let` sono collegamenti vivi, quindi non serve passare la
 * lingua a ogni funzione.
 */
export function applyLang(lang) {
  setLang(lang);
  const tr = lang === 'en' ? EN : {};

  site = fondi(BASE.site, tr.site);
  if (tr.site?.address) site.address = { ...BASE.site.address, ...tr.site.address };
  images = BASE.images;

  team = fondiElenco(BASE.team, tr.team);
  technologies = fondiElenco(BASE.technologies, tr.technologies);
  journal = fondiElenco(BASE.journal, tr.journal);
  faqs = tr.faqs || BASE.faqs;
  reviews = tr.reviews || BASE.reviews;

  treatments = {
    categories: fondiElenco(BASE.treatments.categories, tr.treatments?.categories),
    items: fondiElenco(BASE.treatments.items, tr.treatments?.items)
  };

  cases = {
    ...BASE.cases,
    ...(tr.cases || {}),
    items: fondiElenco(BASE.cases.items, tr.cases?.items, 'id'),
    categories: BASE.cases.categories.map((c) => ({
      ...c,
      label: tr.cases?.categories?.[c.value] || c.label
    }))
  };

  byTreatment = Object.fromEntries(treatments.items.map((x) => [x.slug, x]));
  byPerson = Object.fromEntries(team.map((p) => [p.slug, p]));
  byTech = Object.fromEntries(technologies.map((x) => [x.slug, x]));
  byCategory = Object.fromEntries(treatments.categories.map((c) => [c.slug, c]));

  PATH = Object.fromEntries(Object.entries(ROUTES[lang]).map(([k, v]) => [k, v + '/']));
}

applyLang('it');

/* -- escaping -------------------------------------------------------------- */
export const esc = (s = '') =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export const attr = (s = '') => esc(s).replace(/'/g, '&#39;');

/* -- navigazione ----------------------------------------------------------- */
export const NAV_KEYS = ['studio', 'treatments', 'technologies', 'team', 'firstVisit', 'cases', 'journal', 'contact'];
export const nav = () => NAV_KEYS.map((k) => ({ key: k, label: t('nav.' + k), href: PATH[k] }));

/** prefisso relativo per una pagina a una certa profondita' ( '', '../', '../../' ) */
export const rel = (depth) => '../'.repeat(depth);

/* -- percorsi dei contenuti ------------------------------------------------ */
export const catOf = (x) => byCategory[x.category];
/** le aree non sono piu' pagine: sono sezioni dell'indice trattamenti */
export const catPath = (c) => `${PATH.treatments}#${c.slug}`;
export const treatmentPath = (x) => `${PATH.treatments}${x.slug}/`;
export const teamPath = (p) => `${PATH.team}${p.slug}/`;
export const articlePath = (a) => `${PATH.journal}${a.slug}/`;

export const specialistsOf = (c) => team.filter((p) => (p.treatments || []).some((s) => c.items.includes(s)));

export const techOf = (c) => {
  const visti = new Set();
  for (const s of c.items) for (const x of byTreatment[s]?.tech || []) visti.add(x);
  return [...visti].map((x) => byTech[x]).filter(Boolean);
};

/* -- immagini responsive --------------------------------------------------- */
const WIDTHS = [640, 1280, 1920];

/**
 * I collegamenti fra pagine sono relativi alla radice della lingua (/it/),
 * gli asset stanno invece nella radice del sito: un livello piu' su.
 */
export const assetRoot = (base) =>
  base.startsWith('/') ? base.replace(/(^|\/)(it|en)\/$/, '$1') : base + '../';

export function imgTag(name, opts = {}) {
  const cfg = images[name];
  if (!cfg) throw new Error(`Immagine non trovata nel manifest: ${name}`);
  const { base = '', sizes = '100vw', alt, eager = false, className = '' } = opts;
  const [w, h] = (cfg.ar || '3/2').split('/').map(Number);
  const width = 1280;
  const height = Math.round((1280 * h) / w);
  const r = assetRoot(base);
  const srcset = WIDTHS.map((x) => `${r}images/${name}-${x}.webp ${x}w`).join(', ');
  return `<img src="${r}images/${name}-1280.webp" srcset="${srcset}" sizes="${sizes}"
    width="${width}" height="${height}" alt="${attr(alt ?? cfg.alt)}"
    ${eager ? 'fetchpriority="high" decoding="async"' : 'loading="lazy" decoding="async"'}
    ${className ? `class="${className}"` : ''}>`;
}

export function figure(name, opts = {}) {
  const { ar, className = '', inner = '', ...rest } = opts;
  const style = ar ? ` style="--ar:${ar}"` : '';
  return `<figure class="media media--ar img-mask ${className}"${style}>${imgTag(name, rest)}${inner}</figure>`;
}

/* -- formattazione --------------------------------------------------------- */
export const dateIt = (iso) =>
  new Date(iso + 'T12:00:00').toLocaleDateString(getLang() === 'en' ? 'en-GB' : 'it-IT', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

export const personName = (p) => `${p.title ? p.title + ' ' : ''}${p.name}`.trim();

export const lines = (arr, cls = '') =>
  arr.map((l) => `<span class="line-mask ${cls}"><span>${l}</span></span>`).join('');

export const arrow = '<span class="arrow" aria-hidden="true">&#8594;</span>';

/** aggiunge il suffisso del brand solo se il title resta sotto i 65 caratteri */
export const metaTitle = (base, suffix = null) => {
  const s = suffix ?? site.name;
  const full = `${base} | ${s}`;
  return full.length <= 65 ? full : base;
};

/* -- scrittura ------------------------------------------------------------- */
export function write(outDir, pagePath, html) {
  const file = pagePath === '' ? 'index.html' : path.join(pagePath, 'index.html');
  const full = path.join(outDir, file);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, html);
  return file;
}
