/**
 * Scarica in locale le fotografie dichiarate in content/images.json.
 * Fonte: Unsplash (licenza gratuita, uso commerciale consentito, no attribuzione obbligatoria).
 * Output: public/images/<nome>-<larghezza>.webp  +  public/images/credits.json
 *
 *   node scripts/fetch-images.mjs [--force]
 */
import fs from 'node:fs/promises';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const OUT = path.join(ROOT, 'public', 'images');
const WIDTHS = [640, 1280, 1920];
const FORCE = process.argv.includes('--force');

const manifest = JSON.parse(await fs.readFile(path.join(ROOT, 'content', 'images.json'), 'utf8'));
await fs.mkdir(OUT, { recursive: true });

const credits = {};
let done = 0, skipped = 0, failed = [];

async function base(id) {
  const r = await fetch(`https://unsplash.com/napi/photos/${id}`, { headers: { Accept: 'application/json' } });
  if (!r.ok) throw new Error('napi ' + r.status);
  const j = await r.json();
  if (j.premium || j.plus) throw new Error('foto Unsplash+ (filigranata): scegline una a licenza libera');
  return {
    raw: j.urls.raw,
    author: j.user?.name || '',
    authorUrl: j.user?.links?.html || '',
    link: j.links?.html || `https://unsplash.com/photos/${id}`,
    color: j.color || '#E7E2D8',
    blur: j.blur_hash || ''
  };
}

for (const [name, cfg] of Object.entries(manifest)) {
  try {
    const info = await base(cfg.id);
    credits[name] = { id: cfg.id, author: info.author, authorUrl: info.authorUrl, link: info.link, color: info.color };
    const ar = (cfg.ar || '3/2').replace('/', ':');
    for (const w of WIDTHS) {
      const file = path.join(OUT, `${name}-${w}.webp`);
      if (!FORCE) { try { await fs.access(file); skipped++; continue; } catch {} }
      const url = `${info.raw}&fm=webp&q=74&w=${w}&ar=${encodeURIComponent(ar)}&fit=crop&crop=faces,entropy&auto=format`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('img ' + res.status);
      await fs.writeFile(file, Buffer.from(await res.arrayBuffer()));
      done++;
    }
    process.stdout.write('.');
  } catch (e) {
    failed.push(`${name}: ${e.message}`);
    process.stdout.write('x');
  }
}

await fs.writeFile(path.join(OUT, 'credits.json'), JSON.stringify(credits, null, 2));
console.log(`\nscaricate ${done} · gia presenti ${skipped}` + (failed.length ? `\nERRORI:\n  ${failed.join('\n  ')}` : ''));
