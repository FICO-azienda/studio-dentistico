# Studio Liddi — sito dello studio odontoiatrico

> ### ⚠️ Progetto dimostrativo — contenuti fittizi
>
> **"Studio Liddi" non esiste.** È uno studio odontoiatrico inventato, creato come
> esercizio di design e sviluppo front-end. Sono inventati, e non vanno presi per
> veri né riutilizzati come tali:
>
> - ragione sociale, indirizzo, telefono, email, P. IVA e nome del direttore sanitario;
> - i nove profili del team, con biografie, titoli e appartenenze societarie;
> - le recensioni dei pazienti e i numeri dello studio (anni, pazienti, valutazione);
> - i casi clinici: le immagini prima/dopo sono fotografie di stock di persone diverse,
>   non documentazione clinica.
>
> I testi clinici dei trattamenti sono scritti per essere plausibili e non contengono
> indicazioni terapeutiche personalizzate: **non sono un parere medico**.
>
> Chiunque volesse partire da qui per un sito reale deve sostituire tutti i contenuti
> elencati nella sezione *Prima di andare online* in fondo a questo file. In Italia la
> comunicazione sanitaria è regolata (art. 9-bis D.L. 145/2013) e pubblicare recensioni
> o casi clinici non veritieri è una pratica commerciale scorretta.

Sito statico, editoriale e mobile-first per uno studio dentistico di fascia alta.
Nessun framework, nessuna dipendenza npm: un generatore in Node legge i contenuti
da `/content` e produce HTML statico in `/dist`.

---

## Avvio rapido

```bash
npm run build     # genera dist/
npm run serve     # http://localhost:4173
npm run dev       # build + serve
```

Requisiti: Node ≥ 20 (testato su 24) e Python 3 per il server locale.
Per rigenerare le fotografie: `npm run images`. Per le icone: `npm run icons`.

---

## Il CMS

Tutto il sito è generato dai file JSON in `content/`. Per aggiornare una sezione
si modifica il JSON e si rilancia `npm run build`: non si tocca mai l'HTML.

| File | Contenuto | Dove appare |
|---|---|---|
| `site.json` | nome, indirizzo, telefono, WhatsApp, orari, valori, numeri, social | header, footer, contatti, dati strutturati |
| `treatments.json` | 4 categorie + 16 trattamenti con testi, fasi, FAQ, SEO | home, `/trattamenti`, 16 pagine di dettaglio |
| `team.json` | 9 professionisti con bio, formazione, trattamenti seguiti | home, `/team`, 9 schede personali |
| `technologies.json` | 6 tecnologie | home, `/tecnologie`, pagine trattamento |
| `cases.json` | casi clinici con prima/dopo, durata, medico | home, `/casi-clinici` |
| `journal.json` | articoli con corpo strutturato a blocchi | home, `/journal`, pagine articolo |
| `faq.json` | domande frequenti generali | home, `/prima-visita` |
| `reviews.json` | testimonianze | slider recensioni |
| `images.json` | manifest fotografico: nome logico → foto, alt, proporzioni | ovunque |

**Aggiungere un trattamento**: inserisci un oggetto in `treatments.items`, aggiungi
il suo `slug` all'array `items` della categoria, indica un'immagine presente in
`images.json` e ricostruisci. La pagina, le voci di menu, i correlati, la sitemap e
i dati strutturati si generano da soli.

**Aggiungere una persona**: un oggetto in `team.json` (`featured: true` per mostrarla
in home). Il campo `treatments` collega automaticamente le pagine dei trattamenti.

**Corpo degli articoli**: blocchi `{"t": "p" | "h2" | "ul" | "quote", "v": …}`.

---

## Fotografie

Le immagini non stanno nel repository come file originali: `content/images.json`
dichiara per ogni slot un identificativo Unsplash, il testo alternativo e le
proporzioni. `npm run images` le scarica in `public/images` già convertite in **WebP**
e in tre larghezze (640 / 1280 / 1920) per il `srcset`.

Lo script rifiuta le foto **Unsplash+**, che vengono servite con filigrana.

**Per usare le fotografie reali dello studio** (consigliato): sostituisci i file in
`public/images/` mantenendo la convenzione `nome-640.webp`, `nome-1280.webp`,
`nome-1920.webp` e aggiorna il testo `alt` in `images.json`. Il resto non cambia.

