import { site, treatments, cases, journal, team, esc, attr, arrow, imgTag, figure, lines, dateIt, personName, byTreatment, byPerson, byTech, metaTitle, byCategory, catPath, treatmentPath, specialistsOf, techOf, PATH, teamPath, articlePath } from './utils.mjs';
import { layout, dentistLd } from './layout.mjs';
import { getLang, t } from './i18n.mjs';
import { sectionHead, bookingBand, faqList, faqLd, pageHero, articleCard, personCard } from './components.mjs';

/* ================================= /trattamenti/<area> ================== */
/**
 * Pagina dell'area: cosa comprende, come si svolge, i trattamenti che ne
 * fanno parte, la tecnologia e gli specialisti che se ne occupano.
 */
export const categoryPage = (c) => {
  const base = '../../';
  const items = c.items.map((s) => byTreatment[s]).filter(Boolean);
  const techs = techOf(c);
  const docs = specialistsOf(c);
  const faq = items.map((x) => x.faq[0]).filter(Boolean);

  const main = `
${pageHero({
    label: `${c.num} — ${t('cat.areaLabel')}`,
    title: lines([esc(c.title)]),
    lead: esc(c.lead),
    aside: `${items.length} ${t('cat.treatmentsCount')}<br>${docs.length} ${t('cat.specialistsCount')}`,
    crumbs: [{ label: t('nav.home'), path: '' }, { label: t('nav.treatments'), path: PATH.treatments }, { label: c.title }],
    base,
    media: c.image,
    mediaAr: '21/9'
  })}

<section class="section">
  <div class="wrap">
    <div class="grid">
      <div class="col-5">
        <span class="label reveal">${esc(t('cat.theArea'))}</span>
        <h2 class="h2 mt-2 reveal">${lines([t('cat.howT1'), `<em class="serif-italic">${t('cat.howT2')}</em>`])}</h2>
      </div>
      <div class="col-6 start-7 prose reveal">
        ${c.intro.map((p) => `<p>${esc(p)}</p>`).join('')}
      </div>
    </div>
  </div>
</section>

<section class="section section--flush-top">
  <div class="wrap">
    ${sectionHead({
      label: t('cat.included'),
      title: lines([t('cat.includedT1'), `<em class="serif-italic">${esc(c.title.toLowerCase())}.</em>`]),
      aside: t('cat.includedAside')
    })}
    <div class="article-list">
      ${items
        .map(
          (r) => `<a class="article-card reveal" href="${base}${treatmentPath(r)}">
        <div class="media media--ar media__zoom" style="--ar:4/3">${imgTag(r.image, { base, sizes: '(max-width:900px) 50vw, 33vw' })}</div>
        <h3 class="h3 mt-2">${esc(r.title)}</h3>
        <p>${esc(r.short)}</p>
        <p class="mt-2"><span class="link-u">${esc(t('common.discover'))} ${arrow}</span></p>
      </a>`
        )
        .join('')}
    </div>
  </div>
</section>

<section class="section dark">
  <div class="wrap">
    ${sectionHead({
      label: t('common.technologyUsed'),
      title: lines([t('tr.toolsT1'), `<em class="serif-italic">${t('tr.toolsAreaT2')}</em>`]),
      link: { href: PATH.technologies, label: t('common.allTechnologies') },
      base
    })}
    <div class="team-grid team-grid--3">
      ${techs
        .map(
          (x) => `<a class="person reveal" href="${base}${PATH.technologies}#${x.slug}">
        <div class="media media--ar media--duo media__zoom" style="--ar:3/4">
          ${imgTag(x.image, { base, sizes: '(max-width: 560px) 100vw, (max-width: 1000px) 50vw, 33vw' })}
          <div class="person__overlay"><p>${esc(x.text)}</p><span class="link-u">${esc(t('common.discoverTechnology'))} ${arrow}</span></div>
        </div>
        <div class="person__info">
          <h3 class="h4">${esc(x.title)}</h3>
          <p class="person__role">${esc(x.kicker)}</p>
        </div>
      </a>`
        )
        .join('')}
    </div>
  </div>
</section>

<section class="section">
  <div class="wrap">
    ${sectionHead({
      label: t('common.specialists'),
      title: lines([t('cat.whoT1'), `<em class="serif-italic">${t('cat.whoT2')}</em>`]),
      link: { href: PATH.team, label: t('common.allTeam') },
      base
    })}
    <div class="team-grid">${docs.map((p) => personCard(p, base)).join('')}</div>
  </div>
</section>

<section class="section section--flush-top">
  <div class="wrap">
    <div class="grid">
      <div class="col-4">
        <span class="label reveal">${esc(t('common.faqTitle'))}</span>
        <h2 class="h2 mt-2 reveal">${lines([esc(c.title) + '.'])}</h2>
        <p class="body mt-3 measure-sm reveal">${esc(t('page.faqAside'))}</p>
        <p class="mt-3 reveal"><a class="link-u" href="${base}${PATH.contact}">${esc(t('common.askQuestion'))} ${arrow}</a></p>
      </div>
      <div class="col-7 start-7">${faqList(faq, 'cat')}</div>
    </div>
  </div>
</section>
${bookingBand(base)}`;

  return layout({
    title: metaTitle(c.seo.title),
    description: c.seo.description,
    path: catPath(c),
    depth: 2,
    current: PATH.treatments,
    preload: [c.image],
    crumbs: [
      { label: t('nav.home'), path: '' },
      { label: t('nav.treatments'), path: PATH.treatments },
      { label: c.title, path: catPath(c) }
    ],
    jsonLd: [
      {
        '@type': 'MedicalSpecialty',
        name: c.title,
        description: c.lead,
        url: `${site.url}/${catPath(c)}`
      },
      faqLd(faq)
    ],
    main
  });
};

