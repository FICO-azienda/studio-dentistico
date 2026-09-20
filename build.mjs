/**
 * Studio Canova — generatore statico.
 * Tutti i contenuti vivono in /content (il "CMS"): modificando i JSON e
 * rilanciando `npm run build` il sito si rigenera senza toccare l'HTML.
 *
 *   node build.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { ROOT, site, team, treatments, journal, write } from './src/build/utils.mjs';
import { homePage } from './src/build/page-home.mjs';
import { studioPage, teamPage, personPage, techPage, firstVisitPage, contactPage, bookingPage } from './src/build/page-core.mjs';
import { treatmentsIndex, treatmentPage, casesPage, journalIndex, articlePage, legalPage, notFoundPage } from './src/build/page-catalog.mjs';
import { LEGAL } from './src/build/legal.mjs';

const OUT = path.join(ROOT, 'dist');

/* -- pulizia -------------------------------------------------------------- */
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });

/* -- asset ---------------------------------------------------------------- */
const copyDir = (from, to) => fs.cpSync(from, to, { recursive: true });
copyDir(path.join(ROOT, 'public'), OUT);
fs.mkdirSync(path.join(OUT, 'styles'), { recursive: true });
fs.mkdirSync(path.join(OUT, 'scripts'), { recursive: true });
fs.copyFileSync(path.join(ROOT, 'src/styles/main.css'), path.join(OUT, 'styles/main.css'));
fs.copyFileSync(path.join(ROOT, 'src/scripts/app.js'), path.join(OUT, 'scripts/app.js'));
fs.rmSync(path.join(OUT, 'images', 'credits.json'), { force: true });

/* -- pagine --------------------------------------------------------------- */
const pages = [];
const add = (p, html) => { write(OUT, p, html); pages.push(p); };

add('', homePage());
add('studio', studioPage());
add('team', teamPage());
team.forEach((p) => add(`team/${p.slug}`, personPage(p)));
add('trattamenti', treatmentsIndex());
treatments.items.forEach((t) => add(`trattamenti/${t.slug}`, treatmentPage(t)));
add('tecnologie', techPage());
add('casi-clinici', casesPage());
add('journal', journalIndex());
journal.forEach((a) => add(`journal/${a.slug}`, articlePage(a)));
add('prima-visita', firstVisitPage());
add('contatti', contactPage());
add('prenota', bookingPage());
LEGAL.forEach((l) => add(l.slug, legalPage(l)));
fs.writeFileSync(path.join(OUT, '404.html'), notFoundPage());

/* -- sitemap + robots ----------------------------------------------------- */
const today = new Date().toISOString().slice(0, 10);
const priority = (p) => (p === '' ? '1.0' : p.includes('/') ? '0.6' : '0.8');
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map((p) => `  <url><loc>${site.url}/${p ? p + '/' : ''}</loc><lastmod>${today}</lastmod><changefreq>monthly</changefreq><priority>${priority(p)}</priority></url>`)
  .join('\n')}
</urlset>`;
fs.writeFileSync(path.join(OUT, 'sitemap.xml'), sitemap);
fs.writeFileSync(
  path.join(OUT, 'robots.txt'),
  `User-agent: *\nAllow: /\n\nSitemap: ${site.url}/sitemap.xml\n`
);

console.log(`✓ ${pages.length + 1} pagine generate in dist/`);
console.log(`  ${pages.slice(0, 6).join(', ')} …`);
