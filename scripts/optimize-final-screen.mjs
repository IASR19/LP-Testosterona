import fs from "node:fs";
import sharp from "sharp";

// Fonte atual é 576px; upscale com lanczos para retina (até ter master HD).
const src = "public/images/final-screen.png";
const meta = await sharp(src).metadata();
console.log("source", meta.width, "x", meta.height);

await sharp(src)
  .resize({ width: 1290, kernel: sharp.kernel.lanczos3 })
  .webp({ quality: 92, effort: 6 })
  .toFile("public/images/final-screen.webp");

await sharp(src)
  .resize({ width: 1290, kernel: sharp.kernel.lanczos3 })
  .png({ compressionLevel: 6 })
  .toFile("public/images/final-screen-opt.png");

for (const f of [
  "public/images/final-screen.webp",
  "public/images/final-screen-opt.png",
]) {
  const m = await sharp(f).metadata();
  console.log(f, `${m.width}x${m.height}`, `${Math.round(fs.statSync(f).size / 1024)}kb`);
}
