import { site, esc, attr, arrow, imgTag, figure, lines, dateIt, personName, byPerson, journal, faqs, reviews, PATH, articlePath, teamPath } from './utils.mjs';
import { t } from './i18n.mjs';

/* -- intestazione di sezione ---------------------------------------------- */
export const sectionHead = ({ num, label, title, aside = '', link = null, base = '' }) => `
<div class="section-head">
  <div class="section-head__label reveal">
    <span class="label">${num ? `<span class="label--accent">${esc(num)}</span> &nbsp;—&nbsp; ` : ''}${esc(label)}</span>
  </div>
  <h2 class="section-head__title h2 reveal">${title}</h2>
  <div class="section-head__aside reveal" data-delay="1">
    ${aside ? `<p class="body measure-sm">${aside}</p>` : ''}
    ${link ? `<p class="mt-2"><a class="link-u" href="${base}${link.href}">${esc(link.label)} ${arrow}</a></p>` : ''}
  </div>
</div>`;

/* -- numeri --------------------------------------------------------------- */
export const stats = () => `
<div class="stats">
  ${site.stats
    .map(
      (s, i) => `<div class="stat reveal" data-delay="${i}">
    <p class="stat__value"><span data-count="${s.value}"${s.decimals ? ` data-decimals="${s.decimals}"` : ''}>0</span>${esc(s.suffix)}</p>
    <p class="stat__label">${esc(s.label)}</p>
  </div>`
    )
    .join('')}
</div>`;

/* -- persona -------------------------------------------------------------- */
export const personCard = (p, base) => `
<a class="person reveal" href="${base}${teamPath(p)}">
  <div class="media media--ar media--duo media__zoom" style="--ar:3/4">
    ${imgTag(p.image, { base, sizes: '(max-width: 560px) 100vw, (max-width: 1000px) 50vw, 25vw' })}
    <div class="person__overlay">
      <p>${esc(p.short)}</p>
      <span class="link-u">${esc(t('common.discoverProfile'))} ${arrow}</span>
    </div>
  </div>
  <div class="person__info">
    <h3 class="h4">${esc(personName(p))}</h3>
    <p class="person__role">${esc(p.role)}</p>
  </div>
</a>`;

/* -- articolo ------------------------------------------------------------- */
export const articleCard = (a, base) => `
<a class="article-card reveal" href="${base}${articlePath(a)}">
  <div class="media media--ar media__zoom" style="--ar:4/3">
    ${imgTag(a.image, { base, sizes: '(max-width: 560px) 100vw, (max-width: 900px) 50vw, 33vw' })}
  </div>
  <div class="article-card__meta">
    <span class="label label--accent">${esc(a.category)}</span>
    <span class="label">${a.reading} min</span>
  </div>
  <h3 class="h3">${esc(a.title)}</h3>
  <p>${esc(a.excerpt)}</p>
</a>`;

/* -- fascia prenotazione -------------------------------------------------- */
export const bookingBand = (base) => `
<section class="band">
  <div class="band__bg" data-parallax="3">${imgTag('studio-corridoio', { base, sizes: '100vw' })}</div>
  <div class="band__inner">
    <div class="wrap">
      <div class="grid">
        <div class="col-7">
          <span class="label reveal" style="color:rgba(238,236,229,.6)">Prenota</span>
          <h2 class="h1 mt-2 reveal" data-delay="1">${lines([t('band.t1'), `<em class="serif-italic">${t('band.t2')}</em>`])}</h2>
          <p class="lead mt-3 measure-sm reveal" data-delay="2" style="color:rgba(238,236,229,.8)">
            ${esc(t('band.lead'))}
          </p>
          <div class="row mt-4 reveal" data-delay="3">
            <a class="btn btn--light" href="${base}${PATH.book}">${esc(t('common.bookNow'))}</a>
            <a class="btn btn--outline-light" href="${base}${PATH.contact}">${esc(t('common.contactUs'))}</a>
          </div>
        </div>
      </div>
      <div class="band__contacts reveal">
        <div class="band__contact">
          <span class="label">${esc(t('common.phone'))}</span>
          <a href="tel:${attr(site.phoneHref)}">${esc(site.phone)}</a>
        </div>
        <div class="band__contact">
          <span class="label">${esc(t('common.whatsapp'))}</span>
          <a href="https://wa.me/${attr(site.whatsappHref)}" target="_blank" rel="noopener">${esc(site.whatsapp)}</a>
        </div>
        <div class="band__contact">
          <span class="label">${esc(t('common.email'))}</span>
          <a href="mailto:${attr(site.email)}">${esc(site.email)}</a>
        </div>
        <div class="band__contact">
          <span class="label">${esc(t('common.studio'))}</span>
          <a href="${base}${PATH.contact}">${esc(site.address.street)}, ${esc(site.address.city)}</a>
        </div>
      </div>
    </div>
  </div>
</section>`;

/* -- FAQ ------------------------------------------------------------------ */
export const faqList = (items, idPrefix = 'faq') => `
<div class="faq">
  ${items
    .map(
      (f, i) => `<div class="faq__item reveal">
    <h3>
      <button class="faq__q" type="button" aria-expanded="false" aria-controls="${idPrefix}-${i}">
        <span>${esc(f.q)}</span>
        <span class="faq__icon" aria-hidden="true"></span>
      </button>
    </h3>
    <div class="faq__a" id="${idPrefix}-${i}"><div><p>${esc(f.a)}</p></div></div>
  </div>`
    )
    .join('')}
</div>`;

export const faqLd = (items) => ({
  '@type': 'FAQPage',
  mainEntity: items.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a }
  }))
});

