# Prompt — sito immersivo Studio Liddi

Prompt da incollare in un assistente di sviluppo per creare un sito interattivo con scene 3D
in tempo reale, ispirato per qualità e atmosfera al sito di Immersive Garden.
I dettagli del progetto sono presi da `content/*.json`: per riusarlo con un altro progetto
basta sostituire la sezione DETTAGLI DEL PROGETTO.

```text
Sei un creative developer e un direttore artistico specializzato in esperienze web immersive. Crea un sito interattivo di fascia lusso interamente in codice, con scene 3D in tempo reale (WebGL), scroll narrativo e micro-interazioni curate.
Trattalo come un progetto di direzione artistica, non come un template. Pensa insieme a composizione, materiali, luce, tipografia, ritmo, suono e narrazione, oltre che all'implementazione.

RIFERIMENTO
Il riferimento di qualità e di atmosfera è il sito dello studio Immersive Garden: scene WebGL cinematografiche, uno scroll che guida una narrazione continua, transizioni tra pagine senza stacchi, oggetti 3D che reagiscono al cursore, un preloader curato, un'interfaccia minima e una tipografia di grande scala.
Usalo come metro di qualità, fluidità e meraviglia. Sviluppa scelte di composizione e animazione tue: non replicarne layout, scene o codice.

DETTAGLI DEL PROGETTO
Nome: Studio Liddi, odontoiatria contemporanea, Milano (Via Rovigo 9, vicino a MM Crescenzago).
Cosa fa: studio odontoiatrico. Odontoiatria generale (conservativa, endodonzia, parodontologia, igiene e prevenzione), estetica dentale (sbiancamento), implantologia (impianti, chirurgia orale, protesi), ortodonzia tradizionale.
Pubblico target [ipotesi]: adulti e famiglie di Milano che scelgono uno studio curato e aggiornato, spesso dopo averne confrontati diversi. Molti visitano il sito da telefono e cercano soprattutto come prenotare.
Principale beneficio: tutte le specialità in un unico studio, con esperienza pluridecennale e impronte digitali al posto di quelle tradizionali.
Caratteristiche da evidenziare:
1. Scanner orale: nell'80% dei casi evita l'impronta tradizionale con paste, alginati e siliconi.
2. Esperienza: oltre 30 anni di attività del Dott. Arturo Liddi e oltre 25 del Dott. Giovanni Novi; quattro professionisti in studio.
3. Ascolto: alla prima visita il paziente espone problemi ed esigenze, che si tratti di un'urgenza o di una visita programmata.
Risorse disponibili: fotografie reali dello studio (reception, sala operativa, corridoio, sala d'attesa, sala operativa con un glicine dipinto sulla parete); testi, servizi, team, orari e contatti in italiano e inglese. Nessun modello 3D: va creato.
Messaggio finale: "Your smile. Our commitment." con CTA "Prenota una visita".
Lingue: italiano e inglese.
Formato: responsive e mobile-first. Esperienza 3D completa su desktop, adattata ma non amputata su mobile.

DIREZIONE CREATIVA
Concept: "Il giardino di porcellana".
- La porcellana avorio, il materiale di corone e protesi, rappresenta precisione e mestiere.
- Il glicine dipinto nella sala operativa è il filo conduttore: petali viola fico e foglie verde scuro portano calma e umanità.
- Il verde scuro dà profondità e fiducia nei capitoli più intimi.
Il lusso nasce dalla sottrazione: spazio, lentezza, materiali credibili, luce morbida, poche parole scelte bene. Il mondo di riferimento è quello di alta gioielleria, hotellerie di lusso e gallerie d'arte, non quello clinico. Niente azzurro ospedaliero, denti cartoon, icone generiche di denti, sorrisi da stock od oro e metalli brillanti.

Palette (design token):
- Avorio #F3EDE2: sfondo dominante.
- Porcellana #FAF7F1: superfici e card.
- Bianco #FFFFFF: solo riflessi e luci speculari, mai come sfondo pieno.
- Pietra #D6CFC4: filetti, bordi, piedistalli.
- Grigio caldo #6B665E: testi secondari (contrasto 4,9:1 su avorio).
- Grafite #2A2724: testo principale (12,7:1 su avorio).
- Viola fico #5B2A4A: accento per CTA, stati attivi e dettagli 3D (9,6:1 su avorio).
- Fico profondo #3A1A30: fondali notturni, hover su superfici scure.
- Glicine #C7AFC0: petali e tinte decorative; come testo solo in corpo grande su verde.
- Verde scuro #1F3B2F: capitoli profondi, sezione finale, footer.
- Verde notte #132820: ombre colorate e sfumature.
Proporzioni: circa 70% avorio, porcellana e bianco; 15% grigi e grafite; 10% verde scuro; al massimo 5% viola fico. Non mettere mai testo viola fico su verde scuro (contrasto 1,1:1): sul verde usa avorio o glicine.

Materiali e luce 3D:
- porcellana avorio semitraslucida (transmission, thickness, sheen e clearcoat dosati);
- velluto viola fico;
- foglie verde scuro opache;
- pietra chiara per i piedistalli.
Usa una luce morbida da studio fotografico, ombre di contatto e una grana filmica appena percettibile. Niente bloom eccessivo, neon o cromature. La porcellana non deve mai sembrare plastica.

Tipografia: un serif display ad alto contrasto per i titoli di grande scala (con licenza: Canela o PP Editorial New; gratuiti: Cormorant Garamond 500–600 o Instrument Serif). Per testi e interfaccia un sans pulito: DM Sans, già usato dal sito attuale. Etichette in maiuscolo piccolo con tracking ampio (0.14em).

STORIA E STRUTTURA
Prima di scrivere codice, proponi:
- il concept in cinque righe;
- un moodboard descritto (palette, materiali, luce, tipografia);
- lo storyboard dei capitoli.
Per ogni capitolo descrivi:
- cosa vede il visitatore;
- cosa deve capire;
- il testo sullo schermo;
- l'interazione disponibile;
- la lunghezza di scroll (in vh);
- come si collega al capitolo successivo;
- il fallback per mobile e per chi riduce le animazioni.
Usa questa sequenza come punto di partenza:

0. Preloader (massimo 2–3 secondi)
Petali di glicine si raccolgono e compongono il monogramma dello studio. Un contatore discreto e poi l'invito "Entra", con il suono spento di default e un pulsante per attivarlo. Il preloader deve essere saltabile.

1. Gancio
Un dente scolpito in porcellana avorio, presentato come un gioiello su un piedistallo di pietra. La luce scorre lenta sulla superficie, l'oggetto ruota appena seguendo il cursore e qualche petalo resta sospeso. Titolo di 4–7 parole sul beneficio principale (per esempio "Odontoiatria contemporanea, a Milano."). La CTA "Prenota una visita" è visibile da subito e resta sempre raggiungibile.

2. Lo studio
La camera attraversa la porcellana con un passaggio di luce ed entra nello studio. Le fotografie reali sono disposte su piani WebGL in profondità, con parallasse allo scroll e una lieve distorsione legata alla velocità. Il glicine dipinto nella sala operativa si stacca dalla foto e diventa il filo di petali che accompagna tutto il sito. Testo: "Via Rovigo 9, Milano. A pochi passi da MM Crescenzago."

3. Scanner orale
Una linea di luce attraversa lo spazio e una nuvola di punti si ricompone in un'arcata dentale 3D, guidata dallo scroll. Il visitatore può ruotarla trascinando. Etichetta: "01 — Scanner orale". Testo: "Impronte digitali. Nell'80% dei casi, niente paste, alginati e siliconi."

4. Trattamenti
Le quattro aree sono presentate come una collezione in galleria, ognuna con un oggetto scultoreo:
- odontoiatria generale: la sezione di un dente;
- estetica: una superficie di porcellana levigata;
- implantologia: la vista esplosa di impianto, abutment e corona, che si assemblano al passaggio del cursore;
- ortodonzia tradizionale: un'arcata con apparecchio.
Al passaggio del cursore l'oggetto ruota e la luce cambia. Il clic avvia una transizione a elemento condiviso verso la pagina del trattamento.

5. Le persone
Quattro professionisti, con l'esperienza del Dott. Liddi (oltre 30 anni) e del Dott. Novi (oltre 25). Usa solo ritratti reali, con un duotono avorio e viola fico al passaggio del cursore. Se mancano, usa monogrammi tipografici e mai foto di stock.

6. Chiusura
Un capitolo in verde scuro. Il dente di porcellana torna a riposo accanto a un ramo di glicine. Claim "Your smile. Our commitment.", CTA "Prenota una visita", telefono, WhatsApp e orari. La composizione deve fermarsi e respirare.

Le pagine interne (trattamenti, team, contatti e prenotazione) usano lo stesso linguaggio con meno 3D e più leggibilità. Adatta la sequenza ai contenuti e non aggiungere capitoli solo per riempire.

ESPERIENZA 3D E INTERAZIONE
Ogni capitolo ha un solo punto focale, con al massimo una scena 3D pesante per viewport. Combina con misura queste interazioni:
- parallasse del cursore smorzata (lerp);
- trascinamento per ruotare, con inerzia e limiti;
- cambi di luce o materiale al passaggio del cursore;
- timeline guidate dallo scroll;
- un cursore personalizzato discreto (un anello avorio che si allarga con etichette come "Trascina" o "Esplora");
- pulsanti magnetici;
- menu a tutto schermo con anteprima 3D di ogni voce;
- transizioni di pagina in WebGL (un velo avorio o una scia di petali).
Suono facoltativo: un ambiente morbido e micro-suoni al passaggio del cursore, spento di default e con un interruttore sempre visibile.
Contenuti: non inventare casi prima/dopo, recensioni, casi clinici, numeri, premi o certificazioni che non siano nei contenuti forniti. I modelli anatomici devono essere plausibili ma stilizzati e non sembrare documentazione clinica.
Comunicazione sanitaria: in Italia è regolata. Mantieni un tono informativo, senza promesse di risultato, superlativi, confronti con altri studi o linguaggio promozionale aggressivo.

DIREZIONE DEL MOVIMENTO
- La lentezza è parte del lusso. Usa easing morbidi (expo o cubic out): 0,8–1,6 s per le entrate importanti e 0,2–0,4 s per le micro-interazioni.
- I testi si rivelano per righe, con maschera e un ordine di lettura chiaro. Niente lettere che volano.
- Le transizioni portano un elemento nella scena successiva, come il dente o i petali.
- Varia il ritmo: passaggi rapidi alternati a composizioni che si fermano per un tratto di scroll.
- Lo scroll resta nativo, con uno smooth scroll leggero e disattivabile. Niente scroll-jacking che blocca la pagina.
- Evita rotazioni continue, parallasse ovunque, glitch ed effetti che competono con il contenuto.

TIPOGRAFIA E TESTO
Usa frasi brevi e specifiche: titoli di 4–8 parole e al massimo due righe di testo di supporto per capitolo. Mantieni una gerarchia netta tra titolo display, testo ed etichetta. Titoli di 72–160 px su desktop e 40–56 px su mobile; testo di almeno 16–18 px. Controlla gli a capo sia in italiano (più lungo) sia in inglese, e la leggibilità su schermi piccoli.

IMPLEMENTAZIONE
- Stack consigliato: Vite, React, TypeScript, React Three Fiber, drei, @react-three/postprocessing, GSAP con ScrollTrigger e Lenis, più shader GLSL personalizzati per petali, dissolvenze e distorsioni delle immagini. Scegli Three.js senza React se risulta più semplice.
- Modelli 3D: modellati in Blender o generati via codice; esportati in GLB compresso (Draco o Meshopt) con texture KTX2. I modelli di terzi sono ammessi solo con una licenza che consenta l'uso commerciale, e con l'attribuzione richiesta.
- Organizzazione: un componente per capitolo e scene 3D separate dal layout DOM. Tieni in un'unica configurazione testi IT/EN, design token, asset e timing (lunghezza di ogni capitolo in vh).
- Tutti i testi, i link e le CTA esistono in HTML semantico sotto il canvas, per SEO, lettori di schermo e fallback.
- Nel repository esistente non rompere il generatore statico, il bilinguismo e il sistema di prenotazione. Leggi i dati da content/*.json e collega la CTA alla prenotazione esistente.
- Costruisci prima l'intera sequenza con forme grezze (greybox), poi materiali, luce e dettagli.

PERFORMANCE E ACCESSIBILITÀ
- Budget: LCP sotto 2,5 s su mobile, con il contenuto leggibile prima del 3D. Asset 3D iniziali intorno ai 3 MB al massimo. 60 fps su desktop e almeno 30 su un telefono di fascia media.
- Livelli di qualità in base al dispositivo: DPR limitato (massimo 1,5–2), meno effetti su mobile e rendering in pausa fuori viewport o a scheda nascosta.
- Con prefers-reduced-motion niente scroll guidato né parallasse: mostra render statici delle scene.
- Senza WebGL il sito resta completo e usabile, con immagini pre-renderizzate.
- Navigazione da tastiera, focus visibile, contrasto AA e testi alternativi per le foto. CTA e telefono sono raggiungibili in ogni momento.

REVISIONE E RAFFINAMENTO
Avvia il sito, percorri l'intera esperienza su desktop e mobile e cattura i momenti chiave. Controlla che:
- entro 3 secondi si capisca che è uno studio dentistico a Milano e come prenotare;
- ogni capitolo abbia un punto focale chiaro;
- i testi siano leggibili e restino sullo schermo abbastanza a lungo;
- i modelli siano nitidi e proporzionati, con materiali credibili;
- le transizioni risultino collegate;
- nulla sia troncato o sovrapposto, in italiano come in inglese;
- fps e punteggi Lighthouse (Performance, Accessibility, SEO) siano misurati e riportati;
- la chiusura sembri voluta.
Rifinisci ogni scena affollata, vuota, ripetitiva o lenta. Cura l'equilibrio tra 3D, fotografie e testo.

CONSEGNABILI
- Concept e moodboard.
- Storyboard dei capitoli.
- Il progetto funzionante, con una build statica pronta per la pubblicazione.
- Una registrazione MP4 dell'esperienza (desktop e mobile) e gli screenshot dei momenti chiave.
- I valori Lighthouse e fps.
- Una nota breve su come cambiare testi IT/EN, colori, modelli e asset, e la durata dei capitoli, e su come disattivare effetti e suono.
Se mancano dei dettagli, fai assunzioni creative ragionevoli e dichiarale brevemente.
```
