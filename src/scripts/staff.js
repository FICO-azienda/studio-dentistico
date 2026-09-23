/* =============================================================================
   Studio Liddi — interfaccia web per lo staff
   Pagina a parte, non fa parte del bundle pubblico (app.js). Autenticazione
   a password condivisa (STAFF_TOKEN), nessun account: il token va nell'header
   Authorization di ogni chiamata, salvato in localStorage tra una visita e
   l'altra dello stesso computer.
   ========================================================================== */
(() => {
  'use strict';

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const STORAGE_KEY = 'studioLiddiStaffToken';

  const box = $('[data-staff]');
  if (!box) return;

  const endpoint = box.dataset.endpoint || '';
  const demo = !endpoint;
  const base = endpoint.replace(/prenotazioni\/?$/, '');

  const cfgEl = $('script[data-staff-config]');
  const cfg = cfgEl ? JSON.parse(cfgEl.textContent) : { orari: [], chiusure: {}, dottori: [] };
  const chiusuraIn = { date: [], periodi: [] };
  if (cfg.chiusure) {
    if (Array.isArray(cfg.chiusure.date)) chiusuraIn.date = cfg.chiusure.date;
    if (Array.isArray(cfg.chiusure.periodi)) chiusuraIn.periodi = cfg.chiusure.periodi;
  }
  const giornoChiuso = (iso, day) => {
    if (day === 0) return true;
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
      out.push({ iso, gs: d.toLocaleDateString('it-IT', { weekday: 'short' }), n: d.getDate(), ms: d.toLocaleDateString('it-IT', { month: 'short' }) });
    }
    return out;
  };
  const dataEstesa = (iso) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return iso;
    return new Date(iso + 'T12:00:00').toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  };

  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

  /* -- token e chiamate autenticate ---------------------------------------- */
  let token = '';
  try { token = localStorage.getItem(STORAGE_KEY) || ''; } catch { token = ''; }

  const chiamata = async (percorso, opt = {}) => {
    const res = await fetch(`${base}${percorso}`, {
      ...opt,
      headers: { ...(opt.headers || {}), Authorization: `Bearer ${token}` }
    });
    const data = await res.json().catch(() => ({}));
    return { res, data };
  };

  /* -- login ---------------------------------------------------------------- */
  const disegnaLogin = (errore = '') => {
    box.innerHTML = `
      <div class="staff-wrap">
        <div class="staff-login">
          <p class="label">Area riservata</p>
          <h1 class="h3 mt-2">Accesso staff</h1>
          <form data-login-form>
            <label class="field"><span class="sr-only">Password</span>
              <input type="password" data-token-input placeholder="Password" autocomplete="current-password" required>
            </label>
            <button class="btn btn--block mt-3" type="submit">Entra</button>
          </form>
          ${errore ? `<p class="form-error mt-3" role="alert">${esc(errore)}</p>` : ''}
        </div>
      </div>`;
    $('[data-login-form]', box).addEventListener('submit', (e) => {
      e.preventDefault();
      const val = $('[data-token-input]', box).value.trim();
      if (!val) return;
      token = val;
      try { localStorage.setItem(STORAGE_KEY, token); } catch { /* storage non disponibile: si resta comunque loggati per questa sessione */ }
      caricaEEsegui();
    });
  };

  const disegnaDemo = () => {
    box.innerHTML = `
      <div class="staff-wrap">
        <p class="label">Area riservata</p>
        <h1 class="h3 mt-2">Modalità dimostrativa</h1>
        <p class="body mt-3 measure-sm">Questa pagina funziona solo quando il sito è collegato a un'API di prenotazione reale (<code>site.booking.endpoint</code>). In modalità dimostrativa non ci sono prenotazioni da gestire.</p>
      </div>`;
  };

  /* -- dashboard -------------------------------------------------------------- */
  const ETICHETTA_STATO = { PENDING: 'In attesa', CONFIRMED: 'Confermata', RESCHEDULED: 'Spostata', CANCELLED: 'Annullata', COMPLETED: 'Conclusa' };
  const CLASSE_BADGE = { PENDING: 'staff-badge--pending', CONFIRMED: 'staff-badge--confirmed', RESCHEDULED: 'staff-badge--confirmed', CANCELLED: 'staff-badge--cancelled', COMPLETED: 'staff-badge--done' };

  const TAB = [
    { id: 'pending', label: 'Da confermare', filtro: (r) => r.status === 'PENDING' },
    { id: 'confermate', label: 'Confermate', filtro: (r) => r.status === 'CONFIRMED' || r.status === 'RESCHEDULED' },
    { id: 'chiuse', label: 'Annullate / concluse', filtro: (r) => r.status === 'CANCELLED' || r.status === 'COMPLETED' },
    { id: 'tutte', label: 'Tutte', filtro: () => true }
  ];

  const stato = { prenotazioni: [], tab: 'pending', nota: '' };

  const attr = (s) => esc(s).replace(/"/g, '&quot;');

  const cardAzioni = (r) => {
    if (r.status === 'PENDING') return `<button class="btn btn--sm" type="button" data-azione="conferma" data-id="${attr(r.booking_id)}">Conferma</button>`;
    if (r.status === 'CONFIRMED' || r.status === 'RESCHEDULED') {
      return `<button class="btn btn--ghost btn--sm" type="button" data-azione="sposta" data-id="${attr(r.booking_id)}">Sposta</button>
        <button class="btn btn--ghost btn--sm" type="button" data-azione="annulla" data-id="${attr(r.booking_id)}">Annulla</button>`;
    }
    return '';
  };

  const card = (r) => `
    <div class="staff-card" data-card data-id="${attr(r.booking_id)}">
      <div class="staff-card__top">
        <div>
          <p class="staff-card__id">${esc(r.booking_id)}</p>
          <p class="staff-card__name">${esc(r.nome)} ${esc(r.cognome)}</p>
          <p class="staff-card__meta">${esc(r.tipo_visita)} — ${esc(dataEstesa(r.data_richiesta))} alle ${esc(r.ora_richiesta)}</p>
          <p class="staff-card__meta">${esc(r.telefono)} · ${esc(r.email)}</p>
        </div>
        <span class="staff-badge ${CLASSE_BADGE[r.status] || ''}">${esc(ETICHETTA_STATO[r.status] || r.status)}</span>
      </div>
      <div class="staff-card__actions">${cardAzioni(r)}</div>
      <div class="staff-panel" data-panel hidden></div>
    </div>`;

  const disegnaLista = () => {
    const tabAttiva = TAB.find((t) => t.id === stato.tab) || TAB[0];
    const elenco = stato.prenotazioni.filter(tabAttiva.filtro);
    const lista = $('[data-lista]', box);
    if (!lista) return;
    lista.innerHTML = elenco.length
      ? elenco.map(card).join('')
      : `<p class="staff-empty">Nessuna prenotazione in questa categoria.</p>`;
  };

  const disegnaDashboard = () => {
    box.innerHTML = `
      <div class="staff-wrap">
        <div class="staff-header">
          <div>
            <p class="label">Area riservata</p>
            <h1>Prenotazioni</h1>
          </div>
          <div class="row">
            <button class="btn btn--ghost btn--sm" type="button" data-ricarica>Aggiorna</button>
            <button class="btn btn--ghost btn--sm" type="button" data-logout>Esci</button>
          </div>
        </div>
        ${stato.nota ? `<p class="form-note mt-2 mb-3">${esc(stato.nota)}</p>` : ''}
        <div class="staff-tabs" data-tabs>
          ${TAB.map((t) => `<button class="filter" type="button" data-tab="${t.id}" aria-pressed="${t.id === stato.tab}">${esc(t.label)}</button>`).join('')}
        </div>
        <div data-lista></div>
      </div>`;

    disegnaLista();

    $('[data-tabs]', box).addEventListener('click', (e) => {
      const b = e.target.closest('[data-tab]');
      if (!b) return;
      stato.tab = b.dataset.tab;
      $$('[data-tab]', box).forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
      disegnaLista();
    });

    $('[data-ricarica]', box).addEventListener('click', () => caricaEEsegui());
    $('[data-logout]', box).addEventListener('click', () => {
      try { localStorage.removeItem(STORAGE_KEY); } catch { /* niente da pulire */ }
      token = '';
      disegnaLogin();
    });

    box.addEventListener('click', (e) => {
      const b = e.target.closest('[data-azione]');
      if (!b) return;
      const id = b.dataset.id;
      const record = stato.prenotazioni.find((r) => r.booking_id === id);
      const panel = $(`[data-card][data-id="${CSS.escape(id)}"] [data-panel]`, box);
      if (!record || !panel) return;
      if (b.dataset.azione === 'conferma') apriPannelloConferma(record, panel);
      else if (b.dataset.azione === 'sposta') apriPannelloSposta(record, panel);
      else if (b.dataset.azione === 'annulla') eseguiAnnulla(record, panel);
    });
  };

  /* -- pannello: conferma ---------------------------------------------------- */
  const apriPannelloConferma = (r, panel) => {
    panel.hidden = !panel.hidden;
    if (panel.hidden) return;
    panel.innerHTML = `
      <label class="field"><span class="field__label label">Professionista</span>
        <select data-professionista>
          <option value="">— non specificato —</option>
          ${cfg.dottori.map((n) => `<option value="${attr(n)}"${r.professionista === n ? ' selected' : ''}>${esc(n)}</option>`).join('')}
        </select>
      </label>
      <div class="form-grid mt-2">
        <label class="field"><span class="field__label label">Data (se diversa da quella richiesta)</span>
          <input type="date" data-data value="${attr(r.data_richiesta)}"></label>
        <label class="field"><span class="field__label label">Ora</span>
          <select data-ora>
            ${cfg.orari.map((h) => `<option value="${h}"${r.ora_richiesta === h ? ' selected' : ''}>${h}</option>`).join('')}
          </select>
        </label>
      </div>
      <label class="field mt-2"><span class="field__label label">Nota per il paziente (facoltativa)</span>
        <textarea data-nota rows="2"></textarea>
      </label>
      <div class="row mt-3">
        <button class="btn btn--sm" type="button" data-conferma-invia>Conferma e invia email</button>
      </div>
      <p class="form-error mt-2" data-errore hidden></p>`;

    $('[data-conferma-invia]', panel).addEventListener('click', async () => {
      const btn = $('[data-conferma-invia]', panel);
      const errore = $('[data-errore]', panel);
      errore.hidden = true;
      btn.disabled = true;
      btn.textContent = 'Invio in corso…';
      try {
        const { res, data } = await chiamata('staff/conferma', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            bookingId: r.booking_id,
            professionista: $('[data-professionista]', panel).value,
            nota: $('[data-nota]', panel).value,
            data: $('[data-data]', panel).value,
            ora: $('[data-ora]', panel).value
          })
        });
        if (res.ok && data.ok) {
          await caricaEEsegui();
          return;
        }
        errore.textContent = messaggioErrore(data.error);
        errore.hidden = false;
      } catch {
        errore.textContent = 'Errore di rete: riprova tra poco.';
        errore.hidden = false;
      } finally {
        btn.disabled = false;
        btn.textContent = 'Conferma e invia email';
      }
    });
  };

  /* -- pannello: sposta -------------------------------------------------------- */
  const apriPannelloSposta = (r, panel) => {
    panel.hidden = !panel.hidden;
    if (panel.hidden) return;
    const giorni = giorniDisponibili();
    const scelta = { data: '', ora: '' };
    panel.innerHTML = `
      <p class="label">Nuovo giorno</p>
      <div class="daypick mt-2">
        ${giorni.map((g) => `<button class="day" type="button" data-day="${g.iso}" aria-pressed="false"><span>${g.gs}</span><strong>${g.n}</strong><span>${g.ms}</span></button>`).join('')}
      </div>
      <p class="label mt-4">Nuovo orario</p>
      <div class="slots mt-2" data-slots-box><p class="small" style="color:var(--stone-light)">Scegli prima un giorno.</p></div>
      <div class="row mt-4">
        <button class="btn btn--sm" type="button" data-sposta-invia disabled>Conferma spostamento</button>
      </div>
      <p class="form-error mt-2" data-errore hidden></p>`;

    const slotsBox = $('[data-slots-box]', panel);
    const btnInvia = $('[data-sposta-invia]', panel);
    const errore = $('[data-errore]', panel);

    const disegnaSlots = (occupati) => {
      slotsBox.innerHTML = cfg.orari
        .map((h) => {
          const off = occupati.has(h);
          return `<button class="slot${off ? ' is-off' : ''}" type="button" data-hour="${h}" aria-pressed="${scelta.ora === h}"${off ? ' disabled' : ''}>${h}</button>`;
        })
        .join('');
    };

    panel.addEventListener('click', async (e) => {
      const dayBtn = e.target.closest('[data-day]');
      if (dayBtn) {
        scelta.data = dayBtn.dataset.day;
        scelta.ora = '';
        btnInvia.disabled = true;
        $$('[data-day]', panel).forEach((x) => x.setAttribute('aria-pressed', String(x === dayBtn)));
        slotsBox.innerHTML = '<p class="small" style="color:var(--stone-light)">Verifica disponibilità…</p>';
        const { data } = await chiamata(`disponibilita?giorno=${encodeURIComponent(scelta.data)}`);
        const occupati = data?.chiuso ? new Set(cfg.orari) : new Set(Array.isArray(data?.occupati) ? data.occupati : []);
        disegnaSlots(occupati);
        return;
      }
      const hourBtn = e.target.closest('[data-hour]');
      if (hourBtn && !hourBtn.disabled) {
        scelta.ora = hourBtn.dataset.hour;
        $$('[data-hour]', panel).forEach((x) => x.setAttribute('aria-pressed', String(x === hourBtn)));
        btnInvia.disabled = false;
      }
    });

    btnInvia.addEventListener('click', async () => {
      if (!scelta.data || !scelta.ora) return;
      errore.hidden = true;
      btnInvia.disabled = true;
      btnInvia.textContent = 'Invio in corso…';
      try {
        const { res, data } = await chiamata('staff/sposta', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ bookingId: r.booking_id, data: scelta.data, ora: scelta.ora })
        });
        if (res.ok && data.ok) {
          await caricaEEsegui();
          return;
        }
        errore.textContent = messaggioErrore(data.error);
        errore.hidden = false;
      } catch {
        errore.textContent = 'Errore di rete: riprova tra poco.';
        errore.hidden = false;
      } finally {
        btnInvia.disabled = false;
        btnInvia.textContent = 'Conferma spostamento';
      }
    });
  };

  /* -- annulla ------------------------------------------------------------------ */
  const eseguiAnnulla = async (r, panel) => {
    if (!window.confirm(`Annullare la prenotazione di ${r.nome} ${r.cognome} (${r.booking_id})? Lo slot verrà liberato e il paziente avvisato via email.`)) return;
    panel.hidden = false;
    panel.innerHTML = '<p class="small" style="color:var(--stone-light)">Annullamento in corso…</p>';
    try {
      const { res, data } = await chiamata('staff/cancella', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId: r.booking_id })
      });
      if (res.ok && data.ok) {
        await caricaEEsegui();
        return;
      }
      panel.innerHTML = `<p class="form-error">${esc(messaggioErrore(data.error))}</p>`;
    } catch {
      panel.innerHTML = '<p class="form-error">Errore di rete: riprova tra poco.</p>';
    }
  };

  const messaggioErrore = (codice) => ({
    non_trovata: 'Prenotazione non trovata: potrebbe essere stata modificata nel frattempo. Aggiorna la pagina.',
    occupato: 'Quello slot è già occupato da un\'altra prenotazione.',
    slot_occupato: 'Quello slot è già occupato da un\'altra prenotazione.',
    giorno_chiuso: 'Lo studio è chiuso in quella data.',
    stato_non_confermabile: 'Questa richiesta non è più in attesa: potrebbe essere già stata gestita.',
    orario_non_valido: 'Orario non valido per questo servizio.'
  }[codice] || 'Operazione non riuscita. Riprova.');

  /* -- avvio ---------------------------------------------------------------- */
  const caricaEEsegui = async () => {
    box.innerHTML = '<div class="staff-wrap"><p class="body">Caricamento…</p></div>';
    try {
      const { res, data } = await chiamata('staff/prenotazioni');
      if (res.status === 401) {
        try { localStorage.removeItem(STORAGE_KEY); } catch { /* niente da pulire */ }
        token = '';
        disegnaLogin('Password non corretta.');
        return;
      }
      if (!res.ok || !data.ok) {
        disegnaLogin('Non siamo riusciti a caricare le prenotazioni. Riprova.');
        return;
      }
      stato.prenotazioni = data.prenotazioni || [];
      stato.nota = data.nota || '';
      disegnaDashboard();
    } catch {
      disegnaLogin('Errore di rete: riprova.');
    }
  };

  if (demo) {
    disegnaDemo();
  } else if (token) {
    caricaEEsegui();
  } else {
    disegnaLogin();
  }
})();
