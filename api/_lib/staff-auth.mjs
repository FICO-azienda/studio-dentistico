/**
 * Autenticazione minima per l'interfaccia web dello staff: un'unica password
 * condivisa (STAFF_TOKEN), niente account o login. E' lo stesso livello di
 * sicurezza di un CLI eseguito da chi ha accesso al terminale dello studio —
 * qui la password sostituisce quell'accesso fisico.
 */
import { timingSafeEqual } from 'node:crypto';

/** Il token inviato dal browser combacia con STAFF_TOKEN? Falso se non configurato. */
export function staffTokenValido(token, env = process.env) {
  const atteso = env.STAFF_TOKEN || '';
  if (!atteso || !token) return false;
  const a = Buffer.from(String(token));
  const b = Buffer.from(atteso);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

/** Estrae il token dall'header Authorization: Bearer <token>. */
export function estraiToken(req) {
  const h = req.headers?.authorization || req.headers?.Authorization || '';
  const m = /^Bearer\s+(.+)$/i.exec(String(h));
  return m ? m[1] : '';
}
