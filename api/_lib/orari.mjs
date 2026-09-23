/**
 * Orari di inizio disponibili per una visita.
 * Stessa fonte (content/orari.json) usata dal generatore del sito: qui la
 * legge il backend, per calcolare quali slot consecutivi occupa un servizio.
 */
import fs from 'node:fs';
import path from 'node:path';

function carica() {
  const candidati = [
    path.resolve(process.cwd(), 'content', 'orari.json'),
    path.resolve(import.meta.dirname, '..', '..', 'content', 'orari.json')
  ];
  for (const p of candidati) {
    try {
      return JSON.parse(fs.readFileSync(p, 'utf8')).orari;
    } catch {
      /* prova il successivo */
    }
  }
  throw new Error('content/orari.json non trovato');
}

export const orari = carica();