/* ==================================================== /trattamenti ======= */
/**
 * Una sola pagina per tutti i trattamenti: le quattro aree sono sezioni con
 * la loro ancora, non pagine separate. Da qui si arriva a un trattamento con
 * un solo click, invece dei tre che servivano prima.
 */
export const treatmentsIndex = () => {
  const base = '../';

  const areaCard = (c) => {
    const docs = specialistsOf(c);
    return `<a class="areacard reveal" href="${base}${catPath(c)}">
      <div class="media media--ar media__zoom" style="--ar:16/10">${imgTag(c.image, { base, sizes: '(max-width:900px) 100vw, 46vw' })}</div>
      <p class="treatment-row__num mt-3">${esc(c.num)}</p>
      <h2 class="h2">${esc(c.title)}</h2>
      <p class="body mt-2 measure-sm">${esc(c.lead)}</p>
      <p class="small mt-2" style="color:var(--stone-light)">${c.items.length} ${esc(t('cat.treatmentsCount'))}${docs.length ? ` &middot; ${docs.length} ${esc(t('cat.specialistsCount'))}` : ''}</p>
      <p class="mt-3"><span class="link-u">${esc(t('common.discoverArea'))} ${arrow}</span></p>
    </a>`;
  };

  const main = `
${pageHero({
    label: `01 — ${t('nav.treatments')}`,
    title: lines([t('home.treatments.t1'), `<em class="serif-italic">${t('home.treatments.t2')}</em>`]),
    lead: t('tr.indexLead'),
    aside: t('tr.indexAside'),
    crumbs: [{ label: t('nav.home'), path: '' }, { label: t('nav.treatments') }],
    base
  })}

<section class="section section--flush-top">
  <div class="wrap">
    <div class="areacards">${treatments.categories.map(areaCard).join('')}</div>
  </div>
</section>

<section class="section section--sm">
  <div class="wrap">
    ${sectionHead({
      label: t('tr.allLabel'),
      title: lines([t('tr.allT1'), `<em class="serif-italic">${t('tr.allT2')}</em>`]),
      aside: t('tr.allAside')
    })}
    <div class="article-list">
      ${treatments.items
        .map(
          (x) => `<a class="article-card reveal" href="${base}${treatmentPath(x)}">
        <div class="media media--ar media__zoom" style="--ar:4/3">${imgTag(x.image, { base, sizes: '(max-width:900px) 50vw, 28vw' })}</div>
        <p class="label mt-2" style="color:var(--stone-light)">${esc(byCategory[x.category].title)}</p>
        <h3 class="h3">${esc(x.title)}</h3>
        <p>${esc(x.short)}</p>
        <p class="mt-2"><span class="link-u">${esc(t('common.discover'))} ${arrow}</span></p>
      </a>`
        )
        .join('')}
    </div>
  </div>
</section>
${bookingBand(base)}`;

  return layout({
    title: t('meta.treatments.title'),
    description: t('meta.treatments.desc'),
    path: PATH.treatments,
    depth: 1,
    current: PATH.treatments,
    crumbs: [{ label: t('nav.home'), path: '' }, { label: t('nav.treatments'), path: PATH.treatments }],
    jsonLd: [
      dentistLd(),
      {
        '@type': 'ItemList',
        name: t('nav.treatments'),
        itemListElement: treatments.categories.map((c, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: c.title,
          url: `${site.url}/${getLang()}/${catPath(c)}`
        }))
      }
    ],
    main
  });
};

