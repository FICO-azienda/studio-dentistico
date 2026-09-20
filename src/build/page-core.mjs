import { site, team, technologies, faqs, treatments, esc, attr, arrow, imgTag, figure, lines, personName, byTreatment, byPerson, metaTitle, treatmentPath } from './utils.mjs';
import { layout, dentistLd } from './layout.mjs';
import { sectionHead, stats, personCard, bookingBand, faqList, faqLd, pageHero, testimonials } from './components.mjs';

/* ========================================================== /studio ====== */
export const studioPage = () => {
  const base = '../';
  const main = `
${pageHero({
    label: '02 — Lo Studio',
    title: lines(['Competenza clinica.', '<em class="serif-italic">Attenzione umana.</em>']),
    lead: 'Trecentoquaranta metri quadrati in zona Fiera, dodici professionisti e un modo di lavorare che mette la diagnosi prima del preventivo.',
    aside: 'Via Antonio Canova 14<br>Milano',
    crumbs: [{ label: 'Home', path: '' }, { label: 'Lo studio' }],
    base,
    media: 'studio-interno',
    mediaAr: '21/9'
  })}

<section class="section">
  <div class="wrap">
    <div class="grid">
      <div class="col-5">
        <span class="label reveal">La filosofia</span>
        <h2 class="h2 mt-2 reveal">${lines(['Il tempo', '<em class="serif-italic">è parte della cura.</em>'])}</h2>
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
        <span class="label reveal">I valori</span>
        <h2 class="h2 mt-2 reveal">${lines(['Quattro principi', '<em class="serif-italic">non negoziabili.</em>'])}</h2>
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
      label: 'Gli spazi',
      title: lines(['Cinque sale operative,', '<em class="serif-italic">una sala chirurgica.</em>']),
      aside: 'Radiologia e laboratorio odontotecnico interni: meno passaggi esterni, tempi di consegna più brevi.',
      link: { href: 'tecnologie/', label: 'Le tecnologie' },
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
        <div class="value-item"><span class="num value-item__num" style="color:var(--sage)">0${i + 1}</span><div><h3 class="h4">${esc(t)}</h3><p>${esc(d)}</p></div></div>
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
      label: 'Il team',
      title: lines(['Chi troverai', '<em class="serif-italic">in studio.</em>']),
      link: { href: 'team/', label: 'Tutto il team' },
      base
    })}
    <div class="team-grid">${team.filter((p) => p.featured).map((p) => personCard(p, base)).join('')}</div>
  </div>
</section>

${bookingBand(base)}`;

  return layout({
    title: 'Lo studio — Studio Canova, dentista a Milano',
    description: 'Studio odontoiatrico a Milano zona Fiera: 340 mq, cinque sale operative, radiologia e laboratorio interni. Dodici professionisti e un protocollo condiviso.',
    path: 'studio/',
    depth: 1,
    current: 'studio/',
    preload: ['studio-interno'],
    crumbs: [{ label: 'Home', path: '' }, { label: 'Lo studio', path: 'studio/' }],
    main
  });
};

