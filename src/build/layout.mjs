import { site, NAV, rel, esc, attr, arrow } from './utils.mjs';

/* -- dati strutturati ----------------------------------------------------- */
export const dentistLd = () => ({
  '@type': 'Dentist',
  '@id': site.url + '/#studio',
  name: site.name,
  legalName: site.legalName,
  url: site.url,
  telephone: site.phone,
  email: site.email,
  image: site.url + '/images/hero-studio-1280.webp',
  priceRange: '€€€',
  address: {
    '@type': 'PostalAddress',
    streetAddress: site.address.street,
    postalCode: site.address.zip,
    addressLocality: site.address.city,
    addressRegion: site.address.region,
    addressCountry: site.address.country
  },
  geo: { '@type': 'GeoCoordinates', latitude: site.address.lat, longitude: site.address.lng },
  openingHoursSpecification: [
    { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '08:30', closes: '19:30' },
    { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Saturday'], opens: '09:00', closes: '13:00' }
  ],
  areaServed: { '@type': 'City', name: 'Milano' },
  medicalSpecialty: 'Dentistry',
  availableService: ['Implantologia', 'Ortodonzia invisibile', 'Igiene e prevenzione', 'Estetica dentale', 'Endodonzia']
});

const breadcrumbLd = (base, crumbs) => ({
  '@type': 'BreadcrumbList',
  itemListElement: crumbs.map((c, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: c.label,
    item: site.url + '/' + (c.path || '')
  }))
});

/* -- header --------------------------------------------------------------- */
const logo = (base) => `
  <a class="logo" href="${base}" aria-label="${attr(site.name)} — home">
    <span class="logo__mark">${esc(site.wordmark)}</span>
    <span class="logo__sub">Studio Odontoiatrico</span>
  </a>`;

const header = (base, current) => `
<header class="header header--over">
  <div class="header__inner">
    ${logo(base)}
    <nav class="nav nav--main" aria-label="Navigazione principale">
      ${NAV.map((n) => `<a class="nav__link" href="${base}${n.href}"${current === n.href ? ' aria-current="page"' : ''}>${esc(n.label)}</a>`).join('\n      ')}
    </nav>
    <div class="header__actions">
      <a class="btn btn--sm btn--header" href="${base}prenota/">Prenota una visita</a>
      <button class="burger" type="button" aria-expanded="false" aria-controls="menu" aria-label="Apri il menu">
        <span></span>
      </button>
    </div>
  </div>
</header>

<div class="menu" id="menu" role="dialog" aria-modal="true" aria-label="Menu di navigazione">
  <div></div>
  <div class="menu__body">
    <ul class="menu__list">
      ${NAV.map((n, i) => `<li class="menu__item"><a href="${base}${n.href}"><span class="idx">0${i + 1}</span>${esc(n.label)}</a></li>`).join('\n      ')}
      <li class="menu__item"><a href="${base}prenota/"><span class="idx">09</span><em class="serif-italic">Prenota una visita</em></a></li>
    </ul>
    <div class="menu__aside">
      <div class="menu__meta">
        <span class="label">Studio</span>
        <p>${esc(site.address.street)}<br>${esc(site.address.zip)} ${esc(site.address.city)}</p>
      </div>
      <div class="menu__meta">
        <span class="label">Contatti</span>
        <p><a href="tel:${attr(site.phoneHref)}">${esc(site.phone)}</a><br><a href="mailto:${attr(site.email)}">${esc(site.email)}</a></p>
      </div>
      <div class="menu__meta">
        <span class="label">Orari</span>
        <p>${site.hours.map((h) => `${esc(h.d)} · ${esc(h.h)}`).join('<br>')}</p>
      </div>
    </div>
  </div>
  <div class="menu__foot">
    <div class="wrap" style="display:flex;flex-wrap:wrap;gap:1.5rem;justify-content:space-between">
      <span class="label">${esc(site.city)}, Italia</span>
      <span class="label">${site.social.map((s) => `<a href="${attr(s.url)}" target="_blank" rel="noopener">${esc(s.label)}</a>`).join(' &nbsp;·&nbsp; ')}</span>
    </div>
  </div>
</div>`;

/* -- barra di sezione ----------------------------------------------------- */
/** ancore corrispondenti alle sezioni della homepage */
export const ANCHORS = {
  'studio/': 'studio',
  'trattamenti/': 'trattamenti',
  'tecnologie/': 'tecnologie',
  'team/': 'team',
  'prima-visita/': 'prima-visita',
  'casi-clinici/': 'casi',
  'journal/': 'journal',
  'contatti/': 'contatti'
};

/**
 * Navigazione editoriale di sezione, sottile e sticky sotto l'header.
 * In homepage punta alle ancore con scroll morbido e voce attiva durante lo
 * scorrimento; nelle pagine interne porta alle pagine corrispondenti.
 */
const subnav = (base, current, isHome) => `
<nav class="subnav" aria-label="Sezioni del sito"${isHome ? ' data-scrollspy' : ''}>
  <div class="wrap" style="height:100%">
    <div class="subnav__track">
      ${NAV.map((n) =>
        isHome
          ? `<a class="subnav__link" href="#${ANCHORS[n.href]}" data-spy="${ANCHORS[n.href]}">${esc(n.label)}</a>`
          : `<a class="subnav__link" href="${base}${n.href}"${current === n.href ? ' aria-current="page"' : ''}>${esc(n.label)}</a>`
      ).join('\n      ')}
    </div>
  </div>
</nav>`;

