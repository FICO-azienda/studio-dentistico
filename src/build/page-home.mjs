import { site, treatments, technologies, team, cases, esc, attr, arrow, imgTag, figure, lines, catPath, treatmentPath, PATH } from './utils.mjs';
import { t } from './i18n.mjs';
import { layout, dentistLd } from './layout.mjs';
import { sectionHead, personCard, bookingBand, testimonials, journalPreview } from './components.mjs';

const base = '';

const quickItems = () => [
  { label: t('nav.treatments'), href: PATH.treatments, meta: t('home.quick.treatments') },
  { label: t('home.studio.label'), href: PATH.studio, meta: t('home.quick.studio') },
  { label: t('home.team.label'), href: PATH.team, meta: t('home.quick.team', { n: team.length }) },
  { label: t('nav.cases'), href: PATH.cases, meta: t('common.results') },
  { label: t('nav.bookShort'), href: PATH.book, meta: t('home.quick.book') }
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
        <span class="h3">${esc(q.label)}</span>
        <span class="row"><span class="label">${esc(q.meta)}</span> ${arrow}</span>
      </a>`
      ).join('')}
    </nav>
  </div>
</section>`;

const treatmentsSection = () => `
<section class="section" id="trattamenti">
  <div class="wrap">
    ${sectionHead({
      num: '01',
      label: t('home.treatments.label'),
      title: lines([t('home.treatments.t1'), `<em class="serif-italic">${t('home.treatments.t2')}</em>`]),
      aside: t('home.treatments.aside'),
      link: { href: PATH.treatments, label: t('common.allTreatments') },
      base
    })}
    <div class="team-grid team-grid--2">
      ${treatments.categories
        .map(
          (c) => `<a class="person reveal" href="${catPath(c)}">
        <div class="media media--ar media__zoom" style="--ar:4/3">
          ${imgTag(c.image, { base, sizes: '(max-width: 760px) 100vw, 46vw' })}
        </div>
        <div class="person__info">
          <div class="row row--between" style="gap:1rem">
            <h3 class="h3">${esc(c.title)}</h3>
            <span class="num" style="color:var(--stone-light)">${esc(c.num)}</span>
          </div>
          <p class="body mt-1 measure-sm">${esc(c.lead)}</p>
          <p class="mt-3"><span class="link-u">${esc(t('common.discover'))} ${arrow}</span></p>
        </div>
      </a>`
        )
        .join('')}
    </div>
  </div>
</section>`;

const studioSection = () => `
<section class="section" id="studio">
  <div class="wrap">
    ${sectionHead({
      num: '02',
      label: t('home.studio.label'),
      title: lines([t('home.studio.t1'), `<em class="serif-italic">${t('home.studio.t2')}</em>`]),
      aside: t('home.studio.aside'),
      link: { href: PATH.studio, label: t('common.discoverStudio') },
      base
    })}
    <div class="grid">
      <div class="col-7">
        ${figure('studio-interno', { base, ar: '16/10', className: 'media__zoom', sizes: '(max-width: 1000px) 100vw, 58vw' })}
      </div>
      <div class="col-4 start-9" style="grid-column:9 / span 4">
        <p class="lead reveal">${esc(t('home.studio.lead'))}</p>
        <p class="mt-4 reveal" data-delay="1"><a class="btn btn--ghost" href="${PATH.studio}">${esc(t('common.discoverStudio'))}</a></p>
      </div>
    </div>
  </div>
</section>`;

const techSection = () => `
<section class="section dark" id="tecnologie">
  <div class="wrap">
    ${sectionHead({
      num: '03',
      label: t('home.tech.label'),
      title: lines([t('home.tech.t1'), `<em class="serif-italic">${t('home.tech.t2')}</em>`]),
      aside: t('home.tech.aside'),
      link: { href: PATH.technologies, label: t('common.discoverTech') },
      base
    })}
    <div class="team-grid team-grid--3">
      ${technologies
        .slice(0, 3)
        .map(
          (tec) => `<a class="person reveal" href="${PATH.technologies}#${tec.slug}">
        <div class="media media--ar media--duo media__zoom" style="--ar:3/4">
          ${imgTag(tec.image, { base, sizes: '(max-width: 560px) 100vw, (max-width: 1000px) 50vw, 33vw' })}
          <div class="person__overlay">
            <p>${esc(tec.text)}</p>
            <span class="link-u">${esc(t('common.discoverTechnology'))} ${arrow}</span>
          </div>
        </div>
        <div class="person__info">
          <div class="row row--between" style="gap:1rem">
            <h3 class="h4">${esc(tec.title)}</h3>
            <span class="num" style="color:var(--navy-soft)">${esc(tec.num)}</span>
          </div>
          <p class="person__role">${esc(tec.kicker)}</p>
        </div>
      </a>`
        )
        .join('')}
    </div>
    <p class="mt-4 reveal"><a class="btn btn--outline-light" href="${PATH.technologies}">${esc(t('common.discoverTech'))}</a></p>
  </div>
</section>`;

const teamSection = () => `
<section class="section" id="team">
  <div class="wrap">
    ${sectionHead({
      num: '04',
      label: t('home.team.label'),
      title: lines([t('home.team.t1'), `<em class="serif-italic">${t('home.team.t2')}</em>`]),
      aside: t('home.team.aside'),
      link: { href: PATH.team, label: t('common.meetTeam') },
      base
    })}
    <div class="team-grid">
      ${team.filter((p) => p.featured).map((p) => personCard(p, base)).join('')}
    </div>
  </div>
</section>`;

// valutati a ogni pagina: il dizionario dipende dalla lingua corrente
const steps = () => [
  { t: t('steps.1.t'), d: t('steps.1.d') },
  { t: t('steps.2.t'), d: t('steps.2.d') },
  { t: t('steps.3.t'), d: t('steps.3.d') },
  { t: t('steps.4.t'), d: t('steps.4.d') }
];

const firstVisit = () => `
<section class="section dark" id="prima-visita">
  <div class="wrap">
    ${sectionHead({
      num: '05',
      label: t('home.firstVisit.label'),
      title: lines([t('home.firstVisit.t1')]),
      aside: t('home.firstVisit.aside'),
      link: { href: PATH.firstVisit, label: t('common.howItWorks') },
      base
    })}
    <div class="steps">
      ${steps().map(
        (s, i) => `<article class="step">
        <span class="step__num">0${i + 1}</span>
        <h3 class="h4">${esc(s.t)}</h3>
      </article>`
      ).join('')}
    </div>
    <div class="row mt-5 reveal">
      <a class="btn" href="${PATH.book}">${esc(t('home.firstVisit.cta'))}</a>
      <a class="link-u" href="${PATH.firstVisit}">${esc(t('home.firstVisit.what'))} ${arrow}</a>
    </div>
  </div>
</section>`;

const casesPreview = () => `
<section class="section" id="casi">
  <div class="wrap">
    ${sectionHead({
      label: t('home.cases.label'),
      title: lines([t('home.cases.t1')]),
      aside: t('home.cases.aside'),
      link: { href: PATH.cases, label: t('common.allCases') },
      base
    })}
    <div class="case-grid">
      ${cases.items
        .slice(0, 2)
        .map(
          (c) => `<article class="case reveal">
        <div class="ba" style="--pos:50%">
          ${imgTag(c.before, { base, sizes: '(max-width:760px) 100vw, 46vw', alt: `${c.title} — prima del trattamento` })}
          ${imgTag(c.after, { base, sizes: '(max-width:760px) 100vw, 46vw', alt: `${c.title} — dopo il trattamento`, className: 'ba__after' })}
          <span class="ba__tag ba__tag--l">Prima</span>
          <span class="ba__tag ba__tag--r">Dopo</span>
          <div class="ba__handle" role="slider" tabindex="0" aria-label="Confronto prima e dopo" aria-valuemin="0" aria-valuemax="100" aria-valuenow="50"></div>
        </div>
        <div class="row row--between mt-2">
          <span class="label label--accent">${esc(c.cat)}</span>
          <span class="label">${esc(c.duration)}</span>
        </div>
        <h3 class="h3 mt-1">${esc(c.title)}</h3>
        <p class="body mt-1 measure-sm">${esc(c.summary)}</p>
      </article>`
        )
        .join('')}
    </div>
    <p class="disclaimer mt-4 reveal">Ogni caso clinico è individuale. I risultati possono variare da paziente a paziente. ${esc(cases.note)}</p>
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
      treatmentsSection(),
      studioSection(),
      techSection(),
      teamSection(),
      firstVisit(),
      casesPreview(),
      testimonials(base),
      bookingBand(base),
      journalPreview(base, true),
      contactSection()
    ].join('\n')
  });
