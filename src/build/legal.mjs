import { site } from './utils.mjs';

export const LEGAL = [
  {
    slug: 'privacy',
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