/* ========================================= /trattamenti/[slug] =========== */
export const treatmentPage = (tr) => {
  const base = '../../';
  const cat = byCategory[tr.category];
  const doc = byPerson[tr.doctor];
  const related = tr.related.map((s) => byTreatment[s]).filter(Boolean);
  const techs = (tr.tech || []).map((s) => byTech[s]).filter(Boolean);

  const main = `
${pageHero({
    label: `${cat.num} — ${cat.title}`,
    title: lines([esc(tr.title)]),
    lead: esc(tr.lead),
    aside: `Responsabile clinico<br><a class="link-inline" href="${base}${teamPath(doc)}">${esc(personName(doc))}</a>`,
    crumbs: [
      { label: t('nav.home'), path: '' },
      { label: t('nav.treatments'), path: PATH.treatments },
      { label: tr.title }
    ],
    base,
    media: tr.image,
    mediaAr: '21/9'
  })}

<section class="section">
  <div class="wrap">
    <div class="grid">
      <div class="col-7 prose">
        <div class="reveal">
          <h2 style="margin-top:0">${esc(t('tr.whatIs'))}</h2>
          ${tr.intro.map((p) => `<p>${esc(p)}</p>`).join('')}
        </div>
        <div class="reveal">
          <h2>${esc(t('tr.indicated'))}</h2>
          <ul>${tr.indicated.map((i) => `<li>${esc(i)}</li>`).join('')}</ul>
        </div>
        <div class="reveal">
          <h2>${esc(t('tr.howWorks'))}</h2>
          ${tr.how.map((p) => `<p>${esc(p)}</p>`).join('')}
        </div>
      </div>
      <aside class="col-4 start-8">
        <div class="sticky">
          <div class="sidebar-card reveal">
            <span class="label">${esc(t('common.summary'))}</span>
            <dl class="summary-list mt-3">
              ${tr.specs.map((s) => `<div><dt>${esc(s.label)}</dt><dd>${esc(s.value)}</dd></div>`).join('')}
            </dl>
            <p class="mt-4"><a class="btn btn--block btn--sm" href="${base}${PATH.book}">${esc(t('nav.book'))}</a></p>
          </div>
          <div class="sidebar-card reveal">
            <span class="label">${esc(t('common.leadDoctor'))}</span>
            <a class="row mt-3" href="${base}${teamPath(doc)}" style="gap:1rem;flex-wrap:nowrap">
              <span class="media media--duo" style="width:72px;height:90px;flex:none">${imgTag(doc.image, { base, sizes: '72px' })}</span>
              <span>
                <strong style="font-weight:500">${esc(personName(doc))}</strong>
                <span class="small" style="display:block;color:var(--stone)">${esc(doc.role)}</span>
                <span class="link-u" style="margin-top:.6rem">Profilo ${arrow}</span>
              </span>
            </a>
          </div>
          <div class="sidebar-card reveal">
            <span class="label">${esc(t('common.clinicalArea'))}</span>
            <p class="h4 mt-2"><a class="link-inline" href="${base}${catPath(cat)}">${esc(cat.title)}</a></p>
            <p class="small mt-2" style="color:var(--stone)">${esc(cat.lead)}</p>
          </div>
        </div>
      </aside>
    </div>
  </div>
</section>

<section class="section section--sm bg-sand">
  <div class="wrap">
    <div class="grid">
      <div class="col-4">
        <span class="label reveal">${esc(t('common.thePath'))}</span>
        <h2 class="h2 mt-2 reveal">${lines([t('tr.phasesT1'), `<em class="serif-italic">${t('tr.phasesT2')}</em>`])}</h2>
      </div>
      <div class="col-7 start-7">
        <ol class="phase-list">
          ${tr.phases.map((p) => `<li class="reveal"><div><h3>${esc(p.title)}</h3><p>${esc(p.text)}</p></div></li>`).join('')}
        </ol>
      </div>
    </div>
  </div>
</section>

${
  techs.length
    ? `<section class="section dark">
  <div class="wrap">
    ${sectionHead({
      label: t('common.technologyUsed'),
      title: lines([t('tr.toolsT1'), `<em class="serif-italic">${t('tr.toolsT2')}</em>`]),
      link: { href: PATH.technologies, label: t('common.allTechnologies') },
      base
    })}
    <div class="team-grid team-grid--3">
      ${techs
        .map(
          (x) => `<a class="person reveal" href="${base}${PATH.technologies}#${x.slug}">
        <div class="media media--ar media--duo media__zoom" style="--ar:3/4">
          ${imgTag(x.image, { base, sizes: '(max-width: 560px) 100vw, (max-width: 1000px) 50vw, 33vw' })}
          <div class="person__overlay"><p>${esc(x.text)}</p><span class="link-u">${esc(t('common.discoverTechnology'))} ${arrow}</span></div>
        </div>
        <div class="person__info"><h3 class="h4">${esc(x.title)}</h3><p class="person__role">${esc(x.kicker)}</p></div>
      </a>`
        )
        .join('')}
    </div>
  </div>
</section>`
    : ''
}

<section class="section">
  <div class="wrap">
    <div class="grid">
      <div class="col-4"><span class="label reveal">${esc(t('common.faqTitle'))}</span><h2 class="h2 mt-2 reveal">${lines([esc(tr.title) + '.'])}</h2>
        <p class="body mt-3 measure-sm reveal">${esc(t('page.faqAside'))}</p>
        <p class="mt-3 reveal"><a class="link-u" href="${base}${PATH.contact}">${esc(t('common.askQuestion'))} ${arrow}</a></p>
      </div>
      <div class="col-7 start-7">${faqList(tr.faq, 'tf')}</div>
    </div>
  </div>
</section>

<section class="section section--flush-top">
  <div class="wrap">
    ${sectionHead({ label: t('common.related'), title: lines([t('common.otherTreatments')]), link: { href: catPath(cat), label: `${t('cat.allArea')} ${cat.title.toLowerCase()}` }, base })}
    <div class="article-list">
      ${related
        .map(
          (r) => `<a class="article-card reveal" href="${base}${treatmentPath(r)}">
        <div class="media media--ar media__zoom" style="--ar:4/3">${imgTag(r.image, { base, sizes: '(max-width:900px) 50vw, 33vw' })}</div>
        <div class="article-card__meta"><span class="label label--accent">${esc(byCategory[r.category].title)}</span></div>
        <h3 class="h3">${esc(r.title)}</h3>
        <p>${esc(r.short)}</p>
      </a>`
        )
        .join('')}
    </div>
  </div>
</section>
${bookingBand(base)}`;

  return layout({
    title: metaTitle(tr.seo.title),
    description: tr.seo.description,
    path: treatmentPath(tr),
    depth: 2,
    current: PATH.treatments,
    preload: [tr.image],
    crumbs: [
      { label: t('nav.home'), path: '' },
      { label: t('nav.treatments'), path: PATH.treatments },
      { label: tr.title, path: treatmentPath(tr) }
    ],
    jsonLd: [
      {
        '@type': 'MedicalProcedure',
        name: tr.title,
        description: tr.lead,
        howPerformed: tr.how.join(' '),
        url: `${site.url}/${treatmentPath(t)}`,
        provider: { '@id': site.url + '/#studio' }
      },
      faqLd(tr.faq)
    ],
    main
  });
};

