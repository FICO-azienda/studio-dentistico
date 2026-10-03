import { site, team, technologies, faqs, treatments, orari, giorniOrari, passoMinuti, chiusure, esc, attr, arrow, imgTag, figure, lines, personName, byTreatment, byPerson, metaTitle, treatmentPath, PATH, teamPath } from './utils.mjs';
import { t, t as tt, getLang } from './i18n.mjs';
import { clientConfig } from '../../api/_lib/flows.mjs';
import { layout, dentistLd } from './layout.mjs';
import { sectionHead, stats, personCard, portrait, bookingBand, faqList, faqLd, pageHero, testimonials } from './components.mjs';

/* ========================================================== /studio ====== */
export const studioPage = () => {
  const base = '../';
  const main = `
${pageHero({
    label: t('studio.label'),
    title: lines([t('home.studio.t1'), `<em class="serif-italic">${t('home.studio.t2')}</em>`]),
    lead: t('studio.lead'),
    aside: `${esc(site.address.street)}<br>${esc(site.address.city)}`,
    crumbs: [{ label: t('nav.home'), path: '' }, { label: t('home.studio.label') }],
    base,
    media: 'studio-interno',
    mediaAr: '21/9'
  })}

<section class="section">
  <div class="wrap">
    <div class="grid">
      <div class="col-5">
        <span class="label reveal">${esc(t('studio.philosophy'))}</span>
        <h2 class="h2 mt-2 reveal">${lines([t('studio.phT1'), `<em class="serif-italic">${t('studio.phT2')}</em>`])}</h2>
      </div>
      <div class="col-6 start-7 prose reveal">
        <p>${esc(t('studio.p1'))}</p>
        <p>${esc(t('studio.p2'))}</p>
        <p>${esc(t('studio.p3'))}</p>
      </div>
    </div>
    <div class="grid mt-5">
      ${figure('liddi-corridoio', { base, ar: '4/5', className: 'col-4 media__zoom', sizes: '32vw' })}
      ${figure('liddi-attesa', { base, ar: '4/5', className: 'col-4 media__zoom', sizes: '32vw' })}
      ${figure('studio-dettaglio', { base, ar: '4/5', className: 'col-4 media__zoom', sizes: '32vw' })}
    </div>
  </div>
</section>

<section class="section section--flush-top">
  <div class="wrap">
    <div class="compose">
      <div class="compose__lead">
        <span class="label reveal">${esc(t('studio.values'))}</span>
        <h2 class="h2 mt-2 reveal">${lines([t('studio.valT1'), `<em class="serif-italic">${t('studio.valT2')}</em>`])}</h2>
      </div>
      <div class="compose__stack">
        <div>
          ${site.values
            .map(
              (v, i) => `<div class="value-item reveal" data-delay="${i}">
            <span class="num value-item__num">0${i + 1}</span>
            <div><h3 class="h4">${esc(v.title)}</h3><p>${esc(v.text)}</p></div>
          </div>`
            )
            .join('')}
        </div>
        ${figure('studio-reception', { base, ar: '16/10', className: 'media__zoom', sizes: '50vw' })}
      </div>
    </div>
    <div class="mt-5">${stats()}</div>
  </div>
</section>

<section class="section dark">
  <div class="wrap">
    ${sectionHead({
      label: t('studio.spaces'),
      title: lines([t('studio.spT1'), `<em class="serif-italic">${t('studio.spT2')}</em>`]),
      aside: t('studio.spAside'),
      link: { href: PATH.technologies, label: t('common.allTechnologies') },
      base
    })}
    <div class="grid">
      ${[
        [t('studio.space1.t'), t('studio.space1.d')],
        [t('studio.space2.t'), t('studio.space2.d')]
      ]
        .map(
          ([tit, d], i) => `<div class="col-6 reveal" data-delay="${i % 2}">
        <div class="value-item"><span class="num value-item__num" style="color:var(--navy)">0${i + 1}</span><div><h3 class="h4">${esc(tit)}</h3><p>${esc(d)}</p></div></div>
      </div>`
        )
        .join('')}
    </div>
  </div>
</section>

<section class="section">
  <div class="wrap">
    ${sectionHead({
      num: '04',
      label: t('home.team.label'),
      title: lines([t('studio.whoT1'), `<em class="serif-italic">${t('studio.whoT2')}</em>`]),
      link: { href: PATH.team, label: t('common.allTeam') },
      base
    })}
    <div class="team-grid">${team.filter((p) => p.featured).map((p) => personCard(p, base)).join('')}</div>
  </div>
</section>

${bookingBand(base)}`;

  return layout({
    title: t('meta.studio.title'),
    description: t('meta.studio.desc', { n: team.length }),
    path: PATH.studio,
    depth: 1,
    current: PATH.studio,
    preload: ['studio-interno'],
    crumbs: [{ label: t('nav.home'), path: '' }, { label: t('home.studio.label'), path: PATH.studio }],
    main
  });
};

