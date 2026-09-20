import { site, treatments, technologies, team, cases, faqs, esc, attr, arrow, imgTag, figure, lines, byTreatment } from './utils.mjs';
import { layout, dentistLd } from './layout.mjs';
import { sectionHead, stats, personCard, bookingBand, testimonials, journalPreview, faqSection, faqList, faqLd } from './components.mjs';

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
      aside: 'Quattro aree cliniche, sedici trattamenti. Ogni percorso parte da una diagnosi e da un preventivo scritto.',
      link: { href: 'trattamenti/', label: 'Tutti i trattamenti' },
      base
    })}
  </div>
  <div class="wrap">
    ${treatments.categories
      .map(
        (c) => `<article class="treatment-row">
      <div class="treatment-row__media">
        ${figure(c.image, { base, ar: '4/3', className: 'media__zoom', sizes: '(max-width: 1000px) 100vw, 48vw' })}
      </div>
      <div class="treatment-row__content reveal">
        <p class="treatment-row__num">${esc(c.num)}</p>
        <h3 class="h2">${esc(c.title)}</h3>
        <p class="body mt-2 measure-sm">${esc(c.lead)}</p>
        <ul class="treatment-row__list">
          ${c.items
            .map((s) => {
              const t = byTreatment[s];
              return `<li><a href="trattamenti/${t.slug}/"><span>${esc(t.title)}</span> ${arrow}</a></li>`;
            })
            .join('')}
        </ul>
        <p class="mt-3"><a class="link-u" href="trattamenti/#${c.slug}">Scopri ${esc(c.title.toLowerCase())} ${arrow}</a></p>
      </div>
    </article>`
      )
      .join('')}
  </div>
</section>`;

const featuredRail = () => {
  const items = treatments.items.filter((t) => t.featured);
  return `
<section class="section section--sm dark">
  <div class="wrap">
    <div class="row row--between mb-4">
      <div>
        <span class="label reveal">In evidenza</span>
        <h2 class="h3 mt-1 reveal">Trattamenti più richiesti</h2>
      </div>
      <div class="rail__nav">
        <button class="rail__btn" type="button" data-rail="prev" aria-label="Precedente">&#8592;</button>
        <button class="rail__btn" type="button" data-rail="next" aria-label="Successivo">&#8594;</button>
      </div>
    </div>
  </div>
  <div class="rail">
    <div class="rail__track">
      ${items
        .map(
          (t) => `<a class="card-feature reveal" href="trattamenti/${t.slug}/">
        <div class="media media--ar media__zoom" style="--ar:3/4">${imgTag(t.image, { base, sizes: '(max-width: 700px) 70vw, 26vw' })}</div>
        <div class="card-feature__head"><h3 class="h4">${esc(t.title)}</h3>${arrow}</div>
        <p>${esc(t.short)}</p>
      </a>`
        )
        .join('')}
      <a class="card-feature reveal" href="prima-visita/">
        <div class="media media--ar media__zoom" style="--ar:3/4">${imgTag('trattamento-visita', { base, sizes: '(max-width: 700px) 70vw, 26vw' })}</div>
        <div class="card-feature__head"><h3 class="h4">Prima visita</h3>${arrow}</div>
        <p>45 minuti per capire la situazione e ricevere un piano di trattamento.</p>
      </a>
    </div>
  </div>