/* ==================================================== /casi-clinici ====== */
export const casesPage = () => {
  const base = '../';
  const main = `
${pageHero({
    label: t('common.results'),
    title: lines([t('nav.cases') + '.']),
    lead: t('cases.lead'),
    aside: t('cases.aside'),
    crumbs: [{ label: t('nav.home'), path: '' }, { label: t('nav.cases') }],
    base
  })}

<section class="section section--flush-top">
  <div class="wrap">
    <div class="row row--between mb-4">
      <div class="filters" data-filter-group="cases" role="group" aria-label="${attr(t('cases.filterAria'))}">
        ${cases.categories
          .map((c) => `<button class="filter" type="button" data-value="${attr(c.value)}" aria-pressed="${c.value === 'all'}">${esc(c.label)}</button>`)
          .join('')}
      </div>
      <p class="small" style="color:var(--stone-light)">${cases.items.length} ${esc(t('cases.count'))}</p>
    </div>

    <div class="case-grid">
      ${cases.items
        .map(
          (c) => `<article class="case reveal" data-filter-item="cases" data-cat="${attr(c.cat)}">
        <div class="ba" style="--pos:50%">
          ${imgTag(c.before, { base, sizes: '(max-width:760px) 100vw, 46vw', alt: `${c.title} — ${t('cases.beforeAlt')}` })}
          ${imgTag(c.after, { base, sizes: '(max-width:760px) 100vw, 46vw', alt: `${c.title} — ${t('cases.afterAlt')}`, className: 'ba__after' })}
          <span class="ba__tag ba__tag--l">${esc(t('cases.before'))}</span>
          <span class="ba__tag ba__tag--r">${esc(t('cases.after'))}</span>
          <div class="ba__handle" role="slider" tabindex="0" aria-label="${attr(t('cases.compare'))}" aria-valuemin="0" aria-valuemax="100" aria-valuenow="50"></div>
        </div>
        <div class="row row--between mt-2">
          <span class="label label--accent">${esc(cases.categories.find((x) => x.value === c.cat).label)}</span>
          <span class="label">${esc(c.duration)}</span>
        </div>
        <h2 class="h3 mt-1">${esc(c.title)}</h2>
        <p class="body mt-1 measure-sm">${esc(c.summary)}</p>
        <p class="small mt-2" style="color:var(--stone-light)">${esc(personName(byPerson[c.doctor]))}</p>
      </article>`
        )
        .join('')}
    </div>

    <p class="disclaimer mt-5 reveal">
      ${esc(t('cases.disclaimer'))}
      ${esc(cases.note)}
    </p>
  </div>
</section>
${bookingBand(base)}`;

  return layout({
    title: t('meta.cases.title'),
    description: t('meta.cases.desc'),
    path: PATH.cases,
    depth: 1,
    current: PATH.cases,
    crumbs: [{ label: t('nav.home'), path: '' }, { label: t('nav.cases'), path: PATH.cases }],
    main
  });
};