/* =========================================================== /team ======= */
export const teamPage = () => {
  const base = '../';
  const main = `
${pageHero({
    label: t('team.label'),
    title: lines([t('home.team.t1'), `<em class="serif-italic">${t('home.team.t2')}</em>`]),
    lead: t('team.lead', { n: team.length }),
    aside: t('team.aside'),
    crumbs: [{ label: t('nav.home'), path: '' }, { label: t('nav.team') }],
    base
  })}
<section class="section section--flush-top">
  <div class="wrap">
    <div class="team-grid">${team.map((p) => personCard(p, base)).join('')}</div>
    ${t('team.note') ? `<p class="disclaimer mt-5 reveal">${esc(t('team.note'))}</p>` : ''}
  </div>
</section>
${bookingBand(base)}`;

  return layout({
    title: t('meta.team.title'),
    description: t('meta.team.desc', { n: team.length }),
    path: PATH.team,
    depth: 1,
    current: PATH.team,
    crumbs: [{ label: t('nav.home'), path: '' }, { label: t('nav.team'), path: PATH.team }],
    main
  });
};

export const personPage = (p) => {
  const base = '../../';
  const trats = (p.treatments || []).map((s) => byTreatment[s]).filter(Boolean);
  const others = team.filter((x) => x.slug !== p.slug).slice(0, 4);
  const main = `
<section class="page-hero" data-header-over>
  <div class="wrap">
    <nav class="breadcrumb" aria-label="${attr(t('nav.breadcrumb'))}">
      <a href="${base}">Home</a><span aria-hidden="true">/</span>
      <a href="${base}${PATH.team}">Team</a><span aria-hidden="true">/</span>
      <span aria-current="page">${esc(p.name)}</span>
    </nav>
    <div class="grid">
      <div class="col-5">
        ${p.image
          ? figure(p.image, { base, ar: '3/4', className: 'media--duo', sizes: '(max-width:1000px) 100vw, 40vw', eager: true })
          : `<figure class="media media--ar media--duo" style="--ar:3/4">${portrait(p, base)}</figure>`}
      </div>
      <div class="col-6 start-7">
        <span class="label label--accent reveal">${esc(p.role)}</span>
        <h1 class="h1 mt-2">${lines([esc(personName(p))])}</h1>
        <p class="lead mt-3 reveal" data-delay="1">${esc(p.short)}</p>
        ${p.quote ? `<blockquote class="mt-4 reveal" data-delay="2" style="font-family:var(--font-display);font-size:1.4rem;line-height:1.35;border-left:1px solid var(--navy);padding-left:1.4rem">&ldquo;${esc(p.quote)}&rdquo;</blockquote>` : ''}
        <div class="row mt-4 reveal" data-delay="3">
          <a class="btn" href="${base}${PATH.book}">${esc(t('team.bookWith'))} ${esc(p.title || '')} ${esc(p.name.split(' ')[0])}</a>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <div class="grid">
      <div class="col-7 prose reveal">
        <h2>${esc(t('team.profile'))}</h2>
        <p>${esc(p.bio)}</p>
        ${(p.education || []).length ? `<h2>${esc(t('team.education'))}</h2><ul>${p.education.map((e) => `<li>${esc(e)}</li>`).join('')}</ul>` : ''}
        ${p.member ? `<h2>${esc(t('team.associations'))}</h2><p>${esc(p.member)}</p>` : ''}
      </div>
      <aside class="col-4 start-8">
        <div class="sticky">
          ${(p.focus || []).length
            ? `<div class="sidebar-card reveal">
            <span class="label">${esc(t('team.interests'))}</span>
            <ul class="mt-2 flow flow-sm">${p.focus.map((f) => `<li class="body">${esc(f)}</li>`).join('')}</ul>
          </div>`
            : ''}
          ${
            trats.length
              ? `<div class="sidebar-card reveal">
            <span class="label">${esc(t('nav.treatments'))}</span>
            <ul class="treatment-row__list" style="margin-top:1rem">
              ${trats.map((tr) => `<li><a href="${base}${treatmentPath(tr)}"><span>${esc(tr.title)}</span> ${arrow}</a></li>`).join('')}
            </ul>
          </div>`
              : ''
          }
        </div>
      </aside>
    </div>
  </div>
</section>

<section class="section section--sm">
  <div class="wrap">
    ${sectionHead({ label: t('nav.team'), title: lines([t('team.othersT')]), link: { href: PATH.team, label: t('common.allTeam') }, base })}
    <div class="team-grid">${others.map((x) => personCard(x, base)).join('')}</div>
  </div>
</section>
${bookingBand(base)}`;

  return layout({
    title: metaTitle(`${personName(p)} — ${p.role.split('·')[0].trim()}`),
    description: t('meta.person.desc', { name: personName(p), role: p.role, short: p.short }),
    path: `team/${p.slug}/`,
    depth: 2,
    current: PATH.team,
    preload: p.image ? [p.image] : [],
    crumbs: [{ label: t('nav.home'), path: '' }, { label: t('nav.team'), path: PATH.team }, { label: p.name, path: `team/${p.slug}/` }],
    jsonLd: [
      {
        '@type': 'Person',
        name: personName(p),
        jobTitle: p.role,
        description: p.bio,
        ...(p.image ? { image: `${site.url}/images/${p.image}-1280.webp` } : {}),
        worksFor: { '@id': site.url + '/#studio' },
        url: `${site.url}/team/${p.slug}/`
      }
    ],
    main
  });
};

