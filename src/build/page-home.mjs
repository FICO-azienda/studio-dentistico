import { site, treatments, team, esc, attr, arrow, imgTag, figure, lines, catPath, PATH } from './utils.mjs';
import { t } from './i18n.mjs';
import { layout, dentistLd } from './layout.mjs';
import { sectionHead, bookingBand } from './components.mjs';

const base = '';

const quickItems = () => [
  { label: t('nav.treatments'), href: PATH.treatments, meta: t('home.quick.treatments'), desc: t('home.quick.d.treatments') },
  { label: t('home.studio.label'), href: PATH.studio, meta: t('home.quick.studio'), desc: t('home.quick.d.studio') },
  { label: t('home.team.label'), href: PATH.team, meta: t('home.quick.team', { n: team.length }), desc: t('home.quick.d.team', { n: team.length }) },
  { label: t('nav.cases'), href: PATH.cases, meta: t('common.results'), desc: t('home.quick.d.cases') },
  { label: t('nav.bookShort'), href: PATH.book, meta: t('home.quick.book'), desc: t('home.quick.d.book') }
];

const hero = () => `
<section class="hero" data-header-over>
  <div class="wrap">
    <div class="hero__grid">
      <div class="hero__title">
        <h1 class="display">${lines([t('home.hero.l1'), t('home.hero.l2'), `<em class="serif-italic">${t('home.hero.l3')}</em>`, `<em class="serif-italic">${t('home.hero.l4')}</em>`])}</h1>
      </div>
      <div class="hero__meta reveal" data-delay="3">
        <div class="hero__meta-item">
          <span class="label">${esc(t('common.studio'))}</span>
          <span>${esc(site.address.city)}, Italia</span>
        </div>
        <div class="hero__meta-item">
          <span class="label">${esc(t('common.hours'))}</span>
          <span>${t('home.hero.hours')}</span>
        </div>
        <div class="hero__meta-item">
          <span class="label">${esc(t('common.phone'))}</span>
          <span><a class="link-inline" href="tel:${attr(site.phoneHref)}">${esc(site.phone)}</a></span>
        </div>
      </div>
      <div class="hero__body reveal" data-delay="2">
        <p class="lead">${esc(t('home.hero.lead'))}</p>
        <div class="hero__cta">
          <a class="btn" href="${PATH.book}">${esc(t('nav.book'))}</a>
          <a class="btn btn--ghost" href="${PATH.studio}">${esc(t('common.discoverStudio'))}</a>
        </div>
      </div>
      <div class="hero__media img-mask">
        ${imgTag('hero-studio', { base, sizes: '(max-width: 1080px) 100vw, 58vw', eager: true, className: 'parallax', })}
        <div class="hero__badge">
          <span class="hero__dot"></span>
          <span class="small">${t('home.hero.badge')}</span>
        </div>
      </div>
    </div>
  </div>
</section>`;

const quicknav = () => `
<section class="section section--sm">
  <div class="wrap">
    <nav class="quicknav" aria-label="${attr(t('nav.quick'))}">
      ${quickItems().map(
        (q, i) => `<a class="quicknav__item" href="${q.href}">
        <span class="num" style="color:var(--stone-light)">0${i + 1}</span>
        <span class="quicknav__text">
          <span class="h3">${esc(q.label)}</span>
          <span class="quicknav__desc">${esc(q.desc)}</span>
        </span>
        <span class="row"><span class="label">${esc(q.meta)}</span> ${arrow}</span>
      </a>`
      ).join('')}
    </nav>
  </div>
</section>`;

/**
 * Le quattro aree di cura: una fascia a tutta larghezza ciascuna, che porta
 * alla pagina dell'area. La home descrive, le pagine approfondiscono.
 */
const areasSection = () => `
<section class="section" id="trattamenti">
  <div class="wrap">
    ${sectionHead({
      num: '01',
      label: t('home.areas.label'),
      title: lines([t('home.areas.t1'), `<em class="serif-italic">${t('home.areas.t2')}</em>`]),
      aside: t('home.areas.aside'),
      link: { href: PATH.treatments, label: t('common.allTreatments') },
      base
    })}
  </div>
  <div class="arealanes">
    ${treatments.categories
      .map(
        (c) => `<a class="arealane reveal" href="${catPath(c)}">
      <div class="arealane__media">${imgTag(c.image, { base, sizes: '100vw' })}</div>
      <div class="wrap arealane__inner">
        <span class="num arealane__num">${esc(c.num)}</span>
        <h3 class="h1 arealane__title">${esc(c.title)}</h3>
        <p class="arealane__lead">${esc(c.lead)}</p>
        <span class="arealane__meta">
          <span class="label">${c.items.length} ${esc(t('cat.treatmentsCount'))}</span>
          <span class="link-u">${esc(t('common.discoverArea'))} ${arrow}</span>
        </span>
      </div>
    </a>`
      )
      .join('')}
  </div>
</section>`;

const contactSection = () => `
<section class="section" id="contatti">
  <div class="wrap">
    ${sectionHead({
      label: t('home.contact.label'),
      title: lines([t('home.contact.t1')]),
      aside: t('home.contact.aside'),
      link: { href: PATH.contact, label: t('home.contact.link') },
      base
    })}
    <div class="grid">
      <div class="col-6">
        <div class="info-list">
          <div class="info-list__row"><span class="label">${esc(t('common.address'))}</span><span>${esc(site.address.street)}, ${esc(site.address.zip)} ${esc(site.address.city)}</span></div>
          <div class="info-list__row"><span class="label">${esc(t('common.phone'))}</span><span><a class="link-inline" href="tel:${attr(site.phoneHref)}">${esc(site.phone)}</a></span></div>
          <div class="info-list__row"><span class="label">${esc(t('common.whatsapp'))}</span><span><a class="link-inline" href="https://wa.me/${attr(site.whatsappHref)}" target="_blank" rel="noopener">${esc(site.whatsapp)}</a></span></div>
          <div class="info-list__row"><span class="label">${esc(t('common.email'))}</span><span><a class="link-inline" href="mailto:${attr(site.email)}">${esc(site.email)}</a></span></div>
          <div class="info-list__row"><span class="label">${esc(t('common.hours'))}</span><span>${site.hours.map((h) => `${esc(h.d)} · ${esc(h.h)}`).join('<br>')}</span></div>
        </div>
      </div>
      <div class="col-5 start-8" style="grid-column:8 / span 5">
        ${figure('studio-reception', { base, ar: '4/3', className: 'media__zoom', sizes: '(max-width: 1000px) 100vw, 40vw' })}
        <div class="row mt-4">
          <a class="btn" href="${PATH.book}">${esc(t('nav.book'))}</a>
          <a class="btn btn--ghost" href="${PATH.contact}">${esc(t('home.contact.all'))}</a>
        </div>
      </div>
    </div>
  </div>
</section>`;

export const homePage = () =>
  layout({
    title: t('meta.home.title'),
    description:
      t('meta.home.desc'),
    path: '',
    depth: 0,
    current: '',
    preload: ['hero-studio'],
    jsonLd: [dentistLd()],
    main: [
      hero(),
      quicknav(),
      areasSection(),
      bookingBand(base),
      contactSection()
    ].join('\n')
  });
