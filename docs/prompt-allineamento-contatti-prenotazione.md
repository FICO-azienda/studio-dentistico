# Prompt — Allineare Contatti e Prenotazione

> Da incollare in una sessione Claude Code aperta sul repository
> `fico-azienda/studio-dentistico` (ramo `main`, commit 806cc78 o successivo).
> Prima di incollarlo, compila la sezione **0. Decisioni dello studio**.

---

## 0. Decisioni dello studio (da compilare prima di lanciare il prompt)

Se una riga resta vuota, usa il valore *predefinito* indicato.

1. **Modello di prenotazione online**
   - [ ] A — *Richiesta di appuntamento* (predefinito): il paziente sceglie servizio e
     1–2 preferenze di giorno/orario; **nessuna conferma automatica**; la segreteria
     richiama o scrive su WhatsApp e conferma.
   - [ ] B — *Solo richiamata*: niente calendario online; il paziente lascia servizio,
     canale e fascia oraria, e lo studio lo ricontatta.
   - [ ] C — *Prenotazione autonoma con conferma immediata* (comportamento attuale del
     backend). Sceglila solo se lo studio usa **un'unica agenda** alimentata anche dal
     sito; altrimenti le prenotazioni telefoniche e quelle online si sovrappongono.
2. **Canali con cui lo studio ricontatta**: Telefono ☐ · WhatsApp ☐ · Email ☐
   (predefinito: Telefono e WhatsApp, come dicono Contatti e FAQ).
3. **Chi risponde e quando**: es. "la segreteria richiama entro il giorno lavorativo
   successivo, negli orari di apertura" (predefinito: nessuna promessa di tempi).
4. **Disdetta e spostamento online** (link "Gestisci la prenotazione", 24 ore):
   mantenere ☐ / togliere ☐ (predefinito: togliere con A e B, mantenere con C).
5. **Scelta del professionista** nel modulo: mantenere ☐ / togliere ☐
   (predefinito: mantenere come preferenza, non come vincolo).
6. **Chiusure festive 2026–2027** confermate dallo studio (date esatte).
7. **Backend** (Vercel + Resend) già attivo? Sì ☐ / No ☐. Se no, il modulo **non deve
   fingere** di inviare: vedi punto 3 delle istruzioni.

---

## Prompt

Lavora sul sito dello Studio Liddi in questo repository. Obiettivo: **far dire e fare
la stessa cosa alla pagina Contatti e al sistema di prenotazione**. Oggi raccontano due
modi di gestire i pazienti diversi tra loro. Lo studio ha indicato come gestisce davvero
le richieste nei testi di Contatti e FAQ: quella è la fonte di verità, insieme alle
decisioni della sezione 0 qui sopra. Non inventare dati, orari, tempi di risposta o
servizi: se un'informazione manca, lascia un `TODO(studio)` visibile nel codice e
segnalamelo alla fine.

### Incongruenze da risolvere (verificate sul codice)

1. **Modello di gestione opposto.**
   - `contact.lead` in `src/build/i18n.mjs` e la prima FAQ in `content/faq.json` dicono:
     "le prime visite si prenotano di solito per telefono, oppure su WhatsApp per essere
     ricontattati appena possibile".
   - `/prenota` invece offre un calendario self-service, e il backend
     (`api/_lib/handler.mjs`, README § "Cosa dice al paziente") **conferma subito** la
     prenotazione se lo slot risulta libero. Ma il backend conosce solo le prenotazioni
     fatte dal sito, non l'agenda telefonica: rischio concreto di doppie prenotazioni.
   - Nello stesso wizard `book.whenHint` dice "gli orari sono indicativi: la segreteria
     conferma la disponibilità": contraddice la conferma automatica.

   → Applica il modello scelto al punto 0.1. Con **A**: ogni richiesta resta `PENDING`
   e nessun testo, email o schermata dice "confermato" finché lo staff non conferma da
   `/staff/`. Le scelte di giorno/orario diventano *preferenze*. Aggiorna di conseguenza
   testi IT/EN, email (`api/_lib/templates.mjs`), schermata finale, README e test. Con
   **B**: togli il passo calendario e lascia solo il percorso di richiamata. Con **C**:
   mantieni la conferma, ma riscrivi Contatti e FAQ perché presentino la prenotazione
   online come canale principale, accanto al telefono.