/* =========================================================== /team ======= */
export const teamPage = () => {
  const base = '../';
  const main = `
${pageHero({
    label: '04 — Il Team',
    title: lines(['Persone, prima ancora', '<em class="serif-italic">che professionisti.</em>']),
    lead: 'Dodici professionisti che condividono protocolli, riunioni cliniche settimanali e un criterio: la soluzione più conservativa fra quelle efficaci.',
    aside: 'Riunione clinica<br>ogni martedì',
    crumbs: [{ label: 'Home', path: '' }, { label: 'Team' }],
    base
  })}
<section class="section section--flush-top">
  <div class="wrap">
    <div class="team-grid">${team.map((p) => personCard(p, base)).join('')}</div>
    <p class="disclaimer mt-5 reveal">Lo studio collabora inoltre con igienisti dentali, assistenti di poltrona e odontotecnici del laboratorio interno.</p>
  </div>
</section>
${bookingBand(base)}`;

  return layout({
    title: 'Il team — Studio Canova, dentista a Milano',
    description: 'I professionisti dello Studio Canova a Milano: implantologia, ortodonzia, endodonzia, estetica dentale, parodontologia e odontoiatria pediatrica.',
    path: 'team/',
    depth: 1,
    current: 'team/',
    crumbs: [{ label: 'Home', path: '' }, { label: 'Team', path: 'team/' }],
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
    <nav class="breadcrumb" aria-label="Percorso">
      <a href="${base}">Home</a><span aria-hidden="true">/</span>
      <a href="${base}team/">Team</a><span aria-hidden="true">/</span>
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
        <blockquote class="mt-4 reveal" data-delay="2" style="font-family:var(--font-display);font-size:1.4rem;line-height:1.35;border-left:1px solid var(--sage);padding-left:1.4rem">&ldquo;${esc(p.quote)}&rdquo;</blockquote>
        <div class="row mt-4 reveal" data-delay="3">
          <a class="btn" href="${base}prenota/">Prenota con ${esc(p.title || '')} ${esc(p.name.split(' ')[0])}</a>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <div class="grid">
      <div class="col-7 prose reveal">
        <h2>Profilo</h2>
        <p>${esc(p.bio)}</p>
        ${p.education.length ? `<h2>Formazione</h2><ul>${p.education.map((e) => `<li>${esc(e)}</li>`).join('')}</ul>` : ''}
        ${p.member ? `<h2>Associazioni</h2><p>${esc(p.member)}</p>` : ''}
      </div>
      <aside class="col-4 start-8">
        <div class="sticky">
          <div class="sidebar-card reveal">
            <span class="label">Aree di interesse</span>
            <ul class="mt-2 flow flow-sm">${p.focus.map((f) => `<li class="body">${esc(f)}</li>`).join('')}</ul>
          </div>
          ${
            trats.length
              ? `<div class="sidebar-card reveal">
            <span class="label">Trattamenti</span>
            <ul class="treatment-row__list" style="margin-top:1rem">
              ${trats.map((t) => `<li><a href="${base}${treatmentPath(t)}"><span>${esc(t.title)}</span> ${arrow}</a></li>`).join('')}
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
    ${sectionHead({ label: 'Team', title: lines(['Gli altri professionisti']), link: { href: 'team/', label: 'Tutto il team' }, base })}
    <div class="team-grid">${others.map((x) => personCard(x, base)).join('')}</div>
  </div>
</section>
${bookingBand(base)}`;

  return layout({
    title: metaTitle(`${personName(p)} — ${p.role.split('·')[0].trim()}`),
    description: `${personName(p)}, ${p.role} allo Studio Canova di Milano. ${p.short}`,
    path: `team/${p.slug}/`,
    depth: 2,
    current: 'team/',
    preload: [p.image],
    crumbs: [{ label: 'Home', path: '' }, { label: 'Team', path: 'team/' }, { label: p.name, path: `team/${p.slug}/` }],
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
    label: '03 — Tecnologie',
    title: lines(['La tecnologia al servizio', '<em class="serif-italic">della precisione.</em>']),
    lead: 'Ogni strumento in studio risponde a una domanda clinica precisa. Quelli che non riducono invasività, tempi o margine di errore, non li compriamo.',
    aside: 'Radiologia e laboratorio<br>interni allo studio',
    crumbs: [{ label: 'Home', path: '' }, { label: 'Tecnologie' }],
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
    title: 'Tecnologie — Studio Canova, dentista a Milano',
    description: 'Scanner intraorale, radiologia digitale a bassa dose, implantologia guidata, microscopia, Digital Smile Design e stampa 3D. Studio Canova, Milano.',
    path: 'tecnologie/',
    depth: 1,
    current: 'tecnologie/',
    crumbs: [{ label: 'Home', path: '' }, { label: 'Tecnologie', path: 'tecnologie/' }],
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
    label: '05 — Prima visita',
    title: lines(['La prima visita.']),
    lead: 'Quarantacinque minuti strutturati in quattro passaggi. Al termine sai qual è la situazione, quali sono le opzioni e quanto costa ciascuna.',
    aside: 'Durata 45 minuti<br>Costo 80 €',
    crumbs: [{ label: 'Home', path: '' }, { label: 'Prima visita' }],
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
        <span class="label reveal">Cosa portare</span>
        <h2 class="h2 mt-2 reveal">${lines(['Per non', '<em class="serif-italic">perdere tempo.</em>'])}</h2>
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
        <h2>Dopo la visita</h2>
        <p>Il piano di trattamento ti viene consegnato per iscritto, con le alternative e un preventivo dettagliato. Non c'è alcuna richiesta di decidere in giornata: se vuoi confrontarti con un altro professionista, ti consegniamo anche la documentazione radiografica.</p>
        <p>Se il percorso prevede più fasi, ti indichiamo l'ordine di priorità clinica: cosa è urgente, cosa può attendere e cosa è facoltativo.</p>
      </div>
    </div>
  </div>
</section>

<section class="section bg-sand">
  <div class="wrap">
    <div class="grid">
      <div class="col-4"><span class="label reveal">Domande</span><h2 class="h2 mt-2 reveal">${lines(['Prima di', '<em class="serif-italic">prenotare.</em>'])}</h2></div>
      <div class="col-7 start-7">${faqList(localFaq, 'pv')}</div>
    </div>
    <div class="row mt-5 reveal">
      <a class="btn" href="${base}prenota/">Prenota la tua prima visita</a>
      <a class="link-u" href="tel:${attr(site.phoneHref)}">Oppure chiama ${esc(site.phone)} ${arrow}</a>
    </div>
  </div>
</section>
${bookingBand(base)}`;

  return layout({
    title: 'La prima visita — Studio Canova, dentista a Milano',
    description: 'Come funziona la prima visita allo Studio Canova di Milano: 45 minuti tra ascolto, diagnosi, piano di trattamento e preventivo scritto.',
    path: 'prima-visita/',
    depth: 1,
    current: 'prima-visita/',
    preload: ['trattamento-visita'],
    crumbs: [{ label: 'Home', path: '' }, { label: 'Prima visita', path: 'prima-visita/' }],
    jsonLd: [dentistLd(), faqLd(localFaq)],
    main
  });
};

/* ======================================================= /contatti ======= */
export const contactPage = () => {
  const base = '../';
  const main = `
${pageHero({
    label: 'Contatti',
    title: lines(['Vieni a trovarci.']),
    lead: 'Zona Fiera, a sei minuti a piedi dalla metropolitana. Rispondiamo al telefono negli orari di apertura e via email entro un giorno lavorativo.',
    aside: `${esc(site.address.street)}<br>${esc(site.address.zip)} ${esc(site.address.city)}`,
    crumbs: [{ label: 'Home', path: '' }, { label: 'Contatti' }],
    base
  })}

<section class="section section--flush-top">
  <div class="wrap">
    <div class="grid">
      <div class="col-5">
        <div class="info-list">
          <div class="info-list__row"><span class="label">Telefono</span><span><a class="link-inline" href="tel:${attr(site.phoneHref)}">${esc(site.phone)}</a></span></div>
          <div class="info-list__row"><span class="label">WhatsApp</span><span><a class="link-inline" href="https://wa.me/${attr(site.whatsappHref)}" target="_blank" rel="noopener">${esc(site.whatsapp)}</a></span></div>
          <div class="info-list__row"><span class="label">Email</span><span><a class="link-inline" href="mailto:${attr(site.email)}">${esc(site.email)}</a></span></div>
          <div class="info-list__row"><span class="label">Indirizzo</span><span>${esc(site.address.street)}<br>${esc(site.address.zip)} ${esc(site.address.city)}</span></div>
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
        <h2 class="h3 mt-5 reveal">Richiedi informazioni</h2>
        <form class="mt-3" data-validate data-success="#contact-done" novalidate>
          <div class="form-grid">
            <label class="field"><span class="field__label label">Nome *</span><input type="text" name="nome" required autocomplete="given-name"><span class="field__error">Campo obbligatorio</span></label>
            <label class="field"><span class="field__label label">Cognome *</span><input type="text" name="cognome" required autocomplete="family-name"><span class="field__error">Campo obbligatorio</span></label>
            <label class="field"><span class="field__label label">Email *</span><input type="email" name="email" required autocomplete="email"><span class="field__error">Inserisci un indirizzo email valido</span></label>
            <label class="field"><span class="field__label label">Telefono *</span><input type="tel" name="telefono" required autocomplete="tel" pattern="[0-9 +().-]{6,}"><span class="field__error">Inserisci un numero valido</span></label>
          </div>
          <label class="field mt-3"><span class="field__label label">Come possiamo aiutarti?</span><textarea name="messaggio" rows="4" placeholder="Descrivi brevemente la tua richiesta"></textarea></label>
          <label class="check mt-3">
            <input type="checkbox" name="privacy" required>
            <span class="check__box" aria-hidden="true"></span>
            <span>Ho letto l'<a class="link-inline" href="${base}privacy/">informativa privacy</a> e acconsento al trattamento dei miei dati per essere ricontattato. *</span>
          </label>
          <div class="row mt-4"><button class="btn" type="submit">Invia richiesta</button></div>
          <p class="small mt-2" style="color:var(--stone-light)">* Campi obbligatori. Non inserire dati relativi alla salute in questo modulo.</p>
        </form>
        <div class="form-success" id="contact-done" hidden>
          <h2 class="h2">Grazie.</h2>
          <p class="lead mt-2">Abbiamo ricevuto la tua richiesta: ti ricontattiamo entro un giorno lavorativo.</p>
          <p class="mt-3"><a class="btn btn--ghost" href="${base}">Torna alla home</a></p>
        </div>
      </div>
    </div>
  </div>
</section>
${bookingBand(base)}`;

  return layout({
    title: 'Contatti — Studio Canova, dentista a Milano zona Fiera',
    description: 'Studio Canova, Via Antonio Canova 14, Milano. Telefono, WhatsApp, email, orari di apertura e indicazioni per raggiungerci.',
    path: 'contatti/',
    depth: 1,
    current: 'contatti/',
    crumbs: [{ label: 'Home', path: '' }, { label: 'Contatti', path: 'contatti/' }],
    main
  });
};

/* ======================================================== /prenota ======= */
const VISIT_TYPES = [
  { v: 'prima-visita', l: 'Prima visita', d: 'Esame completo, radiografie e piano di trattamento. 45 minuti.' },
  { v: 'igiene', l: 'Igiene e controllo', d: 'Seduta di igiene professionale con controllo periodico.' },
  { v: 'urgenza', l: 'Urgenza', d: 'Dolore, trauma o problema improvviso: ti richiamiamo entro poche ore.' },
  { v: 'consulenza', l: 'Consulenza specialistica', d: 'Ortodonzia, implantologia o estetica: secondo parere e valutazione.' }
];

export const bookingPage = () => {
  const base = '../';
  const docs = team.filter((p) => p.featured || p.treatments.length);
  const main = `
${pageHero({
    label: 'Prenota',
    title: lines(['Prenota', '<em class="serif-italic">una visita.</em>']),
    lead: 'Quattro passaggi, due minuti. Riceverai una conferma via email e un promemoria il giorno prima dell\'appuntamento.',
    aside: `Preferisci parlare?<br><a class="link-inline" href="tel:${attr(site.phoneHref)}">${esc(site.phone)}</a>`,
    crumbs: [{ label: 'Home', path: '' }, { label: 'Prenota' }],
    base
  })}

<section class="section section--flush-top">
  <div class="wrap">
    <div class="grid">
      <div class="col-8">
        <div data-wizard>
          <ol class="wizard__steps">
            <li data-state="current"><span class="num">01</span><span>Tipo di visita</span></li>
            <li data-state="todo"><span class="num">02</span><span>Professionista</span></li>
            <li data-state="todo"><span class="num">03</span><span>Giorno e ora</span></li>
            <li data-state="todo"><span class="num">04</span><span>I tuoi dati</span></li>
          </ol>

          <section class="wizard__panel" data-requires="tipo">
            <h2 class="h3">Di cosa hai bisogno?</h2>
            <div class="option-grid mt-3" data-group>
              ${VISIT_TYPES.map(
                (t) => `<button class="option" type="button" data-set="tipo" data-value="${attr(t.v)}" data-label="${attr(t.l)}" aria-pressed="false">
                <strong>${esc(t.l)}</strong><span class="small" style="color:var(--stone)">${esc(t.d)}</span>
              </button>`
              ).join('')}
            </div>
            <div class="row mt-4"><button class="btn" type="button" data-next disabled>Continua</button></div>
          </section>

          <section class="wizard__panel" hidden>
            <h2 class="h3">Con chi preferisci?</h2>
            <p class="body mt-1">Se non hai preferenze, assegniamo il professionista più adatto al tuo caso.</p>
            <div class="option-grid mt-3" data-group>
              <button class="option" type="button" data-set="dottore" data-value="Nessuna preferenza" aria-pressed="true"><strong>Nessuna preferenza</strong><span class="small" style="color:var(--stone)">Scegliamo noi in base al motivo della visita.</span></button>
              ${docs
                .map(
                  (p) => `<button class="option" type="button" data-set="dottore" data-value="${attr(personName(p))}" aria-pressed="false">
                <strong>${esc(personName(p))}</strong><span class="small" style="color:var(--stone)">${esc(p.role)}</span>
              </button>`
                )
                .join('')}
            </div>
            <div class="row mt-4"><button class="btn btn--ghost" type="button" data-prev>Indietro</button><button class="btn" type="button" data-next>Continua</button></div>
          </section>

          <section class="wizard__panel" hidden data-requires="giorno ora">
            <h2 class="h3">Quando ti è comodo?</h2>
            <p class="label mt-3">Giorno</p>
            <div class="daypick mt-2" data-days data-group aria-label="Scegli il giorno"></div>
            <p class="label mt-4">Orario</p>
            <div class="slots mt-2" data-group>
              ${['08:30', '09:15', '10:00', '11:30', '12:15', '14:00', '15:00', '16:30', '17:15', '18:30']
                .map((h) => `<button class="slot" type="button" data-set="ora" data-value="${h}" aria-pressed="false">${h}</button>`)
                .join('')}
            </div>
            <p class="small mt-3" style="color:var(--stone-light)">Gli orari mostrati sono indicativi: la segreteria conferma la disponibilità effettiva.</p>
            <div class="row mt-4"><button class="btn btn--ghost" type="button" data-prev>Indietro</button><button class="btn" type="button" data-next disabled>Continua</button></div>
          </section>

          <section class="wizard__panel" hidden>
            <h2 class="h3">I tuoi dati</h2>
            <form class="mt-3" data-validate data-success="#booking-done" novalidate>
              <div class="form-grid">
                <label class="field"><span class="field__label label">Nome *</span><input type="text" name="nome" required autocomplete="given-name"><span class="field__error">Campo obbligatorio</span></label>
                <label class="field"><span class="field__label label">Cognome *</span><input type="text" name="cognome" required autocomplete="family-name"><span class="field__error">Campo obbligatorio</span></label>
                <label class="field"><span class="field__label label">Email *</span><input type="email" name="email" required autocomplete="email"><span class="field__error">Inserisci un indirizzo email valido</span></label>
                <label class="field"><span class="field__label label">Telefono *</span><input type="tel" name="telefono" required autocomplete="tel" pattern="[0-9 +().-]{6,}"><span class="field__error">Inserisci un numero valido</span></label>
              </div>
              <label class="field mt-3"><span class="field__label label">Note</span><textarea name="note" rows="3" placeholder="Qualcosa che è utile sapere prima dell'appuntamento"></textarea></label>
              <input type="hidden" name="appuntamento" data-booking-detail>
              <dl class="summary-list mt-4">
                <div><dt>Tipo di visita</dt><dd data-summary="tipoLabel">—</dd></div>
                <div><dt>Professionista</dt><dd data-summary="dottore">—</dd></div>
                <div><dt>Giorno</dt><dd data-summary="giorno">—</dd></div>
                <div><dt>Orario</dt><dd data-summary="ora">—</dd></div>
              </dl>
              <label class="check mt-4">
                <input type="checkbox" name="privacy" required>
                <span class="check__box" aria-hidden="true"></span>
                <span>Ho letto l'<a class="link-inline" href="${base}privacy/">informativa privacy</a> e acconsento al trattamento dei miei dati per la gestione dell'appuntamento. *</span>
              </label>
              <div class="row mt-4"><button class="btn btn--ghost" type="button" data-prev>Indietro</button><button class="btn" type="submit">Conferma richiesta</button></div>
            </form>
            <div class="form-success" id="booking-done" hidden>
              <h2 class="h2">Richiesta inviata.</h2>
              <p class="lead mt-2 measure-sm" style="margin-inline:auto">La segreteria ti ricontatta entro poche ore per confermare data e orario.</p>
              <p class="mt-3"><a class="btn btn--ghost" href="${base}">Torna alla home</a></p>
            </div>
          </section>
        </div>
      </div>

      <aside class="col-3 start-8" style="grid-column:10 / span 3">
        <div class="sticky">
          <div class="sidebar-card">
            <span class="label">Preferisci il telefono?</span>
            <p class="h4 mt-2"><a class="link-inline" href="tel:${attr(site.phoneHref)}">${esc(site.phone)}</a></p>
            <p class="small mt-2" style="color:var(--stone)">Lun — Ven 08:30 — 19:30<br>Sab 09:00 — 13:00</p>
            <p class="mt-3"><a class="link-u" href="https://wa.me/${attr(site.whatsappHref)}" target="_blank" rel="noopener">Scrivici su WhatsApp ${arrow}</a></p>
          </div>
          <div class="sidebar-card">
            <span class="label">Urgenze</span>
            <p class="small mt-2" style="color:var(--stone)">In caso di dolore acuto o trauma, chiama direttamente lo studio: riserviamo ogni giorno spazi per le urgenze.</p>
          </div>
        </div>
      </aside>
    </div>
  </div>
</section>`;

  return layout({
    title: 'Prenota una visita — Studio Canova, dentista a Milano',
    description: 'Prenota online la tua visita allo Studio Canova di Milano: scegli il tipo di visita, il professionista e l\'orario che preferisci.',
    path: 'prenota/',
    depth: 1,
    current: 'prenota/',
    crumbs: [{ label: 'Home', path: '' }, { label: 'Prenota', path: 'prenota/' }],
    main
  });
};