/* ======================================================== /journal ======= */
export const journalIndex = () => {
  const base = '../';
  const [f, ...rest] = journal;
  const main = `
${pageHero({
    label: `06 — ${t('journal.label')}`,
    title: lines([t('journal.label') + '.']),
    lead: t('journal.lead'),
    aside: `${journal.length} ${t('journal.count')}`,
    crumbs: [{ label: t('nav.home'), path: '' }, { label: t('journal.label') }],
    base
  })}
<section class="section section--flush-top">
  <div class="wrap">
    <a class="article-feature" href="${base}${articlePath(f)}">
      <div class="article-feature__media">${figure(f.image, { base, ar: '16/10', className: 'media__zoom', sizes: '(max-width:1000px) 100vw, 58vw' })}</div>
      <div class="article-feature__body">
        <div class="row"><span class="label label--accent">${esc(f.category)}</span><span class="label">${dateIt(f.date)}</span></div>
        <h2 class="h2 mt-2 reveal">${esc(f.title)}</h2>
        <p class="body mt-2 measure-sm">${esc(f.excerpt)}</p>
        <p class="small mt-2" style="color:var(--stone-light)">${esc(personName(byPerson[f.author]))} · ${f.reading} ${esc(t('common.minRead'))}</p>
        <p class="mt-3"><span class="link-u">${esc(t('common.readMore'))} ${arrow}</span></p>
      </div>
    </a>
    <div class="article-list mt-5">${rest.map((a) => articleCard(a, base)).join('')}</div>
  </div>
</section>
${bookingBand(base)}`;

  return layout({
    title: t('meta.journal.title'),
    description: t('meta.journal.desc'),
    path: PATH.journal,
    depth: 1,
    current: PATH.journal,
    crumbs: [{ label: t('nav.home'), path: '' }, { label: t('journal.label'), path: PATH.journal }],
    main
  });
};

