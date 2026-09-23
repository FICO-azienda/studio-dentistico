import { site, team, technologies, faqs, treatments, orari, chiusure, esc, attr, arrow, imgTag, figure, lines, personName, byTreatment, byPerson, metaTitle, treatmentPath, PATH, teamPath } from './utils.mjs';
import { t, getLang } from './i18n.mjs';
import { clientConfig } from '../../api/_lib/flows.mjs';
import { layout, dentistLd } from './layout.mjs';
import { sectionHead, stats, personCard, bookingBand, faqList, faqLd, pageHero, testimonials } from './components.mjs';

/* ========================================================== /studio ====== */
export const studioPage = () => {
  const base = '../';
  const main = `
${pageHero({
    label: t('studio.label'),
    title: lines([t('home.studio.t1'), `<em class="serif-italic">${t('home.studio.t2')}</em>`]),
    lead: t('studio.lead'),
    aside: 'Via Antonio Canova 14<br>Milano',
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
        <p>Lo studio nasce nel 2004 dall'idea che l'odontoiatria di qualità non dipenda dai materiali ma dal metodo: una diagnosi completa, un progetto discusso e un'esecuzione verificata passaggio per passaggio.</p>
        <p>Vent'anni dopo, il principio è rimasto lo stesso. Quello che è cambiato è la tecnologia a disposizione, che oggi permette di pianificare al computer ciò che un tempo si decideva in poltrona.</p>
        <p>Non accettiamo più di due nuovi pazienti al giorno per professionista. È una scelta che limita i numeri e allunga le agende, ma è l'unico modo per dedicare a ciascuno il tempo che una diagnosi seria richiede.</p>
      </div>
    </div>
    <div class="grid mt-5">
      ${figure('studio-corridoio', { base, ar: '4/5', className: 'col-4 media__zoom', sizes: '32vw' })}
      ${figure('studio-attesa', { base, ar: '4/5', className: 'col-4 media__zoom', sizes: '32vw' })}
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
        ['Accoglienza', 'Sala d\'attesa separata dalle aree cliniche, con connessione e postazione di lavoro.'],
        ['Sale operative', 'Cinque riuniti identici per strumentazione e protocolli di sterilizzazione.'],
        ['Sala chirurgica', 'Ambiente dedicato agli interventi implantari, con monitoraggio e sedazione disponibile.'],
        ['Sterilizzazione', 'Ciclo tracciato per ogni strumento, con registro digitale consultabile.']
      ]
        .map(
          ([t, d], i) => `<div class="col-6 reveal" data-delay="${i % 2}">
        <div class="value-item"><span class="num value-item__num" style="color:var(--navy)">0${i + 1}</span><div><h3 class="h4">${esc(t)}</h3><p>${esc(d)}</p></div></div>
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
    <p class="disclaimer mt-5 reveal">${esc(t('team.note'))}</p>
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
        ${figure(p.image, { base, ar: '3/4', className: 'media--duo', sizes: '(max-width:1000px) 100vw, 40vw', eager: true })}
      </div>
      <div class="col-6 start-7">
        <span class="label label--accent reveal">${esc(p.role)}</span>
        <h1 class="h1 mt-2">${lines([esc(personName(p))])}</h1>
        <p class="lead mt-3 reveal" data-delay="1">${esc(p.short)}</p>
        <blockquote class="mt-4 reveal" data-delay="2" style="font-family:var(--font-display);font-size:1.4rem;line-height:1.35;border-left:1px solid var(--navy);padding-left:1.4rem">&ldquo;${esc(p.quote)}&rdquo;</blockquote>
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
        ${p.education.length ? `<h2>${esc(t('team.education'))}</h2><ul>${p.education.map((e) => `<li>${esc(e)}</li>`).join('')}</ul>` : ''}
        ${p.member ? `<h2>${esc(t('team.associations'))}</h2><p>${esc(p.member)}</p>` : ''}
      </div>
      <aside class="col-4 start-8">
        <div class="sticky">
          <div class="sidebar-card reveal">
            <span class="label">${esc(t('team.interests'))}</span>
            <ul class="mt-2 flow flow-sm">${p.focus.map((f) => `<li class="body">${esc(f)}</li>`).join('')}</ul>
          </div>
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
    description: `${personName(p)}, ${p.role} allo Studio Liddi di Milano. ${p.short}`,
    path: `team/${p.slug}/`,
    depth: 2,
    current: PATH.team,
    preload: [p.image],
    crumbs: [{ label: t('nav.home'), path: '' }, { label: t('nav.team'), path: PATH.team }, { label: p.name, path: `team/${p.slug}/` }],
    jsonLd: [
      {
        '@type': 'Person',
        name: personName(p),
        jobTitle: p.role,
        description: p.bio,
        image: `${site.url}/images/${p.image}-1280.webp`,
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
            ['Impiego', TECH_DETAIL[t.slug].use],
            ['Vantaggio', TECH_DETAIL[t.slug].gain]
          ]
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

const TECH_DETAIL = {
  'scanner-intraorale': { use: 'Protesi, ortodonzia, allineatori, impronte di precisione.', gain: 'Nessuna impronta tradizionale, archivio digitale confrontabile nel tempo.' },
  'radiologia-digitale': { use: 'Diagnosi di carie, parodontite, lesioni apicali e pianificazione implantare.', gain: 'Dose ridotta fino all\'80% e immagine disponibile in pochi secondi.' },
  'implantologia-guidata': { use: 'Inserimento di impianti singoli e riabilitazioni complete.', gain: 'Posizione progettata sulla protesi finale, non sull\'osso disponibile.' },
  microscopia: { use: 'Endodonzia, ritrattamenti, conservativa di precisione.', gain: 'Ingrandimenti fino a 25×: si vede ciò che a occhio nudo si intuisce soltanto.' },
  'digital-smile-design': { use: 'Faccette, estetica del sorriso, riabilitazioni anteriori.', gain: 'Il risultato viene approvato dal paziente prima di ogni preparazione.' },
  'stampa-3d': { use: 'Dime chirurgiche, modelli, provvisori, allineatori.', gain: 'Produzione interna: meno passaggi esterni e tempi di consegna più brevi.' }
};

/* ==================================================== /prima-visita ====== */
const VISIT_STEPS = [
  { t: 'Ascolto', d: 'Venti minuti di colloquio, prima di qualunque strumento. Ci racconti cosa ti preoccupa, cosa hai già fatto e cosa ti aspetti dal percorso.', n: '01' },
  { t: 'Diagnosi', d: 'Esame clinico completo di denti, gengive e tessuti molli, fotografie standardizzate, radiografie digitali e scansione intraorale quando indicata.', n: '02' },
  { t: 'Piano di trattamento', d: 'Ti presentiamo le alternative possibili con vantaggi, limiti e tempi di ciascuna, accompagnate da un preventivo scritto voce per voce.', n: '03' },
  { t: 'Percorso personalizzato', d: 'Concordiamo insieme sequenza, sedute e modalità di pagamento. Nessuna fase inizia senza la tua approvazione esplicita.', n: '04' }
];

export const firstVisitPage = () => {
  const base = '../';
  const localFaq = [
    { q: 'Quanto dura la prima visita?', a: faqs[0].a },
    { q: 'Cosa devo portare?', a: 'Documento d\'identità, tessera sanitaria, eventuali radiografie o documentazione di trattamenti precedenti e l\'elenco dei farmaci che assumi abitualmente.' },
    { q: 'La prima visita è gratuita?', a: 'La prima visita ha un costo di 80 euro, che comprende esame clinico, fotografie, radiografie necessarie e piano di trattamento scritto. L\'importo viene scalato dal preventivo se decidi di iniziare il percorso in studio.' },
    { q: 'Devo decidere subito?', a: 'No. Il piano di trattamento e il preventivo ti vengono consegnati per iscritto: puoi valutarli con calma, chiedere un secondo parere e tornare quando preferisci.' }
  ];
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
      ${VISIT_STEPS.map(
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
        ${figure('strumenti-set', { base, ar: '4/3', className: 'mt-4 media__zoom', sizes: '40vw' })}
      </div>
      <div class="col-6 start-7 prose reveal">
        <ul>
          <li>Documento d'identità e tessera sanitaria</li>
          <li>Radiografie o documentazione di trattamenti precedenti, anche vecchi</li>
          <li>Elenco dei farmaci che assumi abitualmente</li>
          <li>Eventuali referti medici rilevanti (cardiologici, terapie anticoagulanti, bifosfonati)</li>
          <li>Il nome del tuo medico curante, se stai seguendo terapie in corso</li>
        </ul>
        <h2>${esc(t('fv.after'))}</h2>
        <p>Il piano di trattamento ti viene consegnato per iscritto, con le alternative e un preventivo dettagliato. Non c'è alcuna richiesta di decidere in giornata: se vuoi confrontarti con un altro professionista, ti consegniamo anche la documentazione radiografica.</p>
        <p>Se il percorso prevede più fasi, ti indichiamo l'ordine di priorità clinica: cosa è urgente, cosa può attendere e cosa è facoltativo.</p>
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
    lead: 'Zona Fiera, a sei minuti a piedi dalla metropolitana. Rispondiamo al telefono negli orari di apertura e via email entro un giorno lavorativo.',
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
        <p class="mt-4"><a class="btn btn--ghost btn--sm" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(site.address.street + ', ' + site.address.city)}" target="_blank" rel="noopener">Apri in Google Maps ${arrow}</a></p>
      </div>

      <div class="col-6 start-7">
        <div class="map reveal">
          <iframe title="Mappa dello studio" loading="lazy" referrerpolicy="no-referrer-when-downgrade"
            src="https://www.openstreetmap.org/export/embed.html?bbox=9.158%2C45.474%2C9.179%2C45.484&amp;layer=mapnik&amp;marker=${site.address.lat}%2C${site.address.lng}"></iframe>
        </div>
        <h2 class="h3 mt-5 reveal">${esc(t('contact.request'))}</h2>
        <form class="mt-3" data-validate data-success="#contact-done" novalidate>
          <div class="form-grid">
            <label class="field"><span class="field__label label">${esc(t('form.name'))} *</span><input type="text" name="nome" required autocomplete="given-name"><span class="field__error">${esc(t('form.required'))}</span></label>
            <label class="field"><span class="field__label label">${esc(t('form.surname'))} *</span><input type="text" name="cognome" required autocomplete="family-name"><span class="field__error">${esc(t('form.required'))}</span></label>
            <label class="field"><span class="field__label label">${esc(t('form.email'))} *</span><input type="email" name="email" required autocomplete="email"><span class="field__error">${esc(t('form.invalidEmail'))}</span></label>
            <label class="field"><span class="field__label label">${esc(t('form.phone'))} *</span><input type="tel" name="telefono" required autocomplete="tel" pattern="[0-9 +\\(\\)\\.\\-]{6,}"><span class="field__error">${esc(t('form.invalidPhone'))}</span></label>
          </div>
          <label class="field mt-3"><span class="field__label label">Come possiamo aiutarti?</span><textarea name="messaggio" rows="4" placeholder="Descrivi brevemente la tua richiesta"></textarea></label>
          <label class="check mt-3">
            <input type="checkbox" name="privacy" required>
            <span class="check__box" aria-hidden="true"></span>
            <span>Ho letto l'<a class="link-inline" href="${base}${PATH.privacy}">informativa privacy</a> e acconsento al trattamento dei miei dati per essere ricontattato. *</span>
          </label>
          <div class="row mt-4"><button class="btn" type="submit">${esc(t('form.send'))}</button></div>
          <p class="small mt-2" style="color:var(--stone-light)">* Campi obbligatori. Non inserire dati relativi alla salute in questo modulo.</p>
        </form>
        <div class="form-success" id="contact-done" hidden>
          <h2 class="h2">Grazie.</h2>
          <p class="lead mt-2">Abbiamo ricevuto la tua richiesta: ti ricontattiamo entro un giorno lavorativo.</p>
          <p class="mt-3"><a class="btn btn--ghost" href="${base}">${esc(t('common.backHome'))}</a></p>
        </div>
      </div>
    </div>
  </div>
</section>
${bookingBand(base)}`;

  return layout({
    title: t('meta.contact.title'),
    description: 'Studio Liddi, Via Antonio Canova 14, Milano. Telefono, WhatsApp, email, orari di apertura e indicazioni per raggiungerci.',
    path: PATH.contact,
    depth: 1,
    current: PATH.contact,
    crumbs: [{ label: t('nav.home'), path: '' }, { label: t('nav.contact'), path: PATH.contact }],
    main
  });
};

/* ======================================================== /prenota ======= */
// i valori coincidono con VISIT_TYPES in api/_lib/validate.mjs
const VISIT_TYPES = [
  { v: 'prima-visita', l: 'Prima visita', d: 'Esame completo, radiografie e piano di trattamento. 45 minuti.' },
  { v: 'igiene', l: 'Igiene dentale', d: 'Seduta di igiene professionale e istruzioni personalizzate.' },
  { v: 'controllo', l: 'Controllo', d: 'Controllo periodico di denti, gengive e restauri esistenti.' },
  { v: 'ortodonzia', l: 'Ortodonzia', d: 'Allineatori o apparecchio: valutazione e simulazione digitale.' },
  { v: 'implantologia', l: 'Implantologia', d: 'Valutazione per impianti e riabilitazioni su impianti.' },
  { v: 'estetica', l: 'Estetica dentale', d: 'Sbiancamento, faccette, progetto del sorriso.' },
  { v: 'urgenza', l: 'Urgenza', d: 'Dolore, trauma o problema improvviso: ti richiamiamo entro poche ore.' },
  { v: 'altro', l: 'Altro', d: 'Descrivi la tua necessita\' nelle note: ti richiamiamo noi.' }
];

export const bookingPage = () => {
  const base = '../';
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
        <div data-wizard data-endpoint="${attr(site.booking?.endpoint || '')}" data-mode="${attr(site.booking?.mode || 'demo')}">
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
                <button class="btn" type="submit" data-submit>${esc(t('form.send'))}</button>
              </div>
              <p class="small mt-2" style="color:var(--stone-light)">
                ${esc(t('form.noDiagnosis'))}
              </p>
            </form>

            <div class="form-success" id="booking-done" hidden tabindex="-1">
              <h2 class="h2">${esc(t('book.received'))}</h2>
              <p class="lead mt-2 measure-sm" style="margin-inline:auto" data-done-lead></p>
              <p class="body mt-2 measure-sm" style="margin-inline:auto" data-done-note></p>
              <p class="mt-4"><span class="label">${esc(t('book.code'))}</span><br>
                <span class="h3" style="font-family:var(--font-sans);letter-spacing:.04em" data-done-code></span>
              </p>
              <div class="row mt-4" style="justify-content:center">
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
            <p class="small mt-2" style="color:var(--stone)">${site.hours.slice(0, 2).map((h) => `${esc(h.d)} ${esc(h.h)}`).join('<br>')}</p>
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
<script type="application/json" data-slots>${JSON.stringify({ orari, chiusure, dottori: [t('book.noPreference'), ...docs.map((p) => personName(p))] })}</script>`;

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

<script type="application/json" data-manage-slots>${JSON.stringify({ orari, chiusure })}</script>`;

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
