/**
 * Verifica delle credenziali KV, condivisa da store.mjs e availability.mjs.
 *
 * Senza questo controllo, con BOOKING_STORE=kv ma KV_REST_API_URL/TOKEN
 * mancanti o sbagliate, le letture (getBooking, getDayOccupied) tornavano
 * silenziosamente "niente trovato" / "nessuno slot occupato": il sito
 * sembrava funzionare — nessun errore, nessun log — ma l'autogestione non
 * trovava prenotazioni reali e il calendario mostrava tutto libero anche
 * quando non lo era, con rischio concreto di doppie prenotazioni. Meglio un
 * errore rumoroso (500 + riga di log chiara) di un archivio che sembra
 * vuoto per errore.
 */
export function kvCredenziali(env) {
  const url = env.KV_REST_API_URL;
  const token = env.KV_REST_API_TOKEN;
  if (!url || !token) {
    throw new Error(
      "BOOKING_STORE=kv ma KV_REST_API_URL / KV_REST_API_TOKEN non sono configurate nell'ambiente: " +
        "l'archivio prenotazioni non è realmente raggiungibile. Configurale nelle variabili d'ambiente di Vercel " +
        "(o passa a BOOKING_STORE=log solo per sviluppo locale)."
    );
  }
  return { url, token };
}

/**
 * La modalita' 'log' (quella predefinita, se BOOKING_STORE non e' impostato)
 * legge/scrive un file sul disco della funzione. In locale il processo e'
 * persistente e funziona; su un vero deployment Vercel ogni invocazione puo'
 * capitare su un'istanza diversa — quel file spesso semplicemente non c'e'.
 * Senza questo controllo getBooking/getDayOccupied risponderebbero comunque
 * ("non trovato" / "niente occupato"), sembrando funzionanti mentre non lo
 * sono: l'autogestione del paziente si romperebbe silenziosamente e il
 * calendario mostrerebbe libero cio' che non lo e' (rischio doppie
 * prenotazioni). VERCEL_ENV e' impostata da Vercel su ogni esecuzione,
 * inclusa `vercel dev` (che pero' vale 'development' ed e' un processo
 * locale persistente: li' il file funziona davvero, quindi non si blocca).
 */
export function assertArchivioAffidabile(kind, env) {
  const deployato = env.VERCEL_ENV === 'production' || env.VERCEL_ENV === 'preview';
  if (kind === 'log' && deployato) {
    throw new Error(
      "BOOKING_STORE non è configurato (resta 'log') su un deployment Vercel: il file locale usato in sviluppo " +
        'non è affidabile qui, perché il filesystem della funzione non è persistente tra le invocazioni. ' +
        "Imposta BOOKING_STORE=kv con KV_REST_API_URL/KV_REST_API_TOKEN perché l'autogestione e il calendario " +
        'disponibilità funzionino davvero.'
    );
  }
}
