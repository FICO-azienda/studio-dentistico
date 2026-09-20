import fs from 'node:fs';
import path from 'node:path';

export const ROOT = path.resolve(import.meta.dirname, '..', '..');
export const read = (f) => JSON.parse(fs.readFileSync(path.join(ROOT, 'content', f), 'utf8'));

export const site = read('site.json');
export const images = read('images.json');
export const team = read('team.json');
export const treatments = read('treatments.json');
export const technologies = read('technologies.json');
export const journal = read('journal.json');
export const cases = read('cases.json');
export const faqs = read('faq.json');
export const reviews = read('reviews.json');
export const assistant = read('assistant.json');

export const byTreatment = Object.fromEntries(treatments.items.map((t) => [t.slug, t]));
export const byPerson = Object.fromEntries(team.map((p) => [p.slug, p]));
export const byTech = Object.fromEntries(technologies.map((t) => [t.slug, t]));
export const byCategory = Object.fromEntries(treatments.categories.map((c) => [c.slug, c]));

/** i trattamenti vivono sotto la pagina del loro gruppo */
export const catOf = (t) => byCategory[t.category];
export const catPath = (c) => `trattamenti/${c.slug}/`;
export const treatmentPath = (t) => `trattamenti/${t.category}/${t.slug}/`;

/** professionisti che si occupano dei trattamenti di un gruppo */
export const specialistsOf = (c) =>
  team.filter((p) => (p.treatments || []).some((s) => c.items.includes(s)));

/** tecnologie usate dai trattamenti di un gruppo, senza ripetizioni */
export const techOf = (c) => {
  const seen = new Set();
  for (const s of c.items) for (const x of byTreatment[s]?.tech || []) seen.add(x);
  return [...seen].map((x) => byTech[x]).filter(Boolean);
};

/* -- escaping ------------------------------------------------------------- */
export const esc = (s = '') =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export const attr = (s = '') => esc(s).replace(/'/g, '&#39;');

/* -- navigazione ---------------------------------------------------------- */
export const NAV = [
  { label: 'Studio', href: 'studio/' },
  { label: 'Trattamenti', href: 'trattamenti/' },
  { label: 'Tecnologie', href: 'tecnologie/' },
  { label: 'Team', href: 'team/' },
  { label: 'Prima visita', href: 'prima-visita/' },
  { label: 'Casi clinici', href: 'casi-clinici/' },
  { label: 'Journal', href: 'journal/' },
  { label: 'Contatti', href: 'contatti/' }
];

/** prefisso relativo per una pagina a una certa profondita' ( '', '../', '../../' ) */
export const rel = (depth) => '../'.repeat(depth);

/* -- immagini responsive -------------------------------------------------- */
const WIDTHS = [640, 1280, 1920];

export function imgTag(name, opts = {}) {
  const cfg = images[name];
  if (!cfg) throw new Error(`Immagine non trovata nel manifest: ${name}`);
  const { base = '', sizes = '100vw', alt, eager = false, className = '' } = opts;
  const [w, h] = (cfg.ar || '3/2').split('/').map(Number);
  const width = 1280;
  const height = Math.round((1280 * h) / w);
  const srcset = WIDTHS.map((x) => `${base}images/${name}-${x}.webp ${x}w`).join(', ');
  return `<img src="${base}images/${name}-1280.webp" srcset="${srcset}" sizes="${sizes}"
    width="${width}" height="${height}" alt="${attr(alt ?? cfg.alt)}"
    ${eager ? 'fetchpriority="high" decoding="async"' : 'loading="lazy" decoding="async"'}
    ${className ? `class="${className}"` : ''}>`;
}

/** figura con maschera di rivelazione */
export function figure(name, opts = {}) {
  const { ar, className = '', inner = '', ...rest } = opts;
  const style = ar ? ` style="--ar:${ar}"` : '';
  return `<figure class="media media--ar img-mask ${className}"${style}>${imgTag(name, rest)}${inner}</figure>`;
}

/* -- formattazione -------------------------------------------------------- */
export const dateIt = (iso) =>
  new Date(iso + 'T12:00:00').toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' });

export const personName = (p) => `${p.title ? p.title + ' ' : ''}${p.name}`.trim();

/** spezza un titolo in righe animate */
export const lines = (arr, cls = '') =>
  arr.map((l) => `<span class="line-mask ${cls}"><span>${l}</span></span>`).join('');

/** aggiunge il suffisso del brand solo se il title resta sotto i 65 caratteri */
export const metaTitle = (base, suffix = 'Studio Liddi') => {
  const full = `${base} | ${suffix}`;
  return full.length <= 65 ? full : base;
};

export const arrow = '<span class="arrow" aria-hidden="true">&#8594;</span>';

/* -- scrittura ------------------------------------------------------------ */
export function write(outDir, pagePath, html) {
  const file = pagePath === '' ? 'index.html' : path.join(pagePath, 'index.html');
  const full = path.join(outDir, file);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, html);
  return file;
}
