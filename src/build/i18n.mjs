/**
 * Bilingue italiano / inglese.
 *
 * Il sito viene generato due volte, in /it/ e /en/. Tre meccanismi:
 *
 *  1. ROUTES   i segmenti degli indirizzi sono tradotti
 *              (/it/trattamenti/ -> /en/treatments/)
 *  2. UI       le stringhe dell'interfaccia stanno nel dizionario qui sotto
 *  3. content/ i contenuti stanno nei JSON italiani; content/en/ contiene la
 *              traduzione, chiave per chiave. Cio' che non e' ancora tradotto
 *              ricade sull'italiano invece di sparire.
 *
 * `lang` e' una variabile di modulo impostata dal build prima di generare le
 * pagine di una lingua: il generatore e' sincrono, quindi non c'e' rischio di
 * sovrapposizione.
 */

export const LANGS = ['it', 'en'];
export const DEFAULT_LANG = 'it';

let lang = DEFAULT_LANG;
export const setLang = (l) => { lang = LANGS.includes(l) ? l : DEFAULT_LANG; };
export const getLang = () => lang;

export const LANG_LABEL = { it: 'Italiano', en: 'English' };
export const HTML_LANG = { it: 'it', en: 'en' };
export const OG_LOCALE = { it: 'it_IT', en: 'en_GB' };

/* -- segmenti degli indirizzi --------------------------------------------- */
export const ROUTES = {
  it: {
    studio: 'studio',
    treatments: 'trattamenti',
    technologies: 'tecnologie',
    team: 'team',
    firstVisit: 'prima-visita',
    cases: 'casi-clinici',
    journal: 'journal',
    contact: 'contatti',
    book: 'prenota',
    manage: 'gestisci',
    privacy: 'privacy',
    cookie: 'cookie-policy',
    terms: 'termini'
  },
  en: {
    studio: 'practice',
    treatments: 'treatments',
    technologies: 'technology',
    team: 'team',
    firstVisit: 'first-visit',
    cases: 'case-studies',
    journal: 'journal',
    contact: 'contact',
    book: 'book',
    manage: 'manage',
    privacy: 'privacy',
    cookie: 'cookie-policy',
    terms: 'terms'
  }
};

export const route = (key, l = lang) => ROUTES[l][key];

