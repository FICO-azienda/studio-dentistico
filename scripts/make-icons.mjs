/** Genera favicon.svg, apple-touch-icon.png e site.webmanifest in /public. */
import fs from 'node:fs';
import zlib from 'node:zlib';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const OUT = path.join(ROOT, 'public');
const INK = [18, 51, 85];
const IVORY = [255, 255, 255];
const SAGE = [157, 186, 218];

/* -- marchio: arco aperto (una "C") -------------------------------------- */
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" fill="#123355"/>
  <path d="M44 20.5A18 18 0 1 0 44 43.5" fill="none" stroke="#ffffff" stroke-width="5.5" stroke-linecap="butt"/>
  <circle cx="46.5" cy="32" r="3.2" fill="#9dbada"/>
</svg>`;
fs.writeFileSync(path.join(OUT, 'favicon.svg'), svg);

/* -- PNG minimale (no dipendenze) ---------------------------------------- */
function png(size, draw) {
  const raw = Buffer.alloc(size * (size * 3 + 1));
  for (let y = 0; y < size; y++) {
    raw[y * (size * 3 + 1)] = 0; // filter: none
    for (let x = 0; x < size; x++) {
      const [r, g, b] = draw(x, y);
      const o = y * (size * 3 + 1) + 1 + x * 3;
      raw[o] = r; raw[o + 1] = g; raw[o + 2] = b;
    }
  }
  const chunk = (type, data) => {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length);
    const body = Buffer.concat([Buffer.from(type, 'ascii'), data]);
    const crc = Buffer.alloc(4);
    crc.writeUInt32BE(crc32(body) >>> 0);
    return Buffer.concat([len, body, crc]);
  };
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0); ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; ihdr[9] = 2; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk('IHDR', ihdr),
    chunk('IDAT', zlib.deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0))
  ]);
}

let T = null;
function crc32(buf) {
  if (!T) {
    T = new Int32Array(256);
    for (let n = 0; n < 256; n++) {
      let c = n;
      for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      T[n] = c;
    }
  }
  let c = -1;
  for (let i = 0; i < buf.length; i++) c = T[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return c ^ -1;
}

const icon = (size) =>
  png(size, (x, y) => {
    const s = size / 64;
    const cx = 32 * s, cy = 32 * s;
    const dx = x + 0.5 - cx, dy = y + 0.5 - cy;
    const r = Math.hypot(dx, dy);
    const a = Math.atan2(dy, dx); // -pi..pi
    const rIn = 15.3 * s, rOut = 20.8 * s;
    const gap = Math.abs(a) < 0.62; // apertura a destra -> forma di C
    if (r >= rIn && r <= rOut && !gap) return IVORY;
    const pd = Math.hypot(x + 0.5 - 46.5 * s, y + 0.5 - 32 * s);
    if (pd <= 3.2 * s) return SAGE;
    return INK;
  });

fs.writeFileSync(path.join(OUT, 'apple-touch-icon.png'), icon(180));
fs.writeFileSync(path.join(OUT, 'favicon-96.png'), icon(96));

fs.writeFileSync(
  path.join(OUT, 'site.webmanifest'),
  JSON.stringify(
    {
      name: 'Studio Canova — Odontoiatria',
      short_name: 'Canova',
      description: 'Studio odontoiatrico a Milano',
      start_url: './',
      display: 'standalone',
      background_color: '#ffffff',
      theme_color: '#ffffff',
      icons: [
        { src: './favicon.svg', sizes: 'any', type: 'image/svg+xml' },
        { src: './favicon-96.png', sizes: '96x96', type: 'image/png' },
        { src: './apple-touch-icon.png', sizes: '180x180', type: 'image/png' }
      ]
    },
    null,
    2
  )
);
console.log('icone generate');
