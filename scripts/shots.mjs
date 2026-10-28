/** Önce/sonra ekran görüntüsü karşılaştırması — masaüstü 1440 + mobil 390 */
import { chromium } from "playwright";
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import path from "node:path";

const label = process.argv[2] || "after";
const dist = path.resolve("dist");
const server = createServer(async (req, res) => {
  let p = req.url.split("?")[0];
  if (p === "/") p = "/index.html";
  else if (!path.extname(p)) p += p.endsWith("/") ? "index.html" : "/index.html";
  try {
    const data = await readFile(path.join(dist, p));
    res.writeHead(200, { "Content-Type": p.endsWith(".html") ? "text/html" : "application/octet-stream" });
    res.end(data);
  } catch { res.writeHead(404); res.end("nf"); }
});
await new Promise((r) => server.listen(8092, r));

const browser = await chromium.launch();
const routes = ["/", "/kurumsal", "/hizmetler", "/hizmetler/insaat-ve-yapi-uygulamalari", "/iletisim"];

async function shot(viewport, paths, suffix, scrollMap = {}) {
  const page = await browser.newPage({ viewport });
  await page.addInitScript(() => { try { localStorage.setItem("kuk-cookie-consent", "declined"); } catch {} });
  for (const r of paths) {
    await page.goto(`http://localhost:8092${r}`, { waitUntil: "load" });
    await page.waitForTimeout(4200); // intro + animasyonlar bitsin
    if (scrollMap[r]) await page.evaluate((y) => window.scrollTo(0, y), scrollMap[r]);
    await page.waitForTimeout(scrollMap[r] ? 1200 : 200);
    const name = `scripts/cmp-${label}-${r.replaceAll("/", "_") || "home"}${suffix}.png`;
    await page.screenshot({ path: name });
    console.log("  ✓", name);
  }
  await page.close();
}

await shot({ width: 1440, height: 900 }, routes, "-d1440", { "/iletisim": 620 });
await shot({ width: 390, height: 844 }, ["/", "/iletisim"], "-m390", { "/iletisim": 420 });
await browser.close();
server.close();