/* -- footer --------------------------------------------------------------- */
const footer = (base) => `
<footer class="footer">
  <div class="wrap">
    <div class="footer__top">
      <div class="footer__brand">
        ${logo(base)}
        <p class="small mt-2" style="color:rgba(238,236,229,.6);max-width:34ch">
          Odontoiatria contemporanea a Milano. Tecnologia avanzata, esperienza clinica e attenzione alla persona in ogni fase del trattamento.
        </p>
      </div>
      <nav class="footer__col" aria-label="Studio">
        <span class="label">Studio</span>
        <ul>
          <li><a href="${base}studio/">Lo studio</a></li>
          <li><a href="${base}team/">Il team</a></li>
          <li><a href="${base}tecnologie/">Tecnologie</a></li>
          <li><a href="${base}prima-visita/">Prima visita</a></li>
        </ul>
      </nav>
      <nav class="footer__col" aria-label="Trattamenti">
        <span class="label">Trattamenti</span>
        <ul>
          <li><a href="${base}trattamenti/">Tutti i trattamenti</a></li>
          <li><a href="${base}trattamenti/implantologia/">Implantologia</a></li>
          <li><a href="${base}trattamenti/allineatori-trasparenti/">Allineatori</a></li>
          <li><a href="${base}casi-clinici/">Casi clinici</a></li>
          <li><a href="${base}journal/">Journal</a></li>
        </ul>
      </nav>
      <div class="footer__contact">
        <span class="label">Contatti</span>
        <p><a href="${base}contatti/">${esc(site.address.street)}<br>${esc(site.address.zip)} ${esc(site.address.city)}</a></p>
        <p><a href="tel:${attr(site.phoneHref)}">${esc(site.phone)}</a></p>
        <p><a href="https://wa.me/${attr(site.whatsappHref)}" target="_blank" rel="noopener">WhatsApp ${arrow}</a></p>
        <p><a href="mailto:${attr(site.email)}">${esc(site.email)}</a></p>
        <p class="mt-2"><a class="btn btn--sm btn--outline-light" href="${base}prenota/">Prenota una visita</a></p>
      </div>
    </div>
    <p class="footer__claim">${esc(site.claim)}</p>
    <div class="footer__legal">
      <span>© <span data-year>2026</span> ${esc(site.legalName)} · P. IVA ${esc(site.vat)}</span>
      <span>${esc(site.director)}</span>
      <ul>
        <li><a href="${base}privacy/">Privacy Policy</a></li>
        <li><a href="${base}cookie-policy/">Cookie Policy</a></li>
        <li><a href="${base}termini/">Termini</a></li>
        ${site.social.map((s) => `<li><a href="${attr(s.url)}" target="_blank" rel="noopener">${esc(s.label)}</a></li>`).join('')}
      </ul>
    </div>
  </div>
</footer>

<div class="mobile-cta" aria-label="Azioni rapide">
  <div class="mobile-cta__row">
    <a class="btn btn--sm" href="${base}prenota/">Prenota</a>
    <a class="btn btn--sm btn--ghost" href="tel:${attr(site.phoneHref)}">Chiama</a>
    <a class="mobile-cta__icon" href="https://wa.me/${attr(site.whatsappHref)}" target="_blank" rel="noopener" aria-label="Scrivici su WhatsApp">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><path d="M21 11.5a8.5 8.5 0 0 1-12.6 7.4L3 21l2.2-5.2A8.5 8.5 0 1 1 21 11.5Z"/></svg>
    </a>
  </div>
</div>`;

/* -- layout --------------------------------------------------------------- */
export function layout({
  title,
  description,
  path: pagePath = '',
  depth = 0,
  current = '',
  headerOver = true,
  main,
  preload = [],
  jsonLd = [],
  crumbs = null,
  bodyClass = '',
  baseOverride = null
}) {
  // la 404 viene servita da URL arbitrari: usa percorsi assoluti, non relativi
  const base = baseOverride ?? rel(depth);
  const canonical = `${site.url}/${pagePath}`;
  const ld = [...jsonLd];
  if (crumbs) ld.push(breadcrumbLd(base, crumbs));
  const graph = { '@context': 'https://schema.org', '@graph': ld.length ? ld : [dentistLd()] };

  return `<!DOCTYPE html>
<html lang="it">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${attr(description)}">
<link rel="canonical" href="${canonical}">
<meta name="robots" content="index, follow, max-image-preview:large">
<meta name="theme-color" content="#ffffff">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${attr(site.name)}">
<meta property="og:locale" content="it_IT">
<meta property="og:title" content="${attr(title)}">
<meta property="og:description" content="${attr(description)}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${site.url}/images/hero-studio-1280.webp">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="${base}favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="${base}apple-touch-icon.png">
<link rel="manifest" href="${base}site.webmanifest">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@300;400;500&display=swap">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@300;400;500&display=swap" media="print" onload="this.media='all'">
<noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@300;400;500&display=swap"></noscript>
<link rel="stylesheet" href="${base}styles/main.css">
${preload.map((p) => `<link rel="preload" as="image" href="${base}images/${p}-1280.webp" imagesrcset="${base}images/${p}-640.webp 640w, ${base}images/${p}-1280.webp 1280w, ${base}images/${p}-1920.webp 1920w" imagesizes="70vw" fetchpriority="high">`).join('\n')}
<script type="application/ld+json">${JSON.stringify(graph)}</script>
</head>
<body class="${bodyClass}">
<div class="page-veil" aria-hidden="true"></div>
<a class="skip-link" href="#main">Vai al contenuto</a>
${header(base, current)}
${subnav(base, current, depth === 0 && pagePath === '')}
<main id="main">
${main}
</main>
${footer(base)}
<script src="${base}scripts/app.js" defer></script>
</body>
</html>`;
}
