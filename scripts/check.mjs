/** Controllo qualita' del sito generato: link interni, immagini, alt, h1, JSON-LD. */
import fs from 'node:fs';
import path from 'node:path';

const DIST = path.resolve(import.meta.dirname, '..', 'dist');
const pages = [];
(function walk(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const f = path.join(d, e.name);
    if (e.isDirectory()) walk(f);
    else if (e.name.endsWith('.html')) pages.push(f);
  }
})(DIST);

const problems = [];
const exists = (p) => fs.existsSync(p) || fs.existsSync(path.join(p, 'index.html'));

for (const file of pages) {
  const html = fs.readFileSync(file, 'utf8');
  const dir = path.dirname(file);
  const rel = path.relative(DIST, file);

  // link interni
  for (const m of html.matchAll(/href="([^"]+)"/g)) {
    const href = m[1];
    if (/^(https?:|mailto:|tel:|#|data:)/.test(href)) continue;
    const clean = href.split('#')[0] || '.';
    const target = clean.startsWith('/') ? path.join(DIST, clean) : path.resolve(dir, clean);
    if (!exists(target)) problems.push(`${rel}: link rotto -> ${href}`);
  }
  // immagini e asset
  for (const m of html.matchAll(/src="([^"]+)"/g)) {
    const src = m[1];
    if (/^(https?:|data:)/.test(src)) continue;
    if (!fs.existsSync(path.resolve(dir, src))) problems.push(`${rel}: file mancante -> ${src}`);
  }
  for (const m of html.matchAll(/srcset="([^"]+)"/g)) {
    for (const part of m[1].split(',')) {
      const u = part.trim().split(/\s+/)[0];
      if (u && !/^https?:/.test(u) && !fs.existsSync(path.resolve(dir, u))) problems.push(`${rel}: srcset mancante -> ${u}`);
    }
  }
  // alt
  const noAlt = [...html.matchAll(/<img (?![^>]*\balt=)[^>]*>/g)];
  if (noAlt.length) problems.push(`${rel}: ${noAlt.length} <img> senza alt`);
  // un solo h1
  const h1 = (html.match(/<h1[\s>]/g) || []).length;
  if (h1 !== 1) problems.push(`${rel}: ${h1} elementi h1`);
  // meta
  if (!/<meta name="description" content="[^"]{60,}"/.test(html)) problems.push(`${rel}: description assente o troppo corta`);
  if (!/<link rel="canonical"/.test(html)) problems.push(`${rel}: canonical assente`);
  // JSON-LD
  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try { JSON.parse(m[1]); } catch (e) { problems.push(`${rel}: JSON-LD non valido (${e.message})`); }
  }
  const title = (html.match(/<title>([^<]*)<\/title>/) || [])[1] || '';
  if (title.length > 70) problems.push(`${rel}: title lungo ${title.length} caratteri`);
}

console.log(`Pagine analizzate: ${pages.length}`);
if (problems.length) {
  console.log(`\n${problems.length} problemi:`);
  for (const p of problems.slice(0, 60)) console.log('  ' + p);
} else console.log('Nessun problema rilevato.');
