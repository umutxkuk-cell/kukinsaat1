/** Consent bar uçtan uca testi: görünüm → tıklama → kalıcılık → FAB */
import { chromium } from "playwright";
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import path from "node:path";

const dist = path.resolve("dist");
const server = createServer(async (req, res) => {
  let p = req.url.split("?")[0];
  if (p === "/") p = "/index.html";
  else if (!path.extname(p)) p += p.endsWith("/") ? "index.html" : "/index.html";
  try {
    const data = await readFile(path.join(dist, p));
    res.writeHead(200, { "Content-Type": p.endsWith(".html") ? "text/html" : "application/octet-stream" });
    res.end(data);
  } catch {
    res.writeHead(404);
    res.end("nf");
  }
});
await new Promise((r) => server.listen(8091, r));

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1366, height: 800 } });
const errors = [];
page.on("console", (m) => { if (m.type() === "error") errors.push(m.text().slice(0, 150)); });
page.on("pageerror", (e) => errors.push("PAGEERROR: " + String(e).slice(0, 200)));

// 1) Temiz oturum: bar görünmeli (intro ~2.2sn + 2.6sn gecikme)
await page.goto("http://localhost:8091/", { waitUntil: "load" });
await page.waitForSelector(".consent-bar", { timeout: 8000 }).catch(() => {});
let st = await page.evaluate(() => {
  const bar = document.querySelector(".consent-bar");
  if (!bar) return { step: 1, bar: false };
  const r = bar.getBoundingClientRect();
  return { step: 1, bar: true, top: Math.round(r.top), h: Math.round(r.height), vw: window.innerWidth };
});
console.log("1) İlk ziyaret:", JSON.stringify(st));
await page.screenshot({ path: "scripts/consent-bar.png" });

// 2) "Tümünü kabul et" → bar kapanır, FAB belirir
await page.getByRole("button", { name: "Tümünü kabul et" }).click();
await page.waitForTimeout(900);
st = await page.evaluate(() => ({
  step: 2,
  bar: !!document.querySelector(".consent-bar"),
  fab: !!document.querySelector(".consent-fab"),
  stored: localStorage.getItem("kuk-cookie-consent"),
  ga: !!document.getElementById("kuk-ga4-tag"),
}));
console.log("2) Kabul sonrası:", JSON.stringify(st));

// 3) Sayfa yenile → bar gelmez (tercih hatırlanır), FAB kalır
await page.reload({ waitUntil: "load" });
await page.waitForTimeout(4000);
st = await page.evaluate(() => ({
  step: 3,
  bar: !!document.querySelector(".consent-bar"),
  fab: !!document.querySelector(".consent-fab"),
}));
console.log("3) Yenileme:", JSON.stringify(st));
await page.screenshot({ path: "scripts/consent-rozet.png" });

// 4) FAB → bar tekrar açılır
await page.getByRole("button", { name: "Çerez tercihlerini değiştir" }).click();
await page.waitForTimeout(500);
st = await page.evaluate(() => ({ step: 4, bar: !!document.querySelector(".consent-bar") }));
console.log("4) FAB açtı:", JSON.stringify(st));

// 5) Tercihler görünümü
await page.getByRole("button", { name: "Tercihler", exact: true }).click();
await page.waitForTimeout(600);
st = await page.evaluate(() => ({
  step: 5,
  switches: document.querySelectorAll('.consent-toggle[role="switch"]').length,
  saveBtn: !!document.querySelector('button:not([disabled])') ,
}));
console.log("5) Tercihler:", JSON.stringify(st));
await page.screenshot({ path: "scripts/consent-prefs.png" });

console.log("Hatalar:", errors.length ? errors : "YOK");
await browser.close();
server.close();
