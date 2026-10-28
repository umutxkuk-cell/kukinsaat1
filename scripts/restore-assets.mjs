/**
 * İkili varlık geri yükleme betiği.
 *
 * src/assets ve public altındaki ikili dosyalar (woff2, webp, png) herhangi
 * bir nedenle silinirse bu betik scripts/assets-backup ve scripts/fonts
 * içindeki base64 metin yedeklerinden dosyaları yeniden üretir:
 *
 *   node scripts/restore-assets.mjs
 */
import {
  closeSync,
  existsSync,
  mkdirSync,
  openSync,
  readFileSync,
  writeSync,
} from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

/** [yedek klasörü, hedef klasörü, dosya adı] */
const assets = [
  ["scripts/fonts", "src/assets/fonts", "inter-latin.woff2"],
  ["scripts/fonts", "src/assets/fonts", "inter-latin-ext.woff2"],
  ["scripts/fonts", "src/assets/fonts", "manrope-latin.woff2"],
  ["scripts/fonts", "src/assets/fonts", "manrope-latin-ext.woff2"],
  ["scripts/assets-backup", "src/assets", "hero.webp"],
  ["scripts/assets-backup", "public", "apple-touch-icon.png"],
];

for (const [backupDir, targetDir, name] of assets) {
  const b64Path = join(root, backupDir, `${name}.b64`);
  const outPath = join(root, targetDir, name);
  if (!existsSync(b64Path)) {
    console.error(`Eksik yedek: ${b64Path}`);
    process.exitCode = 1;
    continue;
  }
  if (existsSync(outPath)) {
    console.log(`Zaten mevcut: ${name}`);
    continue;
  }
  mkdirSync(join(root, targetDir), { recursive: true });
  const buf = Buffer.from(readFileSync(b64Path, "utf8").trim(), "base64");
  const fd = openSync(outPath, "w");
  writeSync(fd, buf);
  closeSync(fd);
  console.log(`Geri yüklendi: ${name} (${buf.length} bayt)`);
}