const renderBlock = (b) => {
  if (b.t === 'p') return `<p>${esc(b.v)}</p>`;
  if (b.t === 'h2') return `<h2>${esc(b.v)}</h2>`;
  if (b.t === 'ul') return `<ul>${b.v.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>`;
  if (b.t === 'quote')
    return `<blockquote style="font-family:var(--font-display);font-size:1.5rem;line-height:1.35;border-left:1px solid var(--sage);padding-left:1.4rem;margin:2.4rem 0">&ldquo;${esc(b.v)}&rdquo;</blockquote>`;
  return '';
};

export const articlePage = (a) => {
  const base = '../../';
  const author = byPerson[a.author];
  const others = journal.filter((x) => x.slug !== a.slug).slice(0, 3);
  const plain = a.body.filter((b) => b.t === 'p').map((b) => b.v).join(' ');

  const main = `
${pageHero({
    label: a.category,
    title: lines([esc(a.title)]),
    lead: esc(a.excerpt),
    aside: `${dateIt(a.date)}<br>${a.reading} ${esc(t('common.minRead'))}`,
    crumbs: [{ label: t('nav.home'), path: '' }, { label: t('journal.label'), path: PATH.journal }, { label: a.title }],
    base,
    media: a.image,
    mediaAr: '21/9'
  })}

<section class="section">
  <div class="wrap">
    <div class="grid">
      <div class="col-7 start-2 prose reveal">
        ${a.body.map(renderBlock).join('\n        ')}
      </div>
      <aside class="col-3" style="grid-column:10 / span 3">
        <div class="sticky">
          <div class="sidebar-card">
            <span class="label">${esc(t('common.author'))}</span>
            <a class="row mt-3" href="${base}${teamPath(author)}" style="gap:1rem;flex-wrap:nowrap">
              <span class="media media--duo" style="width:64px;height:80px;flex:none">${imgTag(author.image, { base, sizes: '64px' })}</span>
              <span><strong style="font-weight:500">${esc(personName(author))}</strong><span class="small" style="display:block;color:var(--stone)">${esc(author.role)}</span></span>
            </a>
          </div>
          <div class="sidebar-card">
            <span class="label">${esc(t('journal.question'))}</span>
            <p class="small mt-2" style="color:var(--stone)">${esc(t('journal.questionText'))}</p>
            <p class="mt-3"><a class="btn btn--sm btn--block" href="${base}${PATH.book}">${esc(t('nav.book'))}</a></p>
          </div>
        </div>
      </aside>
    </div>
  </div>
</section>

<section class="section section--flush-top">
  <div class="wrap">
    ${sectionHead({ label: t('common.keepReading'), title: lines([t('common.otherArticles')]), link: { href: PATH.journal, label: t('common.goToJournal') }, base })}
    <div class="article-list">${others.map((x) => articleCard(x, base)).join('')}</div>
  </div>
</section>
${bookingBand(base)}`;

  return layout({
    title: metaTitle(a.title, 'Journal Studio Liddi'),
    description: a.excerpt,
    path: articlePath(a),
    depth: 2,
    current: PATH.journal,
    preload: [a.image],
    crumbs: [
      { label: t('nav.home'), path: '' },
      { label: t('journal.label'), path: PATH.journal },
      { label: a.title, path: articlePath(a) }
    ],
    jsonLd: [
      {
        '@type': 'Article',
        headline: a.title,
        description: a.excerpt,
        datePublished: a.date,
        dateModified: a.date,
        articleBody: plain.slice(0, 900),
        image: `${site.url}/images/${a.image}-1280.webp`,
        author: { '@type': 'Person', name: personName(author) },
        publisher: { '@id': site.url + '/#studio' },
        mainEntityOfPage: `${site.url}/journal/${a.slug}/`
      }
    ],
    main
  });
};