/* ====================================================== /tecnologie ====== */
export const techPage = () => {
  const base = '../';
  const main = `
${pageHero({
    label: t('tech.label'),
    title: lines([t('home.tech.t1'), `<em class="serif-italic">${t('home.tech.t2')}</em>`]),
    lead: t('tech.lead'),
    aside: t('tech.aside'),
    crumbs: [{ label: t('nav.home'), path: '' }, { label: t('nav.technologies') }],
    base
  })}
<section class="section section--flush-top">
  <div class="wrap">
    ${technologies
      .map(
        (t, i) => `<article class="treatment-row" id="${t.slug}">
      <div class="treatment-row__media">${figure(t.image, { base, ar: '3/4', className: 'media__zoom media--duo', sizes: '(max-width:1000px) 100vw, 48vw' })}</div>
      <div class="treatment-row__content reveal">
        <p class="treatment-row__num">${esc(t.num)}</p>
        <h2 class="h2">${esc(t.title)}</h2>
        <p class="label label--accent mt-1">${esc(t.kicker)}</p>
        <p class="body mt-2 measure-sm">${esc(t.text)}</p>
        <div class="spec-grid mt-4" style="grid-template-columns:repeat(2,1fr)">
          ${[
            [tt('tech.use'), t.use],
            [tt('tech.gain'), t.gain]
          ]
            .filter(([, v]) => v)
            .map(([l, v]) => `<div class="spec"><span class="label">${esc(l)}</span><p class="body mt-1" style="font-size:.95rem">${esc(v)}</p></div>`)
            .join('')}
        </div>
      </div>
    </article>`
      )
      .join('')}
  </div>
</section>
${bookingBand(base)}`;

  return layout({
    title: t('meta.tech.title'),
    description: t('meta.tech.desc'),
    path: PATH.technologies,
    depth: 1,
    current: PATH.technologies,
    crumbs: [{ label: t('nav.home'), path: '' }, { label: t('nav.technologies'), path: PATH.technologies }],
    main
  });
};


/* ==================================================== /prima-visita ====== */
// stessi quattro passaggi della home: testi nel dizionario, cosi' seguono la lingua
const VISIT_STEPS = () => [1, 2, 3, 4].map((n) => ({ t: t(`steps.${n}.t`), d: t(`steps.${n}.d`), n: `0${n}` }));