/* -- testimonianze -------------------------------------------------------- */
export const testimonials = (base) => {
  if (!reviews.length) return '';
  return `
<section class="section">
  <div class="wrap">
    ${sectionHead({
      label: t('reviews.label'),
      title: lines([t('reviews.t1'), `<em class="serif-italic">${t('reviews.t2')}</em>`]),
      aside: t('reviews.aside')
    })}
  </div>
  <div class="rail">
    <div class="rail__track">
      ${reviews
        .map(
          (r) => `<article class="quote-card reveal">
        <blockquote>&ldquo;${esc(r.text)}&rdquo;</blockquote>
        <footer>${esc(r.name)} <span style="opacity:.55">— ${esc(r.source)}</span></footer>
      </article>`
        )
        .join('')}
    </div>
    <div class="wrap">
      <div class="row row--between mt-3">
        <p class="small" style="color:var(--stone-light)">${esc(t('common.dragToScroll'))}</p>
        <div class="rail__nav">
          <button class="rail__btn" type="button" data-rail="prev" aria-label="${attr(t('common.previous'))}">&#8592;</button>
          <button class="rail__btn" type="button" data-rail="next" aria-label="${attr(t('common.next'))}">&#8594;</button>
        </div>
      </div>
    </div>
  </div>
</section>`;
};

/* -- journal preview ------------------------------------------------------ */
export const journalPreview = (base, compact = false) => {
  // in homepage: solo gli ultimi tre articoli e un invito all'archivio
  if (compact) {
    return `
<section class="section" id="journal">
  <div class="wrap">
    ${sectionHead({
      num: '06',
      label: t('journal.label'),
      title: lines(['Journal']),
      aside: t('journal.aside'),
      link: { href: PATH.journal, label: t('common.goToJournal') },
      base
    })}
    <div class="article-list">
      ${journal.slice(0, 3).map((x) => articleCard(x, base)).join('')}
    </div>
    <p class="mt-4 reveal"><a class="btn btn--ghost" href="${base}${PATH.journal}">${esc(t('common.goToJournal'))}</a></p>
  </div>
</section>`;
  }

  const [featured, ...rest] = journal;
  const a = byPerson[featured.author];
  return `
<section class="section" id="journal">
  <div class="wrap">
    ${sectionHead({
      num: '06',
      label: t('journal.label'),
      title: lines(['Journal']),
      aside: t('journal.aside'),
      link: { href: PATH.journal, label: t('common.allArticles') },
      base
    })}
    <a class="article-feature" href="${base}${articlePath(featured)}">
      <div class="article-feature__media">
        ${figure(featured.image, { base, ar: '16/10', className: 'media__zoom', sizes: '(max-width: 1000px) 100vw, 58vw' })}
      </div>
      <div class="article-feature__body">
        <div class="row">
          <span class="label label--accent">${esc(featured.category)}</span>
          <span class="label">${dateIt(featured.date)}</span>
        </div>
        <h3 class="h2 mt-2 reveal">${esc(featured.title)}</h3>
        <p class="body mt-2 measure-sm">${esc(featured.excerpt)}</p>
        <p class="small mt-2" style="color:var(--stone-light)">${esc(personName(a))} · ${featured.reading} ${esc(t('common.minRead'))}</p>
        <p class="mt-3"><span class="link-u">${esc(t('common.readMore'))} ${arrow}</span></p>
      </div>
    </a>
    <div class="article-list mt-5">
      ${rest.slice(0, 3).map((x) => articleCard(x, base)).join('')}
    </div>
  </div>
</section>`;
};

/* -- FAQ home ------------------------------------------------------------- */
export const faqSection = (base, items = faqs.slice(0, 6)) => `
<section class="section">
  <div class="wrap">
    <div class="grid">
      <div class="col-4">
        <span class="label reveal">${esc(t('common.faqTitle'))}</span>
        <h2 class="h2 mt-2 reveal">${lines([t('page.faqT1'), `<em class="serif-italic">${t('page.faqT2')}</em>`])}</h2>
        <p class="body mt-3 measure-sm reveal">${esc(t('page.faqHomeAside'))}</p>
        <p class="mt-3 reveal"><a class="link-u" href="${base}${PATH.contact}">${esc(t('common.askQuestion'))} ${arrow}</a></p>
      </div>
      <div class="col-7 start-7">
        ${faqList(items)}
      </div>
    </div>
  </div>
</section>`;

/* -- hero pagine interne -------------------------------------------------- */
export const pageHero = ({ label, title, lead = '', aside = '', crumbs = [], base = '', media = null, mediaAr = '21/9' }) => `
<section class="page-hero" data-header-over>
  <div class="wrap">
    <nav class="breadcrumb" aria-label="${attr(t('nav.breadcrumb'))}">
      ${crumbs
        .map((c, i) =>
          c.path !== undefined && i < crumbs.length - 1
            ? `<a href="${base}${c.path}">${esc(c.label)}</a><span aria-hidden="true">/</span>`
            : `<span aria-current="page">${esc(c.label)}</span>`
        )
        .join(' ')}
    </nav>
    <div class="page-hero__grid">
      <div class="page-hero__title">
        <span class="label label--accent reveal">${esc(label)}</span>
        <h1 class="h1 mt-2">${title}</h1>
      </div>
      <div class="page-hero__aside">
        ${aside ? `<p class="body reveal" data-delay="2">${aside}</p>` : ''}
      </div>
    </div>
    ${lead ? `<p class="lead mt-4 measure reveal" data-delay="1">${lead}</p>` : ''}
  </div>
  ${media ? `<div class="wrap wrap--wide">${figure(media, { base, ar: mediaAr, className: 'page-hero__media', sizes: '100vw', eager: true })}</div>` : ''}
</section>`;
