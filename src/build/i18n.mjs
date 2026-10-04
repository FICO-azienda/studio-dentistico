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
  'common.wordmarkSub': ["Studio Dentistico", "Dental Practice"],
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
  'common.requestOnline': ['Lascia una richiesta online', 'Leave a request online'],
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
  'home.hero.lead': ["Tutte le specialità dell'odontoiatria in un unico studio a Milano, con esperienza clinica e attenzione alla persona.", "All the specialities of dentistry in a single practice in Milan, with clinical experience and attention to the person."],
  'home.hero.badge': ["Prenotazioni per<br>telefono o WhatsApp", "Bookings by<br>phone or WhatsApp"],
  'home.hero.hours': ["Lun — Ven<br>pomeriggio 14:00 — 19:00", "Mon — Fri<br>afternoons 14:00 — 19:00"],

  /* navigazione rapida */
  'home.quick.treatments': ["{n} trattamenti", "{n} treatments"],
  'home.quick.studio': ["Milano, Via Rovigo", "Milan, Via Rovigo"],
  'home.quick.team': ['{n} professionisti', '{n} professionals'],
  'home.quick.book': ["Telefono o WhatsApp", "Phone or WhatsApp"],

  /* sezioni della home */
  'home.treatments.label': ['Trattamenti', 'Treatments'],
  'home.treatments.t1': ['Soluzioni personalizzate', 'Tailored solutions'],
  'home.treatments.t2': ['per ogni sorriso.', 'for every smile.'],
  'home.treatments.aside': ["Quattro aree cliniche. Ogni area ha la sua pagina, con i trattamenti e gli specialisti.", "Four clinical areas. Each area has its own page, with its treatments and specialists."],

  'home.studio.label': ['Lo Studio', 'The Practice'],
  'home.studio.t1': ['Competenza clinica.', 'Clinical expertise.'],
  'home.studio.t2': ['Attenzione umana.', 'Human attention.'],
  'home.studio.aside': ["Un solo studio a Milano, in Via Rovigo 9, vicino alla MM Crescenzago: quattro professionisti e tutte le specialità dell'odontoiatria.", "A single practice in Milan, at Via Rovigo 9, near the Crescenzago metro station: four professionals and all the specialities of dentistry."],
  'home.studio.lead': ["Alla prima visita ascoltiamo le tue problematiche e cerchiamo insieme di soddisfare le tue esigenze, che si tratti di un'urgenza o di una visita programmata.", "At the first visit we listen to your concerns and together we try to meet your needs, whether it is an emergency or a planned visit."],

  'home.tech.label': ['Tecnologia', 'Technology'],
  'home.tech.t1': ["Impronte digitali,", "Digital impressions,"],
  'home.tech.t2': ["senza paste fastidiose.", "without unpleasant pastes."],
  'home.tech.aside': ["Lo studio è fornito di scanner orale per l'acquisizione di impronte digitali.", "The practice is equipped with an oral scanner for taking digital impressions."],

  'home.team.label': ['Il Team', 'The Team'],
  'home.team.t1': ['Persone, prima ancora', 'People, before'],
  'home.team.t2': ['che professionisti.', 'professionals.'],
  'home.team.aside': ["Quattro professionisti, per tutte le specialità dell'odontoiatria.", "Four professionals, for all the specialities of dentistry."],

  'home.firstVisit.label': ['Prima visita', 'First visit'],
  'home.firstVisit.t1': ['La prima visita.', 'The first visit.'],
  'home.firstVisit.aside': ["Un percorso in quattro passaggi: prenotazione, prima visita, preventivo e pagamento.", "Four steps: booking, first visit, quote and payment."],
  'home.firstVisit.cta': ['Prenota la tua prima visita', 'Book your first visit'],
  'home.firstVisit.what': ['Preventivi e pagamenti', 'Quotes and payment'],

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
  'home.contact.aside': ["Via Rovigo 9, Milano, nelle vicinanze della MM Crescenzago.", "Via Rovigo 9, Milan, near the Crescenzago metro station."],
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
  'band.lead': ["Prenota la tua prima visita per telefono o su WhatsApp: ci racconti le tue esigenze e cerchiamo insieme la soluzione.", "Book your first visit by phone or on WhatsApp: tell us what you need and together we will look for the solution."],

  /* journal */
  'journal.label': ['Journal', 'Journal'],
  'journal.aside': ["Approfondimenti su prevenzione, cure e trattamenti odontoiatrici.", "Insight on prevention, care and dental treatments."],
  'journal.lead': ["Approfondimenti su prevenzione, cure e trattamenti odontoiatrici, con le fonti indicate in fondo a ogni articolo.", "Insight on prevention, care and dental treatments, with the sources listed at the end of each article."],
  'journal.count': ['articoli', 'articles'],
  'journal.sources': ['Fonti', 'Sources'],
  'journal.question': ['Hai una domanda?', 'Have a question?'],
  'journal.questionText': ["Chiama lo studio o scrivici su WhatsApp: ti rispondiamo appena possibile.", "Call the practice or write to us on WhatsApp: we will reply as soon as possible."],

  /* pagine interne */
  'page.faqAside': ["Hai una domanda diversa? Scrivici: ti rispondiamo appena possibile.", "Different question? Write to us: we will reply as soon as possible."],
  'page.faqHomeAside': ["Se non trovi quello che cerchi, scrivici: ti rispondiamo appena possibile.", "If you cannot find what you are looking for, write to us: we will reply as soon as possible."],
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
  'form.notes': ['Altro da segnalare allo studio (facoltativo)', 'Anything else for the practice (optional)'],
  'form.urgent': ["È un'urgenza", 'It is an emergency'],
  'form.urgentHint': ["Lo studio valuterà con te se si tratta di un'urgenza o di una visita programmata.", 'The practice will assess with you whether it is an emergency or a scheduled visit.'],
  'form.notesPlaceholder': [
    'Per esempio da quanto tempo hai il problema, o a che ora puoi essere chiamato',
    'For example how long you have had the problem, or when you can be called'
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
  'form.noDiagnosis': ["Le informazioni raccolte servono alla segreteria per capire la richiesta: non sono una diagnosi.", "The information collected helps our front desk understand your request: it is not a diagnosis."],
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
  'contact.thanksLead': ["Abbiamo ricevuto la tua richiesta: ti ricontattiamo appena possibile.", "We have received your request: we will get back to you as soon as possible."],


  /* passaggi della prima visita */
  'steps.1.t': ["Prenotazione", "Booking"],
  'steps.1.d': ["Di solito per telefono: ci racconti le tue problematiche e cerchiamo insieme di soddisfare le tue esigenze (urgenza, visita programmata). Oppure su WhatsApp, per essere ricontattato appena possibile.", "Usually by phone: you tell us about your concerns and together we try to meet your needs (emergency, planned visit). Or on WhatsApp, to be contacted as soon as possible."],
  'steps.2.t': ["Prima visita", "First visit"],
  'steps.2.d': ["La visita con il dentista e, se occorre, una radiografia panoramica.", "The visit with the dentist and, if needed, a panoramic X-ray."],
  'steps.3.t': ["Preventivo", "Quote"],
  'steps.3.d': ["Normalmente il preventivo viene fornito direttamente in studio, dopo la prima visita e, se occorre, la radiografia panoramica.", "The quote is normally given directly at the practice, after the first visit and, if needed, a panoramic X-ray."],
  'steps.4.t': ["Pagamento", "Payment"],
  'steps.4.d': ["In studio con assegni o contanti, con POS oppure con bonifico.", "At the practice by cheque or cash, by card terminal (POS) or by bank transfer."],

  /* titoli e descrizioni delle pagine */
  'meta.home.title': [
    'Studio Liddi — Dentista a Milano | Odontoiatria contemporanea',
    'Studio Liddi — Dentist in Milan | Contemporary dentistry'
  ],
  'meta.home.desc': ["Studio dentistico a Milano, in Via Rovigo 9 (MM Crescenzago): conservativa, endodonzia, implantologia, chirurgia orale, parodontologia, protesi, ortodonzia, igiene e sbiancamenti.", "Dental practice in Milan, Via Rovigo 9 (Crescenzago metro): conservative dentistry, endodontics, implantology, oral surgery, periodontology, prosthetics, orthodontics, hygiene and whitening."],
  'meta.studio.title': ['Lo studio — Studio Liddi, dentista a Milano', 'The practice — Studio Liddi, dentist in Milan'],
  'meta.studio.desc': ["Lo Studio Liddi a Milano, in Via Rovigo 9: {n} professionisti e tutte le specialità dell'odontoiatria in un unico studio.", "Studio Liddi in Milan, Via Rovigo 9: {n} professionals and all the specialities of dentistry in a single practice."],
  'meta.team.title': ['Il team — Studio Liddi, dentista a Milano', 'The team — Studio Liddi, dentist in Milan'],
  'meta.team.desc': ["I professionisti dello Studio Liddi a Milano: implantologia e ricostruzione ossea, conservativa, endodonzia, igiene e ortognatodonzia.", "The professionals at Studio Liddi in Milan: implantology and bone reconstruction, conservative dentistry, endodontics, hygiene and orthodontics."],
  'meta.tech.title': ['Tecnologie — Studio Liddi, dentista a Milano', 'Technology — Studio Liddi, dentist in Milan'],
  'meta.tech.desc': ["Lo scanner orale dello Studio Liddi di Milano: impronte digitali senza paste, alginati e siliconi.", "The oral scanner at Studio Liddi in Milan: digital impressions without pastes, alginates or silicones."],
  'meta.firstVisit.title': ['La prima visita — Studio Liddi, dentista a Milano', 'The first visit — Studio Liddi, dentist in Milan'],
  'meta.firstVisit.desc': ["Come funziona la prima visita allo Studio Liddi di Milano: prenotazione per telefono o WhatsApp, visita, preventivo e pagamento.", "How the first visit works at Studio Liddi in Milan: booking by phone or WhatsApp, visit, quote and payment."],
  'meta.contact.title': ["Contatti — Studio Liddi, dentista a Milano", "Contact — Studio Liddi, dentist in Milan"],
  'meta.contact.desc': ["Studio Liddi, Via Rovigo 9, 20132 Milano. Telefono, WhatsApp, email, orari di apertura e indicazioni per raggiungerci.", "Studio Liddi, Via Rovigo 9, 20132 Milan. Phone, WhatsApp, email, opening hours and how to reach us."],
  'meta.book.title': ['Prenota una visita — Studio Liddi, dentista a Milano', 'Book an appointment — Studio Liddi, dentist in Milan'],
  'meta.book.desc': [
    'Prenota la tua visita allo Studio Liddi di Milano per telefono o su WhatsApp, oppure lascia una richiesta online: ti ricontatteremo noi.',
    'Book your visit at Studio Liddi in Milan by phone or on WhatsApp, or leave a request online: we will get back to you.'
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
  'meta.journal.desc': ["Articoli di approfondimento su prevenzione, cure e trattamenti odontoiatrici, con le fonti indicate.", "In-depth articles on prevention, care and dental treatments, with sources listed."],

  /* pagina studio */
  'studio.label': ['02 — Lo Studio', '02 — The Practice'],
  'studio.lead': ["Un solo studio a Milano, in Via Rovigo 9, vicino alla MM Crescenzago: quattro professionisti e tutte le specialità dell'odontoiatria.", "A single practice in Milan, at Via Rovigo 9, near the Crescenzago metro station: four professionals and all the specialities of dentistry."],
  'studio.philosophy': ['La filosofia', 'Our approach'],
  'studio.phT1': ["Esperienza", "Experience"],
  'studio.phT2': ["e aggiornamento continuo.", "and continuing education."],
  'studio.p1': ["Il Dott. Arturo Liddi svolge l'attività di dentista come libero professionista da oltre trent'anni, nelle diverse specialità. Ha frequentato per oltre quindici anni la clinica universitaria, nel reparto di implantologia.", "Dr Arturo Liddi has worked as a self-employed dentist for over thirty years, across the different specialities. He attended the university clinic for over fifteen years, in the implantology department."],
  'studio.p2': ["Il Dott. Giovanni Novi, laureato anche in Medicina e Chirurgia, è dentista libero professionista da oltre venticinque anni e ha frequentato per circa dieci anni la cattedra odontoiatrica universitaria.", "Dr Giovanni Novi, who also graduated in Medicine and Surgery, has worked as a self-employed dentist for over twenty-five years and attended the university dental department for about ten years."],
  'studio.p3': ["Nello studio si svolgono tutte le specialità dell'odontoiatria: conservativa, endodonzia, implantologia e chirurgia orale, chirurgia degli ottavi, parodontologia, protesi, ortodonzia, igiene e sbiancamenti.", "All the specialities of dentistry are practised at the practice: conservative dentistry, endodontics, implantology and oral surgery, wisdom tooth surgery, periodontology, prosthetics, orthodontics, hygiene and whitening."],
  'studio.values': ['I valori', 'Our values'],
  'studio.valT1': ["Quattro cose", "Four things"],
  'studio.valT2': ["su cui puoi contare.", "you can count on."],
  'studio.spaces': ['Gli spazi', 'The spaces'],
  'studio.spT1': ["Accoglienza", "Reception"],
  'studio.spT2': ["e sale operative.", "and treatment rooms."],
  'studio.spAside': ["Gli ambienti dello studio, in Via Rovigo 9.", "The rooms of the practice, at Via Rovigo 9."],
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
  'tr.indexLead': ["Quattro aree cliniche, {n} trattamenti. Nello studio si svolgono tutte le specialità dell'odontoiatria.", "Four clinical areas, {n} treatments. All the specialities of dentistry are practised at the practice."],
  'tr.indexAside': ["{n} trattamenti<br>4 aree cliniche", "{n} treatments<br>4 clinical areas"],

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
  'team.lead': ["{n} professionisti che coprono tutte le specialità dell'odontoiatria, dalla conservativa all'implantologia, dall'igiene all'ortodonzia.", "{n} professionals covering all the specialities of dentistry, from conservative dentistry to implantology, from hygiene to orthodontics."],
  'team.aside': ["Uno studio<br>a Milano", "One practice<br>in Milan"],
  'team.note': ["", ""],
  'team.profile': ['Profilo', 'Profile'],
  'team.education': ['Formazione', 'Education'],
  'team.associations': ['Associazioni', 'Memberships'],
  'team.interests': ['Aree di interesse', 'Areas of focus'],
  'team.othersT': ['Gli altri professionisti', 'The other clinicians'],
  'team.bookWith': ['Prenota con', 'Book with'],

  /* tecnologie */
  'tech.label': ['03 — Tecnologie', '03 — Technology'],
  'tech.lead': ["Lo studio è fornito di scanner orale per l'acquisizione di impronte digitali.", "The practice is equipped with an oral scanner for taking digital impressions."],
  'tech.aside': ["Scanner orale", "Oral scanner"],
  'tech.use': ['Impiego', 'Used for'],
  'tech.gain': ['Vantaggio', 'Benefit'],

  /* prima visita */
  'fv.label': ['05 — Prima visita', '05 — First visit'],
  'fv.lead': ["Di solito la prima visita si prenota per telefono o su WhatsApp: ci racconti le tue problematiche e cerchiamo insieme di soddisfare le tue esigenze.", "The first visit is usually booked by phone or on WhatsApp: you tell us about your concerns and together we try to meet your needs."],
  'fv.aside': ["Prenotazione<br>telefono o WhatsApp", "Booking<br>phone or WhatsApp"],
  'fv.bring': ["Preventivi e pagamenti", "Quotes and payment"],
  'fv.bringT1': ["Preventivi", "Quotes"],
  'fv.bringT2': ["e pagamenti.", "and payment."],
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
    "Di solito ci si prenota per telefono; puoi anche scrivere su WhatsApp. Se preferisci, lascia qui una richiesta: descrivi il problema e lo studio ti ricontatterà appena possibile per concordare l'appuntamento.",
    'Appointments are usually booked by phone; you can also write on WhatsApp. If you prefer, leave a request here: describe the problem and the practice will get back to you as soon as possible to arrange the appointment.'
  ],
  'book.preferPhone': ['Prenota per telefono', 'Book by phone'],
  'book.step': ['Passo', 'Step'],
  'book.of': ['di', 'of'],
  'book.chooseService': ['Scegli il servizio', 'Choose the service'],
  'book.urgent': ['Urgenze', 'Urgent care'],
  'book.urgentText': ["In caso di urgenza chiama direttamente lo studio o scrivi su WhatsApp: valutiamo insieme a te se si tratta di un'urgenza o di una visita programmata.", "In an emergency, call the practice directly or write on WhatsApp: we will assess with you whether it is an emergency or a scheduled visit."],
  'wa.message': ['Buongiorno, vorrei prenotare una visita. Il problema che vorrei descrivere è: ', 'Hello, I would like to book a visit. The problem I would like to describe is: '],
  'book.requestNote': ["Per prenotare chiama lo studio o scrivi su WhatsApp. Oppure lascia qui una richiesta: non è una conferma, ti ricontattiamo noi.", "To book, call the practice or write on WhatsApp. Or leave a request here: it is not a confirmation, we will get back to you."],
  'book.received': ['Richiesta ricevuta.', 'Request received.'],
  'book.code': ['Codice richiesta', 'Request code'],
  'book.demoNote': [
    'Modalità dimostrativa: nessuna email è stata inviata e nessun appuntamento è stato registrato.',
    'Demo mode: no email was sent and no appointment was recorded.'
  ],
  'book.emailSent': [
    'Ti abbiamo inviato una email con il riepilogo. La richiesta non è ancora una conferma: lo studio ti contatterà appena possibile.',
    'We have sent you an email with the summary. Your request is not yet a confirmation: the practice will contact you as soon as possible.'
  ],
  'book.emailFailed': [
    "Non siamo riusciti a inviarti l'email di riepilogo, ma la richiesta è registrata. Lo studio ti contatterà appena possibile.",
    'We could not send you the summary email, but your request has been recorded. The practice will contact you as soon as possible.'
  ],
  'book.thanksFor': ['Grazie, {nome}. Abbiamo ricevuto la tua richiesta {quando}.', 'Thank you, {nome}. We have received your request {quando}.'],
  'book.forDate': ['per {giorno} alle {ora}', 'for {giorno} at {ora}'],
  'book.forCallback': ['e la richiamata che ci hai chiesto', 'and the call back you asked for'],
  'book.when': ['Quando ti è comodo?', 'When suits you?'],
  'book.whenHint': [
    'Gli orari mostrati seguono quelli di apertura dello studio e sono indicativi: la richiesta non è una conferma, lo studio ti ricontatterà.',
    'The times shown follow the practice opening hours and are indicative: your request is not a confirmation, the practice will contact you.'
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
  'book.bookOption': ['Indica giorno e orario che preferisci: lo studio ti ricontatta per confermare.', 'Tell us the day and time you prefer: the practice will contact you to confirm.'],
  'book.callbackOption': ['Ti ricontattiamo appena possibile, per telefono o WhatsApp.', 'We will get back to you as soon as possible, by phone or WhatsApp.'],

  /* autogestione prenotazione */
  'manage.label': ['Gestisci', 'Manage'],
  'manage.title1': ['Gestisci la tua', 'Manage your'],
  'manage.title2': ['prenotazione.', 'booking.'],
  'manage.lead': [
    'Annulla o sposta il tuo appuntamento.',
    'Cancel or reschedule your appointment.'
  ],
  'meta.manage.desc': [
    "Annulla o sposta il tuo appuntamento allo Studio Liddi di Milano: pagina riservata a chi ha ricevuto il link nell'email.",
    'Cancel or reschedule your appointment at Studio Liddi in Milan: page for patients who received the link by email.'
  ],
  'manage.loading': ['Caricamento…', 'Loading…'],
  'contact.lead': ["Via Rovigo 9, Milano, nelle vicinanze della MM Crescenzago. Per le prime visite ci si prenota di solito per telefono, oppure su WhatsApp per essere ricontattati appena possibile.", "Via Rovigo 9, Milan, near the Crescenzago metro station. First visits are usually booked by phone, or on WhatsApp to be contacted as soon as possible."],
  'meta.person.desc': ["{name}, {role} allo Studio Liddi di Milano. {short}", "{name}, {role} at Studio Liddi in Milan. {short}"],
  'studio.space1.t': ["Accoglienza", "Reception"],
  'studio.space1.d': ["Reception e sala d'attesa.", "Reception and waiting room."],
  'studio.space2.t': ["Sale operative", "Treatment rooms"],
  'studio.space2.d': ["Le sale in cui si svolgono i trattamenti.", "The rooms where treatments are carried out."],
  'fv.quoteH': ["Preventivi", "Quotes"],
  'fv.quoteText': ["Normalmente i preventivi vengono forniti direttamente in studio, dopo la prima visita e, se occorre, la radiografia panoramica.", "Quotes are normally given directly at the practice, after the first visit and, if needed, a panoramic X-ray."],
  'fv.payH': ["Pagamenti", "Payment"],
  'fv.payText': ["I pagamenti possono essere effettuati in studio con assegni o contanti, con POS oppure con bonifico.", "Payments can be made at the practice by cheque or cash, by card terminal (POS) or by bank transfer."],
  'footer.about': ["Tutte le specialità dell'odontoiatria in un unico studio a Milano.", "All the specialities of dentistry in a single practice in Milan."]
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
