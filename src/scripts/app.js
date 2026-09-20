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

  /* -- Quick nav: anteprima fotografica al passaggio ----------------------*/
  const quicknav = () => {
    const nav = $('[data-quicknav]');
    const preview = $('.quicknav__preview');
    if (!nav || !preview) return;
    const imgs = $$('img', preview);
    let raf = null, tx = 0, ty = 0, cx = 0, cy = 0, active = false;

    const loop = () => {
      cx += (tx - cx) * 0.14;
      cy += (ty - cy) * 0.14;
      preview.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%) scale(${active ? 1 : 0.94})`;
      raf = requestAnimationFrame(loop);
    };

    nav.addEventListener('pointermove', (e) => {
      tx = e.clientX; ty = e.clientY;
      if (!raf) { cx = tx; cy = ty; raf = requestAnimationFrame(loop); }
    });
    $$('[data-preview]', nav).forEach((item) => {
      item.addEventListener('pointerenter', () => {
        active = true;
        preview.classList.add('is-visible');
        imgs.forEach((i) => i.classList.toggle('is-active', i.dataset.key === item.dataset.preview));
      });
    });
    nav.addEventListener('pointerleave', () => {
      active = false;
      preview.classList.remove('is-visible');
      setTimeout(() => { if (!active && raf) { cancelAnimationFrame(raf); raf = null; } }, 500);
    });
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

  /* -- Wizard prenotazione -------------------------------------------------*/
  const wizard = () => {
    const wz = $('[data-wizard]');
    if (!wz) return;
    const panels = $$('.wizard__panel', wz);
    const steps = $$('.wizard__steps li', wz);
    const state = { tipo: '', tipoLabel: '', dottore: 'Nessuna preferenza', giorno: '', giornoLabel: '', ora: '' };
    const apertoIl = Date.now();
    let idx = 0;

    let started = false;
    const show = (i) => {
      idx = clamp(i, 0, panels.length - 1);
      panels.forEach((p, n) => (p.hidden = n !== idx));
      steps.forEach((s, n) => s.setAttribute('data-state', n === idx ? 'current' : n < idx ? 'done' : 'todo'));
      const title = $('h2, h3', panels[idx]);
      if (title) title.setAttribute('tabindex', '-1');
      if (started && idx > 0) title?.focus({ preventScroll: true });
      // al primo render non si sposta la pagina: la hero deve restare visibile
      if (started) wz.scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth', block: 'start' });
      syncSummary();
      syncNext();
    };

    const syncSummary = () => {
      $$('[data-summary]', wz).forEach((el) => {
        const k = el.dataset.summary === 'giorno' ? 'giornoLabel' : el.dataset.summary;
        el.textContent = state[k] || '—';
      });
      const hidden = $('[data-booking-detail]', wz);
      if (hidden) hidden.value = `${state.tipoLabel} · ${state.dottore} · ${state.giornoLabel} ${state.ora}`;
    };

    const syncNext = () => {
      const next = $('[data-next]', panels[idx]);
      if (!next) return;
      const need = panels[idx].dataset.requires;
      next.disabled = need ? need.split(' ').some((k) => !state[k]) : false;
    };

    // giorni disponibili generati a runtime: niente date che invecchiano nell'HTML
    const days = $('[data-days]', wz);
    if (days) {
      const out = [];
      const d = new Date();
      d.setHours(12, 0, 0, 0);
      while (out.length < 12) {
        d.setDate(d.getDate() + 1);
        if (d.getDay() === 0) continue; // domenica chiuso
        const label = d.toLocaleDateString('it-IT', { weekday: 'short' });
        const month = d.toLocaleDateString('it-IT', { month: 'short' });
        const full = d.toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long' });
        const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        out.push(`<button class="day" type="button" data-set="giorno" data-value="${iso}" data-label="${full}" aria-pressed="false">
          <span>${label}</span><strong>${d.getDate()}</strong><span>${month}</span>
        </button>`);
      }
      days.innerHTML = out.join('');
    }

    $$('[data-set]', wz).forEach((btn) => {
      btn.addEventListener('click', () => {
        const key = btn.dataset.set;
        const scope = btn.closest('[data-group]') || wz;
        $$(`[data-set="${key}"]`, scope).forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
        state[key] = btn.dataset.value;
        if (key === 'tipo') state.tipoLabel = btn.dataset.label || btn.dataset.value;
        if (key === 'giorno') state.giornoLabel = btn.dataset.label || btn.dataset.value;
        syncSummary(); syncNext();
      });
    });
    bookingSubmit(wz, state, apertoIl);

    $$('[data-next]', wz).forEach((b) => b.addEventListener('click', () => show(idx + 1)));
    $$('[data-prev]', wz).forEach((b) => b.addEventListener('click', () => show(idx - 1)));
    show(0);
    started = true;
  };

  /* -- Invio della richiesta di appuntamento -------------------------------*/
  const bookingSubmit = (wz, state, apertoIl) => {
    const form = $('form[data-booking]', wz);
    if (!form) return;
    form.setAttribute('novalidate', '');
    $$('input, textarea, select', form).forEach((el) => {
      el.addEventListener('blur', () => validateField(el));
      el.addEventListener('input', () => {
        const f = el.closest('.field') || el.closest('.check');
        if (f?.classList.contains('is-invalid')) validateField(el);
      });
    });
    const done = $('#booking-done', wz);
    const box = $('[data-form-error]', form);
    const btn = $('[data-submit]', form);
    const endpoint = wz.dataset.endpoint || '';
    const demo = !endpoint || wz.dataset.mode !== 'live';
    let inviando = false;

    const errore = (html) => {
      if (!box) return;
      box.innerHTML = html;
      box.hidden = false;
      box.scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth', block: 'center' });
    };

    const mostraConferma = ({ bookingId, emailSent }) => {
      const lead = $('[data-done-lead]', done);
      const note = $('[data-done-note]', done);
      const code = $('[data-done-code]', done);
      const nome = form.nome.value.trim();
      if (lead) lead.textContent = `Grazie, ${nome}. Abbiamo ricevuto la tua richiesta di appuntamento per ${state.giornoLabel} alle ${state.ora}.`;
      if (note) {
        note.textContent = demo
          ? 'Modalità dimostrativa: nessuna email è stata inviata e nessun appuntamento è stato registrato.'
          : emailSent
            ? 'Ti abbiamo inviato una email con il riepilogo. Il nostro team ti contatterà per confermare definitivamente la disponibilità.'
            : 'Non siamo riusciti a inviarti l\'email di riepilogo, ma la richiesta è registrata. Il nostro team ti contatterà per confermare la disponibilità.';
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
      if (!state.giorno || !state.ora) {
        errore('Scegli giorno e orario prima di inviare la richiesta.');
        return;
      }

      inviando = true;
      btn.classList.add('is-busy');
      btn.disabled = true;
      const etichetta = btn.textContent;
      btn.textContent = 'Invio in corso';

      const payload = {
        nome: form.nome.value,
        cognome: form.cognome.value,
        email: form.email.value,
        telefono: form.telefono.value,
        tipoVisita: state.tipo,
        dottore: state.dottore,
        dataRichiesta: state.giorno,
        oraRichiesta: state.ora,
        secondaData: form.secondaData?.value || '',
        secondaOra: form.secondaOra?.value || '',
        messaggio: form.messaggio?.value || '',
        privacy: form.privacy.checked,
        comunicazioni: form.comunicazioni?.checked || false,
        azienda: form.azienda?.value || '',
        startedAt: apertoIl
      };

      const ripristina = () => {
        inviando = false;
        btn.classList.remove('is-busy');
        btn.disabled = false;
        btn.textContent = etichetta;
      };

      if (demo) {
        // nessun endpoint configurato: si mostra la conferma dicendo chiaramente
        // che è una dimostrazione, mai una finta conferma
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
          errore(
            (data.message || 'Non siamo riusciti a inviare la richiesta. Riprova oppure contatta direttamente lo studio.') +
              ' <a href="tel:' + (form.dataset.phone || '') + '">Chiama lo studio</a>'
          );
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

  /* -- Box domande: elenco, filtro e risposte gia' scritte -----------------*/
  const askBox = () => {
    const box = $('[data-ask]');
    if (!box) return;
    const panel = $('.ask__panel', box);
    const toggle = $('.ask__toggle', box);
    const lista = $('[data-ask-list]', box);
    const ricerca = $('[data-ask-search]', box);
    const vuoto = $('[data-ask-empty]', box);
    const voci = $$('.ask__questions li', box);
    const risposte = $$('.ask__answer', box);
    const topics = $$('.ask__topic', box);
    let topic = 'all';

    const mostraElenco = () => {
      risposte.forEach((r) => (r.hidden = true));
      lista.hidden = false;
      box.querySelector('.ask__body').scrollTop = 0;
    };

    const apri = (id) => {
      const target = $('#ask-' + CSS.escape(id), box);
      if (!target) return;
      lista.hidden = true;
      risposte.forEach((r) => (r.hidden = r !== target));
      box.querySelector('.ask__body').scrollTop = 0;
      target.focus({ preventScroll: true });
    };

    const filtra = () => {
      const q = (ricerca?.value || '').trim().toLowerCase();
      let visibili = 0;
      voci.forEach((li) => {
        const okTopic = topic === 'all' || li.dataset.topic === topic;
        const okTesto = !q || li.dataset.text.includes(q);
        li.hidden = !(okTopic && okTesto);
        if (!li.hidden) visibili++;
      });
      if (vuoto) vuoto.hidden = visibili > 0;
    };

    const apriPannello = () => {
      panel.hidden = false;
      requestAnimationFrame(() => box.classList.add('is-open'));
      toggle.setAttribute('aria-expanded', 'true');
      setTimeout(() => ricerca?.focus({ preventScroll: true }), 260);
    };
    const chiudiPannello = () => {
      box.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      setTimeout(() => { panel.hidden = true; }, 320);
      toggle.focus({ preventScroll: true });
    };

    toggle.addEventListener('click', apriPannello);
    $('.ask__close', box)?.addEventListener('click', chiudiPannello);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && box.classList.contains('is-open')) chiudiPannello();
    });
    document.addEventListener('click', (e) => {
      if (box.classList.contains('is-open') && !box.contains(e.target)) chiudiPannello();
    });

    box.addEventListener('click', (e) => {
      const apriBtn = e.target.closest('[data-open]');
      if (apriBtn) { apri(apriBtn.dataset.open); return; }
      if (e.target.closest('[data-ask-back]')) mostraElenco();
    });

    topics.forEach((t) => {
      t.addEventListener('click', () => {
        topic = t.dataset.topic;
        topics.forEach((x) => x.setAttribute('aria-pressed', String(x === t)));
        filtra();
      });
    });
    ricerca?.addEventListener('input', filtra);
    filtra();
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
    year(); header(); sectionNav(); reveals(); parallax(); quicknav(); rails();
    faq(); beforeAfter(); filters(); forms(); wizard(); askBox(); transitions(); smoothScroll();
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
