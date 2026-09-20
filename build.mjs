/**
 * Studio Liddi — generatore statico bilingue.
 *
 * Tutti i contenuti vivono in /content (il "CMS"); la traduzione inglese sta
 * in /content/en e ricade sull'italiano per cio' che non e' ancora tradotto.
 * Il sito viene generato due volte, sotto /it/ e /en/.
 *
 *   node build.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { ROOT, site, team, treatments, journal, write, applyLang, PATH } from './src/build/utils.mjs';
import { LANGS, DEFAULT_LANG, ROUTES, altPath, setLang } from './src/build/i18n.mjs';
import { homePage } from './src/build/page-home.mjs';
import { studioPage, teamPage, personPage, techPage, firstVisitPage, contactPage, bookingPage } from './src/build/page-core.mjs';
import { treatmentsIndex, categoryPage, treatmentPage, casesPage, journalIndex, articlePage, legalPage, notFoundPage } from './src/build/page-catalog.mjs';
import { LEGAL } from './src/build/legal.mjs';

const OUT = path.join(ROOT, 'dist');

/* -- pulizia -------------------------------------------------------------- */
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });

/* -- asset (condivisi fra le lingue) --------------------------------------- */
fs.cpSync(path.join(ROOT, 'public'), OUT, { recursive: true });
fs.mkdirSync(path.join(OUT, 'styles'), { recursive: true });
fs.mkdirSync(path.join(OUT, 'scripts'), { recursive: true });
fs.copyFileSync(path.join(ROOT, 'src/styles/main.css'), path.join(OUT, 'styles/main.css'));
fs.copyFileSync(path.join(ROOT, 'src/scripts/app.js'), path.join(OUT, 'scripts/app.js'));
fs.rmSync(path.join(OUT, 'images', 'credits.json'), { force: true });

/* -- pagine, una lingua alla volta ----------------------------------------- */
/** percorsi generati, per lingua: servono a sitemap e controlli */
const pagine = Object.fromEntries(LANGS.map((l) => [l, []]));

for (const lang of LANGS) {
  applyLang(lang);
  const R = ROUTES[lang];
  const add = (p, html) => {
    write(OUT, `${lang}/${p}`, html);
    pagine[lang].push(p);
  };

  add('', homePage());
  add(R.studio, studioPage());
  add(R.team, teamPage());
  team.forEach((p) => add(`${R.team}/${p.slug}`, personPage(p)));
  add(R.treatments, treatmentsIndex());
  treatments.categories.forEach((c) => add(`${R.treatments}/${c.slug}`, categoryPage(c)));
  treatments.items.forEach((x) => add(`${R.treatments}/${x.category}/${x.slug}`, treatmentPage(x)));
  add(R.technologies, techPage());
  add(R.cases, casesPage());
  add(R.journal, journalIndex());
  journal.forEach((a) => add(`${R.journal}/${a.slug}`, articlePage(a)));
  add(R.firstVisit, firstVisitPage());
  add(R.contact, contactPage());
  add(R.book, bookingPage());
  LEGAL.forEach((l) => add(R[l.routeKey], legalPage(l)));
}

/* -- 404 e ingresso senza lingua ------------------------------------------- */
applyLang(DEFAULT_LANG);
fs.writeFileSync(path.join(OUT, '404.html'), notFoundPage());

/**
 * La radice non e' una pagina: smista verso la lingua del browser.
 * Il rimando funziona anche senza JavaScript grazie al refresh, e la pagina
 * mostra comunque i due collegamenti.
 */
const bp = site.basePath || '/';
fs.writeFileSync(
  path.join(OUT, 'index.html'),
  `<!DOCTYPE html>
<html lang="${DEFAULT_LANG}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${site.name}</title>
<meta name="description" content="Studio Liddi, studio odontoiatrico a Milano. Scegli la lingua del sito: italiano oppure inglese. Studio Liddi, dental practice in Milan: choose your language.">
<meta name="robots" content="noindex, follow">
<link rel="canonical" href="${site.url}/${DEFAULT_LANG}/">
${LANGS.map((l) => `<link rel="alternate" hreflang="${l}" href="${site.url}/${l}/">`).join('\n')}
<link rel="alternate" hreflang="x-default" href="${site.url}/${DEFAULT_LANG}/">
<meta http-equiv="refresh" content="0; url=${bp}${DEFAULT_LANG}/">
<link rel="icon" href="${bp}favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="${bp}styles/main.css">
<script>
  (function () {
    var l = (navigator.language || 'it').toLowerCase().slice(0, 2);
    var scelta = ${JSON.stringify(LANGS)}.indexOf(l) >= 0 ? l : '${DEFAULT_LANG}';
    location.replace('${bp}' + scelta + '/' + location.hash);
  })();
</script>
</head>
<body>
<main id="main" class="wrap" style="min-height:60vh;display:flex;flex-direction:column;justify-content:center;gap:1.5rem">
  <p class="label">${site.name}</p>
  <h1 class="h2">Scegli la lingua<br><em class="serif-italic">Choose your language</em></h1>
  <p class="row">
    <a class="btn" href="${bp}it/" hreflang="it">Italiano</a>
    <a class="btn btn--ghost" href="${bp}en/" hreflang="en">English</a>
  </p>
</main>
</body>
</html>`
);

/* -- sitemap e robots ------------------------------------------------------ */
const oggi = new Date().toISOString().slice(0, 10);
const priorita = (p) => (p === '' ? '1.0' : p.includes('/') ? '0.6' : '0.8');

const url = (lang, p) => {
  const alt = LANGS.map(
    (l) => `    <xhtml:link rel="alternate" hreflang="${l}" href="${site.url}/${l}/${l === lang ? (p ? p + '/' : '') : altPath(p ? p + '/' : '', lang, l)}"/>`
  ).join('\n');
  return `  <url>
    <loc>${site.url}/${lang}/${p ? p + '/' : ''}</loc>
${alt}
    <lastmod>${oggi}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${priorita(p)}</priority>
  </url>`;
};

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${LANGS.flatMap((l) => pagine[l].map((p) => url(l, p))).join('\n')}
</urlset>`;
fs.writeFileSync(path.join(OUT, 'sitemap.xml'), sitemap);
fs.writeFileSync(path.join(OUT, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${site.url}/sitemap.xml\n`);

const totale = LANGS.reduce((n, l) => n + pagine[l].length, 0) + 2;
console.log(`✓ ${totale} pagine generate in dist/ (${LANGS.map((l) => `${l}: ${pagine[l].length}`).join(', ')})`);
