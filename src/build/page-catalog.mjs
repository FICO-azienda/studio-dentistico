import { site, treatments, cases, journal, team, esc, attr, arrow, imgTag, figure, lines, dateIt, personName, byTreatment, byPerson, byTech, metaTitle } from './utils.mjs';
import { layout, dentistLd } from './layout.mjs';
import { sectionHead, bookingBand, faqList, faqLd, pageHero, articleCard, personCard } from './components.mjs';

/* ==================================================== /trattamenti ======= */
export const treatmentsIndex = () => {
  const base = '../';
  const main = `
${pageHero({
    label: '01 — Trattamenti',
    title: lines(['Soluzioni personalizzate', '<em class="serif-italic">per ogni sorriso.</em>']),
    lead: 'Quattro aree cliniche, sedici trattamenti. Ogni percorso parte da una diagnosi completa e da un preventivo scritto, voce per voce.',
    aside: '16 trattamenti<br>4 aree cliniche',
    crumbs: [{ label: 'Home', path: '' }, { label: 'Trattamenti' }],
    base
  })}
<section class="section section--flush-top">
  <div class="wrap">
    ${treatments.categories
      .map(
        (c) => `<article class="treatment-row" id="${c.slug}">
      <div class="treatment-row__media">${figure(c.image, { base, ar: '4/3', className: 'media__zoom', sizes: '(max-width:1000px) 100vw, 48vw' })}</div>
      <div class="treatment-row__content reveal">
        <p class="treatment-row__num">${esc(c.num)}</p>
        <h2 class="h2">${esc(c.title)}</h2>
        <p class="body mt-2 measure-sm">${esc(c.lead)}</p>
        <ul class="treatment-row__list">
          ${c.items
            .map((s) => {
              const t = byTreatment[s];
              return `<li><a href="${base}trattamenti/${t.slug}/"><span>${esc(t.title)}</span><span class="small" style="color:var(--stone-light);flex:1;text-align:right;margin-right:1rem">${esc(t.short)}</span> ${arrow}</a></li>`;
            })
            .join('')}
        </ul>
      </div>
    </article>`
      )
      .join('')}
  </div>
</section>
${bookingBand(base)}`;

  return layout({
    title: 'Trattamenti — Studio Canova, dentista a Milano',
    description: 'Implantologia, ortodonzia invisibile, estetica dentale, endodonzia, parodontologia e prevenzione. Tutti i trattamenti dello Studio Canova a Milano.',
    path: 'trattamenti/',
    depth: 1,
    current: 'trattamenti/',
    crumbs: [{ label: 'Home', path: '' }, { label: 'Trattamenti', path: 'trattamenti/' }],
    main
  });
};

