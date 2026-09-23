/* =============================================================================
   Studio Liddi — interazioni
   Vanilla JS, nessuna dipendenza. Tutto degrada con grazia senza JS.
   ========================================================================== */
(() => {
  'use strict';

  const rm = window.matchMedia('(prefers-reduced-motion: reduce)');
  const reduced = () => rm.matches;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const clamp = (v, a, b) => Math.min(Math.max(v, a), b);

  /* -- Lingua della pagina: per il wizard e la pagina di autogestione, il
     cui HTML e' generato via JS (non a build time come il resto del sito)
     e quindi non passa per src/build/i18n.mjs. ------------------------- */
  const LANG = document.documentElement.lang === 'en' ? 'en' : 'it';
  const LOCALE = LANG === 'en' ? 'en-GB' : 'it-IT';

  const STR = {
    it: {
      searchService: 'Cerca un servizio',
      multiHint: 'Puoi scegliere più di una risposta.',
      modeBookHint: 'Scegli giorno e orario dal calendario.',
      modeCallHint: 'Ti richiamiamo noi quando preferisci.',
      whenTitle: 'Quando ti è comodo?',
      whenSub: 'Gli orari mostrati riflettono la disponibilità reale: se lo slot è libero, l\'appuntamento viene confermato subito.',
      day: 'Giorno',
      time: 'Orario',
      secondChoice: 'Seconda preferenza',
      optional: '— facoltativa',
      altDay: 'Giorno alternativo',
      altTime: 'Orario alternativo',
      noPreference: 'Nessuna preferenza',
      professional: 'Professionista',
      sInitialRequest: 'Richiesta iniziale',
      sService: 'Servizio',
      sDay: 'Giorno',
      sTime: 'Orario',
      sSecondChoice: 'Seconda preferenza',
      sAt: (h) => ` alle ${h}`,
      sProfessional: 'Professionista',
      sMode: 'Modalità',
      sCallback: 'Richiamata',
      sChannel: 'Canale preferito',
      sWindow: 'Fascia oraria',
      stepOf: (i, n) => `Passo ${i} di ${n}`,
      chooseService: 'Scegli il servizio',
      goToDetails: 'Vai ai tuoi dati',
      continueBtn: 'Continua',
      sendingBtn: 'Invio in corso',
      thanksFor: (name, when) => `Grazie, ${name}. Abbiamo ricevuto la tua richiesta ${when}.`,
      whenFor: (day, hour) => `per ${day} alle ${hour}`,
      whenCallback: 'e la richiamata che ci hai chiesto',
      demoNote: 'Modalità dimostrativa: nessuna email è stata inviata e nessun appuntamento è stato registrato.',
      emailSentNote:
        'Ti abbiamo inviato una email con il riepilogo. Il nostro team ti contatterà per confermare definitivamente la disponibilità.',
      emailFailedNote:
        "Non siamo riusciti a inviarti l'email di riepilogo, ma la richiesta è registrata. Il nostro team ti contatterà per confermare la disponibilità.",
      confirmedTitle: 'Appuntamento confermato.',
      confirmedNote: "Il tuo appuntamento è confermato: ti abbiamo inviato l'email con l'invito al calendario.",
      confirmedFailedNote:
        "Il tuo appuntamento è confermato, ma non siamo riusciti a inviarti l'email di conferma. Salva il codice qui sotto e contattaci se hai dubbi.",
      invalidFields: 'Alcuni dati non sono validi.',
      submitFailed: 'Non siamo riusciti a inviare la richiesta. Riprova oppure contatta direttamente lo studio.',
      networkFailed: 'Non siamo riusciti a inviare la richiesta. Controlla la connessione, riprova oppure contatta direttamente lo studio.',

      manageLoadError: 'Non riusciamo a caricare la prenotazione',
      manageLoadErrorBody: 'Il link potrebbe non essere più valido. Se hai bisogno di annullare o spostare il tuo appuntamento, contattaci direttamente.',
      contatti: (telHref, tel, email) =>
        `Chiamaci al <a class="link-inline" href="tel:${telHref}">${tel}</a> oppure scrivici a <a class="link-inline" href="mailto:${email}">${email}</a>.`,
      atHour: (h) => `alle ${h}`,
      code: (id) => `Codice ${id}`,
      outOfWindow: 'Mancano meno di 24 ore a questo appuntamento: la modifica online non è più disponibile. Se hai un imprevisto, contattaci il prima possibile.',
      statusCancelled: 'annullato',
      statusCompleted: 'concluso',
      notManageable: (stato) => `Questo appuntamento risulta ${stato}: non ci sono ulteriori azioni disponibili.`,
      rescheduleBtn: 'Sposta appuntamento',
      cancelBtn: 'Annulla appuntamento',
      confirmCancel: 'Confermi di voler annullare questo appuntamento? Lo slot verrà liberato.',
      cancelledTitle: 'Appuntamento annullato',
      cancelledBody: 'Ti abbiamo inviato una email di conferma. Puoi prenotare un nuovo appuntamento quando vuoi.',
      newDay: 'Nuovo giorno',
      newTime: 'Nuovo orario',
      chooseDayFirst: 'Scegli prima un giorno.',
      confirmNewTime: 'Conferma nuovo orario',
      checkingAvailability: 'Verifica disponibilità…',
      rescheduledTitle: 'Appuntamento spostato',
      rescheduledBody: (when, hour) => `Il nuovo appuntamento è per ${when} alle ${hour}. Ti abbiamo inviato una email di conferma con il calendario aggiornato.`,
      slotTaken: 'Questo orario è appena stato occupato: scegline un altro.',
      rescheduleFailed: 'Non siamo riusciti a completare lo spostamento. Riprova.',
      networkRetry: 'Errore di rete: riprova tra poco.'
    },
    en: {
      searchService: 'Search for a service',
      multiHint: 'You can choose more than one answer.',
      modeBookHint: 'Pick a day and time from the calendar.',
      modeCallHint: "We'll call you back whenever suits you.",
      whenTitle: 'When suits you best?',
      whenSub: 'The times shown reflect real availability: if the slot is free, your appointment is confirmed right away.',
      day: 'Day',
      time: 'Time',
      secondChoice: 'Second choice',
      optional: '— optional',
      altDay: 'Alternative day',
      altTime: 'Alternative time',
      noPreference: 'No preference',
      professional: 'Practitioner',
      sInitialRequest: 'Initial request',
      sService: 'Service',
      sDay: 'Day',
      sTime: 'Time',
      sSecondChoice: 'Second choice',
      sAt: (h) => ` at ${h}`,
      sProfessional: 'Practitioner',
      sMode: 'Mode',
      sCallback: 'Call back',
      sChannel: 'Preferred channel',
      sWindow: 'Preferred time',
      stepOf: (i, n) => `Step ${i} of ${n}`,
      chooseService: 'Choose the service',
      goToDetails: 'Go to your details',
      continueBtn: 'Continue',
      sendingBtn: 'Sending',
      thanksFor: (name, when) => `Thank you, ${name}. We've received your request ${when}.`,
      whenFor: (day, hour) => `for ${day} at ${hour}`,
      whenCallback: 'and the call back you asked for',
      demoNote: 'Demo mode: no email was sent and no appointment was recorded.',
      emailSentNote: "We've sent you a summary email. Our team will contact you to confirm final availability.",
      emailFailedNote:
        "We couldn't send you the summary email, but your request has been recorded. Our team will contact you to confirm availability.",
      confirmedTitle: 'Appointment confirmed.',
      confirmedNote: "Your appointment is confirmed: we've sent you the email with the calendar invite.",
      confirmedFailedNote:
        "Your appointment is confirmed, but we couldn't send you the confirmation email. Save the code below and contact us if in doubt.",
      invalidFields: 'Some information is not valid.',
      submitFailed: "We couldn't send your request. Please try again or contact the practice directly.",
      networkFailed: "We couldn't send your request. Check your connection, try again, or contact the practice directly.",

      manageLoadError: "We can't load this booking",
      manageLoadErrorBody: 'This link may no longer be valid. If you need to cancel or reschedule your appointment, please contact us directly.',
      contatti: (telHref, tel, email) =>
        `Call us at <a class="link-inline" href="tel:${telHref}">${tel}</a> or email <a class="link-inline" href="mailto:${email}">${email}</a>.`,
      atHour: (h) => `at ${h}`,
      code: (id) => `Code ${id}`,
      outOfWindow: 'Less than 24 hours remain before this appointment: the online change is no longer available. If something has come up, please contact us as soon as possible.',
      statusCancelled: 'cancelled',
      statusCompleted: 'completed',
      notManageable: (stato) => `This appointment is ${stato}: there are no further actions available.`,
      rescheduleBtn: 'Reschedule appointment',
      cancelBtn: 'Cancel appointment',
      confirmCancel: 'Are you sure you want to cancel this appointment? The slot will be released.',
      cancelledTitle: 'Appointment cancelled',
      cancelledBody: "We've sent you a confirmation email. You can book a new appointment whenever you like.",
      newDay: 'New day',
      newTime: 'New time',
      chooseDayFirst: 'Choose a day first.',
      confirmNewTime: 'Confirm new time',
      checkingAvailability: 'Checking availability…',
      rescheduledTitle: 'Appointment rescheduled',
      rescheduledBody: (when, hour) => `Your new appointment is for ${when} at ${hour}. We've sent you a confirmation email with the updated calendar invite.`,
      slotTaken: 'This time slot was just taken: please choose another one.',
      rescheduleFailed: "We couldn't complete the reschedule. Please try again.",
      networkRetry: 'Network error: please try again shortly.'
    }
  };
  const tr = (key, ...args) => {
    const v = STR[LANG][key];
    return typeof v === 'function' ? v(...args) : v;
  };

  /* -- Contatori numerici: partono quando entrano nello schermo ------------*/
  const reveals = () => {
    const items = $$('[data-count]');
    if (!items.length) return;
    if (reduced() || !('IntersectionObserver' in window)) {
      items.forEach((el) => { el.textContent = el.dataset.countFormatted || el.dataset.count; });
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        countUp(entry.target);
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });
    items.forEach((el) => io.observe(el));
  };

  /* -- Contatori -----------------------------------------------------------*/
  const countUp = (el) => {
    const end = parseFloat(el.dataset.count);
    const dec = parseInt(el.dataset.decimals || '0', 10);
    const dur = 1500;
    const t0 = performance.now();
    const fmt = (v) => v.toLocaleString(LOCALE, { minimumFractionDigits: dec, maximumFractionDigits: dec });
    const tick = (t) => {
      const p = clamp((t - t0) / dur, 0, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(end * eased);
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = fmt(end);
    };
    requestAnimationFrame(tick);
  };

  /* -- Header + menu -------------------------------------------------------*/
  const header = () => {
    const hd = $('.header');
    if (!hd) return;
    const hero = $('[data-header-over]');
    const mcta = $('.mobile-cta');
    let last = window.scrollY;

    const overUntil = () => (hero ? hero.offsetTop + hero.offsetHeight - 120 : 0);

    const update = () => {
      const y = window.scrollY;
      const over = y < overUntil();
      hd.classList.toggle('header--over', over);
      hd.classList.toggle('header--on-dark', over && hero?.dataset.headerOver === 'dark');
      hd.classList.toggle('header--solid', !over && y > 40);
      const hidden = y > last + 4 && y > 400;
      hd.classList.toggle('header--hidden', hidden);
      document.body.classList.toggle('header-hidden', hidden);
      if (mcta) mcta.classList.toggle('is-visible', y > 600);
      last = y;
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);

  };

  /* -- Barra di sezione: scroll morbido + voce attiva ----------------------*/
  const sectionNav = () => {
    const bar = $('.subnav');

    /** scroll morbido con compensazione delle due barre sticky */
    const offset = () => {
      const cs = getComputedStyle(document.documentElement);
      const h = parseInt(cs.getPropertyValue('--header-h'), 10) || 88;
      const sub = bar ? bar.offsetHeight : 0;
      return h + sub + 16;
    };

    const scrollToTarget = (el) => {
      const top = el.getBoundingClientRect().top + window.scrollY - offset();
      window.scrollTo({ top: Math.max(top, 0), behavior: reduced() ? 'auto' : 'smooth' });
    };

    document.addEventListener('click', (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute('href').slice(1);
      if (!id) return;
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      scrollToTarget(target);
      history.replaceState(null, '', '#' + id);
    });

    // all'apertura con un'ancora nell'URL: riallinea sotto le barre
    if (location.hash) {
      const t = document.getElementById(location.hash.slice(1));
      if (t) setTimeout(() => scrollToTarget(t), 60);
    }

  };

  /* -- Rail (slider orizzontale) ------------------------------------------*/
  const rails = () => {
    $$('.rail').forEach((rail) => {
      const track = $('.rail__track', rail);
      const prev = $('[data-rail="prev"]', rail);
      const next = $('[data-rail="next"]', rail);
      const bar = $('.rail__progress i', rail);
      if (!track) return;

      const step = () => {
        const first = track.firstElementChild;
        return first ? first.getBoundingClientRect().width + parseFloat(getComputedStyle(track).gap || 0) : 320;
      };
      const update = () => {
        const maxScroll = track.scrollWidth - track.clientWidth;
        if (prev) prev.disabled = track.scrollLeft < 8;
        if (next) next.disabled = track.scrollLeft > maxScroll - 8;
        if (bar) {
          const ratio = track.clientWidth / track.scrollWidth;
          bar.style.width = `${clamp(ratio * 100, 8, 100)}%`;
          bar.style.transform = `translateX(${maxScroll > 0 ? (track.scrollLeft / maxScroll) * (100 / clamp(ratio, 0.08, 1) - 100) : 0}%)`;
        }
      };
      prev?.addEventListener('click', () => track.scrollBy({ left: -step(), behavior: 'smooth' }));
      next?.addEventListener('click', () => track.scrollBy({ left: step(), behavior: 'smooth' }));
      track.addEventListener('scroll', update, { passive: true });
      window.addEventListener('resize', update);
      update();

      // drag to scroll
      let down = false, startX = 0, startL = 0, moved = 0;
      track.addEventListener('pointerdown', (e) => {
        if (e.pointerType === 'touch') return;
        down = true; moved = 0; startX = e.clientX; startL = track.scrollLeft;
        track.classList.add('is-dragging');
      });
      track.addEventListener('pointermove', (e) => {
        if (!down) return;
        const d = e.clientX - startX;
        moved = Math.abs(d);
        track.scrollLeft = startL - d;
      });
      const stop = () => { down = false; track.classList.remove('is-dragging'); };
      track.addEventListener('pointerup', stop);
      track.addEventListener('pointerleave', stop);
      track.addEventListener('click', (e) => { if (moved > 6) { e.preventDefault(); moved = 0; } }, true);
    });
  };

  /* -- FAQ -----------------------------------------------------------------*/
  const faq = () => {
    $$('.faq').forEach((list) => {
      $$('.faq__q', list).forEach((btn) => {
        btn.addEventListener('click', () => {
          const item = btn.closest('.faq__item');
          const isOpen = item.classList.contains('is-open');
          if (list.dataset.single !== 'false') {
            $$('.faq__item.is-open', list).forEach((o) => { o.classList.remove('is-open'); $('.faq__q', o).setAttribute('aria-expanded', 'false'); });
          }
          item.classList.toggle('is-open', !isOpen);
          btn.setAttribute('aria-expanded', String(!isOpen));
        });
      });
    });
  };

  /* -- Before / after ------------------------------------------------------*/
  const beforeAfter = () => {
    $$('.ba').forEach((ba) => {
      const set = (clientX) => {
        const r = ba.getBoundingClientRect();
        const pos = clamp(((clientX - r.left) / r.width) * 100, 0, 100);
        ba.style.setProperty('--pos', `${pos}%`);
        const h = $('.ba__handle', ba);
        if (h) h.setAttribute('aria-valuenow', Math.round(pos));
      };
      let down = false;
      ba.addEventListener('pointerdown', (e) => { down = true; ba.setPointerCapture(e.pointerId); set(e.clientX); });
      ba.addEventListener('pointermove', (e) => { if (down) set(e.clientX); });
      ba.addEventListener('pointerup', () => { down = false; });
      ba.addEventListener('pointercancel', () => { down = false; });
      const handle = $('.ba__handle', ba);
      handle?.addEventListener('keydown', (e) => {
        const cur = parseFloat(getComputedStyle(ba).getPropertyValue('--pos')) || 50;
        if (e.key === 'ArrowLeft') { ba.style.setProperty('--pos', `${clamp(cur - 4, 0, 100)}%`); e.preventDefault(); }
        if (e.key === 'ArrowRight') { ba.style.setProperty('--pos', `${clamp(cur + 4, 0, 100)}%`); e.preventDefault(); }
      });
    });
  };

  /* -- Filtri --------------------------------------------------------------*/
  const filters = () => {
    $$('[data-filter-group]').forEach((group) => {
      const targets = $$(`[data-filter-item="${group.dataset.filterGroup}"]`);
      $$('.filter', group).forEach((btn) => {
        btn.addEventListener('click', () => {
          const val = btn.dataset.value;
          $$('.filter', group).forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
          targets.forEach((t) => {
            const show = val === 'all' || (t.dataset.cat || '').split(' ').includes(val);
            t.hidden = !show;
            if (show) { t.classList.remove('is-in'); requestAnimationFrame(() => t.classList.add('is-in')); }
          });
        });
      });
    });
  };

  /* -- Validazione form ----------------------------------------------------*/
  const validateField = (input) => {
    const field = input.closest('.field') || input.closest('.check');
    const ok = input.checkValidity();
    if (field) field.classList.toggle('is-invalid', !ok);
    return ok;
  };

  const forms = () => {
    // il form di prenotazione ha un invio proprio (bookingSubmit)
    $$('form[data-validate]:not([data-booking])').forEach((form) => {
      form.setAttribute('novalidate', '');
      $$('input, textarea, select', form).forEach((el) => {
        el.addEventListener('blur', () => validateField(el));
        el.addEventListener('input', () => { if ((el.closest('.field') || {}).classList?.contains('is-invalid')) validateField(el); });
      });
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const fields = $$('input, textarea, select', form).filter((el) => !el.disabled);
        const bad = fields.filter((el) => !validateField(el));
        if (bad.length) { bad[0].focus(); return; }
        const done = $(form.dataset.success);
        form.hidden = true;
        if (done) { done.hidden = false; done.scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth', block: 'center' }); }
      });
    });
  };

  /* -- Wizard di prenotazione guidato dalla configurazione ------------------
     I passi non sono scritti qui: vengono dedotti da content/booking-flows.json.
     Una domanda la cui condizione non e' soddisfatta viene saltata, cosi' non
     si chiede mai qualcosa di non pertinente. Le risposte restano in memoria:
     tornando indietro non si perde nulla. Priorita' e tag li calcola il
     server, non il browser.                                                  */
  const wizard = () => {
    const wz = $('[data-wizard]');
    if (!wz) return;

    const cfgEl = $('script[data-flows]');
    const slotEl = $('script[data-slots]');
    if (!cfgEl) return;
    const cfg = JSON.parse(cfgEl.textContent);
    const slots = slotEl ? JSON.parse(slotEl.textContent) : { orari: [], dottori: [] };

    /* -- disponibilita' reale: quali orari sono gia' confermati in un giorno --
       Uno slot occupato blocca anche gli orari successivi richiesti da un
       servizio piu' lungo (slotCount > 1), con la stessa logica del server
       (vedi api/_lib/availability.mjs). Si interroga solo in modalita' live:
       in demo tutti gli orari restano selezionabili. */
    const dispEndpoint = wz.dataset.endpoint ? wz.dataset.endpoint.replace(/prenotazioni\/?$/, 'disponibilita') : '';
    const occupatiCache = new Map();
    let occupatiGiorno = new Set();

    const caricaDisponibilita = async (iso) => {
      if (!dispEndpoint || wz.dataset.mode !== 'live') return new Set();
      if (occupatiCache.has(iso)) return occupatiCache.get(iso);
      try {
        const res = await fetch(`${dispEndpoint}?giorno=${encodeURIComponent(iso)}`);
        const data = await res.json();
        // il server e' la fonte di verita' sulle chiusure: se dice che il
        // giorno e' chiuso (es. content/chiusure.json aggiornato dopo che il
        // browser ha messo in cache questa pagina), si blocca tutto l'orario
        const set = data?.chiuso ? new Set(slots.orari) : new Set(Array.isArray(data?.occupati) ? data.occupati : []);
        occupatiCache.set(iso, set);
        return set;
      } catch {
        return new Set(); // rete assente: meglio mostrare tutto che bloccare la prenotazione
      }
    };

    /** Orari da disabilitare per il servizio corrente, dato cio' che e' gia' occupato nel giorno scelto. */
    const orariBloccati = (slotCount) => {
      if (!occupatiGiorno.size) return new Set();
      const bloccati = new Set();
      slots.orari.forEach((h, i) => {
        const richiesti = slots.orari.slice(i, i + slotCount);
        const stanzaSufficiente = richiesti.length === slotCount;
        if (!stanzaSufficiente || richiesti.some((o) => occupatiGiorno.has(o))) bloccati.add(h);
      });
      return bloccati;
    };

    const stage = $('[data-stage]', wz);
    const finale = $('[data-final]', wz);
    const nav = $('[data-nav]', wz);
    const btnNext = $('[data-next]', wz);
    const btnBack = $('[data-back]', wz);
    const barra = $('[data-progress-bar]', wz);
    const etichetta = $('[data-progress-label]', wz);
    const servizioLabel = $('[data-progress-service]', wz);
    const form = $('form[data-booking]', wz);
    const apertoIl = Date.now();

    /* -- prenota di nuovo: dati di contatto gia' pronti da un link ricevuto
       via email (vedi api/_lib/token.mjs, rebookUrl). Stesso meccanismo del
       link di autogestione: un token firmato, niente account. -------------- */
    (async () => {
      const qs = new URLSearchParams(location.search);
      const b = qs.get('b');
      const t = qs.get('t');
      if (!b || !t || wz.dataset.mode !== 'live' || !wz.dataset.endpoint) return;
      const prenotazioneEndpoint = wz.dataset.endpoint.replace(/prenotazioni\/?$/, 'prenotazione');
      try {
        const res = await fetch(`${prenotazioneEndpoint}?b=${encodeURIComponent(b)}&t=${encodeURIComponent(t)}`);
        const data = await res.json();
        if (!res.ok || !data.ok) return;
        if (form.nome) form.nome.value = data.nome || '';
        if (form.cognome) form.cognome.value = data.cognome || '';
        if (form.email) form.email.value = data.email || '';
        if (form.telefono) form.telefono.value = data.telefono || '';
        // il token ha fatto il suo lavoro: non serve lasciarlo nell'URL
        history.replaceState(null, '', location.pathname);
      } catch {
        // link scaduto/non valido: il form resta semplicemente vuoto
      }
    })();

    const state = {
      servizio: '',
      servizioOrigine: '',
      risposte: {},
      modalita: '',
      canale: '',
      fascia: '',
      giorno: '',
      giornoLabel: '',
      ora: '',
      secondaData: '',
      secondaOra: '',
      dottore: tr('noPreference')
    };

    const servizio = () => cfg.services.find((s) => s.id === state.servizio) || null;

    /** Stessa regola del server: una domanda si mostra solo se pertinente. */
    const visibile = (q) => {
      if (!q.when) return true;
      const val = state.risposte[q.when.q];
      const lista = Array.isArray(val) ? val : val ? [val] : [];
      if (q.when.in) return lista.some((v) => q.when.in.includes(v));
      if (q.when.not) return lista.length > 0 && !lista.some((v) => q.when.not.includes(v));
      return true;
    };

    /** Sequenza dei passi, ricalcolata a ogni risposta. */
    const passi = () => {
      const out = [{ kind: 'service' }];
      const s = servizio();
      if (!s) return out;
      s.questions.filter(visibile).forEach((q) => out.push({ kind: 'question', q }));
      out.push({ kind: 'mode' });
      if (state.modalita === 'prenota') out.push({ kind: 'when' });
      if (state.modalita === 'ricontatto') out.push({ kind: 'contact' });
      out.push({ kind: 'final' });
      return out;
    };

    let i = 0;

    /* -- mattoni dell'interfaccia ----------------------------------------- */
    const opzione = (v, l, sotto, premuto) =>
      `<button class="option" type="button" data-pick="${v}" aria-pressed="${premuto ? 'true' : 'false'}">
        <strong>${l}</strong>${sotto ? `<span class="small" style="color:var(--stone)">${sotto}</span>` : ''}
      </button>`;

    const titolo = (t, sub) =>
      `<h2 class="h3">${t}</h2>${sub ? `<p class="body mt-1 measure-sm">${sub}</p>` : ''}`;

    const chiusuraIn = { date: [], periodi: [] };
    if (slots.chiusure) {
      if (Array.isArray(slots.chiusure.date)) chiusuraIn.date = slots.chiusure.date;
      if (Array.isArray(slots.chiusure.periodi)) chiusuraIn.periodi = slots.chiusure.periodi;
    }
    /** Stessa regola del server (api/_lib/chiusure.mjs): domenica, festivi ed eventuali periodi di ferie. */
    const giornoChiuso = (iso, day) => {
      if (day === 0) return true; // domenica
      if (chiusuraIn.date.includes(iso)) return true;
      return chiusuraIn.periodi.some((p) => iso >= p.da && iso <= p.a);
    };

    const giorniDisponibili = () => {
      const out = [];
      const d = new Date();
      d.setHours(12, 0, 0, 0);
      let sicurezza = 0;
      while (out.length < 12 && sicurezza < 400) {
        d.setDate(d.getDate() + 1);
        sicurezza++;
        const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        if (giornoChiuso(iso, d.getDay())) continue;
        out.push({
          iso,
          gs: d.toLocaleDateString(LOCALE, { weekday: 'short' }),
          n: d.getDate(),
          ms: d.toLocaleDateString(LOCALE, { month: 'short' }),
          full: d.toLocaleDateString(LOCALE, { weekday: 'long', day: 'numeric', month: 'long' })
        });
      }
      return out;
    };

    /* -- disegno dei passi -------------------------------------------------- */
    const disegnaServizi = () => {
      const gruppi = cfg.groups
        .map((g) => {
          const items = cfg.services.filter((s) => s.group === g.id);
          if (!items.length) return '';
          return `<div class="svc-group" data-group-block>
            <p class="label mt-3">${g.label}</p>
            <div class="option-grid mt-2">
              ${items.map((s) => opzione(s.id, s.label, s.hint, state.servizio === s.id)).join('')}
            </div>
          </div>`;
        })
        .join('');
      return `${titolo(cfg.chooseLabel, cfg.chooseHint)}
        <label class="field mt-3"><span class="sr-only">${tr('searchService')}</span>
          <input type="search" data-svc-search placeholder="${cfg.searchPlaceholder}" autocomplete="off">
        </label>
        ${gruppi}`;
    };

    const disegnaDomanda = (q) => {
      const val = state.risposte[q.id];
      if (q.type === 'text') {
        return `${titolo(q.q)}
          <label class="field mt-3"><span class="sr-only">${q.q}</span>
            <textarea data-text rows="4" placeholder="${q.placeholder || ''}">${val ? String(val) : ''}</textarea>
          </label>`;
      }
      const scelte = Array.isArray(val) ? val : val ? [val] : [];
      const multi = q.type === 'multi';
      return `${titolo(q.q, multi ? tr('multiHint') : '')}
        ${q.note ? `<p class="small mt-2" style="color:var(--stone-light)">${q.note}</p>` : ''}
        <div class="option-grid mt-3" data-multi="${multi}">
          ${q.options.map((o) => opzione(o.v, o.l, '', scelte.includes(o.v))).join('')}
        </div>`;
    };

    const disegnaModalita = () => {
      const q = cfg.tail.modeQuestion;
      return `${titolo(q.q)}
        <div class="option-grid mt-3">
          ${q.options
            .map((o) =>
              opzione(
                o.v,
                o.l,
                o.v === 'prenota' ? tr('modeBookHint') : tr('modeCallHint'),
                state.modalita === o.v
              )
            )
            .join('')}
        </div>`;
    };

    const slotsHtml = () => {
      const bloccati = orariBloccati(servizio()?.slotCount || 1);
      return slots.orari
        .map((h) => {
          const off = bloccati.has(h);
          return `<button class="slot${off ? ' is-off' : ''}" type="button" data-hour="${h}" aria-pressed="${state.ora === h}"${off ? ' disabled aria-disabled="true"' : ''}>${h}</button>`;
        })
        .join('');
    };

    const disegnaQuando = () => {
      const giorni = giorniDisponibili();
      return `${titolo(tr('whenTitle'), tr('whenSub'))}
        <p class="label mt-4">${tr('day')}</p>
        <div class="daypick mt-2">
          ${giorni
            .map(
              (g) => `<button class="day" type="button" data-day="${g.iso}" data-label="${g.full}" aria-pressed="${state.giorno === g.iso}">
            <span>${g.gs}</span><strong>${g.n}</strong><span>${g.ms}</span>
          </button>`
            )
            .join('')}
        </div>
        <p class="label mt-4">${tr('time')}</p>
        <div class="slots mt-2" data-slots-box>${slotsHtml()}</div>
        <p class="label mt-4">${tr('secondChoice')} <span style="text-transform:none;letter-spacing:0;color:var(--stone-light)">${tr('optional')}</span></p>
        <div class="form-grid mt-2">
          <label class="field"><span class="field__label label">${tr('altDay')}</span>
            <input type="date" data-second-date value="${state.secondaData}"></label>
          <label class="field"><span class="field__label label">${tr('altTime')}</span>
            <select data-second-hour>
              <option value="">${tr('noPreference')}</option>
              ${slots.orari.map((h) => `<option value="${h}"${state.secondaOra === h ? ' selected' : ''}>${h}</option>`).join('')}
            </select>
          </label>
        </div>
        <p class="label mt-4">${tr('professional')}</p>
        <label class="field"><span class="sr-only">${tr('professional')}</span>
          <select data-doctor>
            ${slots.dottori.map((n) => `<option value="${n}"${state.dottore === n ? ' selected' : ''}>${n}</option>`).join('')}
          </select>
        </label>`;
    };

    const disegnaContatto = () => {
      const c = cfg.tail.channelQuestion;
      const f = cfg.tail.windowQuestion;
      return `${titolo(c.q)}
        <div class="option-grid mt-3" data-field="canale">
          ${c.options.map((o) => opzione(o.v, o.l, '', state.canale === o.v)).join('')}
        </div>
        <p class="h4 mt-5">${f.q}</p>
        <div class="option-grid mt-3" data-field="fascia">
          ${f.options.map((o) => opzione(o.v, o.l, '', state.fascia === o.v)).join('')}
        </div>`;
    };

    /* -- riepilogo ---------------------------------------------------------- */
    const etichettaOpzione = (q, v) => (q.options.find((o) => o.v === v) || {}).l || v;

    const riepilogo = () => {
      const s = servizio();
      const righe = [];
      if (state.servizioOrigine) righe.push([tr('sInitialRequest'), cfg.services.find((x) => x.id === state.servizioOrigine)?.label || '—']);
      righe.push([tr('sService'), s ? s.label : '—']);
      if (s) {
        s.questions.filter(visibile).forEach((q) => {
          const val = state.risposte[q.id];
          if (!val || (Array.isArray(val) && !val.length)) return;
          righe.push([q.q, q.type === 'text' ? String(val) : (Array.isArray(val) ? val : [val]).map((v) => etichettaOpzione(q, v)).join(', ')]);
        });
      }
      if (state.modalita === 'prenota') {
        righe.push([tr('sDay'), state.giornoLabel || '—']);
        righe.push([tr('sTime'), state.ora || '—']);
        if (state.secondaData) righe.push([tr('sSecondChoice'), state.secondaData + (state.secondaOra ? tr('sAt', state.secondaOra) : '')]);
        righe.push([tr('sProfessional'), state.dottore]);
      } else if (state.modalita === 'ricontatto') {
        righe.push([tr('sMode'), tr('sCallback')]);
        righe.push([tr('sChannel'), etichettaOpzione(cfg.tail.channelQuestion, state.canale)]);
        righe.push([tr('sWindow'), etichettaOpzione(cfg.tail.windowQuestion, state.fascia)]);
      }
      return righe;
    };

    const aggiornaRiepilogo = () => {
      const dl = $('[data-summary-list]', wz);
      if (!dl) return;
      dl.innerHTML = riepilogo()
        .map(([k, v]) => `<div><dt>${k}</dt><dd>${String(v).replace(/</g, '&lt;')}</dd></div>`)
        .join('');
    };

    /* -- avanzamento e validazione del passo -------------------------------- */
    const passoCompleto = (p) => {
      if (p.kind === 'service') return !!state.servizio;
      if (p.kind === 'question') {
        const val = state.risposte[p.q.id];
        if (p.q.type === 'text') return String(val || '').trim().length >= 3;
        return Array.isArray(val) ? val.length > 0 : !!val;
      }
      if (p.kind === 'mode') return !!state.modalita;
      if (p.kind === 'when') return !!state.giorno && !!state.ora;
      if (p.kind === 'contact') return !!state.canale && !!state.fascia;
      return true;
    };

    const render = () => {
      const lista = passi();
      i = Math.max(0, Math.min(i, lista.length - 1));
      const p = lista[i];
      const totale = lista.length;

      // finche' il servizio non e' scelto non si conosce il numero di passi
      const noto = !!servizio();
      if (barra) barra.style.width = noto ? `${Math.round(((i + 1) / totale) * 100)}%` : '6%';
      if (etichetta) etichetta.textContent = noto ? tr('stepOf', i + 1, totale) : tr('chooseService');
      if (servizioLabel) servizioLabel.textContent = servizio() ? servizio().label : '';

      if (p.kind === 'final') {
        stage.innerHTML = '';
        stage.hidden = true;
        nav.hidden = true;
        finale.hidden = false;
        aggiornaRiepilogo();
        const h = $('h2', finale);
        h?.setAttribute('tabindex', '-1');
        h?.focus({ preventScroll: true });
      } else {
        finale.hidden = true;
        stage.hidden = false;
        nav.hidden = false;
        stage.innerHTML =
          p.kind === 'service'
            ? disegnaServizi()
            : p.kind === 'question'
              ? disegnaDomanda(p.q)
              : p.kind === 'mode'
                ? disegnaModalita()
                : p.kind === 'when'
                  ? disegnaQuando()
                  : disegnaContatto();
        stage.dataset.kind = p.kind;
        stage.dataset.question = p.kind === 'question' ? p.q.id : '';
        btnBack.hidden = i === 0;
        btnNext.textContent = lista[i + 1] && lista[i + 1].kind === 'final' ? tr('goToDetails') : tr('continueBtn');
        btnNext.disabled = !passoCompleto(p);
      }

      if (i > 0) wz.scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth', block: 'start' });
    };

    const aggiornaAvanti = () => {
      const lista = passi();
      btnNext.disabled = !passoCompleto(lista[Math.min(i, lista.length - 1)]);
    };

    /* -- interazioni -------------------------------------------------------- */
    stage.addEventListener('click', (e) => {
      const b = e.target.closest('[data-pick], [data-day], [data-hour]');
      if (!b) return;
      const kind = stage.dataset.kind;

      if (b.dataset.day) {
        state.giorno = b.dataset.day;
        state.giornoLabel = b.dataset.label;
        $$('[data-day]', stage).forEach((x) => x.setAttribute('aria-pressed', String(x === b)));

        const box = $('[data-slots-box]', stage);
        if (box) box.setAttribute('aria-busy', 'true');
        const iso = state.giorno;
        caricaDisponibilita(iso).then((occupati) => {
          if (state.giorno !== iso) return; // l'utente ha gia' cambiato giorno
          occupatiGiorno = occupati;
          if (occupatiGiorno.size && orariBloccati(servizio()?.slotCount || 1).has(state.ora)) {
            state.ora = ''; // l'orario scelto prima non e' piu' disponibile in questo giorno
          }
          // si aggiorna solo il box degli orari: un render() intero
          // farebbe scorrere di nuovo la pagina sotto l'utente
          const box2 = $('[data-slots-box]', stage);
          if (box2) {
            box2.innerHTML = slotsHtml();
            box2.removeAttribute('aria-busy');
          }
          aggiornaAvanti();
        });

        aggiornaAvanti();
        return;
      }
      if (b.dataset.hour) {
        state.ora = b.dataset.hour;
        $$('[data-hour]', stage).forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
        aggiornaAvanti();
        return;
      }

      const v = b.dataset.pick;

      if (kind === 'service') {
        state.servizio = v;
        state.servizioOrigine = '';
        state.risposte = {};
        i = 1;
        render();
        return;
      }

      if (kind === 'question') {
        const s = servizio();
        const q = s.questions.find((x) => x.id === stage.dataset.question);
        const opt = q.options.find((o) => o.v === v);

        // alcune risposte indirizzano a un percorso piu' specifico
        if (opt && opt.goto) {
          state.servizioOrigine = state.servizio;
          state.servizio = opt.goto;
          state.risposte = {};
          i = 1;
          render();
          return;
        }

        if (q.type === 'multi') {
          const cur = Array.isArray(state.risposte[q.id]) ? [...state.risposte[q.id]] : [];
          const pos = cur.indexOf(v);
          if (pos >= 0) cur.splice(pos, 1);
          else cur.push(v);
          state.risposte[q.id] = cur;
          b.setAttribute('aria-pressed', String(cur.includes(v)));
        } else {
          state.risposte[q.id] = v;
          $$('[data-pick]', stage).forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
        }
        aggiornaAvanti();
        return;
      }

      if (kind === 'mode') {
        state.modalita = v;
        $$('[data-pick]', stage).forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
        aggiornaAvanti();
        return;
      }

      if (kind === 'contact') {
        const campo = b.closest('[data-field]').dataset.field;
        state[campo] = v;
        $$('[data-pick]', b.closest('[data-field]')).forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
        aggiornaAvanti();
      }
    });

    stage.addEventListener('input', (e) => {
      const t = e.target;
      if (t.matches('[data-text]')) {
        state.risposte[stage.dataset.question] = t.value;
        aggiornaAvanti();
      }
      if (t.matches('[data-second-date]')) state.secondaData = t.value;
      if (t.matches('[data-second-hour]')) state.secondaOra = t.value;
      if (t.matches('[data-doctor]')) state.dottore = t.value;
      if (t.matches('[data-svc-search]')) {
        const q = t.value.trim().toLowerCase();
        $$('[data-group-block]', stage).forEach((blocco) => {
          let visibili = 0;
          $$('[data-pick]', blocco).forEach((b) => {
            const ok = !q || b.textContent.toLowerCase().includes(q);
            b.style.display = ok ? '' : 'none';
            if (ok) visibili++;
          });
          blocco.hidden = visibili === 0;
        });
      }
    });

    btnNext.addEventListener('click', () => { i += 1; render(); });
    btnBack.addEventListener('click', () => { i -= 1; render(); });
    $('[data-back-final]', wz)?.addEventListener('click', () => {
      i = passi().length - 2;
      render();
    });

    render();

    /* -- invio -------------------------------------------------------------- */
    const done = $('#booking-done', wz);
    const box = $('[data-form-error]', form);
    const btn = $('[data-submit]', form);
    const endpoint = wz.dataset.endpoint || '';
    const demo = !endpoint || wz.dataset.mode !== 'live';
    let inviando = false;

    form.setAttribute('novalidate', '');
    $$('input, textarea, select', form).forEach((el) => {
      el.addEventListener('blur', () => validateField(el));
      el.addEventListener('input', () => {
        const f = el.closest('.field') || el.closest('.check');
        if (f?.classList.contains('is-invalid')) validateField(el);
      });
    });

    const errore = (html) => {
      if (!box) return;
      box.innerHTML = html;
      box.hidden = false;
      box.scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth', block: 'center' });
    };

    const mostraConferma = ({ bookingId, emailSent, status }) => {
      const titolo = $('[data-done-title]', done);
      const lead = $('[data-done-lead]', done);
      const nota = $('[data-done-note]', done);
      const code = $('[data-done-code]', done);
      const nome = form.nome.value.trim();
      const quando =
        state.modalita === 'prenota'
          ? tr('whenFor', state.giornoLabel, state.ora)
          : tr('whenCallback');
      if (lead) lead.textContent = tr('thanksFor', nome, quando);
      const confermata = status === 'CONFIRMED';
      if (titolo && confermata && !demo) titolo.textContent = tr('confirmedTitle');
      if (nota) {
        nota.textContent = demo
          ? tr('demoNote')
          : confermata
            ? (emailSent ? tr('confirmedNote') : tr('confirmedFailedNote'))
            : (emailSent ? tr('emailSentNote') : tr('emailFailedNote'));
      }
      if (code) code.textContent = bookingId || '—';
      form.hidden = true;
      done.hidden = false;
      done.focus({ preventScroll: true });
      done.scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth', block: 'center' });
    };

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (inviando) return; // doppio click: il secondo non parte nemmeno
      if (box) box.hidden = true;

      const campi = $$('input, textarea, select', form).filter((el) => !el.disabled);
      const invalidi = campi.filter((el) => !validateField(el));
      if (invalidi.length) { invalidi[0].focus(); return; }

      inviando = true;
      btn.classList.add('is-busy');
      btn.disabled = true;
      const testo = btn.textContent;
      btn.textContent = tr('sendingBtn');

      const payload = {
        nome: form.nome.value,
        cognome: form.cognome.value,
        email: form.email.value,
        telefono: form.telefono.value,
        servizio: state.servizio,
        risposte: state.risposte,
        modalita: state.modalita,
        canale: state.canale,
        fascia: state.fascia,
        dottore: state.dottore,
        dataRichiesta: state.giorno,
        oraRichiesta: state.ora,
        secondaData: state.secondaData,
        secondaOra: state.secondaOra,
        messaggio: form.messaggio?.value || '',
        privacy: form.privacy.checked,
        comunicazioni: form.comunicazioni?.checked || false,
        azienda: form.azienda?.value || '',
        lang: document.documentElement.lang || 'it',
        startedAt: apertoIl
      };

      const ripristina = () => {
        inviando = false;
        btn.classList.remove('is-busy');
        btn.disabled = false;
        btn.textContent = testo;
      };

      if (demo) {
        setTimeout(() => {
          ripristina();
          mostraConferma({ bookingId: 'APT-DEMO-000000', emailSent: false });
        }, 600);
        return;
      }

      try {
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json().catch(() => ({}));

        if (res.status === 422 && data.fields) {
          ripristina();
          Object.entries(data.fields).forEach(([nome, msg]) => {
            const el = form.elements[nome];
            const field = el?.closest('.field') || el?.closest('.check');
            if (field) {
              field.classList.add('is-invalid');
              const e2 = field.querySelector('.field__error');
              if (e2) e2.textContent = msg;
            }
          });
          errore(data.message || tr('invalidFields'));
          return;
        }
        if (!res.ok || !data.ok) {
          ripristina();
          errore(data.message || tr('submitFailed'));
          return;
        }
        ripristina();
        mostraConferma({ bookingId: data.bookingId, emailSent: data.emailSent !== false, status: data.status });
      } catch {
        ripristina();
        errore(tr('networkFailed'));
      }
    });
  };


  /* -- Autogestione prenotazione: annulla o sposta con un click -----------
     La regola delle 24 ore la applica il server (e' l'unica fonte di
     verita': un orologio del browser non e' affidabile). Qui si mostra
     semplicemente cio' che il server dice di poter fare.               */
  const gestisciPrenotazione = () => {
    const box = $('[data-manage]');
    if (!box) return;

    const qs = new URLSearchParams(location.search);
    const b = qs.get('b') || '';
    const tk = qs.get('t') || '';
    const endpoint = box.dataset.endpoint || '';
    const demo = !endpoint || box.dataset.mode !== 'live';
    const base = endpoint.replace(/prenotazioni\/?$/, '');
    const telefono = box.dataset.phone || '';
    const telefonoHref = box.dataset.phoneHref || '';
    const email = box.dataset.email || '';

    const slotsEl = $('script[data-manage-slots]');
    const slotsData = slotsEl ? JSON.parse(slotsEl.textContent) : {};
    const orari = slotsData.orari || [];
    const chiusuraIn = { date: [], periodi: [] };
    if (slotsData.chiusure) {
      if (Array.isArray(slotsData.chiusure.date)) chiusuraIn.date = slotsData.chiusure.date;
      if (Array.isArray(slotsData.chiusure.periodi)) chiusuraIn.periodi = slotsData.chiusure.periodi;
    }
    /** Stessa regola del server (api/_lib/chiusure.mjs): domenica, festivi ed eventuali periodi di ferie. */
    const giornoChiuso = (iso, day) => {
      if (day === 0) return true;
      if (chiusuraIn.date.includes(iso)) return true;
      return chiusuraIn.periodi.some((p) => iso >= p.da && iso <= p.a);
    };

    const contatti = () => `<p class="body mt-3">${tr('contatti', telefonoHref, telefono, email)}</p>`;

    const erroreGenerico = () => {
      box.innerHTML = `<h2 class="h3">${tr('manageLoadError')}</h2>
        <p class="body mt-2">${tr('manageLoadErrorBody')}</p>
        ${contatti()}`;
    };

    if (!b || !tk || demo) {
      erroreGenerico();
      return;
    }

    const giorniDisponibili = () => {
      const out = [];
      const d = new Date();
      d.setHours(12, 0, 0, 0);
      let sicurezza = 0;
      while (out.length < 12 && sicurezza < 400) {
        d.setDate(d.getDate() + 1);
        sicurezza++;
        const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        if (giornoChiuso(iso, d.getDay())) continue;
        out.push({
          iso,
          gs: d.toLocaleDateString(LOCALE, { weekday: 'short' }),
          n: d.getDate(),
          ms: d.toLocaleDateString(LOCALE, { month: 'short' }),
          full: d.toLocaleDateString(LOCALE, { weekday: 'long', day: 'numeric', month: 'long' })
        });
      }
      return out;
    };

    const dataEstesa = (iso) => {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return iso;
      return new Date(iso + 'T12:00:00').toLocaleDateString(LOCALE, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    };

    const caricaDisponibilita = async (iso) => {
      try {
        const res = await fetch(`${base}disponibilita?giorno=${encodeURIComponent(iso)}`);
        const data = await res.json();
        if (data?.chiuso) return new Set(orari);
        return new Set(Array.isArray(data?.occupati) ? data.occupati : []);
      } catch {
        return new Set();
      }
    };

    const orariBloccati = (occupati, slotCount) => {
      const bloccati = new Set();
      orari.forEach((h, i) => {
        const richiesti = orari.slice(i, i + slotCount);
        if (richiesti.length !== slotCount || richiesti.some((o) => occupati.has(o))) bloccati.add(h);
      });
      return bloccati;
    };

    const stato = { data: null, ora: null, giornoScelto: '', occupati: new Set(), inviando: false };

    const schedaAppuntamento = (s) => `
      <p class="label">${s.tipo_visita}</p>
      <h2 class="h3 mt-1">${dataEstesa(s.data)}<br>${tr('atHour', s.ora)}</h2>
      <p class="small mt-2" style="color:var(--stone-light)">${tr('code', s.booking_id)}</p>`;

    const disegnaFuoriFinestra = (s) => {
      box.innerHTML = `${schedaAppuntamento(s)}
        <div class="form-note mt-4">
          <p class="body">${tr('outOfWindow')}</p>
          ${contatti()}
        </div>`;
    };

    const disegnaNonGestibile = (s) => {
      const etichetta = { CANCELLED: tr('statusCancelled'), COMPLETED: tr('statusCompleted') }[s.status] || s.status.toLowerCase();
      box.innerHTML = `${schedaAppuntamento(s)}
        <p class="body mt-4">${tr('notManageable', etichetta)}</p>`;
    };

    const disegnaEsito = (titolo, messaggio) => {
      box.innerHTML = `<h2 class="h3">${titolo}</h2><p class="body mt-2">${messaggio}</p>`;
    };

    const disegnaGestibile = (s) => {
      box.innerHTML = `${schedaAppuntamento(s)}
        <div class="row mt-4">
          <button class="btn btn--ghost" type="button" data-azione="sposta">${tr('rescheduleBtn')}</button>
          <button class="btn btn--ghost" type="button" data-azione="annulla">${tr('cancelBtn')}</button>
        </div>
        <div class="mt-5" data-pannello hidden></div>`;

      const pannello = $('[data-pannello]', box);

      $('[data-azione="annulla"]', box).addEventListener('click', async () => {
        if (!window.confirm(tr('confirmCancel'))) return;
        box.querySelectorAll('button').forEach((btn) => (btn.disabled = true));
        try {
          const res = await fetch(`${base}prenotazione-cancella`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ b, t: tk })
          });
          const data = await res.json().catch(() => ({}));
          if (res.ok && data.ok) {
            disegnaEsito(tr('cancelledTitle'), tr('cancelledBody'));
          } else if (data.error === 'fuori_finestra') {
            disegnaFuoriFinestra(s);
          } else {
            erroreGenerico();
          }
        } catch {
          erroreGenerico();
        }
      });

      $('[data-azione="sposta"]', box).addEventListener('click', () => {
        pannello.hidden = false;
        const giorni = giorniDisponibili();
        pannello.innerHTML = `
          <p class="label">${tr('newDay')}</p>
          <div class="daypick mt-2">
            ${giorni
              .map(
                (g) => `<button class="day" type="button" data-day="${g.iso}" aria-pressed="false">
              <span>${g.gs}</span><strong>${g.n}</strong><span>${g.ms}</span>
            </button>`
              )
              .join('')}
          </div>
          <p class="label mt-4">${tr('newTime')}</p>
          <div class="slots mt-2" data-manage-slots-box><p class="small" style="color:var(--stone-light)">${tr('chooseDayFirst')}</p></div>
          <div class="row mt-4">
            <button class="btn" type="button" data-conferma-sposta disabled>${tr('confirmNewTime')}</button>
          </div>
          <p class="form-error mt-3" data-errore-sposta hidden></p>`;

        const slotsBox = $('[data-manage-slots-box]', pannello);
        const btnConferma = $('[data-conferma-sposta]', pannello);
        const erroreSposta = $('[data-errore-sposta]', pannello);

        const disegnaSlots = () => {
          const bloccati = orariBloccati(stato.occupati, s.slotCount || 1);
          slotsBox.innerHTML = orari
            .map((h) => {
              const off = bloccati.has(h);
              return `<button class="slot${off ? ' is-off' : ''}" type="button" data-hour="${h}" aria-pressed="${stato.ora === h}"${off ? ' disabled' : ''}>${h}</button>`;
            })
            .join('');
        };

        pannello.addEventListener('click', async (e) => {
          const dayBtn = e.target.closest('[data-day]');
          if (dayBtn) {
            stato.data = dayBtn.dataset.day;
            stato.ora = null;
            btnConferma.disabled = true;
            $$('[data-day]', pannello).forEach((x) => x.setAttribute('aria-pressed', String(x === dayBtn)));
            slotsBox.innerHTML = `<p class="small" style="color:var(--stone-light)">${tr('checkingAvailability')}</p>`;
            stato.occupati = await caricaDisponibilita(stato.data);
            disegnaSlots();
            return;
          }
          const hourBtn = e.target.closest('[data-hour]');
          if (hourBtn && !hourBtn.disabled) {
            stato.ora = hourBtn.dataset.hour;
            $$('[data-hour]', pannello).forEach((x) => x.setAttribute('aria-pressed', String(x === hourBtn)));
            btnConferma.disabled = false;
          }
        });

        btnConferma.addEventListener('click', async () => {
          if (!stato.data || !stato.ora || stato.inviando) return;
          stato.inviando = true;
          btnConferma.disabled = true;
          erroreSposta.hidden = true;
          try {
            const res = await fetch(`${base}prenotazione-sposta`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ b, t: tk, data: stato.data, ora: stato.ora })
            });
            const data = await res.json().catch(() => ({}));
            if (res.ok && data.ok) {
              disegnaEsito(tr('rescheduledTitle'), tr('rescheduledBody', dataEstesa(data.data), data.ora));
              return;
            }
            if (data.error === 'fuori_finestra') {
              disegnaFuoriFinestra(s);
              return;
            }
            erroreSposta.textContent = data.error === 'slot_occupato' ? tr('slotTaken') : tr('rescheduleFailed');
            erroreSposta.hidden = false;
            stato.occupati = await caricaDisponibilita(stato.data);
            disegnaSlots();
          } catch {
            erroreSposta.textContent = tr('networkRetry');
            erroreSposta.hidden = false;
          } finally {
            stato.inviando = false;
            btnConferma.disabled = !(stato.data && stato.ora);
          }
        });
      });
    };

    fetch(`${base}prenotazione?b=${encodeURIComponent(b)}&t=${encodeURIComponent(tk)}`)
      .then((res) => res.json().then((data) => ({ res, data })))
      .then(({ res, data }) => {
        if (!res.ok || !data.ok) {
          erroreGenerico();
          return;
        }
        if (!data.gestibile) disegnaNonGestibile(data);
        else if (!data.selfService) disegnaFuoriFinestra(data);
        else disegnaGestibile(data);
      })
      .catch(erroreGenerico);
  };

  /* -- Transizione di pagina ----------------------------------------------*/
  const transitions = () => {
    requestAnimationFrame(() => document.body.classList.add('is-ready'));
    if (reduced()) return;
    document.addEventListener('click', (e) => {
      const a = e.target.closest('a');
      if (!a || e.metaKey || e.ctrlKey || e.shiftKey || a.target === '_blank') return;
      const href = a.getAttribute('href') || '';
      if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('http')) return;
      e.preventDefault();
      document.body.classList.add('is-leaving');
      setTimeout(() => { window.location.href = a.href; }, 180);
    });
    window.addEventListener('pageshow', (e) => { if (e.persisted) document.body.classList.remove('is-leaving'); });
  };

  /* -- Anno corrente -------------------------------------------------------*/
  const year = () => { $$('[data-year]').forEach((el) => (el.textContent = new Date().getFullYear())); };

  /* -- Avvio ---------------------------------------------------------------*/
  const init = () => {
    year(); header(); sectionNav(); reveals(); rails();
    faq(); beforeAfter(); filters(); forms(); wizard(); gestisciPrenotazione(); transitions();
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
