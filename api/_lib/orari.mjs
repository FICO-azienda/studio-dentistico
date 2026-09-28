/**
 * Orari di inizio disponibili per una visita.
 * Stessa fonte (content/orari.json) usata dal generatore del sito: qui la
 * legge il backend, per calcolare quali slot consecutivi occupa un servizio
 * e quali giorni della settimana lo studio e' aperto.
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
      return JSON.parse(fs.readFileSync(p, 'utf8'));
    } catch {
      /* prova il successivo */
    }
  }
  throw new Error('content/orari.json non trovato');
}

const cfg = carica();

/** Tutti gli orari di inizio possibili, in ordine. */
export const orari = cfg.orari;
/** Distanza in minuti fra due slot contigui: due slot separati dalla pausa non sono consecutivi. */
export const passoMinuti = cfg.passoMinuti || 60;

const minuti = (h) => Number(h.slice(0, 2)) * 60 + Number(h.slice(3, 5));

/** Orari di inizio prenotabili in una data (YYYY-MM-DD); vuoto se lo studio e' chiuso quel giorno della settimana. */
export function orariDelGiorno(dataIso) {
  const d = new Date(dataIso + 'T12:00:00');
  if (Number.isNaN(d.getTime())) return [];
  return cfg.giorni?.[String(d.getDay())] || [];
}

/** true se gli orari sono uno di seguito all'altro, senza pause in mezzo. */
export const contigui = (lista) => lista.every((h, i) => i === 0 || minuti(h) - minuti(lista[i - 1]) === passoMinuti);