/* ============================================ /trattamenti/[slug] ======== */
export const treatmentPage = (t) => {
  const base = '../../';
  const cat = treatments.categories.find((c) => c.slug === t.category);
  const doc = byPerson[t.doctor];
  const related = t.related.map((s) => byTreatment[s]).filter(Boolean);
  const techs = (t.tech || []).map((s) => byTech[s]).filter(Boolean);

  const main = `
${pageHero({
    label: `${cat.num} — ${cat.title}`,
    title: lines([esc(t.title)]),
    lead: esc(t.lead),
    aside: `Responsabile clinico<br><a class="link-inline" href="${base}team/${doc.slug}/">${esc(personName(doc))}</a>`,
    crumbs: [{ label: 'Home', path: '' }, { label: 'Trattamenti', path: 'trattamenti/' }, { label: t.title }],
    base,
    media: t.image,
    mediaAr: '21/9'
  })}

<section class="section">
  <div class="wrap">
    <div class="grid">
      <div class="col-7 prose">
        <div class="reveal">
          <h2 style="margin-top:0">Che cos'è</h2>
          ${t.intro.map((p) => `<p>${esc(p)}</p>`).join('')}
        </div>
        <div class="reveal">
          <h2>Per chi è indicato</h2>
          <ul>${t.indicated.map((i) => `<li>${esc(i)}</li>`).join('')}</ul>
        </div>
        <div class="reveal">
          <h2>Come funziona</h2>
          ${t.how.map((p) => `<p>${esc(p)}</p>`).join('')}
        </div>
      </div>
      <aside class="col-4 start-8">
        <div class="sticky">
          <div class="sidebar-card reveal">
            <span class="label">In sintesi</span>
            <dl class="summary-list mt-3">
              ${t.specs.map((s) => `<div><dt>${esc(s.label)}</dt><dd>${esc(s.value)}</dd></div>`).join('')}
            </dl>
            <p class="mt-4"><a class="btn btn--block btn--sm" href="${base}prenota/">Prenota una visita</a></p>
          </div>
          <div class="sidebar-card reveal">
            <span class="label">Medico responsabile</span>
            <a class="row mt-3" href="${base}team/${doc.slug}/" style="gap:1rem;flex-wrap:nowrap">
              <span class="media media--duo" style="width:72px;height:90px;flex:none">${imgTag(doc.image, { base, sizes: '72px' })}</span>
              <span>
                <strong style="font-weight:500">${esc(personName(doc))}</strong>
                <span class="small" style="display:block;color:var(--stone)">${esc(doc.role)}</span>
                <span class="link-u" style="margin-top:.6rem">Profilo ${arrow}</span>
              </span>
            </a>
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
        <span class="label reveal">Il percorso</span>
        <h2 class="h2 mt-2 reveal">${lines(['Fasi del', '<em class="serif-italic">trattamento.</em>'])}</h2>
      </div>
      <div class="col-7 start-7">
        <ol class="phase-list">
          ${t.phases
            .map(
              (p) => `<li class="reveal"><div><h3>${esc(p.title)}</h3><p>${esc(p.text)}</p></div></li>`
            )
            .join('')}
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
      label: 'Tecnologia utilizzata',
      title: lines(['Gli strumenti', '<em class="serif-italic">di questo trattamento.</em>']),
      link: { href: 'tecnologie/', label: 'Tutte le tecnologie' },
      base
    })}
    <div class="tech-grid">
      ${techs
        .map(
          (x) => `<article class="tech-item reveal">
        <div class="tech-item__bg">${imgTag(x.image, { base, sizes: '33vw', alt: '' })}</div>
        <span class="num" style="color:var(--sage)">${esc(x.num)}</span>
        <div><h3 class="h3">${esc(x.title)}</h3><p class="mt-2">${esc(x.text)}</p></div>
      </article>`
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
      <div class="col-4"><span class="label reveal">Domande frequenti</span><h2 class="h2 mt-2 reveal">${lines([esc(t.title) + '.'])}</h2>
        <p class="body mt-3 measure-sm reveal">Hai una domanda diversa? Scrivici: rispondiamo entro un giorno lavorativo.</p>
        <p class="mt-3 reveal"><a class="link-u" href="${base}contatti/">Fai una domanda ${arrow}</a></p>
      </div>
      <div class="col-7 start-7">${faqList(t.faq, 'tf')}</div>
    </div>
  </div>
</section>

<section class="section section--flush-top">
  <div class="wrap">
    ${sectionHead({ label: 'Correlati', title: lines(['Altri trattamenti']), link: { href: 'trattamenti/', label: 'Tutti i trattamenti' }, base })}
    <div class="article-list">
      ${related
        .map(
          (r) => `<a class="article-card reveal" href="${base}trattamenti/${r.slug}/">
        <div class="media media--ar media__zoom" style="--ar:4/3">${imgTag(r.image, { base, sizes: '(max-width:900px) 50vw, 33vw' })}</div>
        <div class="article-card__meta"><span class="label label--accent">${esc(treatments.categories.find((c) => c.slug === r.category).title)}</span></div>
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
    title: metaTitle(t.seo.title),
    description: t.seo.description,
    path: `trattamenti/${t.slug}/`,
    depth: 2,
    current: 'trattamenti/',
    preload: [t.image],
    crumbs: [
      { label: 'Home', path: '' },
      { label: 'Trattamenti', path: 'trattamenti/' },
      { label: t.title, path: `trattamenti/${t.slug}/` }
    ],
    jsonLd: [
      {
        '@type': 'MedicalProcedure',
        name: t.title,
        description: t.lead,
        howPerformed: t.how.join(' '),
        url: `${site.url}/trattamenti/${t.slug}/`,
        provider: { '@id': site.url + '/#studio' }
      },
      faqLd(t.faq)
    ],
    main
  });
};