export const firstVisitPage = () => {
  const base = '../';
  const localFaq = faqs;
  const main = `
${pageHero({
    label: t('fv.label'),
    title: lines([t('home.firstVisit.t1')]),
    lead: t('fv.lead'),
    aside: t('fv.aside'),
    crumbs: [{ label: t('nav.home'), path: '' }, { label: t('nav.firstVisit') }],
    base,
    media: 'trattamento-visita',
    mediaAr: '21/9'
  })}

<section class="section">
  <div class="wrap">
    <div class="steps">
      ${VISIT_STEPS().map(
        (s) => `<article class="step">
        <span class="step__num">${s.n}</span>
        <h3 class="h4">${esc(s.t)}</h3>
        <p>${esc(s.d)}</p>
      </article>`
      ).join('')}
    </div>
  </div>
</section>

<section class="section section--flush-top">
  <div class="wrap">
    <div class="grid">
      <div class="col-5">
        <span class="label reveal">${esc(t('fv.bring'))}</span>
        <h2 class="h2 mt-2 reveal">${lines([t('fv.bringT1'), `<em class="serif-italic">${t('fv.bringT2')}</em>`])}</h2>
        ${figure('liddi-sala-glicine', { base, ar: '4/3', className: 'mt-4 media__zoom', sizes: '40vw' })}
      </div>
      <div class="col-6 start-7 prose reveal">
        <h2 style="margin-top:0">${esc(t('fv.quoteH'))}</h2>
        <p>${esc(t('fv.quoteText'))}</p>
        <h2>${esc(t('fv.payH'))}</h2>
        <p>${esc(t('fv.payText'))}</p>
      </div>
    </div>
  </div>
</section>

<section class="section bg-sand">
  <div class="wrap">
    <div class="grid">
      <div class="col-4"><span class="label reveal">${esc(t('fv.questions'))}</span><h2 class="h2 mt-2 reveal">${lines([t('fv.beforeT1'), `<em class="serif-italic">${t('fv.beforeT2')}</em>`])}</h2></div>
      <div class="col-7 start-7">${faqList(localFaq, 'pv')}</div>
    </div>
    <div class="row mt-5 reveal">
      <a class="btn" href="${base}${PATH.book}">${esc(t('home.firstVisit.cta'))}</a>
      <a class="link-u" href="tel:${attr(site.phoneHref)}">${esc(t('fv.orCall'))} ${esc(site.phone)} ${arrow}</a>
    </div>
  </div>
</section>
${bookingBand(base)}`;

  return layout({
    title: t('meta.firstVisit.title'),
    description: t('meta.firstVisit.desc'),
    path: PATH.firstVisit,
    depth: 1,
    current: PATH.firstVisit,
    preload: ['trattamento-visita'],
    crumbs: [{ label: t('nav.home'), path: '' }, { label: t('nav.firstVisit'), path: PATH.firstVisit }],
    jsonLd: [dentistLd(), faqLd(localFaq)],
    main
  });
};

