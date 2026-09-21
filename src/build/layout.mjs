import { site, rel, esc, attr, arrow, treatments, imgTag, catPath, PATH, nav, assetRoot } from './utils.mjs';
import { t, getLang, LANGS, LANG_LABEL, HTML_LANG, OG_LOCALE, DEFAULT_LANG, altPath } from './i18n.mjs';

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
    <span class="logo__sub">${esc(t('common.wordmarkSub'))}</span>
  </a>`;

const header = (base, current, lang, asset, altFor) => `
<header class="header header--over">
  <div class="header__inner">
    ${logo(base)}
    <nav class="nav nav--main" aria-label="${attr(t('nav.aria'))}">
      ${nav().map((n) =>
        n.href === PATH.treatments
          ? `<span class="nav__item has-mega">
        <a class="nav__link" href="${base}${n.href}"${current === n.href ? ' aria-current="page"' : ''} aria-haspopup="true">${esc(n.label)}</a>
        <div class="mega" role="group" aria-label="${attr(t('nav.treatmentAreas'))}">
          <div class="mega__inner">
            ${treatments.categories
              .map(
                (c) => `<a class="mega__item" href="${base}${catPath(c)}">
              <span class="media media--ar media__zoom" style="--ar:4/3">${imgTag(c.image, { base, sizes: '220px' })}</span>
              <span class="mega__num num">${esc(c.num)}</span>
              <span class="mega__title h4">${esc(c.title)}</span>
              <span class="mega__text small">${c.items.length} ${esc(t('nav.treatments').toLowerCase())}</span>
            </a>`
              )
              .join('')}
          </div>
        </div>
      </span>`
          : `<a class="nav__link" href="${base}${n.href}"${current === n.href ? ' aria-current="page"' : ''}>${esc(n.label)}</a>`
      ).join('\n      ')}
    </nav>
    <div class="header__actions">
      <nav class="langsw" aria-label="${attr(t('nav.langLabel'))}">
        ${LANGS.map((l) =>
          l === lang
            ? `<span class="langsw__item is-current" aria-current="true">${l.toUpperCase()}</span>`
            : `<a class="langsw__item" href="${asset}${l}/${altFor(l)}" hreflang="${l}" lang="${l}" title="${attr(LANG_LABEL[l])}">${l.toUpperCase()}</a>`
        ).join('')}
      </nav>
      <a class="btn btn--sm btn--header" href="${base}${PATH.book}">${esc(t('nav.book'))}</a>
    </div>
  </div>
</header>

`;

/* -- barra di sezione ----------------------------------------------------- */
/** ancore delle sezioni della homepage, per chiave di navigazione */
export const ANCHORS = {
  studio: 'studio',
  treatments: 'trattamenti',
  technologies: 'tecnologie',
  team: 'team',
  firstVisit: 'prima-visita',
  cases: 'casi',
  journal: 'journal',
  contact: 'contatti'
};

/**
 * Navigazione editoriale di sezione, sottile e sticky sotto l'header.
 * In homepage punta alle ancore con scroll morbido e voce attiva durante lo
 * scorrimento; nelle pagine interne porta alle pagine corrispondenti.
 */
const subnav = (base, current, isHome) => `
<nav class="subnav" aria-label="${attr(t('nav.sections'))}"${isHome ? ' data-scrollspy' : ''}>
  <div class="wrap" style="height:100%">
    <div class="subnav__track">
      ${nav()
        .map((n) =>
          isHome
            ? `<a class="subnav__link" href="#${ANCHORS[n.key]}" data-spy="${ANCHORS[n.key]}">${esc(n.label)}</a>`
            : `<a class="subnav__link" href="${base}${n.href}"${current === n.href ? ' aria-current="page"' : ''}>${esc(n.label)}</a>`
        )
        .join('\n      ')}
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
          <li><a href="${base}${PATH.studio}">Lo studio</a></li>
          <li><a href="${base}${PATH.team}">Il team</a></li>
          <li><a href="${base}${PATH.technologies}">Tecnologie</a></li>
          <li><a href="${base}${PATH.firstVisit}">Prima visita</a></li>
        </ul>
      </nav>
      <nav class="footer__col" aria-label="Trattamenti">
        <span class="label">Trattamenti</span>
        <ul>
          <li><a href="${base}${PATH.treatments}">Tutte le aree</a></li>
          <li><a href="${base}${PATH.treatments}odontoiatria-generale/">Odontoiatria generale</a></li>
          <li><a href="${base}${PATH.treatments}estetica-dentale/">Estetica dentale</a></li>
          <li><a href="${base}${PATH.treatments}implantologia/">Implantologia</a></li>
          <li><a href="${base}${PATH.treatments}ortodonzia/">Ortodonzia</a></li>
          <li><a href="${base}${PATH.cases}">Casi clinici</a></li>
          <li><a href="${base}${PATH.journal}">Journal</a></li>
        </ul>
      </nav>
      <div class="footer__contact">
        <span class="label">Contatti</span>
        <p><a href="${base}${PATH.contact}">${esc(site.address.street)}<br>${esc(site.address.zip)} ${esc(site.address.city)}</a></p>
        <p><a href="tel:${attr(site.phoneHref)}">${esc(site.phone)}</a></p>
        <p><a href="https://wa.me/${attr(site.whatsappHref)}" target="_blank" rel="noopener">WhatsApp ${arrow}</a></p>
        <p><a href="mailto:${attr(site.email)}">${esc(site.email)}</a></p>
        <p class="mt-2"><a class="btn btn--sm btn--outline-light" href="${base}${PATH.book}">${esc(t('nav.book'))}</a></p>
      </div>
    </div>
    <p class="footer__claim">${esc(site.claim)}</p>
    <div class="footer__legal">
      <span>© <span data-year>2026</span> ${esc(site.legalName)} · P. IVA ${esc(site.vat)}</span>
      <span>${esc(site.director)}</span>
      <ul>
        <li><a href="${base}${PATH.privacy}">Privacy Policy</a></li>
        <li><a href="${base}${PATH.cookie}">Cookie Policy</a></li>
        <li><a href="${base}${PATH.terms}">Termini</a></li>
        ${site.social.map((s) => `<li><a href="${attr(s.url)}" target="_blank" rel="noopener">${esc(s.label)}</a></li>`).join('')}
      </ul>
    </div>
  </div>
