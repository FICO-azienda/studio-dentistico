import { site, treatments, technologies, team, cases, esc, attr, arrow, imgTag, figure, lines, catPath, treatmentPath } from './utils.mjs';
import { layout, dentistLd } from './layout.mjs';
import { sectionHead, personCard, bookingBand, testimonials, journalPreview } from './components.mjs';

const base = '';

const QUICK = [
  { label: 'Trattamenti', href: 'trattamenti/', key: 'cat-generale', meta: '16 trattamenti' },
  { label: 'Lo studio', href: 'studio/', key: 'studio-interno', meta: 'Milano, zona Fiera' },
  { label: 'Il team', href: 'team/', key: 'trattamento-equipe', meta: '12 professionisti' },
  { label: 'Casi clinici', href: 'casi-clinici/', key: 'sorriso-01', meta: 'Risultati' },
  { label: 'Prenota', href: 'prenota/', key: 'studio-reception', meta: 'Online, 2 minuti' }
];

const hero = () => `
<section class="hero" data-header-over>
  <div class="wrap">
    <div class="hero__grid">
      <div class="hero__title">
        <h1 class="display">${lines(['Odontoiatria', 'contemporanea.', '<em class="serif-italic">Cura, precisione,</em>', '<em class="serif-italic">persone.</em>'])}</h1>
      </div>
      <div class="hero__meta reveal" data-delay="3">
        <div class="hero__meta-item">
          <span class="label">Studio</span>
          <span>${esc(site.address.city)}, Italia</span>
        </div>
        <div class="hero__meta-item">
          <span class="label">Orari</span>
          <span>Lun — Ven<br>08:30 — 19:30</span>
        </div>
        <div class="hero__meta-item">
          <span class="label">Telefono</span>
          <span><a class="link-inline" href="tel:${attr(site.phoneHref)}">${esc(site.phone)}</a></span>
        </div>
      </div>
      <div class="hero__body reveal" data-delay="2">
        <p class="lead">Tecnologia avanzata, esperienza clinica e attenzione alla persona in ogni fase del trattamento.</p>
        <div class="hero__cta">
          <a class="btn" href="prenota/">Prenota una visita</a>
          <a class="btn btn--ghost" href="studio/">Scopri lo studio</a>
        </div>
      </div>
      <div class="hero__media img-mask">
        ${imgTag('hero-studio', { base, sizes: '(max-width: 1080px) 100vw, 58vw', eager: true, className: 'parallax', })}
        <div class="hero__badge">
          <span class="hero__dot"></span>
          <span class="small">Prima visita disponibile<br>questa settimana</span>
        </div>
      </div>
    </div>
  </div>
</section>`;

const quicknav = () => `
<section class="section section--sm">
  <div class="wrap">
    <nav class="quicknav" data-quicknav aria-label="Navigazione rapida">
      ${QUICK.map(
        (q, i) => `<a class="quicknav__item" href="${q.href}" data-preview="${q.key}">
        <span class="num" style="color:var(--stone-light)">0${i + 1}</span>
        <span class="h3">${esc(q.label)}</span>
        <span class="row"><span class="label">${esc(q.meta)}</span> ${arrow}</span>
      </a>`
      ).join('')}
    </nav>
  </div>
  <div class="quicknav__preview" aria-hidden="true">
    ${QUICK.map((q) => imgTag(q.key, { base, sizes: '300px', className: '', alt: '' }).replace('<img ', `<img data-key="${q.key}" `)).join('')}
  </div>
</section>`;

const treatmentsSection = () => `
<section class="section" id="trattamenti">
  <div class="wrap">
    ${sectionHead({
      num: '01',
      label: 'Trattamenti',
      title: lines(['Soluzioni personalizzate', '<em class="serif-italic">per ogni sorriso.</em>']),
      aside: 'Quattro aree cliniche, sedici trattamenti. Ogni area ha la sua pagina, con fasi, tempi e specialisti.',
      link: { href: 'trattamenti/', label: 'Tutte le aree' },
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
          <p class="mt-3"><span class="link-u">Scopri ${arrow}</span></p>
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
      label: 'Lo Studio',
      title: lines(['Competenza clinica.', '<em class="serif-italic">Attenzione umana.</em>']),
      aside: 'Trecentoquaranta metri quadrati in zona Fiera, dodici professionisti e un modo di lavorare che mette la diagnosi prima del preventivo.',
      link: { href: 'studio/', label: 'Scopri lo studio' },
      base
    })}
    <div class="grid">
      <div class="col-7">
        ${figure('studio-interno', { base, ar: '16/10', className: 'media__zoom', sizes: '(max-width: 1000px) 100vw, 58vw' })}
      </div>
      <div class="col-4 start-9" style="grid-column:9 / span 4">
        <p class="lead reveal">Crediamo che la qualità di una cura si misuri su un arco di anni, non di sedute. Per questo investiamo tempo nella diagnosi, spieghiamo le alternative e costruiamo percorsi che possano durare.</p>
        <p class="mt-4 reveal" data-delay="1"><a class="btn btn--ghost" href="studio/">Scopri lo studio</a></p>
      </div>
    </div>
  </div>
</section>`;

