/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

const dir = path.join(__dirname, "..", "public", "brand");
fs.mkdirSync(dir, { recursive: true });

function crc32(buf) {
  let c = ~0;
  for (let i = 0; i < buf.length; i++) {
    c ^= buf[i];
    for (let k = 0; k < 8; k++) c = (c >>> 1) ^ (0xedb88320 & -(c & 1));
  }
  return ~c >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const typeB = Buffer.from(type);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([typeB, data])));
  return Buffer.concat([len, typeB, data, crc]);
}

function solidPng(w, h, r, g, b) {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0);
  ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8;
  ihdr[9] = 2;
  const raw = Buffer.alloc((w * 3 + 1) * h);
  for (let y = 0; y < h; y++) {
    raw[y * (w * 3 + 1)] = 0;
    for (let x = 0; x < w; x++) {
      const i = y * (w * 3 + 1) + 1 + x * 3;
      // subtle gradient for mark
      const t = x / w;
      raw[i] = Math.min(255, r + Math.floor(t * 40));
      raw[i + 1] = g;
      raw[i + 2] = Math.min(255, b + Math.floor((1 - t) * 30));
    }
  }
  return Buffer.concat([
    signature,
    chunk("IHDR", ihdr),
    chunk("IDAT", zlib.deflateSync(raw)),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

fs.writeFileSync(path.join(dir, "logo-mark.png"), solidPng(256, 256, 123, 0, 200));
fs.writeFileSync(path.join(dir, "logo.png"), solidPng(640, 200, 123, 0, 200));
fs.writeFileSync(
  path.join(dir, "logo.svg"),
  `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="160" viewBox="0 0 512 160">
  <rect width="512" height="160" rx="24" fill="#190026"/>
  <rect x="24" y="40" width="80" height="80" rx="16" fill="#7B00C8"/>
  <text x="128" y="100" font-family="Arial,sans-serif" font-size="42" font-weight="700" fill="#FBF7FF">REKAR GROUP</text>
</svg>`
);
console.log("ok");
