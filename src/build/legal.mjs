import { site } from './utils.mjs';
import { getLang } from './i18n.mjs';

const LEGAL_IT = [
  {
    slug: 'privacy',
    routeKey: 'privacy',
    title: 'Privacy Policy',
    description: 'Informativa sul trattamento dei dati personali dello Studio Liddi, ai sensi del Regolamento UE 2016/679.',
    intro: 'Informativa resa ai sensi degli articoli 13 e 14 del Regolamento UE 2016/679 (GDPR) agli utenti del sito e ai pazienti dello studio.',
    sections: [
      { h: 'Titolare del trattamento', p: [`${site.legalName}, ${site.address.street}, ${site.address.zip} ${site.address.city} — P. IVA ${site.vat}. Email: ${site.email}. Telefono: ${site.phone}.`] },
      { h: 'Dati trattati', p: [
        'Dati di navigazione raccolti automaticamente dal sito (indirizzo IP, tipo di browser, pagine visitate) per finalità tecniche e statistiche in forma aggregata.',
        'Dati identificativi e di contatto conferiti volontariamente tramite i moduli di contatto e di prenotazione: nome, cognome, email, telefono ed eventuali note.',
        'Dati relativi alla salute, trattati esclusivamente nell\'ambito della prestazione sanitaria e mai raccolti attraverso i moduli online.'
      ] },
      { h: 'Finalità e base giuridica', p: [
        'I dati conferiti tramite i moduli sono trattati per rispondere alle richieste e gestire gli appuntamenti, sulla base del consenso dell\'interessato e dell\'esecuzione di misure precontrattuali.',
        'I dati sanitari sono trattati per finalità di medicina preventiva, diagnosi e cura, ai sensi dell\'art. 9, par. 2, lett. h) del GDPR, e per adempiere agli obblighi di legge in materia sanitaria, fiscale e amministrativa.'
      ] },
      { h: 'Conservazione', p: [
        'I dati di contatto sono conservati per il tempo necessario a evadere la richiesta e, in caso di instaurazione del rapporto di cura, per la durata prevista dalla normativa sulla documentazione sanitaria.',
        'La documentazione clinica è conservata a tempo indeterminato, come previsto dalle indicazioni ministeriali in materia di cartelle cliniche ambulatoriali.'
      ] },
      { h: 'Comunicazione dei dati', p: [
        'I dati possono essere comunicati a soggetti che operano come responsabili del trattamento (laboratori odontotecnici, consulenti informatici, studio di consulenza fiscale) e alle autorità competenti nei casi previsti dalla legge. Non sono oggetto di diffusione né di trasferimento extra-UE.'
      ] },
      { h: 'Diritti dell\'interessato', p: [
        'Puoi esercitare in qualsiasi momento i diritti previsti dagli articoli 15-22 del GDPR — accesso, rettifica, cancellazione, limitazione, portabilità e opposizione — scrivendo a ' + site.email + '.',
        'Hai inoltre diritto di proporre reclamo al Garante per la protezione dei dati personali (www.garanteprivacy.it).'
      ] }
    ]
  },
  {
    slug: 'cookie-policy',
    routeKey: 'cookie',
    title: 'Cookie Policy',
    description: 'Informativa sui cookie utilizzati dal sito dello Studio Liddi.',
    intro: 'Questo sito utilizza esclusivamente cookie tecnici necessari al funzionamento. Non impiega cookie di profilazione né strumenti di tracciamento pubblicitario.',
    sections: [
      { h: 'Cookie tecnici', p: ['Sono i cookie necessari a garantire la navigazione e l\'erogazione dei servizi richiesti. Per il loro utilizzo non è richiesto il consenso dell\'utente, ai sensi dell\'art. 122 del Codice Privacy.'] },
      { h: 'Cookie di terze parti', p: [
        'Le mappe integrate nella pagina Contatti sono fornite da OpenStreetMap Foundation e possono impostare cookie tecnici propri. I caratteri tipografici sono serviti da Google Fonts.',
        'Nessun servizio di analisi statistica o di remarketing è attualmente attivo sul sito. In caso di attivazione futura, questa informativa verrà aggiornata e sarà richiesto il consenso preventivo.'
      ] },
      { h: 'Gestione dei cookie', p: ['Puoi in ogni momento eliminare o bloccare i cookie attraverso le impostazioni del tuo browser. La disattivazione dei cookie tecnici può compromettere alcune funzionalità del sito.'] }
    ]
  },
  {
    slug: 'termini',
    routeKey: 'terms',
    title: 'Termini e condizioni',
    description: 'Termini di utilizzo del sito e informazioni sulle prestazioni sanitarie dello Studio Liddi.',
    intro: 'Condizioni di utilizzo del sito e informazioni previste dalla normativa in materia di comunicazione sanitaria.',
    sections: [
      { h: 'Natura delle informazioni', p: [
        'I contenuti pubblicati su questo sito hanno finalità informativa e non sostituiscono in alcun modo il parere di un professionista sanitario. Nessuna informazione qui riportata costituisce diagnosi, prescrizione o promessa di risultato.',
        'Ogni trattamento descritto richiede una valutazione clinica individuale: indicazioni, durata, esiti e costi possono variare sensibilmente da paziente a paziente.'
      ] },
      { h: 'Comunicazione sanitaria', p: [
        `Le informazioni pubblicate rispettano i requisiti di trasparenza previsti dall'art. 9-bis del D.L. 145/2013 e successive modificazioni. Direttore sanitario: ${site.director}.`
      ] },
      { h: 'Casi clinici e testimonianze', p: [
        'Le immagini dei casi clinici hanno valore esemplificativo e sono pubblicate previo consenso informato scritto. I risultati mostrati si riferiscono a situazioni individuali e non sono estendibili ad altri pazienti.',
        'Le recensioni riportate provengono da piattaforme pubbliche e sono pubblicate nella forma originale, senza selezione a fini promozionali.'
      ] },
      { h: 'Proprietà intellettuale', p: ['Testi, immagini e progetto grafico sono protetti dalle norme sul diritto d\'autore. Ne è vietata la riproduzione senza autorizzazione scritta.'] },
      { h: 'Prenotazioni online', p: [
        'La richiesta di appuntamento inviata attraverso il sito non costituisce conferma: la segreteria ricontatta il paziente per verificare la disponibilità effettiva e confermare data e orario.'
      ] }
    ]
  }
];

