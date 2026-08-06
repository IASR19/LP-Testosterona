import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const campaign = process.argv[2];

if (!campaign || !["endometriose", "testosterona"].includes(campaign)) {
  console.error("Uso: node scripts/optimize-final-screen.mjs <endometriose|testosterona>");
  process.exit(1);
}

const dir = path.join("public", "images", campaign);
const srcCandidates = [
  path.join(dir, "final-screen-hd.png"),
  path.join(dir, "final-screen.png"),
];
const src = srcCandidates.find((file) => fs.existsSync(file));

if (!src) {
  console.error(`Fonte não encontrada em ${dir}`);
  process.exit(1);
}

const meta = await sharp(src).metadata();
console.log("source", campaign, meta.width, "x", meta.height);

const resize =
  campaign === "testosterona"
    ? { width: 1290, kernel: sharp.kernel.lanczos3 }
    : { width: 1290, withoutEnlargement: true };

await sharp(src)
  .resize(resize)
  .webp({ quality: 92, effort: 6 })
  .toFile(path.join(dir, "final-screen.webp"));

await sharp(src)
  .resize(resize)
  .png({ compressionLevel: 6 })
  .toFile(path.join(dir, "final-screen-opt.png"));

for (const f of [
  path.join(dir, "final-screen.webp"),
  path.join(dir, "final-screen-opt.png"),
]) {
  const m = await sharp(f).metadata();
  console.log(f, `${m.width}x${m.height}`, `${Math.round(fs.statSync(f).size / 1024)}kb`);
}