const techSection = () => `
<section class="section dark" id="tecnologie">
  <div class="wrap">
    ${sectionHead({
      num: '03',
      label: 'Tecnologia',
      title: lines(['La tecnologia al servizio', '<em class="serif-italic">della precisione.</em>']),
      aside: 'Strumenti scelti per ridurre invasività, tempi e numero di sedute. Non per fare scena.',
      link: { href: 'tecnologie/', label: 'Scopri le tecnologie' },
      base
    })}
    <div class="team-grid team-grid--3">
      ${technologies
        .slice(0, 3)
        .map(
          (t) => `<a class="person reveal" href="tecnologie/#${t.slug}">
        <div class="media media--ar media--duo media__zoom" style="--ar:3/4">
          ${imgTag(t.image, { base, sizes: '(max-width: 560px) 100vw, (max-width: 1000px) 50vw, 33vw' })}
          <div class="person__overlay">
            <p>${esc(t.text)}</p>
            <span class="link-u">Scopri la tecnologia ${arrow}</span>
          </div>
        </div>
        <div class="person__info">
          <div class="row row--between" style="gap:1rem">
            <h3 class="h4">${esc(t.title)}</h3>
            <span class="num" style="color:var(--navy-soft)">${esc(t.num)}</span>
          </div>
          <p class="person__role">${esc(t.kicker)}</p>
        </div>
      </a>`
        )
        .join('')}
    </div>
    <p class="mt-4 reveal"><a class="btn btn--outline-light" href="tecnologie/">Scopri le tecnologie</a></p>
  </div>
</section>`;

const teamSection = () => `
<section class="section" id="team">
  <div class="wrap">
    ${sectionHead({
      num: '04',
      label: 'Il Team',
      title: lines(['Persone, prima ancora', '<em class="serif-italic">che professionisti.</em>']),
      aside: 'Dodici professionisti, un unico protocollo condiviso e riunioni cliniche settimanali sui casi complessi.',
      link: { href: 'team/', label: 'Conosci tutto il team' },
      base
    })}
    <div class="team-grid">
      ${team.filter((p) => p.featured).map((p) => personCard(p, base)).join('')}
    </div>
  </div>
</section>`;

const STEPS = [
  { t: 'Ascolto', d: 'Venti minuti di colloquio prima di qualsiasi strumento. Cosa ti preoccupa, cosa hai già provato, cosa ti aspetti.' },
  { t: 'Diagnosi', d: 'Esame clinico completo, fotografie, radiografie digitali e scansione intraorale quando serve.' },
  { t: 'Piano di trattamento', d: 'Le alternative possibili, con vantaggi e limiti di ciascuna, e un preventivo scritto voce per voce.' },
  { t: 'Percorso personalizzato', d: 'Tempi, sedute e modalità di pagamento concordati insieme. Nessun passaggio parte senza la tua approvazione.' }
];

const firstVisit = () => `
<section class="section dark" id="prima-visita">
  <div class="wrap">
    ${sectionHead({
      num: '05',
      label: 'Prima visita',
      title: lines(['La prima visita.']),
      aside: '45 minuti, un percorso in quattro passaggi. Al termine sai qual è la situazione, quali sono le opzioni e quanto costa ciascuna.',
      link: { href: 'prima-visita/', label: 'Come funziona' },
      base
    })}
    <div class="steps">
      ${STEPS.map(
        (s, i) => `<article class="step">
        <span class="step__num">0${i + 1}</span>
        <h3 class="h4">${esc(s.t)}</h3>
      </article>`
      ).join('')}
    </div>
    <div class="row mt-5 reveal">
      <a class="btn" href="prenota/">Prenota la tua prima visita</a>
      <a class="link-u" href="prima-visita/">Cosa portare con te ${arrow}</a>
    </div>
  </div>
</section>`;

const casesPreview = () => `
<section class="section" id="casi">
  <div class="wrap">
    ${sectionHead({
      label: 'Risultati',
      title: lines(['Casi clinici.']),
      aside: 'Una selezione di percorsi completati in studio, con tempi e responsabile clinico.',
      link: { href: 'casi-clinici/', label: 'Tutti i casi' },
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
      label: 'Contatti',
      title: lines(['Vieni a trovarci.']),
      aside: 'Zona Fiera, a sei minuti dalla metropolitana. Parcheggio riservato ai pazienti nel cortile interno.',
      link: { href: 'contatti/', label: 'Mappa e indicazioni' },
      base
    })}
    <div class="grid">
      <div class="col-6">
        <div class="info-list">
          <div class="info-list__row"><span class="label">Indirizzo</span><span>${esc(site.address.street)}, ${esc(site.address.zip)} ${esc(site.address.city)}</span></div>
          <div class="info-list__row"><span class="label">Telefono</span><span><a class="link-inline" href="tel:${attr(site.phoneHref)}">${esc(site.phone)}</a></span></div>
          <div class="info-list__row"><span class="label">WhatsApp</span><span><a class="link-inline" href="https://wa.me/${attr(site.whatsappHref)}" target="_blank" rel="noopener">${esc(site.whatsapp)}</a></span></div>
          <div class="info-list__row"><span class="label">Email</span><span><a class="link-inline" href="mailto:${attr(site.email)}">${esc(site.email)}</a></span></div>
          <div class="info-list__row"><span class="label">Orari</span><span>${site.hours.map((h) => `${esc(h.d)} · ${esc(h.h)}`).join('<br>')}</span></div>
        </div>
      </div>
      <div class="col-5 start-8" style="grid-column:8 / span 5">
        ${figure('studio-reception', { base, ar: '4/3', className: 'media__zoom', sizes: '(max-width: 1000px) 100vw, 40vw' })}
        <div class="row mt-4">
          <a class="btn" href="prenota/">Prenota una visita</a>
          <a class="btn btn--ghost" href="contatti/">Tutti i contatti</a>
        </div>
      </div>
    </div>
  </div>
</section>`;

export const homePage = () =>
  layout({
    title: 'Studio Canova — Dentista a Milano | Odontoiatria contemporanea',
    description:
      'Studio dentistico a Milano zona Fiera: implantologia, ortodonzia invisibile, estetica dentale e prevenzione. Prima visita con piano di trattamento e preventivo scritto.',
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