/* ==================================================== /casi-clinici ====== */
export const casesPage = () => {
  const base = '../';
  const main = `
${pageHero({
    label: 'Risultati',
    title: lines(['Casi clinici.']),
    lead: 'Una selezione di percorsi completati in studio. Per ciascuno indichiamo la durata effettiva del trattamento e il professionista responsabile.',
    aside: 'Trascina il cursore<br>per confrontare',
    crumbs: [{ label: 'Home', path: '' }, { label: 'Casi clinici' }],
    base
  })}

<section class="section section--flush-top">
  <div class="wrap">
    <div class="row row--between mb-4">
      <div class="filters" data-filter-group="cases" role="group" aria-label="Filtra per categoria">
        ${cases.categories
          .map((c) => `<button class="filter" type="button" data-value="${attr(c.value)}" aria-pressed="${c.value === 'all'}">${esc(c.label)}</button>`)
          .join('')}
      </div>
      <p class="small" style="color:var(--stone-light)">${cases.items.length} casi</p>
    </div>

    <div class="case-grid">
      ${cases.items
        .map(
          (c) => `<article class="case reveal" data-filter-item="cases" data-cat="${attr(c.cat)}">
        <div class="ba" style="--pos:50%">
          ${imgTag(c.before, { base, sizes: '(max-width:760px) 100vw, 46vw', alt: `${c.title} — prima del trattamento` })}
          ${imgTag(c.after, { base, sizes: '(max-width:760px) 100vw, 46vw', alt: `${c.title} — dopo il trattamento`, className: 'ba__after' })}
          <span class="ba__tag ba__tag--l">Prima</span>
          <span class="ba__tag ba__tag--r">Dopo</span>
          <div class="ba__handle" role="slider" tabindex="0" aria-label="Confronto prima e dopo" aria-valuemin="0" aria-valuemax="100" aria-valuenow="50"></div>
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
      Ogni caso clinico è individuale. I risultati possono variare da paziente a paziente e non costituiscono promessa di risultato.
      ${esc(cases.note)}
    </p>
  </div>
</section>
${bookingBand(base)}`;

  return layout({
    title: 'Casi clinici — Studio Canova, dentista a Milano',
    description: 'Casi clinici dello Studio Canova di Milano: estetica dentale, implantologia, ortodonzia e riabilitazioni, con durata del trattamento e medico responsabile.',
    path: 'casi-clinici/',
    depth: 1,
    current: 'casi-clinici/',
    crumbs: [{ label: 'Home', path: '' }, { label: 'Casi clinici', path: 'casi-clinici/' }],
    main
  });
};

/* ======================================================== /journal ======= */
export const journalIndex = () => {
  const base = '../';
  const [f, ...rest] = journal;
  const main = `
${pageHero({
    label: '06 — Journal',
    title: lines(['Journal.']),
    lead: 'Approfondimenti clinici scritti dai professionisti dello studio. Nessun gergo inutile, nessuna promessa fuori luogo.',
    aside: `${journal.length} articoli`,
    crumbs: [{ label: 'Home', path: '' }, { label: 'Journal' }],
    base
  })}
<section class="section section--flush-top">
  <div class="wrap">
    <a class="article-feature" href="${base}journal/${f.slug}/">
      <div class="article-feature__media">${figure(f.image, { base, ar: '16/10', className: 'media__zoom', sizes: '(max-width:1000px) 100vw, 58vw' })}</div>
      <div class="article-feature__body">
        <div class="row"><span class="label label--accent">${esc(f.category)}</span><span class="label">${dateIt(f.date)}</span></div>
        <h2 class="h2 mt-2 reveal">${esc(f.title)}</h2>
        <p class="body mt-2 measure-sm">${esc(f.excerpt)}</p>
        <p class="small mt-2" style="color:var(--stone-light)">${esc(personName(byPerson[f.author]))} · ${f.reading} min di lettura</p>
        <p class="mt-3"><span class="link-u">Leggi l'articolo ${arrow}</span></p>
      </div>
    </a>
    <div class="article-list mt-5">${rest.map((a) => articleCard(a, base)).join('')}</div>
  </div>
</section>
${bookingBand(base)}`;

  return layout({
    title: 'Journal — Studio Canova, dentista a Milano',
    description: 'Articoli di approfondimento su prevenzione, ortodonzia, implantologia ed estetica dentale, scritti dal team dello Studio Canova di Milano.',
    path: 'journal/',
    depth: 1,
    current: 'journal/',
    crumbs: [{ label: 'Home', path: '' }, { label: 'Journal', path: 'journal/' }],
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
    aside: `${dateIt(a.date)}<br>${a.reading} min di lettura`,
    crumbs: [{ label: 'Home', path: '' }, { label: 'Journal', path: 'journal/' }, { label: a.title }],
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
            <span class="label">Autore</span>
            <a class="row mt-3" href="${base}team/${author.slug}/" style="gap:1rem;flex-wrap:nowrap">
              <span class="media media--duo" style="width:64px;height:80px;flex:none">${imgTag(author.image, { base, sizes: '64px' })}</span>
              <span><strong style="font-weight:500">${esc(personName(author))}</strong><span class="small" style="display:block;color:var(--stone)">${esc(author.role)}</span></span>
            </a>
          </div>
          <div class="sidebar-card">
            <span class="label">Hai una domanda?</span>
            <p class="small mt-2" style="color:var(--stone)">Prenota una prima visita o scrivici: rispondiamo entro un giorno lavorativo.</p>
            <p class="mt-3"><a class="btn btn--sm btn--block" href="${base}prenota/">Prenota una visita</a></p>
          </div>
        </div>
      </aside>
    </div>
  </div>
</section>

<section class="section section--flush-top">
  <div class="wrap">
    ${sectionHead({ label: 'Continua a leggere', title: lines(['Altri articoli']), link: { href: 'journal/', label: 'Tutto il Journal' }, base })}
    <div class="article-list">${others.map((x) => articleCard(x, base)).join('')}</div>
  </div>
</section>
${bookingBand(base)}`;

  return layout({
    title: metaTitle(a.title, 'Journal Studio Canova'),
    description: a.excerpt,
    path: `journal/${a.slug}/`,
    depth: 2,
    current: 'journal/',
    preload: [a.image],
    crumbs: [
      { label: 'Home', path: '' },
      { label: 'Journal', path: 'journal/' },
      { label: a.title, path: `journal/${a.slug}/` }
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
export const legalPage = ({ slug, title, description, intro, sections }) => {
  const base = '../';
  const main = `
${pageHero({
    label: 'Informazioni legali',
    title: lines([esc(title)]),
    lead: esc(intro),
    aside: 'Ultimo aggiornamento<br>settembre 2026',
    crumbs: [{ label: 'Home', path: '' }, { label: title }],
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
    path: `${slug}/`,
    depth: 1,
    crumbs: [{ label: 'Home', path: '' }, { label: title, path: `${slug}/` }],
    main
  });
};

/* ============================================================= 404 ======= */
export const notFoundPage = () =>
  layout({
    title: 'Pagina non trovata — Studio Canova',
    description:
      'La pagina che stai cercando non esiste o è stata spostata. Torna alla home dello Studio Canova, studio odontoiatrico a Milano, oppure prenota direttamente una visita.',
    path: '404.html',
    depth: 0,
    main: `
<section class="page-hero" data-header-over>
  <div class="wrap" style="min-height:52vh;display:flex;flex-direction:column;justify-content:center">
    <span class="label label--accent">Errore 404</span>
    <h1 class="display mt-2">${lines(['Questa pagina', '<em class="serif-italic">non esiste.</em>'])}</h1>
    <p class="lead mt-3 measure-sm">Potrebbe essere stata spostata. Da qui puoi tornare alla home o prenotare direttamente una visita.</p>
    <div class="row mt-4"><a class="btn" href="/">Torna alla home</a><a class="btn btn--ghost" href="/prenota/">Prenota una visita</a></div>
  </div>
</section>`
  });