</section>`;
};

const studioSection = () => `
<section class="section" id="studio">
  <div class="wrap">
    ${sectionHead({
      num: '02',
      label: 'Lo Studio',
      title: lines(['Competenza clinica.', '<em class="serif-italic">Attenzione umana.</em>']),
      aside: 'Nato a Milano nel 2004, lo studio riunisce dodici professionisti attorno a un unico protocollo di lavoro.',
      link: { href: 'studio/', label: 'Scopri lo studio' },
      base
    })}
    <div class="compose">
      <div class="compose__lead">
        ${figure('studio-interno', { base, ar: '4/5', sizes: '(max-width: 1000px) 100vw, 40vw', className: 'media__zoom' })}
        <p class="small mt-2" style="color:var(--stone-light)">Via Antonio Canova 14, Milano</p>
      </div>
      <div class="compose__stack">
        <div class="reveal">
          <p class="lead">Crediamo che la qualità di una cura si misuri su un arco di anni, non di sedute. Per questo investiamo tempo nella diagnosi, spieghiamo le alternative e costruiamo percorsi che possano durare.</p>
          <p class="body mt-3">Lo studio occupa 340 metri quadrati in zona Fiera: cinque sale operative, una sala chirurgica dedicata, radiologia interna e laboratorio odontotecnico. Ogni ambiente è pensato per ridurre l'attesa, il rumore e la percezione clinica.</p>
        </div>
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
        <div class="grid" style="grid-template-columns:repeat(2,1fr)">
          ${figure('studio-scala', { base, ar: '3/4', sizes: '30vw', className: 'media__zoom' })}
          ${figure('studio-attesa', { base, ar: '3/4', sizes: '30vw', className: 'media__zoom' })}
        </div>
      </div>
    </div>
    <div class="mt-5">${stats()}</div>
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
      link: { href: 'tecnologie/', label: 'Tutte le tecnologie' },
      base
    })}
    <div class="team-grid team-grid--3">
      ${technologies
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
      aside: '45 minuti, un percorso in quattro passaggi. Al termine sai esattamente qual è la situazione e quali sono le opzioni.',
      link: { href: 'prima-visita/', label: 'Come funziona' },
      base
    })}
    <div class="steps">
      ${STEPS.map(
        (s, i) => `<article class="step">
        <span class="step__num">0${i + 1}</span>
        <h3 class="h4">${esc(s.t)}</h3>
        <p>${esc(s.d)}</p>
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
      link: { href: 'contatti/', label: 'Tutti i contatti' },
      base
    })}
    <div class="grid">
      <div class="col-5">
        <div class="info-list">
          <div class="info-list__row"><span class="label">Indirizzo</span><span>${esc(site.address.street)}<br>${esc(site.address.zip)} ${esc(site.address.city)}</span></div>
          <div class="info-list__row"><span class="label">Telefono</span><span><a class="link-inline" href="tel:${attr(site.phoneHref)}">${esc(site.phone)}</a></span></div>
          <div class="info-list__row"><span class="label">WhatsApp</span><span><a class="link-inline" href="https://wa.me/${attr(site.whatsappHref)}" target="_blank" rel="noopener">${esc(site.whatsapp)}</a></span></div>
          <div class="info-list__row"><span class="label">Email</span><span><a class="link-inline" href="mailto:${attr(site.email)}">${esc(site.email)}</a></span></div>
          ${site.hours.map((h) => `<div class="info-list__row"><span class="label">${esc(h.d)}</span><span>${esc(h.h)}</span></div>`).join('')}
        </div>
        <div class="row mt-4">
          <a class="btn btn--ghost btn--sm" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(site.address.street + ', ' + site.address.city)}" target="_blank" rel="noopener">Apri in Google Maps ${arrow}</a>
        </div>
      </div>
      <div class="col-6 start-7">
        <div class="map reveal">
          <iframe title="Mappa dello studio" loading="lazy" referrerpolicy="no-referrer-when-downgrade"
            src="https://www.openstreetmap.org/export/embed.html?bbox=9.158%2C45.474%2C9.179%2C45.484&amp;layer=mapnik&amp;marker=${site.address.lat}%2C${site.address.lng}"></iframe>
        </div>
        <div class="grid mt-3" style="grid-template-columns:repeat(3,1fr);gap:1.5rem">
          ${site.directions.map((d) => `<div><span class="label">${esc(d.label)}</span><p class="small mt-1" style="color:var(--stone)">${esc(d.value)}</p></div>`).join('')}
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
    jsonLd: [dentistLd(), faqLd(faqs.slice(0, 6))],
    main: [
      hero(),
      quicknav(),
      treatmentsSection(),
      featuredRail(),
      studioSection(),
      techSection(),
      teamSection(),
      firstVisit(),
      casesPreview(),
      testimonials(base),
      bookingBand(base),
      journalPreview(base),
      faqSection(base),
      contactSection()
    ].join('\n')
  });
