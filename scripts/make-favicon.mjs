/**
 * Generates public/favicon.ico without any dependencies.
 * Format: ICO container holding a single 32x32 PNG (supported by all modern browsers).
 * Run: node scripts/make-favicon.mjs
 */
import { deflateSync } from "node:zlib";
import { writeFileSync, mkdirSync } from "node:fs";

const SIZE = 32;
const BG = [18, 17, 16]; // ink-950
const STROKE = [232, 126, 112]; // brand-400
const STEM = [255, 255, 255];

const px = Array.from({ length: SIZE }, () =>
  Array.from({ length: SIZE }, () => [0, 0, 0, 0]),
);

function distToSegment(x, y, x1, y1, x2, y2) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len2 = dx * dx + dy * dy || 1;
  let t = ((x - x1) * dx + (y - y1) * dy) / len2;
  t = Math.max(0, Math.min(1, t));
  const cx = x1 + t * dx;
  const cy = y1 + t * dy;
  return Math.hypot(x - cx, y - cy);
}

const radius = 7;
for (let y = 0; y < SIZE; y++) {
  for (let x = 0; x < SIZE; x++) {
    // rounded-rect mask
    const cx = Math.min(Math.max(x, radius), SIZE - 1 - radius);
    const cy = Math.min(Math.max(y, radius), SIZE - 1 - radius);
    const inside = Math.hypot(x - cx, y - cy) <= radius + 0.5;
    if (!inside) continue;
    px[y][x] = [...BG, 255];
  }
}

function stroke(x1, y1, x2, y2, width, color) {
  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      if (px[y][x][3] === 0) continue;
      if (distToSegment(x + 0.5, y + 0.5, x1, y1, x2, y2) <= width / 2) {
        px[y][x] = [...color, 255];
      }
    }
  }
}

stroke(17, 15, 32, 33, 5, STROKE); // left arm of the Y
stroke(47, 15, 32, 33, 5, STROKE); // right arm of the Y
stroke(32, 33, 32, 48, 5, STEM); // stem of the Y

/* ---- build RGBA pixel buffer (top-down) ---- */
const raw = Buffer.alloc((SIZE * 4 + 1) * SIZE);
let o = 0;
for (let y = 0; y < SIZE; y++) {
  raw[o++] = 0; // filter: none
  for (let x = 0; x < SIZE; x++) {
    const [r, g, b, a] = px[y][x];
    raw[o++] = r;
    raw[o++] = g;
    raw[o++] = b;
    raw[o++] = a;
  }
}

function crc32(buf) {
  let c;
  const table = [];
  for (let n = 0; n < 256; n++) {
    c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c >>> 0;
  }
  let crc = 0xffffffff;
  for (const byte of buf) crc = table[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const typeBuf = Buffer.from(type, "ascii");
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])));
  return Buffer.concat([len, typeBuf, data, crc]);
}

const ihdr = Buffer.alloc(13);
ihdr.writeUInt32BE(SIZE, 0);
ihdr.writeUInt32BE(SIZE, 4);
ihdr[8] = 8; // bit depth
ihdr[9] = 6; // colour type: RGBA
ihdr[10] = 0; // compression
ihdr[11] = 0; // filter
ihdr[12] = 0; // interlace

const png = Buffer.concat([
  Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
  chunk("IHDR", ihdr),
  chunk("IDAT", deflateSync(raw)),
  chunk("IEND", Buffer.alloc(0)),
]);

/* ---- wrap in ICO container ---- */
const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0); // reserved
header.writeUInt16LE(1, 2); // type: icon
header.writeUInt16LE(1, 4); // count

const entry = Buffer.alloc(16);
entry[0] = SIZE; // width
entry[1] = SIZE; // height
entry[2] = 0; // colours
entry[3] = 0; // reserved
entry.writeUInt16LE(1, 4); // planes
entry.writeUInt16LE(32, 6); // bpp
entry.writeUInt32LE(png.length, 8);
entry.writeUInt32LE(22, 12); // offset = 6 + 16

mkdirSync("public", { recursive: true });
writeFileSync("public/favicon.ico", Buffer.concat([header, entry, png]));
console.log("wrote public/favicon.ico (" + png.length + " bytes)");
