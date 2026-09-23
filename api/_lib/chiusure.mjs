/**
 * Giornate di chiusura (festivi, ferie) in cui non si accettano prenotazioni.
 * Stessa fonte (content/chiusure.json) usata dal generatore del sito: qui la
 * legge il backend, per rifiutare conferme e spostamenti su un giorno chiuso
 * anche se qualcuno bypassa il calendario mostrato nel sito.
 */
import fs from 'node:fs';
import path from 'node:path';

function carica() {
  const candidati = [
    path.resolve(process.cwd(), 'content', 'chiusure.json'),
    path.resolve(import.meta.dirname, '..', '..', 'content', 'chiusure.json')
  ];
  for (const p of candidati) {
    try {
      return JSON.parse(fs.readFileSync(p, 'utf8'));
    } catch {
      /* prova il successivo */
    }
  }
  throw new Error('content/chiusure.json non trovato');
}

export const chiusure = carica();

/** true se lo studio e' chiuso in quella data (domenica, festivo o periodo di ferie). */
export function giornoChiuso(dataIso) {
  const d = new Date(dataIso + 'T12:00:00');
  if (Number.isNaN(d.getTime())) return false;
  if (d.getDay() === 0) return true; // domenica
  if (chiusure.date.includes(dataIso)) return true;
  return chiusure.periodi.some((p) => dataIso >= p.da && dataIso <= p.a);
}
