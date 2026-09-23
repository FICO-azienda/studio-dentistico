/**
 * Interfaccia web per lo staff: elenco prenotazioni, conferma, annulla,
 * sposta — alternativa agli script da riga di comando. Non fa parte del
 * sito pubblico: pagina unica (non bilingue), esclusa da sitemap e indici,
 * protetta da password condivisa (STAFF_TOKEN, vedi api/_lib/staff-auth.mjs).
 */
import { site, team, orari, chiusure, esc, attr, personName } from './utils.mjs';

export const staffPage = () => {
  const docs = team.filter((p) => p.featured || p.treatments.length);
  const dottori = docs.map((p) => personName(p));

  return `<!DOCTYPE html>
<html lang="it">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Area riservata — ${esc(site.name)}</title>
<meta name="description" content="Area riservata allo staff di ${esc(site.name)} per gestire le prenotazioni: conferma, sposta o annulla gli appuntamenti dei pazienti.">
<meta name="robots" content="noindex, nofollow">
<link rel="canonical" href="${esc(site.url)}/staff/">
<link rel="icon" href="../favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,400&display=swap">
<link rel="stylesheet" href="../styles/main.css">
</head>
<body class="staff-body">
<div data-staff
  data-endpoint="${attr(site.booking?.endpoint || '')}"
  data-mode="${attr(site.booking?.mode || 'demo')}"
  data-phone="${attr(site.phone)}"
><h1 class="sr-only">Area riservata — ${esc(site.name)}</h1></div>
<script type="application/json" data-staff-config>${JSON.stringify({ orari, chiusure, dottori }).replace(/</g, '\\u003c')}</script>
<script src="../scripts/staff.js" defer></script>
</body>
</html>`;
};