</footer>

<div class="mobile-cta" aria-label="${attr(t('common.quickActions'))}">
  <div class="mobile-cta__row">
    <a class="btn btn--sm" href="${base}${PATH.book}">${esc(t('nav.bookShort'))}</a>
    <a class="btn btn--sm btn--ghost" href="tel:${attr(site.phoneHref)}">${esc(t('common.callUs'))}</a>
    <a class="mobile-cta__icon" href="https://wa.me/${attr(site.whatsappHref)}" target="_blank" rel="noopener" aria-label="${attr(t('common.whatsapp'))}">
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
  const lang = getLang();
  // i collegamenti sono relativi alla radice della lingua, gli asset a quella del sito
  const base = baseOverride ?? rel(depth);
  const asset = assetRoot(base);
  const localePath = `${lang}/${pagePath}`;
  const canonical = `${site.url}/${localePath}`;
  // le pagine-file (404) non hanno un equivalente tradotto: si punta alla home
  const isFile = pagePath.endsWith('.html');
  const altFor = (l) => (isFile ? '' : l === lang ? pagePath : altPath(pagePath, lang, l));
  const alternates = LANGS.map((l) => ({ lang: l, href: `${site.url}/${l}/${altFor(l)}` }));
  const ld = [...jsonLd];
  if (crumbs) ld.push(breadcrumbLd(base, crumbs));
  const graph = { '@context': 'https://schema.org', '@graph': ld.length ? ld : [dentistLd()] };

  return `<!DOCTYPE html>
<html lang="${HTML_LANG[lang]}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${attr(description)}">
<link rel="canonical" href="${canonical}">
${alternates.map((a) => `<link rel="alternate" hreflang="${a.lang}" href="${a.href}">`).join('\n')}
<link rel="alternate" hreflang="x-default" href="${site.url}/${DEFAULT_LANG}/${altFor(DEFAULT_LANG)}">
<meta name="robots" content="index, follow, max-image-preview:large">
<meta name="theme-color" content="#ffffff">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${attr(site.name)}">
<meta property="og:locale" content="${OG_LOCALE[lang]}">
${LANGS.filter((l) => l !== lang).map((l) => `<meta property="og:locale:alternate" content="${OG_LOCALE[l]}">`).join('\n')}
<meta property="og:title" content="${attr(title)}">
<meta property="og:description" content="${attr(description)}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${site.url}/images/hero-studio-1280.webp">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="${asset}favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="${asset}apple-touch-icon.png">
<link rel="manifest" href="${asset}site.webmanifest">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,300;0,6..72,400;0,6..72,500;1,6..72,300;1,6..72,400&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,400&display=swap">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,300;0,6..72,400;0,6..72,500;1,6..72,300;1,6..72,400&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,400&display=swap" media="print" onload="this.media='all'">
<noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,300;0,6..72,400;0,6..72,500;1,6..72,300;1,6..72,400&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,400&display=swap"></noscript>
<link rel="stylesheet" href="${asset}styles/main.css">
${preload.map((p) => `<link rel="preload" as="image" href="${asset}images/${p}-1280.webp" imagesrcset="${asset}images/${p}-640.webp 640w, ${asset}images/${p}-1280.webp 1280w, ${asset}images/${p}-1920.webp 1920w" imagesizes="70vw" fetchpriority="high">`).join('\n')}
<script type="application/ld+json">${JSON.stringify(graph)}</script>
</head>
<body class="${bodyClass}">
<div class="page-veil" aria-hidden="true"></div>
<a class="skip-link" href="#main">${esc(t('nav.skip'))}</a>
${header(base, current, lang, asset, altFor)}
${subnav(base, current, depth === 0 && pagePath === '')}
<main id="main">
${main}
</main>
${footer(base)}
<script src="${asset}scripts/app.js" defer></script>
</body>
</html>`;
}