/* ========================================================== legali ======= */
export const legalPage = ({ slug, routeKey, title, description, intro, sections }) => {
  const base = '../';
  const main = `
${pageHero({
    label: t('legal.label'),
    title: lines([esc(title)]),
    lead: esc(intro),
    aside: t('legal.updated'),
    crumbs: [{ label: t('nav.home'), path: '' }, { label: title }],
    base
  })}
<section class="section section--flush-top">
  <div class="wrap">
    <div class="grid">
      <div class="col-7 start-2 prose reveal">
        ${sections.map((s) => `<h2>${esc(s.h)}</h2>${s.p.map((x) => `<p>${esc(x)}</p>`).join('')}`).join('')}
      </div>
    </div>
  </div>
</section>`;
  return layout({
    title: metaTitle(title),
    description,
    path: PATH[routeKey],
    depth: 1,
    crumbs: [{ label: t('nav.home'), path: '' }, { label: title, path: PATH[routeKey] }],
    main
  });
};

/* ============================================================= 404 ======= */
export const notFoundPage = () =>
  layout({
    title: `${t('404.title')} — ${site.name}`,
    description:
      'La pagina che stai cercando non esiste o è stata spostata. Torna alla home dello Studio Liddi, studio odontoiatrico a Milano, oppure prenota direttamente una visita.',
    path: '404.html',
    depth: 0,
    baseOverride: site.basePath + getLang() + '/',
    main: `
<section class="page-hero" data-header-over>
  <div class="wrap" style="min-height:52vh;display:flex;flex-direction:column;justify-content:center">
    <span class="label label--accent">Errore 404</span>
    <h1 class="display mt-2">${lines([t('404.t1'), `<em class="serif-italic">${t('404.t2')}</em>`])}</h1>
    <p class="lead mt-3 measure-sm">${esc(t('404.lead'))}</p>
    <div class="row mt-4"><a class="btn" href="${site.basePath}${getLang()}/">${esc(t('common.backHome'))}</a><a class="btn btn--ghost" href="${site.basePath}${getLang()}/${PATH.book}">${esc(t('nav.book'))}</a></div>
  </div>
</section>`
  });
