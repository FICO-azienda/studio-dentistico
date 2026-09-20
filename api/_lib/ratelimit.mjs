/**
 * Limitazione della frequenza delle richieste.
 *
 * In memoria per impostazione predefinita: su una singola istanza basta a
 * fermare gli invii ripetuti. Su piu' istanze serverless la memoria non e'
 * condivisa, quindi in produzione conviene configurare KV (stesso adattatore
 * dell'archivio) impostando RATELIMIT_STORE=kv.
 */

const memoria = new Map();

/** Elimina le finestre scadute: la mappa non deve crescere all'infinito. */
function pulisci(now, windowMs) {
  for (const [k, v] of memoria) if (now - v.start > windowMs) memoria.delete(k);
}

async function kvHit(key, windowMs, env) {
  const url = env.KV_REST_API_URL;
  const token = env.KV_REST_API_TOKEN;
  if (!url || !token) return null;
  const headers = { Authorization: 'Bearer ' + token };
  const res = await fetch(url + '/incr/' + encodeURIComponent(key), { method: 'POST', headers });
  if (!res.ok) return null;
  const j = await res.json();
  const n = Number(j.result) || 1;
  if (n === 1) {
    await fetch(url + '/expire/' + encodeURIComponent(key) + '/' + Math.ceil(windowMs / 1000), {
      method: 'POST',
      headers
    }).catch(() => {});
  }
  return n;
}

/**
 * @returns {{allowed: boolean, remaining: number, retryAfter: number}}
 */
export async function rateLimit(id, { max = 5, windowMs = 10 * 60 * 1000, now = Date.now(), env = process.env } = {}) {
  const key = 'rl:' + id;

  if ((env.RATELIMIT_STORE || 'memory') === 'kv') {
    const n = await kvHit(key, windowMs, env).catch(() => null);
    if (n !== null) {
      return { allowed: n <= max, remaining: Math.max(0, max - n), retryAfter: Math.ceil(windowMs / 1000) };
    }
    // se KV non risponde si ricade sulla memoria locale invece di bloccare tutto
  }

  pulisci(now, windowMs);
  const rec = memoria.get(key);
  if (!rec || now - rec.start > windowMs) {
    memoria.set(key, { start: now, count: 1 });
    return { allowed: true, remaining: max - 1, retryAfter: 0 };
  }
  rec.count += 1;
  const allowed = rec.count <= max;
  return {
    allowed,
    remaining: Math.max(0, max - rec.count),
    retryAfter: allowed ? 0 : Math.ceil((windowMs - (now - rec.start)) / 1000)
  };
}

/** Solo per i test. */
export const _reset = () => memoria.clear();
