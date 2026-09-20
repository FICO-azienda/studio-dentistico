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

  /* -- Smooth scroll ammortizzato (solo mouse wheel, no trackpad) ---------- */
  const smoothScroll = () => {
    if (reduced() || window.matchMedia('(hover: none)').matches) return;
    let target = window.scrollY;
    let current = target;
    let running = false;

    const max = () => document.documentElement.scrollHeight - window.innerHeight;

    const loop = () => {
      current += (target - current) * 0.12;
      if (Math.abs(target - current) < 0.4) { current = target; running = false; }
      window.scrollTo(0, current);
      if (running) requestAnimationFrame(loop);
    };

    window.addEventListener('wheel', (e) => {
      if (e.ctrlKey || e.defaultPrevented) return;
      // i trackpad producono molti eventi piccoli: li lasciamo al browser
      if (e.deltaMode === 0 && Math.abs(e.deltaY) < 40) { running = false; target = window.scrollY; return; }
      if ($('.menu.is-open')) return;
      e.preventDefault();
      if (!running) { current = window.scrollY; }
      target = clamp(target + e.deltaY * 1.05, 0, max());
      if (!running) { running = true; requestAnimationFrame(loop); }
    }, { passive: false });

    window.addEventListener('scroll', () => { if (!running) target = window.scrollY; }, { passive: true });
    document.documentElement.classList.add('has-lenis');
  };

  /* -- Reveal --------------------------------------------------------------*/
  const reveals = () => {
    const items = $$('.reveal, .img-mask, .line-mask, .step, [data-count]');
    if (!items.length) return;
    if (reduced() || !('IntersectionObserver' in window)) {
      items.forEach((el) => { el.classList.add('is-in'); if (el.dataset.count) el.textContent = el.dataset.countFormatted || el.dataset.count; });
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        if (entry.target.hasAttribute('data-count')) countUp(entry.target);
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
    const fmt = (v) => v.toLocaleString('it-IT', { minimumFractionDigits: dec, maximumFractionDigits: dec });
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
    const menu = $('.menu');
    const burger = $('.burger');
    const mcta = $('.mobile-cta');
    let last = window.scrollY;

    const overUntil = () => (hero ? hero.offsetTop + hero.offsetHeight - 120 : 0);

    const update = () => {
      const y = window.scrollY;
      const over = y < overUntil();
      hd.classList.toggle('header--over', over);
      hd.classList.toggle('header--on-dark', over && hero?.dataset.headerOver === 'dark');
      hd.classList.toggle('header--solid', !over && y > 40);
      const hidden = y > last + 4 && y > 400 && !menu?.classList.contains('is-open');
      hd.classList.toggle('header--hidden', hidden);
      document.body.classList.toggle('header-hidden', hidden);
      if (mcta) mcta.classList.toggle('is-visible', y > 600);
      last = y;
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);

    if (!menu || !burger) return;
    const close = () => {
      menu.classList.remove('is-open');
      hd.classList.remove('is-open');
      document.body.classList.remove('is-locked');
      burger.setAttribute('aria-expanded', 'false');
      update();
    };
    const open = () => {
      menu.classList.add('is-open');
      hd.classList.add('is-open');
      document.body.classList.add('is-locked');
      burger.setAttribute('aria-expanded', 'true');
      const first = $('a', menu);
      if (first) setTimeout(() => first.focus({ preventScroll: true }), 420);
    };
    burger.addEventListener('click', () => (menu.classList.contains('is-open') ? close() : open()));
    menu.addEventListener('click', (e) => { if (e.target.closest('a')) close(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && menu.classList.contains('is-open')) { close(); burger.focus(); } });
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

    if (!bar || !bar.hasAttribute('data-scrollspy')) return;

    const links = $$('.subnav__link[data-spy]', bar);
    const sections = links
      .map((l) => ({ link: l, el: document.getElementById(l.dataset.spy) }))
      .filter((x) => x.el);
    if (!sections.length) return;

    const track = $('.subnav__track', bar);
    let current = null;
    let ticking = false;

    const update = () => {
      const line = window.scrollY + offset() + 8;
      let active = null;
      for (const s of sections) if (s.el.offsetTop <= line) active = s;
      // in fondo alla pagina vince sempre l'ultima sezione
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
        active = sections[sections.length - 1];
      }
      if (active === current) { ticking = false; return; }
      current = active;
      links.forEach((l) => l.classList.toggle('is-active', !!active && l === active.link));
      if (active && track && track.scrollWidth > track.clientWidth) {
        const r = active.link.getBoundingClientRect();
        const t = track.getBoundingClientRect();
        if (r.left < t.left + 16 || r.right > t.right - 16) {
          track.scrollTo({ left: active.link.offsetLeft - 24, behavior: reduced() ? 'auto' : 'smooth' });
        }
      }
      ticking = false;
    };

    const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    update();
  };

  /* -- Parallax ------------------------------------------------------------*/
  const parallax = () => {
    const items = $$('[data-parallax]');
    if (!items.length || reduced()) return;
    let ticking = false;
    const run = () => {
      const vh = window.innerHeight;
      items.forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.bottom < -200 || r.top > vh + 200) return;
        const amt = parseFloat(el.dataset.parallax) || 8;
        const p = (r.top + r.height / 2 - vh / 2) / vh; // -1 .. 1
        el.style.transform = `translate3d(0, ${(-p * amt).toFixed(2)}%, 0)`;
      });
      ticking = false;
    };
    const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(run); } };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    run();
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
      dottore: 'Nessuna preferenza'
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

    const giorniDisponibili = () => {
      const out = [];
      const d = new Date();
      d.setHours(12, 0, 0, 0);
      while (out.length < 12) {
        d.setDate(d.getDate() + 1);
        if (d.getDay() === 0) continue; // domenica chiuso
        out.push({
          iso: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`,
          gs: d.toLocaleDateString('it-IT', { weekday: 'short' }),
          n: d.getDate(),
          ms: d.toLocaleDateString('it-IT', { month: 'short' }),
          full: d.toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long' })
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
        <label class="field mt-3"><span class="sr-only">Cerca un servizio</span>
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
      return `${titolo(q.q, multi ? 'Puoi scegliere più di una risposta.' : '')}
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
                o.v === 'prenota' ? 'Scegli giorno e orario dal calendario.' : 'Ti richiamiamo noi quando preferisci.',
                state.modalita === o.v
              )
            )
            .join('')}
        </div>`;
    };

    const disegnaQuando = () => {
      const giorni = giorniDisponibili();
      return `${titolo('Quando ti è comodo?', 'Gli orari mostrati sono indicativi: la segreteria conferma la disponibilità effettiva.')}
        <p class="label mt-4">Giorno</p>
        <div class="daypick mt-2">
          ${giorni
            .map(
              (g) => `<button class="day" type="button" data-day="${g.iso}" data-label="${g.full}" aria-pressed="${state.giorno === g.iso}">
            <span>${g.gs}</span><strong>${g.n}</strong><span>${g.ms}</span>
          </button>`
            )
            .join('')}
        </div>
        <p class="label mt-4">Orario</p>
        <div class="slots mt-2">
          ${slots.orari.map((h) => `<button class="slot" type="button" data-hour="${h}" aria-pressed="${state.ora === h}">${h}</button>`).join('')}
        </div>
        <p class="label mt-4">Seconda preferenza <span style="text-transform:none;letter-spacing:0;color:var(--stone-light)">— facoltativa</span></p>
        <div class="form-grid mt-2">
          <label class="field"><span class="field__label label">Giorno alternativo</span>
            <input type="date" data-second-date value="${state.secondaData}"></label>
          <label class="field"><span class="field__label label">Orario alternativo</span>
            <select data-second-hour>
              <option value="">Nessuna preferenza</option>
              ${slots.orari.map((h) => `<option value="${h}"${state.secondaOra === h ? ' selected' : ''}>${h}</option>`).join('')}
            </select>
          </label>
        </div>
        <p class="label mt-4">Professionista</p>
        <label class="field"><span class="sr-only">Professionista</span>
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
      if (state.servizioOrigine) righe.push(['Richiesta iniziale', cfg.services.find((x) => x.id === state.servizioOrigine)?.label || '—']);
      righe.push(['Servizio', s ? s.label : '—']);
      if (s) {
        s.questions.filter(visibile).forEach((q) => {
          const val = state.risposte[q.id];
          if (!val || (Array.isArray(val) && !val.length)) return;
          righe.push([q.q, q.type === 'text' ? String(val) : (Array.isArray(val) ? val : [val]).map((v) => etichettaOpzione(q, v)).join(', ')]);
        });
      }
      if (state.modalita === 'prenota') {
        righe.push(['Giorno', state.giornoLabel || '—']);
        righe.push(['Orario', state.ora || '—']);
        if (state.secondaData) righe.push(['Seconda preferenza', state.secondaData + (state.secondaOra ? ' alle ' + state.secondaOra : '')]);
        righe.push(['Professionista', state.dottore]);
      } else if (state.modalita === 'ricontatto') {
        righe.push(['Modalità', 'Richiamata']);
        righe.push(['Canale preferito', etichettaOpzione(cfg.tail.channelQuestion, state.canale)]);
        righe.push(['Fascia oraria', etichettaOpzione(cfg.tail.windowQuestion, state.fascia)]);
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
      if (etichetta) etichetta.textContent = noto ? `Passo ${i + 1} di ${totale}` : 'Scegli il servizio';
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
        btnNext.textContent = lista[i + 1] && lista[i + 1].kind === 'final' ? 'Vai ai tuoi dati' : 'Continua';
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

    const mostraConferma = ({ bookingId, emailSent }) => {
      const lead = $('[data-done-lead]', done);
      const nota = $('[data-done-note]', done);
      const code = $('[data-done-code]', done);
      const nome = form.nome.value.trim();
      const quando =
        state.modalita === 'prenota'
          ? `per ${state.giornoLabel} alle ${state.ora}`
          : 'e la richiamata che ci hai chiesto';
      if (lead) lead.textContent = `Grazie, ${nome}. Abbiamo ricevuto la tua richiesta ${quando}.`;
      if (nota) {
        nota.textContent = demo
          ? 'Modalità dimostrativa: nessuna email è stata inviata e nessun appuntamento è stato registrato.'
          : emailSent
            ? 'Ti abbiamo inviato una email con il riepilogo. Il nostro team ti contatterà per confermare definitivamente la disponibilità.'
            : "Non siamo riusciti a inviarti l'email di riepilogo, ma la richiesta è registrata. Il nostro team ti contatterà per confermare la disponibilità.";
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
      btn.textContent = 'Invio in corso';

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
          errore(data.message || 'Alcuni dati non sono validi.');
          return;
        }
        if (!res.ok || !data.ok) {
          ripristina();
          errore(data.message || 'Non siamo riusciti a inviare la richiesta. Riprova oppure contatta direttamente lo studio.');
          return;
        }
        ripristina();
        mostraConferma({ bookingId: data.bookingId, emailSent: data.emailSent !== false });
      } catch {
        ripristina();
        errore('Non siamo riusciti a inviare la richiesta. Controlla la connessione, riprova oppure contatta direttamente lo studio.');
      }
    });
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
      setTimeout(() => { window.location.href = a.href; }, 320);
    });
    window.addEventListener('pageshow', (e) => { if (e.persisted) document.body.classList.remove('is-leaving'); });
  };

  /* -- Anno corrente -------------------------------------------------------*/
  const year = () => { $$('[data-year]').forEach((el) => (el.textContent = new Date().getFullYear())); };

  /* -- Avvio ---------------------------------------------------------------*/
  const init = () => {
    year(); header(); sectionNav(); reveals(); parallax(); rails();
    faq(); beforeAfter(); filters(); forms(); wizard(); transitions(); smoothScroll();
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