const LEGAL_EN = [
  {
    slug: 'privacy',
    routeKey: 'privacy',
    title: 'Privacy Policy',
    description: 'Information on the processing of personal data by Studio Liddi, under Regulation (EU) 2016/679.',
    intro:
      'Notice provided under Articles 13 and 14 of Regulation (EU) 2016/679 (GDPR) to users of this website and patients of the practice.',
    sections: [
      {
        h: 'Data controller',
        p: [
          `${site.legalName}, ${site.address.street}, ${site.address.zip} ${site.address.city}, Italy — VAT no. ${site.vat}. Email: ${site.email}. Phone: ${site.phone}.`
        ]
      },
      {
        h: 'Data processed',
        p: [
          'Browsing data collected automatically by the website (IP address, browser type, pages visited) for technical purposes and for statistics in aggregate form.',
          'Identification and contact data provided voluntarily through the contact and booking forms: first name, last name, email, phone and any notes.',
          'Health data, processed exclusively within the provision of dental care and never collected through the online forms.'
        ]
      },
      {
        h: 'Purposes and legal basis',
        p: [
          'Data provided through the forms is processed to respond to enquiries and manage appointments, on the basis of consent and of pre-contractual measures.',
          'Health data is processed for the purposes of preventive medicine, diagnosis and care under Article 9(2)(h) GDPR, and to comply with legal obligations in health, tax and administrative matters.'
        ]
      },
      {
        h: 'Retention',
        p: [
          'Contact data is kept for as long as needed to deal with the enquiry and, where a course of care begins, for the period required by the rules on health records.',
          'Clinical records are kept indefinitely, as provided by Italian ministerial guidance on outpatient records.'
        ]
      },
      {
        h: 'Disclosure',
        p: [
          'Data may be disclosed to parties acting as processors (dental laboratories, IT consultants, accountants) and to the competent authorities in the cases provided by law. It is not disseminated and is not transferred outside the EU.'
        ]
      },
      {
        h: 'Your rights',
        p: [
          'You may exercise at any time the rights under Articles 15-22 GDPR — access, rectification, erasure, restriction, portability and objection — by writing to ' + site.email + '.',
          'You also have the right to lodge a complaint with the Italian Data Protection Authority (www.garanteprivacy.it).'
        ]
      }
    ]
  },
  {
    slug: 'cookie-policy',
    routeKey: 'cookie',
    title: 'Cookie Policy',
    description: 'Information on the cookies used by the Studio Liddi website.',
    intro:
      'This website uses only technical cookies necessary for it to function. It does not use profiling cookies or advertising trackers.',
    sections: [
      {
        h: 'Technical cookies',
        p: [
          'These are the cookies needed to allow browsing and to provide the services requested. Their use does not require consent under Article 122 of the Italian Privacy Code.'
        ]
      },
      {
        h: 'Third-party cookies',
        p: [
          'The maps embedded in the Contact page are provided by the OpenStreetMap Foundation and may set their own technical cookies. Typefaces are served by Google Fonts.',
          'No analytics or remarketing service is currently active on this site. Should any be activated in future, this notice will be updated and prior consent will be requested.'
        ]
      },
      {
        h: 'Managing cookies',
        p: [
          'You can delete or block cookies at any time through your browser settings. Disabling technical cookies may impair some features of the site.'
        ]
      }
    ]
  },
  {
    slug: 'termini',
    routeKey: 'terms',
    title: 'Terms and conditions',
    description: 'Terms of use of the website and information on the dental services provided by Studio Liddi.',
    intro: 'Terms of use of this website and the information required by Italian rules on healthcare communication.',
    sections: [
      {
        h: 'Nature of the information',
        p: [
          'The content published on this site is for information only and in no way replaces the opinion of a healthcare professional. Nothing here constitutes a diagnosis, a prescription or a promise of results.',
          'Every treatment described requires individual clinical assessment: indications, duration, outcomes and costs may vary considerably from patient to patient.'
        ]
      },
      {
        h: 'Healthcare communication',
        p: [
          `The information published complies with the transparency requirements of Article 9-bis of Italian Decree-Law 145/2013 as amended. Clinical director: ${site.director}.`
        ]
      },
      {
        h: 'Case studies and testimonials',
        p: [
          'Case images are illustrative and published with written informed consent. The results shown relate to individual situations and cannot be extended to other patients.',
          'The reviews shown come from public platforms and are published in their original form, without selection for promotional purposes.'
        ]
      },
      {
        h: 'Intellectual property',
        p: ['Texts, images and design are protected by copyright. Reproduction without written permission is prohibited.']
      },
      {
        h: 'Online booking',
        p: [
          'An appointment request sent through this website is not a confirmation: our front desk contacts the patient to check actual availability and confirm the date and time.'
        ]
      }
    ]
  }
];

/** Pagine legali nella lingua corrente. */
export const LEGAL_BY_LANG = { it: LEGAL_IT, en: LEGAL_EN };
export const legalPages = () => LEGAL_BY_LANG[getLang()] || LEGAL_IT;