/* ======================================================= /contatti ======= */
export const contactPage = () => {
  const base = '../';
  const main = `
${pageHero({
    label: t('nav.contact'),
    title: lines([t('home.contact.t1')]),
    lead: t('contact.lead'),
    crumbs: [{ label: t('nav.home'), path: '' }, { label: t('nav.contact') }],
    base
  })}

<section class="section section--flush-top">
  <div class="wrap">
    <div class="grid">
      <div class="col-5">
        <div class="info-list">
          <div class="info-list__row"><span class="label">${esc(t('common.phone'))}</span><span><a class="link-inline" href="tel:${attr(site.phoneHref)}">${esc(site.phone)}</a></span></div>
          <div class="info-list__row"><span class="label">${esc(t('common.whatsapp'))}</span><span><a class="link-inline" href="https://wa.me/${attr(site.whatsappHref)}" target="_blank" rel="noopener">${esc(site.whatsapp)}</a></span></div>
          <div class="info-list__row"><span class="label">${esc(t('common.email'))}</span><span><a class="link-inline" href="mailto:${attr(site.email)}">${esc(site.email)}</a></span></div>
          <div class="info-list__row"><span class="label">${esc(t('common.address'))}</span><span>${esc(site.address.street)}<br>${esc(site.address.zip)} ${esc(site.address.city)}</span></div>
          ${site.hours.map((h) => `<div class="info-list__row"><span class="label">${esc(h.d)}</span><span>${esc(h.h)}</span></div>`).join('')}
        </div>
        <div class="info-list mt-4">
          ${site.directions.map((d) => `<div class="info-list__row"><span class="label">${esc(d.label)}</span><span>${esc(d.value)}</span></div>`).join('')}
        </div>
        <p class="mt-4"><a class="btn btn--ghost btn--sm" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(site.address.street + ', ' + site.address.city)}" target="_blank" rel="noopener">${esc(t('contact.openMaps'))} ${arrow}</a></p>
      </div>

      <div class="col-6 start-7">
        <div class="map reveal">
          <iframe title="${attr(t('contact.mapTitle'))}" loading="lazy" referrerpolicy="no-referrer-when-downgrade"
            src="https://www.openstreetmap.org/export/embed.html?bbox=${(site.address.lng - 0.01).toFixed(4)}%2C${(site.address.lat - 0.005).toFixed(4)}%2C${(site.address.lng + 0.01).toFixed(4)}%2C${(site.address.lat + 0.005).toFixed(4)}&amp;layer=mapnik&amp;marker=${site.address.lat}%2C${site.address.lng}"></iframe>
        </div>
        <h2 class="h3 mt-5 reveal">${esc(t('contact.request'))}</h2>
        <p class="body mt-2">${t('contact.requestLead', { link: `<a class="link-inline" href="${base}${PATH.book}">${esc(t('nav.bookShort'))}</a>` })}</p>
        <form class="mt-3" data-validate data-success="#contact-done" data-whatsapp="${attr(site.whatsappHref)}" novalidate>
          <div class="form-grid">
            <label class="field"><span class="field__label label">${esc(t('form.name'))} *</span><input type="text" name="nome" required autocomplete="given-name"><span class="field__error">${esc(t('form.required'))}</span></label>
            <label class="field"><span class="field__label label">${esc(t('form.surname'))} *</span><input type="text" name="cognome" required autocomplete="family-name"><span class="field__error">${esc(t('form.required'))}</span></label>
          </div>
          <label class="field mt-3"><span class="field__label label">${esc(t('contact.help'))} *</span><textarea name="messaggio" rows="4" required placeholder="${attr(t('contact.helpPlaceholder'))}"></textarea><span class="field__error">${esc(t('form.required'))}</span></label>
          <label class="check mt-3">
            <input type="checkbox" name="privacy" required>
            <span class="check__box" aria-hidden="true"></span>
            <span>${t('contact.privacy', { link: `<a class="link-inline" href="${base}${PATH.privacy}">${esc(t('form.privacyLink'))}</a>` })} *</span>
          </label>
          <div class="row mt-4"><button class="btn" type="submit">${esc(t('contact.sendWhatsapp'))}</button></div>
          <p class="small mt-2" style="color:var(--stone-light)">${esc(t('contact.noHealthData'))}</p>
          <p class="small mt-2" style="color:var(--stone-light)">${esc(t('contact.orEmail'))} <a class="link-inline" href="mailto:${attr(site.email)}">${esc(site.email)}</a>.</p>
        </form>
        <div class="form-success" id="contact-done" hidden>
          <h2 class="h2">${esc(t('contact.thanks'))}</h2>
          <p class="lead mt-2">${esc(t('contact.thanksLead'))}</p>
          <p class="mt-3 row"><a class="btn" data-wa-open href="https://wa.me/${attr(site.whatsappHref)}" target="_blank" rel="noopener">${esc(t('contact.waOpen'))}</a><a class="btn btn--ghost" href="${base}">${esc(t('common.backHome'))}</a></p>
        </div>
      </div>
    </div>
  </div>
</section>
${bookingBand(base)}`;

  return layout({
    title: t('meta.contact.title'),
    description: t('meta.contact.desc'),
    path: PATH.contact,
    depth: 1,
    current: PATH.contact,
    crumbs: [{ label: t('nav.home'), path: '' }, { label: t('nav.contact'), path: PATH.contact }],
    main
  });
};