Tutte le foto ricevono lo stesso trattamento cromatico (variabile CSS `--photo`):
è ciò che tiene insieme scatti di origini diverse ed elimina il blu clinico dalle
immagini mediche. I ritratti del team sono in bianco e nero con un leggero ritorno
al colore all'hover.

---

## Struttura

```
content/           i dati (il CMS)
public/            immagini, favicon, manifest — copiati in dist così come sono
src/styles/        main.css (design system completo, ~800 righe commentate)
src/scripts/       app.js (interazioni, vanilla, zero dipendenze)
src/build/         il generatore: utils, layout, componenti, pagine
scripts/           fetch-images, make-icons, check
build.mjs          orchestratore
dist/              il sito generato — è questo che si pubblica
```

### Pagine generate (44)

`/` · `/studio` · `/team` + 9 schede · `/trattamenti` + 16 pagine ·
`/tecnologie` · `/casi-clinici` · `/journal` + 5 articoli · `/prima-visita` ·
`/contatti` · `/prenota` · `/privacy` · `/cookie-policy` · `/termini` · `404.html`
più `sitemap.xml` e `robots.txt`.

---

## Design system

Palette: bianco `#FFFFFF`, off-white `#F7F7F5`, grigio chiaro `#E8E8E8`,
**blu navy `#123355`** come colore del marchio e navy profondo `#0B2440` per footer e
menu. Il navy sostituisce il nero per titoli, micro-label e bottoni nelle sezioni chiare.

Il sito alterna sezioni bianche e sezioni navy: hero e trattamenti in bianco,
trattamenti in evidenza in navy, studio in bianco, tecnologie in navy, team in bianco,
prima visita in navy, casi e testimonianze in bianco, fascia prenotazione in navy,
journal, FAQ e contatti in bianco, footer in navy profondo. Nelle sezioni navy i
bottoni si invertono da soli (regola `.dark .btn`): bianco con testo navy, e all'hover
diventano trasparenti con bordo bianco.

Tipografia: **Instrument Serif** per i titoli editoriali, **Inter** per interfaccia e
testo corrente. Scala fluida con `clamp()`, micro-label maiuscole spaziate.

### Fotografia

Due registri distinti:

- **Ritratti del team** (`.media--duo`): bianco e nero come stato di riposo, colore
  pieno all'hover con un micro zoom a 1.025 e la comparsa della biografia. È il gesto
  distintivo del sito, applicato solo qui perché resti riconoscibile.
- **Tutte le altre fotografie**: colore desaturato e freddo (`--photo`), con un velo
  navy sulle hero che toglie il calore senza scurirle. All'hover solo il micro zoom.

La classe `.media--reveal` implementa lo stesso effetto b/n → colore ed è pronta se in
futuro lo si vuole estendere ad altre gallerie: basta aggiungerla al contenitore
dell'immagine.

Linee e divisori: `#D7DCE2` su bianco, `rgba(255,255,255,0.2)` su navy. Nessuna ombra,
nessun box pesante.

Tutti i valori sono token CSS in cima a `main.css`: cambiare marchio significa
cambiare cinque variabili.

### Animazioni

Reveal allo scroll con `IntersectionObserver`, maschere sulle immagini, righe di
titolo che salgono da una maschera, contatori animati, parallasse leggera,
anteprima fotografica che segue il cursore nella navigazione rapida, menu a tutto
schermo, transizioni tra pagine. Tutto rispetta `prefers-reduced-motion`.

Lo smooth scroll ammortizzato si attiva solo con la rotella del mouse: i trackpad
mantengono lo scorrimento nativo, che è già fluido e più prevedibile.

---

## SEO e performance

- Dati strutturati: `Dentist`/`LocalBusiness`, `Person`, `MedicalProcedure`,
  `Article`, `FAQPage`, `BreadcrumbList`.
- Meta title e description scritti per pagina, canonical, Open Graph.
- Immagini WebP responsive con `width`/`height` espliciti (niente layout shift),
  `loading="lazy"` sotto la piega, `preload` per l'immagine della hero.
- Font caricati in modo non bloccante con `display=swap`.
- CSS 46 KB e JS 18 KB non minificati, nessuna libreria esterna.

`node scripts/check.mjs` verifica link interni, file mancanti, `alt`, un solo `h1`
per pagina, lunghezza dei title, presenza di description e canonical e validità del
JSON-LD.

---

## Sistema di prenotazione ed email