/* -- dizionario dell'interfaccia ------------------------------------------ */
const UI = {
  /* navigazione e struttura */
  'nav.studio': ['Studio', 'Practice'],
  'nav.treatments': ['Trattamenti', 'Treatments'],
  'nav.technologies': ['Tecnologie', 'Technology'],
  'nav.team': ['Team', 'Team'],
  'nav.firstVisit': ['Prima visita', 'First visit'],
  'nav.cases': ['Casi clinici', 'Case studies'],
  'nav.journal': ['Journal', 'Journal'],
  'nav.contact': ['Contatti', 'Contact'],
  'nav.book': ['Prenota una visita', 'Book an appointment'],
  'nav.bookShort': ['Prenota', 'Book'],
  'nav.aria': ['Navigazione principale', 'Main navigation'],
  'nav.sections': ['Sezioni del sito', 'Site sections'],
  'nav.menuOpen': ['Apri il menu', 'Open menu'],
  'nav.menuLabel': ['Menu di navigazione', 'Navigation menu'],
  'nav.treatmentAreas': ['Aree di trattamento', 'Treatment areas'],
  'nav.skip': ['Vai al contenuto', 'Skip to content'],
  'nav.home': ['Home', 'Home'],
  'nav.breadcrumb': ['Percorso', 'Breadcrumb'],
  'nav.quick': ['Navigazione rapida', 'Quick navigation'],
  'nav.langLabel': ['Lingua', 'Language'],

  /* generici */
  'common.wordmarkSub': ['Studio Odontoiatrico', 'Dental Practice'],
  'common.discover': ['Scopri', 'Explore'],
  'common.readMore': ["Leggi l'articolo", 'Read the article'],
  'common.allTreatments': ['Tutte le aree', 'All areas'],
  'common.allTechnologies': ['Tutte le tecnologie', 'All technology'],
  'common.allTeam': ['Tutto il team', 'The whole team'],
  'common.allCases': ['Tutti i casi', 'All case studies'],
  'common.allArticles': ['Tutti gli articoli', 'All articles'],
  'common.goToJournal': ['Vai al Journal', 'Go to the Journal'],
  'common.discoverStudio': ['Scopri lo studio', 'Explore the practice'],
  'common.discoverTech': ['Scopri le tecnologie', 'Explore our technology'],
  'common.meetTeam': ['Conosci tutto il team', 'Meet the whole team'],
  'common.howItWorks': ['Come funziona', 'How it works'],
  'common.contactUs': ['Contattaci', 'Contact us'],
  'common.bookNow': ['Prenota ora', 'Book now'],
  'common.callUs': ['Chiama', 'Call'],
  'common.whatsapp': ['WhatsApp', 'WhatsApp'],
  'common.phone': ['Telefono', 'Phone'],
  'common.email': ['Email', 'Email'],
  'common.address': ['Indirizzo', 'Address'],
  'common.hours': ['Orari', 'Opening hours'],
  'common.studio': ['Studio', 'Practice'],
  'common.minRead': ['min di lettura', 'min read'],
  'common.min': ['min', 'min'],
  'common.quickActions': ['Azioni rapide', 'Quick actions'],
  'common.dragToScroll': ['Trascina per scorrere', 'Drag to scroll'],
  'common.previous': ['Precedente', 'Previous'],
  'common.next': ['Successivo', 'Next'],
  'common.profile': ['Profilo', 'Profile'],
  'common.discoverProfile': ['Scopri il profilo', 'View profile'],
  'common.openInMaps': ['Apri in Google Maps', 'Open in Google Maps'],
  'common.mapAria': ['Mappa dello studio', 'Practice location map'],
  'common.backHome': ['Torna alla home', 'Back to home'],
  'common.contactStudio': ['Contatta lo studio', 'Contact the practice'],
  'common.askQuestion': ['Fai una domanda', 'Ask a question'],
  'common.faqTitle': ['Domande frequenti', 'Frequently asked questions'],
  'common.related': ['Correlati', 'Related'],
  'common.otherTreatments': ['Altri trattamenti', 'Other treatments'],
  'common.otherArticles': ['Altri articoli', 'More articles'],
  'common.keepReading': ['Continua a leggere', 'Keep reading'],
  'common.results': ['Risultati', 'Results'],
  'common.author': ['Autore', 'Author'],
  'common.summary': ['In sintesi', 'At a glance'],
  'common.leadClinician': ['Responsabile clinico', 'Lead clinician'],
  'common.leadDoctor': ['Medico responsabile', 'Lead clinician'],
  'common.clinicalArea': ['Area clinica', 'Clinical area'],
  'common.thePath': ['Il percorso', 'The process'],
  'common.specialists': ['Specialisti', 'Specialists'],
  'common.technologyUsed': ['Tecnologia utilizzata', 'Technology used'],
  'common.discoverTechnology': ['Scopri la tecnologia', 'Explore this technology'],
  'common.requiredFields': ['* Campi obbligatori.', '* Required fields.'],
  'common.yes': ['Sì', 'Yes'],
  'common.no': ['No', 'No'],

  /* header e menu */
  'header.city': ['Milano, Italia', 'Milan, Italy'],

  /* hero della home */
  'home.hero.l1': ['Odontoiatria', 'Contemporary'],
  'home.hero.l2': ['contemporanea.', 'dentistry.'],
  'home.hero.l3': ['Cura, precisione,', 'Care, precision,'],
  'home.hero.l4': ['persone.', 'people.'],
  'home.hero.lead': [
    'Tecnologia avanzata, esperienza clinica e attenzione alla persona in ogni fase del trattamento.',
    'Advanced technology, clinical experience and attention to the person at every stage of treatment.'
  ],
  'home.hero.badge': ['Prima visita disponibile<br>questa settimana', 'First appointments available<br>this week'],
  'home.hero.hours': ['Lun — Ven<br>08:30 — 19:30', 'Mon — Fri<br>08:30 — 19:30'],

  /* navigazione rapida */
  'home.quick.treatments': ['16 trattamenti', '16 treatments'],
  'home.quick.studio': ['Milano, zona Fiera', 'Milan, Fiera district'],
  'home.quick.team': ['{n} professionisti', '{n} professionals'],
  'home.quick.book': ['Online, 2 minuti', 'Online, 2 minutes'],

  /* sezioni della home */
  'home.treatments.label': ['Trattamenti', 'Treatments'],
  'home.treatments.t1': ['Soluzioni personalizzate', 'Tailored solutions'],
  'home.treatments.t2': ['per ogni sorriso.', 'for every smile.'],
  'home.treatments.aside': [
    'Quattro aree cliniche, sedici trattamenti. Ogni area ha la sua pagina, con fasi, tempi e specialisti.',
    'Four clinical areas, sixteen treatments. Each area has its own page, with stages, timings and specialists.'
  ],

  'home.studio.label': ['Lo Studio', 'The Practice'],
  'home.studio.t1': ['Competenza clinica.', 'Clinical expertise.'],
  'home.studio.t2': ['Attenzione umana.', 'Human attention.'],
  'home.studio.aside': [
    'Trecentoquaranta metri quadrati in zona Fiera, dodici professionisti e un modo di lavorare che mette la diagnosi prima del preventivo.',
    'Three hundred and forty square metres in the Fiera district, twelve professionals, and a way of working that puts diagnosis before the estimate.'
  ],
  'home.studio.lead': [
    'Crediamo che la qualità di una cura si misuri su un arco di anni, non di sedute. Per questo investiamo tempo nella diagnosi, spieghiamo le alternative e costruiamo percorsi che possano durare.',
    'We believe the quality of care is measured in years, not appointments. That is why we invest time in diagnosis, explain the alternatives, and build treatment plans designed to last.'
  ],

  'home.tech.label': ['Tecnologia', 'Technology'],
  'home.tech.t1': ['La tecnologia al servizio', 'Technology in the service'],
  'home.tech.t2': ['della precisione.', 'of precision.'],
  'home.tech.aside': [
    'Strumenti scelti per ridurre invasività, tempi e numero di sedute. Non per fare scena.',
    'Instruments chosen to reduce invasiveness, time and number of appointments. Not for show.'
  ],

  'home.team.label': ['Il Team', 'The Team'],
  'home.team.t1': ['Persone, prima ancora', 'People, before'],
  'home.team.t2': ['che professionisti.', 'professionals.'],
  'home.team.aside': [
    'Un unico protocollo condiviso e riunioni cliniche settimanali sui casi complessi.',
    'One shared protocol and weekly clinical meetings on complex cases.'
  ],

  'home.firstVisit.label': ['Prima visita', 'First visit'],
  'home.firstVisit.t1': ['La prima visita.', 'The first visit.'],
  'home.firstVisit.aside': [
    '45 minuti, un percorso in quattro passaggi. Al termine sai qual è la situazione, quali sono le opzioni e quanto costa ciascuna.',
    '45 minutes, in four steps. By the end you know where you stand, what the options are and what each one costs.'
  ],
  'home.firstVisit.cta': ['Prenota la tua prima visita', 'Book your first visit'],
  'home.firstVisit.what': ['Cosa portare con te', 'What to bring with you'],

  'home.cases.label': ['Risultati', 'Results'],
  'home.cases.t1': ['Casi clinici.', 'Case studies.'],
  'home.cases.aside': [
    'Una selezione di percorsi completati in studio, con tempi e responsabile clinico.',
    'A selection of treatments completed at the practice, with timings and lead clinician.'
  ],
  'home.cases.disclaimer': [
    'Ogni caso clinico è individuale. I risultati possono variare da paziente a paziente.',
    'Every case is individual. Results may vary from patient to patient.'
  ],

  'home.contact.label': ['Contatti', 'Contact'],
  'home.contact.t1': ['Vieni a trovarci.', 'Come and see us.'],
  'home.contact.aside': [
    'Zona Fiera, a sei minuti dalla metropolitana. Parcheggio riservato ai pazienti nel cortile interno.',
    'Fiera district, six minutes from the underground. Patient parking in the courtyard.'
  ],
  'home.contact.link': ['Mappa e indicazioni', 'Map and directions'],
  'home.contact.all': ['Tutti i contatti', 'All contact details'],

  /* testimonianze */
  'reviews.label': ['Testimonianze', 'Testimonials'],
  'reviews.t1': ['Le parole', 'In the words'],
  'reviews.t2': ['dei nostri pazienti.', 'of our patients.'],
  'reviews.aside': ['Recensioni raccolte tra i pazienti dello studio.', 'Reviews collected from our patients.'],

  /* fascia prenotazione */
  'band.label': ['Prenota', 'Book'],
  'band.t1': ['Prenditi cura', 'Take care'],
  'band.t2': ['del tuo sorriso.', 'of your smile.'],
  'band.lead': [
    'Prenota una prima visita con il nostro team: 45 minuti per capire la situazione, vedere le opzioni e ricevere un preventivo chiaro.',
    'Book a first visit with our team: 45 minutes to understand the situation, see the options and receive a clear estimate.'
  ],

  /* journal */
  'journal.label': ['Journal', 'Journal'],
  'journal.aside': [
    'Approfondimenti clinici scritti dal nostro team, senza gergo inutile.',
    'Clinical insight written by our team, without unnecessary jargon.'
  ],
  'journal.lead': [
    'Approfondimenti clinici scritti dai professionisti dello studio. Nessun gergo inutile, nessuna promessa fuori luogo.',
    'Clinical insight written by the practice team. No unnecessary jargon, no misplaced promises.'
  ],
  'journal.count': ['articoli', 'articles'],
  'journal.sources': ['Fonti', 'Sources'],
  'journal.question': ['Hai una domanda?', 'Have a question?'],
  'journal.questionText': [
    'Prenota una prima visita o scrivici: rispondiamo entro un giorno lavorativo.',
    'Book a first visit or write to us: we reply within one working day.'
  ],

  /* pagine interne */
  'page.faqAside': [
    'Hai una domanda diversa? Scrivici: rispondiamo entro un giorno lavorativo.',
    'Different question? Write to us: we reply within one working day.'
  ],
  'page.faqHomeAside': [
    'Se non trovi quello che cerchi, scrivici: rispondiamo entro un giorno lavorativo.',
    'If you cannot find what you are looking for, write to us: we reply within one working day.'
  ],
  'page.faqT1': ['Le risposte', 'The answers'],
  'page.faqT2': ['più richieste.', 'most often needed.'],

  /* 404 */
  '404.label': ['Errore 404', 'Error 404'],
  '404.t1': ['Questa pagina', 'This page'],
  '404.t2': ['non esiste.', 'does not exist.'],
  '404.lead': [
    'Potrebbe essere stata spostata. Da qui puoi tornare alla home o prenotare direttamente una visita.',
    'It may have been moved. From here you can go back to the home page or book an appointment directly.'
  ],
  '404.title': ['Pagina non trovata', 'Page not found'],
  '404.description': [
    'La pagina che stai cercando non esiste o è stata spostata. Torna alla home dello Studio Liddi, studio odontoiatrico a Milano, oppure prenota direttamente una visita.',
    'The page you are looking for does not exist or has been moved. Go back to the Studio Liddi home page, a dental practice in Milan, or book an appointment directly.'
  ],

  /* moduli */
  'form.name': ['Nome', 'First name'],
  'form.surname': ['Cognome', 'Last name'],
  'form.email': ['Email', 'Email'],
  'form.phone': ['Telefono', 'Phone'],
  'form.notes': ['Note', 'Notes'],
  'form.notesPlaceholder': [
    "Qualcosa che è utile sapere prima dell'appuntamento",
    'Anything useful for us to know before the appointment'
  ],
  'form.required': ['Campo obbligatorio', 'Required field'],
  'form.invalidEmail': ['Inserisci un indirizzo email valido', 'Enter a valid email address'],
  'form.invalidPhone': ['Inserisci un numero valido', 'Enter a valid phone number'],
  'form.privacy': [
    "Ho letto l'{link} e acconsento al trattamento dei miei dati per la gestione dell'appuntamento. *",
    'I have read the {link} and consent to my data being processed to manage the appointment. *'
  ],
  'form.privacyLink': ['informativa privacy', 'privacy notice'],
  'form.marketing': [
    'Accetto di ricevere comunicazioni relative al mio appuntamento (promemoria e variazioni).',
    'I agree to receive communications about my appointment (reminders and changes).'
  ],
  'form.send': ['Invia richiesta', 'Send request'],
  'form.sending': ['Invio in corso', 'Sending'],
  'form.back': ['Indietro', 'Back'],
  'form.continue': ['Continua', 'Continue'],
  'form.toYourDetails': ['Vai ai tuoi dati', 'Go to your details'],
  'form.yourDetails': ['I tuoi dati', 'Your details'],
  'form.summary': ['Riepilogo della richiesta', 'Request summary'],
  'form.company': ['Azienda', 'Company'],
  'form.errorGeneric': [
    'Non siamo riusciti a inviare la richiesta. Riprova oppure contatta direttamente lo studio.',
    'We could not send your request. Please try again or contact the practice directly.'
  ],
  'form.errorNetwork': [
    'Non siamo riusciti a inviare la richiesta. Controlla la connessione, riprova oppure contatta direttamente lo studio.',
    'We could not send your request. Check your connection, try again, or contact the practice directly.'
  ],
  'form.errorFields': ['Alcuni dati non sono validi.', 'Some details are not valid.'],
  'form.noDiagnosis': [
    'Le informazioni raccolte servono alla segreteria per capire la richiesta: non sono una diagnosi. La richiesta non è una conferma, ti ricontattiamo noi.',
    'The information collected helps our front desk understand your request: it is not a diagnosis. A request is not a confirmation — we will get back to you.'
  ],
  'form.noscript': [
    'Per prenotare online serve JavaScript attivo. In alternativa chiamaci allo',
    'Online booking requires JavaScript. Otherwise call us on'
  ],
  'form.orWrite': ['o scrivici a', 'or write to us at'],

  /* contatti */
  'contact.request': ['Richiedi informazioni', 'Request information'],
  'contact.help': ['Come possiamo aiutarti?', 'How can we help?'],
  'contact.helpPlaceholder': ['Descrivi brevemente la tua richiesta', 'Briefly describe your request'],
  'contact.noHealthData': [
    '* Campi obbligatori. Non inserire dati relativi alla salute in questo modulo.',
    '* Required fields. Please do not enter health data in this form.'
  ],
  'contact.thanks': ['Grazie.', 'Thank you.'],
  'contact.thanksLead': [
    'Abbiamo ricevuto la tua richiesta: ti ricontattiamo entro un giorno lavorativo.',
    'We have received your request: we will get back to you within one working day.'
  ],


  /* passaggi della prima visita */
  'steps.1.t': ['Ascolto', 'Listening'],
  'steps.1.d': [
    'Venti minuti di colloquio prima di qualsiasi strumento. Cosa ti preoccupa, cosa hai già provato, cosa ti aspetti.',
    'Twenty minutes of conversation before any instrument. What worries you, what you have already tried, what you expect.'
  ],
  'steps.2.t': ['Diagnosi', 'Diagnosis'],
  'steps.2.d': [
    'Esame clinico completo, fotografie, radiografie digitali e scansione intraorale quando serve.',
    'A full clinical examination, photographs, digital radiographs and an intraoral scan where needed.'
  ],
  'steps.3.t': ['Piano di trattamento', 'Treatment plan'],
  'steps.3.d': [
    'Le alternative possibili, con vantaggi e limiti di ciascuna, e un preventivo scritto voce per voce.',
    'The available options, with the advantages and limits of each, and a written estimate itemised line by line.'
  ],
  'steps.4.t': ['Percorso personalizzato', 'A plan built around you'],
  'steps.4.d': [
    'Tempi, sedute e modalità di pagamento concordati insieme. Nessun passaggio parte senza la tua approvazione.',
    'Timings, appointments and payment terms agreed together. No stage begins without your approval.'
  ],

  /* titoli e descrizioni delle pagine */
  'meta.home.title': [
    'Studio Liddi — Dentista a Milano | Odontoiatria contemporanea',
    'Studio Liddi — Dentist in Milan | Contemporary dentistry'
  ],
  'meta.home.desc': [
    'Studio dentistico a Milano zona Fiera: implantologia, ortodonzia invisibile, estetica dentale e prevenzione. Prima visita con piano di trattamento e preventivo scritto.',
    'Dental practice in Milan, Fiera district: dental implants, invisible orthodontics, cosmetic dentistry and prevention. First visit with a treatment plan and written estimate.'
  ],
  'meta.studio.title': ['Lo studio — Studio Liddi, dentista a Milano', 'The practice — Studio Liddi, dentist in Milan'],
  'meta.studio.desc': [
    'Studio odontoiatrico a Milano zona Fiera: 340 mq, cinque sale operative, radiologia e laboratorio interni. {n} professionisti e un protocollo condiviso.',
    'Dental practice in Milan, Fiera district: 340 sqm, five surgeries, in-house radiology and laboratory. {n} professionals and one shared protocol.'
  ],
  'meta.team.title': ['Il team — Studio Liddi, dentista a Milano', 'The team — Studio Liddi, dentist in Milan'],
  'meta.team.desc': [
    'I professionisti dello Studio Liddi a Milano: implantologia, ortodonzia, endodonzia, estetica dentale, parodontologia e odontoiatria pediatrica.',
    'The clinicians at Studio Liddi in Milan: implantology, orthodontics, endodontics, cosmetic dentistry, periodontology and paediatric dentistry.'
  ],
  'meta.tech.title': ['Tecnologie — Studio Liddi, dentista a Milano', 'Technology — Studio Liddi, dentist in Milan'],
  'meta.tech.desc': [
    'Scanner intraorale, radiologia digitale a bassa dose, implantologia guidata, microscopia, Digital Smile Design e stampa 3D. Studio Liddi, Milano.',
    'Intraoral scanner, low-dose digital radiology, guided implant surgery, microscopy, Digital Smile Design and 3D printing. Studio Liddi, Milan.'
  ],
  'meta.firstVisit.title': ['La prima visita — Studio Liddi, dentista a Milano', 'The first visit — Studio Liddi, dentist in Milan'],
  'meta.firstVisit.desc': [
    'Come funziona la prima visita allo Studio Liddi di Milano: 45 minuti tra ascolto, diagnosi, piano di trattamento e preventivo scritto.',
    'How the first visit works at Studio Liddi in Milan: 45 minutes of listening, diagnosis, treatment plan and written estimate.'
  ],
  'meta.contact.title': ['Contatti — Studio Liddi, dentista a Milano zona Fiera', 'Contact — Studio Liddi, dentist in Milan'],
  'meta.contact.desc': [
    'Studio Liddi, Via Antonio Canova 14, Milano. Telefono, WhatsApp, email, orari di apertura e indicazioni per raggiungerci.',
    'Studio Liddi, Via Antonio Canova 14, Milan. Phone, WhatsApp, email, opening hours and how to reach us.'
  ],
  'meta.book.title': ['Prenota una visita — Studio Liddi, dentista a Milano', 'Book an appointment — Studio Liddi, dentist in Milan'],
  'meta.book.desc': [
    'Prenota online la tua visita allo Studio Liddi di Milano: scegli il servizio, rispondi a poche domande e indica quando preferisci.',
    'Book your appointment online at Studio Liddi in Milan: choose the service, answer a few questions and tell us when suits you.'
  ],
  'meta.treatments.title': ['Trattamenti — Studio Liddi, dentista a Milano', 'Treatments — Studio Liddi, dentist in Milan'],
  'meta.treatments.desc': [
    'Le quattro aree cliniche dello Studio Liddi a Milano: odontoiatria generale, estetica dentale, implantologia e ortodonzia.',
    'The four clinical areas at Studio Liddi in Milan: general dentistry, cosmetic dentistry, implantology and orthodontics.'
  ],
  'meta.cases.title': ['Casi clinici — Studio Liddi, dentista a Milano', 'Case studies — Studio Liddi, dentist in Milan'],
  'meta.cases.desc': [
    'Casi clinici dello Studio Liddi di Milano: estetica dentale, implantologia, ortodonzia e riabilitazioni, con durata del trattamento e medico responsabile.',
    'Case studies from Studio Liddi in Milan: cosmetic dentistry, implantology, orthodontics and full rehabilitations, with treatment duration and lead clinician.'
  ],
  'meta.journal.title': ['Journal — Studio Liddi, dentista a Milano', 'Journal — Studio Liddi, dentist in Milan'],
  'meta.journal.desc': [
    'Articoli di approfondimento su prevenzione, ortodonzia, implantologia ed estetica dentale, scritti dal team dello Studio Liddi di Milano.',
    'In-depth articles on prevention, orthodontics, implantology and cosmetic dentistry, written by the team at Studio Liddi in Milan.'
  ],

  /* pagina studio */
  'studio.label': ['02 — Lo Studio', '02 — The Practice'],
  'studio.lead': [
    'Trecentoquaranta metri quadrati in zona Fiera, dodici professionisti e un modo di lavorare che mette la diagnosi prima del preventivo.',
    'Three hundred and forty square metres in the Fiera district, twelve professionals, and a way of working that puts diagnosis before the estimate.'
  ],
  'studio.philosophy': ['La filosofia', 'Our approach'],
  'studio.phT1': ['Il tempo', 'Time'],
  'studio.phT2': ['è parte della cura.', 'is part of the treatment.'],
  'studio.p1': [
    "Lo studio nasce nel 2004 dall'idea che l'odontoiatria di qualità non dipenda dai materiali ma dal metodo: una diagnosi completa, un progetto discusso e un'esecuzione verificata passaggio per passaggio.",
    'The practice was founded in 2004 on the idea that quality dentistry depends not on materials but on method: a complete diagnosis, a plan discussed together, and execution checked at every step.'
  ],
  'studio.p2': [
    "Vent'anni dopo, il principio è rimasto lo stesso. Quello che è cambiato è la tecnologia a disposizione, che oggi permette di pianificare al computer ciò che un tempo si decideva in poltrona.",
    'Twenty years on, the principle has not changed. What has changed is the technology available, which now lets us plan on screen what used to be decided in the chair.'
  ],
  'studio.p3': [
    'Non accettiamo più di due nuovi pazienti al giorno per professionista. È una scelta che limita i numeri e allunga le agende, ma è l\'unico modo per dedicare a ciascuno il tempo che una diagnosi seria richiede.',
    'We take no more than two new patients a day per clinician. It limits our numbers and lengthens the diary, but it is the only way to give each person the time a serious diagnosis requires.'
  ],
  'studio.values': ['I valori', 'Our values'],
  'studio.valT1': ['Quattro principi', 'Four principles'],
  'studio.valT2': ['non negoziabili.', 'we do not compromise on.'],
  'studio.spaces': ['Gli spazi', 'The spaces'],
  'studio.spT1': ['Cinque sale operative,', 'Five surgeries,'],
  'studio.spT2': ['una sala chirurgica.', 'one operating theatre.'],
  'studio.spAside': [
    'Radiologia e laboratorio odontotecnico interni: meno passaggi esterni, tempi di consegna più brevi.',
    'In-house radiology and dental laboratory: fewer external steps, shorter turnaround.'
  ],
  'studio.whoT1': ['Chi troverai', 'Who you will meet'],
  'studio.whoT2': ['in studio.', 'at the practice.'],


  /* pagina trattamento e area */
  'tr.whatIs': ["Che cos'è", 'What it is'],
  'tr.indicated': ['Per chi è indicato', 'Who it is for'],
  'tr.howWorks': ['Come funziona', 'How it works'],
  'tr.phasesT1': ['Fasi del', 'Stages of'],
  'tr.phasesT2': ['trattamento.', 'treatment.'],
  'tr.toolsT1': ['Gli strumenti', 'The instruments'],
  'tr.toolsT2': ['di questo trattamento.', 'used in this treatment.'],
  'tr.toolsAreaT2': ['di questa area.', 'used in this area.'],
  'cat.areaLabel': ['Area clinica', 'Clinical area'],
  'cat.theArea': ["L'area", 'The area'],
  'cat.howT1': ['Come la', 'How we'],
  'cat.howT2': ['affrontiamo.', 'approach it.'],
  'cat.included': ['I trattamenti', 'The treatments'],
  'cat.includedT1': ['Cosa comprende', 'What'],
  'cat.includedAside': [
    'Ogni trattamento ha una pagina dedicata con fasi, durata, tecnologia e domande frequenti.',
    'Each treatment has its own page with stages, duration, technology and frequently asked questions.'
  ],
  'cat.whoT1': ['Chi se ne', 'Who takes'],
  'cat.whoT2': ['occupa.', 'care of it.'],
  'cat.treatmentsCount': ['trattamenti', 'treatments'],
  'cat.specialistsCount': ['specialisti', 'specialists'],
  'cat.allArea': ["Tutta l'area", 'The whole area'],
  'tr.indexLead': [
    'Quattro aree cliniche, sedici trattamenti. Ogni percorso parte da una diagnosi completa e da un preventivo scritto, voce per voce.',
    'Four clinical areas, sixteen treatments. Every course of treatment starts with a full diagnosis and an itemised written estimate.'
  ],
  'tr.indexAside': ['16 trattamenti<br>4 aree cliniche', '16 treatments<br>4 clinical areas'],

  /* casi clinici */
  'cases.lead': [
    'Una selezione di percorsi completati in studio. Per ciascuno indichiamo la durata effettiva del trattamento e il professionista responsabile.',
    'A selection of treatments completed at the practice. For each we give the actual duration and the lead clinician.'
  ],
  'cases.aside': ['Trascina il cursore<br>per confrontare', 'Drag the slider<br>to compare'],
  'cases.filterAria': ['Filtra per categoria', 'Filter by category'],
  'cases.count': ['casi', 'case studies'],
  'cases.before': ['Prima', 'Before'],
  'cases.after': ['Dopo', 'After'],
  'cases.compare': ['Confronto prima e dopo', 'Before and after comparison'],
  'cases.beforeAlt': ['prima del trattamento', 'before treatment'],
  'cases.afterAlt': ['dopo il trattamento', 'after treatment'],
  'cases.disclaimer': [
    'Ogni caso clinico è individuale. I risultati possono variare da paziente a paziente e non costituiscono promessa di risultato.',
    'Every case is individual. Results may vary from patient to patient and are not a promise of outcome.'
  ],

  /* team */
  'team.label': ['04 — Il Team', '04 — The Team'],
  'team.lead': [
    '{n} professionisti che condividono protocolli, riunioni cliniche settimanali e un criterio: la soluzione più conservativa fra quelle efficaci.',
    '{n} professionals who share protocols, weekly clinical meetings and one criterion: the most conservative of the effective options.'
  ],
  'team.aside': ['Riunione clinica<br>ogni martedì', 'Clinical meeting<br>every Tuesday'],
  'team.note': [
    'Lo studio collabora inoltre con igienisti dentali, assistenti di poltrona e odontotecnici del laboratorio interno.',
    'The practice also works with dental hygienists, chairside assistants and technicians from the in-house laboratory.'
  ],
  'team.profile': ['Profilo', 'Profile'],
  'team.education': ['Formazione', 'Education'],
  'team.associations': ['Associazioni', 'Memberships'],
  'team.interests': ['Aree di interesse', 'Areas of focus'],
  'team.othersT': ['Gli altri professionisti', 'The other clinicians'],
  'team.bookWith': ['Prenota con', 'Book with'],

  /* tecnologie */
  'tech.label': ['03 — Tecnologie', '03 — Technology'],
  'tech.lead': [
    'Ogni strumento in studio risponde a una domanda clinica precisa. Quelli che non riducono invasività, tempi o margine di errore, non li compriamo.',
    'Every instrument here answers a specific clinical question. If it does not reduce invasiveness, time or margin of error, we do not buy it.'
  ],
  'tech.aside': ['Radiologia e laboratorio<br>interni allo studio', 'In-house radiology<br>and laboratory'],
  'tech.use': ['Impiego', 'Used for'],
  'tech.gain': ['Vantaggio', 'Benefit'],

  /* prima visita */
  'fv.label': ['05 — Prima visita', '05 — First visit'],
  'fv.lead': [
    'Quarantacinque minuti strutturati in quattro passaggi. Al termine sai qual è la situazione, quali sono le opzioni e quanto costa ciascuna.',
    'Forty-five minutes, structured in four steps. By the end you know where you stand, what the options are and what each one costs.'
  ],
  'fv.aside': ['Durata 45 minuti<br>Costo 80 €', 'Duration 45 minutes<br>Fee €80'],
  'fv.bring': ['Cosa portare', 'What to bring'],
  'fv.bringT1': ['Per non', 'So nothing'],
  'fv.bringT2': ['perdere tempo.', 'is wasted.'],
  'fv.after': ['Dopo la visita', 'After the visit'],
  'fv.questions': ['Domande', 'Questions'],
  'fv.beforeT1': ['Prima di', 'Before'],
  'fv.beforeT2': ['prenotare.', 'you book.'],
  'fv.orCall': ['Oppure chiama', 'Or call'],

  'legal.label': ['Informazioni legali', 'Legal information'],
  'legal.updated': ['Ultimo aggiornamento<br>settembre 2026', 'Last updated<br>September 2026'],

  /* prenotazione */
  'book.title1': ['Prenota', 'Book'],
  'book.title2': ['una visita.', 'an appointment.'],
  'book.lead': [
    'Scegli il servizio: le domande cambiano di conseguenza e sono al massimo cinque. Puoi prenotare un appuntamento oppure chiedere di essere ricontattato.',
    'Choose the service: the questions change accordingly, and there are never more than five. You can book an appointment or ask us to call you back.'
  ],
  'book.preferPhone': ['Preferisci parlare?', 'Prefer to talk?'],
  'book.step': ['Passo', 'Step'],
  'book.of': ['di', 'of'],
  'book.chooseService': ['Scegli il servizio', 'Choose the service'],
  'book.urgent': ['Urgenze', 'Urgent care'],
  'book.urgentText': [
    'In caso di dolore acuto o trauma, chiama direttamente lo studio: riserviamo ogni giorno spazi per le urgenze.',
    'For acute pain or trauma, call the practice directly: we keep slots free every day for urgent cases.'
  ],
  'book.received': ['Richiesta ricevuta.', 'Request received.'],
  'book.code': ['Codice richiesta', 'Request code'],
  'book.demoNote': [
    'Modalità dimostrativa: nessuna email è stata inviata e nessun appuntamento è stato registrato.',
    'Demo mode: no email was sent and no appointment was recorded.'
  ],
  'book.emailSent': [
    'Ti abbiamo inviato una email con il riepilogo. Il nostro team ti contatterà per confermare definitivamente la disponibilità.',
    'We have sent you an email with the summary. Our team will contact you to confirm availability.'
  ],
  'book.emailFailed': [
    "Non siamo riusciti a inviarti l'email di riepilogo, ma la richiesta è registrata. Il nostro team ti contatterà per confermare la disponibilità.",
    'We could not send you the summary email, but your request has been recorded. Our team will contact you to confirm availability.'
  ],
  'book.thanksFor': ['Grazie, {nome}. Abbiamo ricevuto la tua richiesta {quando}.', 'Thank you, {nome}. We have received your request {quando}.'],
  'book.forDate': ['per {giorno} alle {ora}', 'for {giorno} at {ora}'],
  'book.forCallback': ['e la richiamata che ci hai chiesto', 'and the call back you asked for'],
  'book.when': ['Quando ti è comodo?', 'When suits you?'],
  'book.whenHint': [
    'Gli orari mostrati sono indicativi: la segreteria conferma la disponibilità effettiva.',
    'The times shown are indicative: our front desk confirms actual availability.'
  ],
  'book.day': ['Giorno', 'Day'],
  'book.time': ['Orario', 'Time'],
  'book.second': ['Seconda preferenza', 'Second preference'],
  'book.optional': ['facoltativa', 'optional'],
  'book.altDay': ['Giorno alternativo', 'Alternative day'],
  'book.altTime': ['Orario alternativo', 'Alternative time'],
  'book.noPreference': ['Nessuna preferenza', 'No preference'],
  'book.professional': ['Professionista', 'Practitioner'],
  'book.multiHint': ['Puoi scegliere più di una risposta.', 'You can choose more than one answer.'],
  'book.bookOption': ['Scegli giorno e orario dal calendario.', 'Pick a day and time from the calendar.'],
  'book.callbackOption': ['Ti richiamiamo noi quando preferisci.', 'We call you back when it suits you.'],

  /* autogestione prenotazione */
  'manage.label': ['Gestisci', 'Manage'],
  'manage.title1': ['Gestisci la tua', 'Manage your'],
  'manage.title2': ['prenotazione.', 'booking.'],
  'manage.lead': [
    'Annulla o sposta il tuo appuntamento, gratuitamente, fino a 24 ore prima.',
    'Cancel or reschedule your appointment, free of charge, up to 24 hours before.'
  ],
  'manage.loading': ['Caricamento…', 'Loading…']
};

const IDX = { it: 0, en: 1 };

/** Stringa dell'interfaccia nella lingua corrente. */
export function t(key, vars = null) {
  const v = UI[key];
  if (!v) {
    if (process.env.I18N_STRICT) throw new Error('chiave mancante nel dizionario: ' + key);
    return key;
  }
  let s = v[IDX[lang]] ?? v[0];
  if (vars) for (const [k, val] of Object.entries(vars)) s = s.replaceAll('{' + k + '}', val);
  return s;
}

/**
 * Stesso indirizzo nell'altra lingua. Solo il primo segmento cambia: gli slug
 * dei contenuti (trattamenti, team, articoli) restano gli stessi.
 */
export function altPath(pagePath, from, to) {
  if (!pagePath) return '';
  const parti = pagePath.split('/').filter(Boolean);
  const chiave = Object.keys(ROUTES[from]).find((k) => ROUTES[from][k] === parti[0]);
  if (chiave) parti[0] = ROUTES[to][chiave];
  return parti.join('/') + '/';
}

/** Elenco delle chiavi: usato dal controllo di completezza. */
export const uiKeys = () => Object.keys(UI);
export const uiEntry = (k) => UI[k];