/* ======================================================== /prenota ======= */
export const bookingPage = () => {
  const base = '../';
  // senza un endpoint attivo la richiesta si completa su WhatsApp (vedi src/scripts/app.js)
  const bookingLive = site.booking?.mode === 'live' && !!site.booking?.endpoint;
  const bookingMode = bookingLive ? 'live' : 'whatsapp';
  const docs = team.filter((p) => p.featured || p.treatments.length);

  const main = `
${pageHero({
    label: t('nav.bookShort'),
    title: lines([t('book.title1'), `<em class="serif-italic">${t('book.title2')}</em>`]),
    lead: t('book.lead'),
    crumbs: [{ label: t('nav.home'), path: '' }, { label: t('nav.bookShort') }],
    base
  })}

<section class="section section--flush-top">
  <div class="wrap">
    <div class="grid">
      <div class="col-8">
        <div data-wizard data-endpoint="${attr(site.booking?.endpoint || '')}" data-mode="${attr(bookingMode)}" data-auto-confirm="${site.booking?.confermaAutomatica === true}" data-whatsapp="${attr(site.whatsappHref)}">
          <div class="wizard__progress">
            <div class="row row--between">
              <span class="label" data-progress-label>${esc(t('book.chooseService'))}</span>
              <span class="label" data-progress-service></span>
            </div>
            <div class="wizard__bar"><i data-progress-bar style="width:0%"></i></div>
          </div>

          <!-- i passi dinamici vengono costruiti dalla configurazione -->
          <div class="wizard__stage" data-stage aria-live="polite"></div>

          <div class="row mt-4" data-nav>
            <button class="btn btn--ghost" type="button" data-back hidden>${esc(t('form.back'))}</button>
            <button class="btn" type="button" data-next disabled>${esc(t('form.continue'))}</button>
          </div>

          <!-- ultimo passo: dati personali e riepilogo -->
          <section class="wizard__panel" data-final hidden>
            <h2 class="h3">${esc(t('form.yourDetails'))}</h2>
            <form class="mt-3" data-booking data-validate data-success="#booking-done" novalidate>
              <div class="form-grid">
                <label class="field"><span class="field__label label">${esc(t('form.name'))} *</span><input type="text" name="nome" required autocomplete="given-name"><span class="field__error">${esc(t('form.required'))}</span></label>
                <label class="field"><span class="field__label label">${esc(t('form.surname'))} *</span><input type="text" name="cognome" required autocomplete="family-name"><span class="field__error">${esc(t('form.required'))}</span></label>
                <label class="field"><span class="field__label label">${esc(t('form.email'))} *</span><input type="email" name="email" required autocomplete="email"><span class="field__error">${esc(t('form.invalidEmail'))}</span></label>
                <label class="field"><span class="field__label label">${esc(t('form.phone'))} *</span><input type="tel" name="telefono" required autocomplete="tel" pattern="[0-9 +\\(\\)\\.\\-]{6,}"><span class="field__error">${esc(t('form.invalidPhone'))}</span></label>
              </div>
              <label class="field mt-3"><span class="field__label label">${esc(t('form.notes'))}</span><textarea name="messaggio" rows="3" placeholder="${attr(t('form.notesPlaceholder'))}"></textarea></label>

              <!-- esca anti-spam: invisibile alle persone, compilata dai bot -->
              <div aria-hidden="true" style="position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden">
                <label>${esc(t('form.company'))}<input type="text" name="azienda" tabindex="-1" autocomplete="off"></label>
              </div>

              <p class="label mt-4">${esc(t('form.summary'))}</p>
              <dl class="summary-list mt-2" data-summary-list></dl>

              <label class="check mt-4">
                <input type="checkbox" name="privacy" required>
                <span class="check__box" aria-hidden="true"></span>
                <span>${t('form.privacy', { link: `<a class="link-inline" href="${base}${PATH.privacy}">${esc(t('form.privacyLink'))}</a>` })}</span>
              </label>
              <label class="check mt-3">
                <input type="checkbox" name="comunicazioni">
                <span class="check__box" aria-hidden="true"></span>
                <span>${esc(t('form.marketing'))}</span>
              </label>

              <p class="form-error mt-3" data-form-error hidden role="alert"></p>
              <div class="row mt-4">
                <button class="btn btn--ghost" type="button" data-back-final>${esc(t('form.back'))}</button>
                <button class="btn" type="submit" data-submit>${esc(t(bookingLive ? 'form.send' : 'book.sendWhatsapp'))}</button>
              </div>
              ${bookingLive ? '' : `<p class="small mt-2" style="color:var(--stone-light)">${esc(t('book.whatsappHint'))}</p>`}
              <p class="small mt-2" style="color:var(--stone-light)">
                ${esc(t('form.noDiagnosis'))}
              </p>
            </form>

            <div class="form-success" id="booking-done" hidden tabindex="-1">
              <h2 class="h2" data-done-title>${esc(t('book.received'))}</h2>
              <p class="lead mt-2 measure-sm" style="margin-inline:auto" data-done-lead></p>
              <p class="body mt-2 measure-sm" style="margin-inline:auto" data-done-note></p>
              <p class="mt-4"><span class="label">${esc(t('book.code'))}</span><br>
                <span class="h3" style="font-family:var(--font-sans);letter-spacing:.04em" data-done-code></span>
              </p>
              <div class="row mt-4" style="justify-content:center" data-done-actions>
                <a class="btn btn--ghost" href="${base}">${esc(t('common.backHome'))}</a>
                <a class="btn" href="tel:${attr(site.phoneHref)}">${esc(t('common.contactStudio'))}</a>
              </div>
            </div>
          </section>

          <noscript>
            <p class="form-note mt-4">
              ${esc(t('form.noscript'))}
              <a class="link-inline" href="tel:${attr(site.phoneHref)}">${esc(site.phone)}</a>
              ${esc(t('form.orWrite'))} <a class="link-inline" href="mailto:${attr(site.email)}">${esc(site.email)}</a>.
            </p>
          </noscript>
        </div>
      </div>

      <aside class="col-3" style="grid-column:10 / span 3">
        <div class="sticky">
          <div class="sidebar-card">
            <span class="label">${esc(t('book.preferPhone'))}</span>
            <p class="h4 mt-2"><a class="link-inline" href="tel:${attr(site.phoneHref)}">${esc(site.phone)}</a></p>
            <p class="small mt-2" style="color:var(--stone)">${site.hours.map((h) => `${esc(h.d)} ${esc(h.h)}`).join('<br>')}</p>
            <p class="mt-3"><a class="link-u" href="https://wa.me/${attr(site.whatsappHref)}" target="_blank" rel="noopener">${esc(t('common.whatsapp'))} ${arrow}</a></p>
          </div>
          <div class="sidebar-card">
            <span class="label">${esc(t('book.urgent'))}</span>
            <p class="small mt-2" style="color:var(--stone)">${esc(t('book.urgentText'))}</p>
          </div>
        </div>
      </aside>
    </div>
  </div>
</section>

<script type="application/json" data-flows>${JSON.stringify(clientConfig(getLang())).replace(/</g, '\\u003c')}</script>
<script type="application/json" data-slots>${JSON.stringify({ orari, giorni: giorniOrari, passoMinuti, chiusure, dottori: [t('book.noPreference'), ...docs.map((p) => personName(p))] })}</script>`;

  return layout({
    title: t('meta.book.title'),
    description: t('meta.book.desc'),
    path: PATH.book,
    depth: 1,
    current: PATH.book,
    crumbs: [{ label: t('nav.home'), path: '' }, { label: t('nav.bookShort'), path: PATH.book }],
    main
  });
};