Il sito e' statico, quindi il form di prenotazione parla con una funzione
server-side ospitata altrove. Il codice e' gia' scritto e testato: manca solo
la distribuzione.

### Come funziona

```
paziente compila il form
        v
POST all'endpoint            api/prenotazioni.js
        v
anti-spam e limite di frequenza
        v
validazione lato server      api/_lib/validate.mjs
        v
codice richiesta APT-2026-000124
        v
SALVATAGGIO                  api/_lib/store.mjs    <- prima delle email
        v
email al paziente + email allo studio              <- se falliscono, la
        v                                             richiesta resta salva
schermata di conferma con il codice
```

L'ordine non e' casuale: la richiesta viene archiviata **prima** di tentare
l'invio delle email. Se il servizio email cade, i dati del paziente non si
perdono e l'errore finisce nei log.

### Cosa dice al paziente, e cosa non dice

La richiesta non e' mai presentata come confermata, perche' nessun calendario
verifica la disponibilita' in tempo reale. L'email e la schermata finale dicono
"abbiamo ricevuto la tua richiesta" e annunciano che la segreteria ricontattera'
il paziente. Se l'email non parte, la schermata lo dice invece di promettere un
riepilogo mai spedito. Se l'invio fallisce del tutto, compare un errore con i
recapiti dello studio, mai una falsa conferma.

### Distribuzione su Vercel con Resend

1. Importa la repository su Vercel. Il sito statico puo' restare su GitHub
   Pages: a Vercel serve solo la cartella `api/`.
2. Su Resend: verifica il dominio e crea una chiave API.
3. In Vercel, *Settings -> Environment Variables*:

| Variabile | Esempio | Note |
|---|---|---|
| `MAIL_PROVIDER` | `resend` | anche `sendgrid`, `postmark`, `console` |
| `RESEND_API_KEY` | `re_...` | mai nel codice, mai nel front-end |
| `MAIL_FROM` | `Studio Liddi <prenotazioni@dominio.it>` | dominio verificato su Resend |
| `BOOKING_NOTIFY_EMAIL` | `segreteria@dominio.it` | riceve le notifiche interne |
| `ALLOWED_ORIGINS` | `https://fico-azienda.github.io` | separati da virgola |
| `BOOKING_STORE` | `log` | `kv` o `http` per archiviare altrove |
| `RATELIMIT_MAX` | `5` | richieste per IP ogni 10 minuti |

4. In `content/site.json` imposta:

```json
"booking": { "endpoint": "https://IL-TUO-PROGETTO.vercel.app/api/prenotazioni", "mode": "live" }
```

5. `npm run build` e push: il form inizia a inviare davvero.

Finche' `mode` resta `"demo"` il form non invia nulla e la schermata finale lo
dichiara apertamente. E' una scelta: mostrare una conferma finta a un paziente
che crede di aver prenotato sarebbe peggio di un form disattivato.

### Logica condizionale per servizio

Il percorso non e' uno solo: ogni servizio ha le sue domande. La configurazione
sta in **`content/booking-flows.json`** — 27 servizi, 88 domande — e il motore
(`api/_lib/flows.mjs`) la interpreta sia nel browser sia sul server. Aggiungere
un servizio significa aggiungere un oggetto al file, mai toccare il codice.

```
scelta del servizio
        v
domande del servizio (max 5, solo quelle pertinenti)
        v
appuntamento oppure richiamata
        v
dati personali + riepilogo automatico
```

**Domande saltate.** Una domanda con `when` compare solo se la condizione e'
soddisfatta. In implantologia, per esempio, "da quanto tempo manca il dente?"
viene posta solo a chi ha risposto che il dente e' gia' stato estratto: il
percorso passa da otto a sette passi da solo.

**Indirizzamento.** Un'opzione con `goto` porta al percorso piu' specifico:
da "Estetica dentale" si finisce su sbiancamento, faccette o allineatori senza
che il paziente debba ricominciare. Il servizio di partenza resta nel riepilogo.

**Priorita' e tag** sono calcolati **sul server** a partire dalle risposte, mai
inviati dal browser. Un'opzione puo' portare `priority` (`high`, `urgent`) e
`tag`; il motore prende la priorita' piu' alta fra quelle incontrate. Trauma
dentale nasce gia' `urgent`, il dolore moderato porta a `high`, un controllo
resta `normal`. L'oggetto dell'email allo studio si apre con `[URGENTE]` o
`[PRIORITA ALTA]` quando serve.

