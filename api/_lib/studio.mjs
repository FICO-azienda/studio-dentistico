/**
 * Dati dello studio usati dalle email.
 * Vengono letti da content/site.json, cosi' restano allineati al sito, e
 * possono essere sovrascritti da variabili d'ambiente in produzione.
 */
import fs from 'node:fs';
import path from 'node:path';

function fromFile() {
  const candidati = [
    path.resolve(process.cwd(), 'content', 'site.json'),
    path.resolve(import.meta.dirname, '..', '..', 'content', 'site.json')
  ];
  for (const p of candidati) {
    try {
      return JSON.parse(fs.readFileSync(p, 'utf8'));
    } catch {
      /* passa al successivo */
    }
  }
  return {};
}

const s = fromFile();
const env = process.env;

export const studio = {
  nome: env.STUDIO_NAME || s.name || 'Studio Liddi',
  ragioneSociale: env.STUDIO_LEGAL_NAME || s.legalName || '',
  indirizzo: [s.address?.street, [s.address?.zip, s.address?.city].filter(Boolean).join(' ')]
    .filter(Boolean)
    .join(', ') || env.STUDIO_ADDRESS || '',
  telefono: env.STUDIO_PHONE || s.phone || '',
  telefonoHref: env.STUDIO_PHONE_HREF || s.phoneHref || '',
  whatsapp: env.STUDIO_WHATSAPP || s.whatsapp || '',
  whatsappHref: env.STUDIO_WHATSAPP_HREF || s.whatsappHref || '',
  email: env.STUDIO_EMAIL || s.email || '',
  sito: env.SITE_URL || s.url || '',
  orari: (s.hours || []).map((h) => `${h.d}: ${h.h}`),
  direttore: s.director || ''
};

/** Destinatario delle notifiche interne: puo' differire dall'email pubblica. */
export const destinatarioStudio = env.BOOKING_NOTIFY_EMAIL || studio.email;

/** Mittente verificato presso il provider email. */
export const mittente = env.MAIL_FROM || `${studio.nome} <no-reply@example.com>`;