/* ======================================================== /gestisci ====== */
export const manageBookingPage = () => {
  const base = '../';
  const main = `
${pageHero({
    label: t('manage.label'),
    title: lines([t('manage.title1'), t('manage.title2')]),
    lead: t('manage.lead'),
    crumbs: [{ label: t('nav.home'), path: '' }, { label: t('manage.label') }],
    base
  })}

<section class="section section--flush-top">
  <div class="wrap">
    <div class="grid">
      <div class="col-7 start-3" data-manage
        data-endpoint="${attr(site.booking?.endpoint || '')}"
        data-mode="${attr(site.booking?.mode || 'demo')}"
        data-phone="${attr(site.phone)}"
        data-phone-href="${attr(site.phoneHref)}"
        data-email="${attr(site.email)}">
        <p class="body">${esc(t('manage.loading'))}</p>
      </div>
    </div>
  </div>
</section>

<script type="application/json" data-manage-slots>${JSON.stringify({ orari, giorni: giorniOrari, passoMinuti, chiusure })}</script>`;

  return layout({
    title: metaTitle(t('manage.title1') + ' ' + t('manage.title2')),
    description: t('manage.lead'),
    path: PATH.manage,
    depth: 1,
    current: PATH.manage,
    crumbs: [{ label: t('nav.home'), path: '' }, { label: t('manage.label'), path: PATH.manage }],
    main
  });
};