Questa classificazione e' **organizzativa, non clinica**: serve alla segreteria
per mettere in ordine le richieste, non viene mostrata al paziente e non compare
in nessuna forma nell'email che riceve. Le domande raccolgono informazioni
preliminari: non producono una diagnosi e non propongono terapie.

**Riepilogo automatico.** Il riepilogo mostrato prima dell'invio e quello
inserito nelle due email si costruiscono dalle domande effettivamente poste, per
cui cambiano da servizio a servizio senza template scritti a mano.

**Richiamata.** Chi sceglie "essere ricontattato" non vede il calendario: gli si
chiede canale e fascia oraria, e data e ora smettono di essere obbligatorie
anche lato server.

**Navigazione.** Indicatore di avanzamento, ritorno al passo precedente senza
perdere le risposte gia' date, ricerca fra i 27 servizi.

### Archivio delle richieste

Ogni richiesta produce un record con `booking_id`, dati del paziente, tipo di
visita, data e ora richieste, seconda preferenza, messaggio, `status`
(`PENDING` all'inizio, poi `CONFIRMED`, `RESCHEDULED`, `CANCELLED`,
`COMPLETED`) e `created_at`.

Senza database configurato il record viene comunque scritto come riga JSON nei
log della piattaforma, recuperabile in qualsiasi momento. Con `BOOKING_STORE=kv`
finisce su Vercel KV / Upstash; con `http` viene inoltrato a un endpoint tuo.

### Sicurezza e privacy

Chiavi solo lato server, validazione e sanitizzazione server-side, campo esca
invisibile per i bot, tempo minimo di compilazione, blocco dei link nel testo,
limite di frequenza per IP e deduplica dei doppi invii — anche simultanei. Nelle
email finisce solo quanto serve a fissare un appuntamento; il campo messaggio,
scritto dal paziente, viene neutralizzato prima di entrare nell'HTML.

### Prove

```bash
npm test                 # 25 test sul flusso completo
npm run dev:api          # API locale su http://localhost:4174
```

I test coprono gli scenari richiesti: prenotazione normale, con e senza
messaggio, senza seconda preferenza, email non valida, data mancante o non
valida, guasto del servizio email, invio da mobile, doppio click. Verificano
anche che l'email al paziente non usi mai la parola "confermato" per giorno e
orario e che l'HTML inserito nei campi non venga eseguito.

Per vedere le email senza spedirle:

```bash
npm run build && node -e "…"   # vedi scripts/ oppure apri dist/_email/*.html
```

---

## Prima di andare online

Il sito è completo dal punto di vista tecnico, ma i **contenuti sono di esempio** e
vanno sostituiti. In particolare, trattandosi di comunicazione sanitaria:

1. **Nome, indirizzo, telefono, P. IVA e direttore sanitario** in `site.json` sono
   inventati. Vanno sostituiti con quelli reali: l'indicazione del direttore sanitario
   nel footer è un obbligo di legge (art. 9-bis D.L. 145/2013).
2. **Recensioni** (`reviews.json`): vanno sostituite con recensioni reali e
   verificabili. Pubblicare testimonianze inventate è una pratica commerciale
   scorretta.
3. **Casi clinici** (`cases.json`): le immagini prima/dopo sono dimostrative e non
   rappresentano pazienti. Vanno sostituite con documentazione clinica dello studio,
   previo **consenso informato scritto** del paziente. Il disclaimer in pagina resta.
4. **Numeri** (`site.stats`), **prezzi** (costo della prima visita in `page-core.mjs`)
   e **biografie del team**: da verificare uno per uno.
5. **Moduli**: al momento la validazione è lato client e l'invio è simulato. Vanno
   collegati a un endpoint reale (o a un servizio come Formspree) e la prenotazione
   va integrata con l'agenda dello studio. I dati sanitari non devono mai transitare
   dai moduli web.
6. **Privacy e cookie policy**: i testi sono una base corretta ma vanno validati dal
   consulente privacy, soprattutto se verranno attivati strumenti di analisi.
7. `site.url` in `site.json` determina canonical, Open Graph e sitemap: va impostato
   sul dominio reale prima della pubblicazione.

## Pubblicazione

`dist/` è una cartella statica: funziona su qualunque hosting (Netlify, Vercel,
GitHub Pages, Aruba). Configura il server perché serva `404.html` per le pagine non
trovate. Gli URL sono directory con `index.html`, quindi non serve alcuna riscrittura.