2. **Canali e fasce di ricontatto incompatibili con lo studio.**
   In `content/booking-flows.json` (e `content/en/booking-flows.json`), `tail.channelQuestion`
   offre Telefono/WhatsApp/**Email** e `tail.windowQuestion` offre
   Mattina/**Pausa pranzo**/Pomeriggio/**Sera**. Lo studio è chiuso tra le 12:00/12:30 e
   le 14:00, chiude alle 19:00 e il mercoledì mattina.
   → Limita i canali a quelli del punto 0.2 e ricava le fasce dagli orari reali
   (es. "Mattina (lun, mar, gio, ven)" e "Pomeriggio, 14–19"). Il server deve
   rifiutare i valori non ammessi (`api/_lib/validate.mjs`).

3. **Il modulo "Richiedi informazioni" di Contatti non invia nulla.**
   In `src/scripts/app.js` (funzione `forms`), i form con `data-validate` che non sono il
   wizard validano i campi e mostrano "Grazie, ti ricontattiamo", ma **non spediscono
   niente**. Il paziente crede di essere stato preso in carico e la richiesta va persa.
   → Scegli una sola soluzione e motivala: (a) collegarlo allo stesso endpoint del wizard
   come richiesta di tipo "Informazioni" (il servizio esiste già nel gruppo
   `informazioni`), con stesso archivio, stesse email e stessa vista staff; oppure
   (b) sostituirlo con due pulsanti, "Chiama" e "Scrivi su WhatsApp" (con
   messaggio precompilato `wa.me/...?text=`), più un link al percorso di richiamata su
   `/prenota`. Finché `site.booking.mode` è `demo` o l'endpoint è vuoto, **nessun modulo
   deve mostrare un messaggio di successo**: mostra invece telefono e WhatsApp.

4. **Orari duplicati in quattro punti.**
   `content/site.json` → `hours` (testo) e `openingHours` (schema.org);
   `content/orari.json` (slot prenotabili); `home.hero.hours` in `i18n.mjs`, scritto a
   mano ("Lun — Ven pomeriggio 14:00 — 19:00"). Oggi coincidono quasi, ma divergeranno
   al primo cambio.
   → Fai di `content/orari.json` l'unica fonte: aggiungi le fasce di apertura
   (es. `"apertura": {"1": [["10:00","12:00"],["14:00","19:00"]], ...}`), genera da lì
   `hours`, `openingHours`, il testo della home, la sidebar di `/prenota` e gli slot.
   Rimuovi i duplicati da `site.json`. Verifica anche gli slot: giovedì e venerdì lo
   studio chiude alle 12:30 ma l'ultimo slot mattutino è alle 11:00. Lascialo così se
   lo slot dura 60 minuti, ma documentalo nella `_nota`.

5. **Chiusure sbagliate.** In `content/chiusure.json` ci sono `2026-01-01` e
   `2026-01-06`, ormai passate: quasi certamente dovevano essere `2027-01-01` e
   `2027-01-06`. Correggile. Per Sant'Ambrogio (7/12), l'Immacolata (8/12) e le ferie
   usa **solo** le date del punto 0.6; se mancano, lascia un `TODO(studio)`.
   Aggiungi un test che fallisce se il file contiene date passate rispetto alla build.

6. **Autogestione disdetta/spostamento** (`/gestisci/`, `api/prenotazione-*.js`,
   `manage.*` in `i18n.mjs`): coerente solo con il modello C. Applica il punto 0.4.
   Se la togli, rimuovi anche i link dalle email e le pagine IT/EN, e aggiorna la
   sitemap e i test.

7. **Coerenza dei testi.** Dopo le modifiche, Contatti, FAQ, home, `/prenota`, la fascia
   `bookingBand`, le email e la schermata finale devono descrivere lo **stesso**
   processo, con le stesse parole chiave ("richiesta", "ti ricontattiamo", "conferma")
   in italiano e in inglese. Elenca in un commento finale ogni stringa modificata.

8. **README.** Il banner iniziale dice ancora che lo studio e i contenuti sono
   inventati, mentre il sito usa i dati reali forniti dal dentista. Aggiornalo e
   riscrivi la sezione "Sistema di prenotazione ed email" secondo il modello scelto.

### Vincoli

- Niente nuove dipendenze npm; rispetta lo stile del codice esistente (commenti in
  italiano, nessun framework).
- Ogni testo esiste in IT e EN (`i18n.mjs`, `content/en/*.json`).
- Nessun dato sanitario nel modulo Contatti; mantieni le note privacy esistenti.
- Non cambiare grafica, palette o struttura delle pagine oltre a quanto serve.
- Non toccare dati dello studio (indirizzo, telefoni, team, servizi) se non per
  spostarli nella fonte unica.

### Verifica prima di consegnare

1. `npm run build` e `npm test` senza errori; aggiungi test per: canali e fasce ammessi,
   assenza di "confermato" nel modello A/B, fonte unica degli orari, chiusure non
   passate, assenza di successi finti in modalità demo.
2. Avvia `npm run dev` e `npm run dev:api` e percorri a mano, in IT e EN:
   prima visita → richiesta; urgenza; richiamata via WhatsApp; modulo Contatti.
   Controlla testo a schermo ed email di anteprima (`npm run email:preview`).
3. Fai `grep` di "confermat", "confirmed", "Email", "Sera", "Pausa pranzo" e degli
   orari scritti a mano, e verifica che non resti nessun residuo incoerente.
4. Consegna un riepilogo con: modello applicato, file modificati, decisioni prese al
   posto dello studio (con motivazione) e i `TODO(studio)` aperti.
