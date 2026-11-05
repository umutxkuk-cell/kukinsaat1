import { useId, type CSSProperties, type ReactElement } from "react";
import "./hero-art.css";

/**
 * KUK İnşaat — beş sayfanın hero sahneleri.
 *
 * TEK DÜNYA, TEK IŞIK. Beş sahne de aynı ufuk çizgisinde (y=424), aynı
 * güneşin (940,246) altında ve aynı uzak şehir siluetinin önünde durur.
 * Işık her zaman sağ üstten gelir; bu yüzden her sayfada aynı yön aydınlık,
 * aynı yön gölgededir. Sitenin her yerinde aynı dünya görünür.
 *
 * DİL: poster. Kalın, dolu siluetler; teknik çizgi yok. Bir çocuğun bile
 * "bina yapılıyor", "mercek içini gösteriyor", "yol bize geliyor" diye
 * okuyacağı kadar açık biçimler. Terracotta her sahnede YALNIZCA tek bir
 * aktif öğede kullanılır — vinçteki yük, konum iğnesi, teslim bayrağı.
 */

export type SceneId = "home" | "kurumsal" | "hizmetler" | "projeler" | "iletisim";

const VW = 1200;
const VH = 620;
const HORIZON = 424;                 // her sahnede aynı ufuk
const KERB = HORIZON + 32;           // paylaşılan kaldırım şeridi
const SUN = { x: 940, y: 246, r: 98 };  // her sahnede aynı güneş

const C = {
  ink: "#20262b",
  inkDeep: "#151a1f",
  blue: "#1f435c",
  blueLit: "#3d7095",
  terra: "#a34e3a",
  far: "#ddd7cb",     // uzak siluet — atmosferik perspektif
  mid: "#c8c1b2",     // orta mesafe
  ground: "#e2ddd1",
  line: "#d8d3ca",
  line2: "#9c9384",
  paper: "#fbfaf6",
  warm: "#f6e3b0",
};

type Vars = Record<string, string | number>;
const st = (o: Vars) => o as CSSProperties;
const d = (delay: number, dur?: number): CSSProperties =>
  st({ "--d": `${delay}s`, ...(dur ? { "--dur": `${dur}s` } : {}) });
const origin = (x: number, y: number, extra: Vars = {}): CSSProperties =>
  st({ transformOrigin: `${x}px ${y}px`, ...extra });

const rnd = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

/* ───────────────────── Paylaşılan dünya ───────────────────── */

function Defs({ u }: { u: string }) {
  return (
    <defs>
      <linearGradient id={`${u}sky`} x1="0" x2="0" y1="0" y2="1">
        <stop offset="0" stopColor="#9dbdd4" stopOpacity=".34" />
        <stop offset=".52" stopColor="#c3cfd8" stopOpacity=".14" />
        <stop offset="1" stopColor="#e7ddca" stopOpacity=".3" />
      </linearGradient>
      <linearGradient id={`${u}sun`} x1="0" x2="0" y1="0" y2="1">
        <stop offset="0" stopColor="#d07a5c" />
        <stop offset="1" stopColor="#98452f" />
      </linearGradient>
      <radialGradient id={`${u}halo`} cx="50%" cy="50%" r="50%">
        <stop offset="0" stopColor={C.warm} stopOpacity=".55" />
        <stop offset="1" stopColor={C.warm} stopOpacity="0" />
      </radialGradient>
      {/* Kütle yüzeyleri: sağ cephe güneşe dönük, sol cephe gölgede */}
      <linearGradient id={`${u}md`} x1="0" x2="1" y1="0" y2="0">
        <stop offset="0" stopColor="#262e36" />
        <stop offset="1" stopColor="#1a2027" />
      </linearGradient>
      <linearGradient id={`${u}mb`} x1="0" x2="1" y1="0" y2="0">
        <stop offset="0" stopColor="#2b5a7a" />
        <stop offset="1" stopColor="#1d4059" />
      </linearGradient>
      <linearGradient id={`${u}ml`} x1="0" x2="1" y1="0" y2="0">
        <stop offset="0" stopColor="#4a7fa3" />
        <stop offset="1" stopColor="#31627f" />
      </linearGradient>
      <linearGradient id={`${u}gp`} x1="0" x2="0" y1="0" y2="1">
        <stop offset="0" stopColor={C.ground} />
        <stop offset="1" stopColor="#ebe7de" />
      </linearGradient>
      <linearGradient id={`${u}gl`} x1="0" x2="1" y1="0" y2="0">
        <stop offset="0" stopColor="#fff" stopOpacity="0" />
        <stop offset=".5" stopColor="#fff" stopOpacity=".26" />
        <stop offset="1" stopColor="#fff" stopOpacity="0" />
      </linearGradient>
    </defs>
  );
}

/** Tam kana gökyüzü. */
function Sky({ u }: { u: string }) {
  return <rect width={VW} height={VH} fill={`url(#${u}sky)`} />;
}

/** Aynı güneş, her sahnede. */
function SunDisc({ u, delay = 0.2 }: { u: string; delay?: number }) {
  return (
    <>
      <circle className="hv-fb hv-pulse" cx={SUN.x} cy={SUN.y} r={SUN.r + 92} fill={`url(#${u}halo)`} />
      <g className="hv-sun" style={d(delay)}>
        <circle className="hv-fb hv-pulse" cx={SUN.x} cy={SUN.y} r={SUN.r} fill={`url(#${u}sun)`} />
      </g>
    </>
  );
}

/** UZAK ŞEHİR — beş sahnede de birebir aynı. Sitenin ortak ufku. */
const FAR: [number, number, number][] = [
  [-14, 96, 72], [92, 68, 102], [170, 120, 60], [298, 62, 90], [370, 106, 54],
  [488, 70, 82], [570, 134, 46], [714, 66, 94], [788, 112, 58], [910, 74, 86],
  [994, 130, 50], [1130, 84, 76],
];
function FarCity({ delay = 0.3 }: { delay?: number }) {
  return (
    <g>
      {FAR.map(([x, w, h], i) => (
        <rect key={x} className="hv-fb-b hv-rise" x={x} y={HORIZON - h} width={w} height={h}
          fill={C.far} style={d(delay + i * 0.045, 1.5)} />
      ))}
    </g>
  );
}

/** Orta mesafe kütleler — derinlik. */
function MidCity({ delay = 0.5 }: { delay?: number }) {
  const blocks: [number, number, number][] = [[30, 92, 138], [134, 66, 176], [1046, 92, 152], [1146, 66, 116]];
  return (
    <g>
      {blocks.map(([x, w, h], i) => (
        <rect key={x} className="hv-fb-b hv-rise" x={x} y={HORIZON - h} width={w} height={h}
          fill={C.mid} style={d(delay + i * 0.08, 1.6)} />
      ))}
    </g>
  );
}

/** Ufuk çizgisi + kenardan kenara zemin düzlemi. */
/** Ufuk + paylaşılan kaldırım şeridi. Beş sahnede de birebir aynı: sitenin
 *  ortak zemini. Şerit, iletişim sahnesinde yola dönüşür. */
function GroundBand({ u, delay = 0.1 }: { u: string; delay?: number }) {
  return (
    <>
      <rect x="0" y={HORIZON} width={VW} height={VH - HORIZON} fill={`url(#${u}gp)`}
        className="hv-fade" style={d(delay, 1.4)} />
      <rect x="0" y={HORIZON} width={VW} height={KERB - HORIZON} fill={C.ink} opacity=".055"
        className="hv-fade" style={d(delay + 0.2, 1.4)} />
      <path d={`M0 ${KERB} L${VW} ${KERB}`} stroke={C.line2} strokeWidth="1.2" opacity=".7" fill="none"
        className="hv-fade" style={d(delay + 0.3, 1.4)} />
      <path d={`M0 ${HORIZON} L${VW} ${HORIZON}`} stroke={C.ink} strokeWidth="2" fill="none"
        pathLength={1} className="hv-draw" style={d(0, 2)} />
    </>
  );
}

/** Temas gölgesi — kütleyi zemine oturtur. */
function Contact({ cx, rx, delay = 1.2 }: { cx: number; rx: number; delay?: number }) {
  return <ellipse cx={cx} cy={HORIZON + 7} rx={rx} ry="7" fill={C.ink} opacity=".11"
    className="hv-fade" style={d(delay, 1)} />;
}

/** Kalın kütle: gövde + güneşe dönük aydınlık sağ şerit + parapet. */
function Mass({
  u, x, y, w, h, delay, face = "dark", cap = true, capColor,
}: {
  u: string; x: number; y: number; w: number; h: number; delay: number;
  face?: "dark" | "blue"; cap?: boolean; capColor?: string;
}) {
  const strip = Math.max(9, Math.round(w * 0.17));
  return (
    <g className="hv-fb-b hv-rise" style={d(delay, 1.7)}>
      <rect x={x} y={y} width={w} height={h} fill={`url(#${u}${face === "dark" ? "md" : "mb"})`} />
      <rect x={x + w - strip} y={y} width={strip} height={h} fill={`url(#${u}ml)`} opacity=".92" />
      {cap && (
        <rect x={x - 3} y={y - 6} width={w + 6} height="6"
          fill={capColor ?? C.inkDeep} />
      )}
    </g>
  );
}

/** Seyrek sıcak pencereler. */
function Windows({
  x, y, cols, rows, gx, gy, w = 9, h = 5, seed = 1, delay = 1.8, still = false, litRate = 0.42,
}: {
  x: number; y: number; cols: number; rows: number; gx: number; gy: number;
  w?: number; h?: number; seed?: number; delay?: number; still?: boolean; litRate?: number;
}) {
  const out: ReactElement[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const n = seed * 977 + r * 19 + c * 7;
      const lit = rnd(n) < litRate;
      const anim = !still && lit && rnd(n + 0.5) < 0.38;
      out.push(
        <rect key={`${r}-${c}`} x={x + c * gx} y={y + r * gy} width={w} height={h}
          fill={lit ? C.warm : "#8fb0c6"} opacity={lit ? 0.62 + rnd(n + 2) * 0.38 : 0.16}
          className={anim ? "hv-tw" : undefined}
          style={anim ? st({ "--dur": `${6 + rnd(n + 3) * 8}s`, "--del": `-${rnd(n + 4) * 9}s` }) : undefined} />,
      );
    }
  }
  return <g className={still ? undefined : "hv-fade"} style={still ? undefined : d(delay, 1.6)}>{out}</g>;
}

function Birds({ del, y, s = 1 }: { del: number; y: number; s?: number }) {
  return (
    <g className="hv-bird" style={st({ "--d": `${del}s`, "--dur": "46s" })}>
      <g transform={`translate(120 ${y}) scale(${s})`}>
        <path d="M0 0 q8 -9 16 0 q8 -9 16 0" fill="none" stroke={C.ink} strokeWidth="1.7"
          strokeLinecap="round" opacity=".45" />
      </g>
    </g>
  );
}

function Beacon({ x, y }: { x: number; y: number }) {
  return (
    <>
      <circle cx={x} cy={y} r="4" fill={C.terra} className="hv-beacon" />
      <circle cx={x} cy={y} r="4" fill="none" stroke={C.terra} strokeWidth="1.2" className="hv-fb hv-ring" />
    </>
  );
}

/* ───────────────────────── 1 · ANA SAYFA ─────────────────────────
   The home scene shares the same sky, horizon and palette as the inner pages.
   A calm, stepped architectural elevation replaces the previous crane scene. */
function HomeScene({ u }: { u: string }) {
  const floorY = [181, 222, 263, 304, 345];
  const bayX = [638, 700, 762];

  return (
    <>
      <Defs u={u} />
      <defs>
        <clipPath id={`${u}home-facade`}>
          <rect x="620" y="165" width="226" height={HORIZON - 165} />
        </clipPath>
      </defs>

      <Sky u={u} />
      <g className="home-scene__responsive"><SunDisc u={u} /></g>
      <g className="home-scene__ground">
        <FarCity />
        <MidCity delay={0.55} />
        <GroundBand u={u} />
      </g>

      <g className="home-scene__responsive">
        <Contact cx={757} rx={255} delay={1.1} />

        {/* The lower wings give the main structure a grounded, human scale. */}
        <g className="hv-fb-b hv-rise" style={d(0.6, 1.7)}>
          <rect x="500" y="288" width="154" height={HORIZON - 288} fill={`url(#${u}md)`} />
          <rect x="510" y="310" width="136" height="92" fill={`url(#${u}mb)`} />
          <path d="M500 288H654M500 328H654M500 368H654" fill="none" stroke={C.far} strokeWidth="5" />
          <path d="M545 310V402M591 310V402" fill="none" stroke={C.inkDeep} strokeWidth="3" opacity=".75" />
          <rect x="858" y="250" width="150" height={HORIZON - 250} fill={`url(#${u}md)`} />
          <rect x="870" y="270" width="126" height="132" fill={`url(#${u}mb)`} />
          <path d="M858 250H1008M858 294H1008M858 338H1008M858 382H1008" fill="none" stroke={C.far} strokeWidth="5" />
          <path d="M912 270V402M958 270V402" fill="none" stroke={C.inkDeep} strokeWidth="3" opacity=".75" />
        </g>

        {/* Main facade, return wall and roof are one architectural mass. */}
        <g className="hv-fb-b hv-rise" style={d(0.85, 1.8)}>
          <rect x="620" y="165" width="226" height={HORIZON - 165} fill={`url(#${u}mb)`} />
          <path d="M846 165L900 143V424H846Z" fill="#203a4c" />
          <path d="M620 165L674 143H900L846 165Z" fill="#d1cdc2" />
          <path d="M616 165H850" fill="none" stroke={C.inkDeep} strokeWidth="7" />
          <path d="M854 184L893 168M854 226L893 210M854 268L893 252M854 310L893 294M854 352L893 336"
            fill="none" stroke="#8fb0c6" strokeWidth="3" opacity=".3" />
        </g>

        {/* Recessed glazing and horizontal balcony lines. */}
        <g className="hv-fade" style={d(2.1, 1.3)}>
          {floorY.map((y, floor) => (
            <g key={y}>
              {bayX.map((x, bay) => (
                <g key={x}>
                  <rect x={x} y={y} width="52" height="26" fill="#90b1c5" opacity=".28" />
                  {(floor + bay * 2) % 4 === 0 && (
                    <rect x={x + 5} y={y + 5} width="42" height="16" fill={C.warm} opacity=".7"
                      className="hv-tw" style={st({ "--dur": `${7 + floor}s`, "--del": `-${bay * 2 + floor}s` })} />
                  )}
                </g>
              ))}
              <path d={`M620 ${y + 30}H846`} fill="none" stroke={C.inkDeep} strokeWidth="4" opacity=".75" />
            </g>
          ))}
          <path d="M696 176V380M758 176V380" fill="none" stroke={C.inkDeep} strokeWidth="3" opacity=".65" />
        </g>

        <g clipPath={`url(#${u}home-facade)`}>
          <rect x="620" y="165" width="50" height={HORIZON - 165} fill={`url(#${u}gl)`}
            className="hv-sweep" style={st({ "--d": "4s" })} />
        </g>

        {/* A continuous plinth and a softly lit entrance complete the scene. */}
        <g className="hv-fade" style={d(1.9, 1.2)}>
          <rect x="500" y="408" width="508" height="16" fill={C.inkDeep} />
          <rect x="690" y="378" width="82" height="46" fill={C.warm} opacity=".88" className="hv-glow" />
          <rect x="690" y="378" width="82" height="5" fill={C.inkDeep} />
          <rect x="730" y="383" width="3" height="41" fill={C.inkDeep} opacity=".48" />
        </g>

        <g className="hv-fade" style={d(2.1, 1.3)}>
          {[538, 982].map((x, i) => (
            <g key={x}>
              <rect x={x - 3} y="384" width="6" height="40" fill={C.ink} opacity=".8" />
              <circle cx={x} cy="374" r={i ? 23 : 26} fill={C.blue} opacity=".85" />
              <circle cx={x + (i ? -9 : 10)} cy="362" r="15" fill={C.blueLit} opacity=".62" />
            </g>
          ))}
        </g>
      </g>
    </>
  );
}

/* ───────────────────────── 2 · KURUMSAL ─────────────────────────
   "İnşaata mühendislik gözüyle bakan bir firma."
   Vakur bir kurum cephesi ve tam ortasında KUK monogramı: önce çizilerek
   belirir, sonra mürekkebi dolar. Marka, binanın armasıdır. */
const HEX = "M297.08 261.26 164.79 341.36 31.00 259.41 31.00 113.09 164.79 30.22 297.08 112.63Z M164.79 3.36 6.48 98.83 6.48 273.28 164.79 369.14 321.14 273.28 321.14 98.83Z";
const K_LEFT = "M67.56 173.29 101.80 109.85 101.80 89.02 74.50 105.22 29.15 187.64 29.61 236.72 53.68 198.29 103.65 282.09 103.65 235.33Z";
const K_RIGHT = "M253.14 105.22 225.84 89.02 225.84 109.85 260.09 173.29 223.99 235.33 223.99 282.09 273.97 198.29 298.03 236.72 298.49 187.64Z";
const U_PATH = "M183.24 62.60 183.24 267.28 164.73 280.24 145.76 267.28 146.69 62.60 120.31 77.91 120.31 289.50 164.27 318.67 208.69 290.43 208.69 76.98Z";

function KurumsalScene({ u }: { u: string }) {
  const BX = 516, BW = 384, BY = 196;
  const EX = 708, EY = 286, ER = 94;      // arma merkezi
  const MS = 0.40;                         // monogram ölçeği
  const mt = `translate(${EX} ${EY}) scale(${MS}) translate(-164.64 -186.25)`;
  const piers = Array.from({ length: 9 }, (_, i) => BX + 26 + i * ((BW - 52) / 8));

  return (
    <>
      <Defs u={u} />
      <Sky u={u} />
      <SunDisc u={u} delay={0.25} />
      <FarCity />
      <MidCity delay={0.55} />
      <Birds del={-14} y={160} s={0.9} />
      <GroundBand u={u} />
      <Contact cx={BX + BW / 2} rx={212} delay={1.5} />

      {/* ── kurum cephesi ── */}
      <Mass u={u} x={BX} y={BY} w={BW} h={HORIZON - BY} delay={0.8} face="blue" cap={false} />
      <rect className="hv-fb hv-grow-x" x={BX - 10} y={BY - 14} width={BW + 20} height="14" fill={C.inkDeep} style={d(2.2, 1.2)} />
      <rect className="hv-fb hv-grow-x" x={BX - 10} y={BY - 18} width={BW + 20} height="4" fill={C.blue} style={d(2.35, 1.2)} />
      {/* düşey payandalar ve aralarındaki sıcak cam */}
      {piers.map((px, i) => (
        <rect key={px} className="hv-fb-b hv-rise" x={px - 7} y={BY + 6} width="14" height={HORIZON - BY - 22}
          fill={`url(#${u}ml)`} opacity=".55" style={d(1.1 + i * 0.07, 1.4)} />
      ))}
      <Windows x={BX + 34} y={BY + 22} cols={8} rows={11} gx={42} gy={17} w={22} seed={17} delay={2.6} litRate={0.46} />
      {/* kaide */}
      <rect className="hv-fb hv-grow-x" x={BX - 6} y={HORIZON - 16} width={BW + 12} height="16" fill={C.inkDeep} style={d(1.9, 1.2)} />
      {/* giriş: sıcak ışık */}
      <rect x={EX - 44} y={HORIZON - 62} width="88" height="62" fill={C.warm} opacity=".95" className="hv-glow" />
      <rect x={EX - 44} y={HORIZON - 62} width="88" height="5" fill={C.inkDeep} />
      <rect x={EX - 2} y={HORIZON - 57} width="4" height="57" fill={C.inkDeep} opacity=".5" />
      {/* giriş merdiveni */}
      {[0, 1, 2].map((i) => (
        <rect key={i} className="hv-fb hv-grow-x" x={EX - 74 - i * 16} y={HORIZON + i * 11} width={148 + i * 32} height="11"
          fill={`url(#${u}fs)`} stroke={C.line2} strokeWidth=".7" style={d(2.5 + i * 0.14, 1)} />
      ))}

      {/* ── arma: KUK monogramı çizilerek belirir, sonra dolar ── */}
      <g className="hv-fb hv-pop" style={d(2.5, 1.2)}>
        <circle cx={EX} cy={EY} r={ER} fill={C.paper} stroke={C.inkDeep} strokeWidth="2.5" />
      </g>
      <path className="hv-draw" style={d(3, 2.2)} pathLength={1} fill="none" stroke={C.terra} strokeWidth="1.8"
        opacity=".9" d={`M${EX - ER - 13} ${EY} A${ER + 13} ${ER + 13} 0 1 1 ${EX + ER + 13} ${EY} A${ER + 13} ${ER + 13} 0 1 1 ${EX - ER - 13} ${EY}`} />
      <g transform={mt}>
        {/* 1. geçiş: kontur çizilir */}
        <g fill="none" stroke={C.ink} strokeWidth="6" strokeLinejoin="round">
          <path d={HEX} pathLength={1} className="hv-draw" style={d(3.2, 2)} />
          <path d={K_LEFT} pathLength={1} className="hv-draw" style={d(3.6, 1.6)} />
          <path d={U_PATH} pathLength={1} className="hv-draw" style={d(3.9, 1.6)} />
          <path d={K_RIGHT} pathLength={1} className="hv-draw" style={d(4.2, 1.6)} />
        </g>
        {/* 2. geçiş: mürekkep dolar */}
        <g fill={C.ink} className="hv-fade" style={d(5.2, 1.4)}>
          <path fillRule="evenodd" d={HEX} />
          <path d={K_LEFT} />
          <path d={U_PATH} />
          <path d={K_RIGHT} />
        </g>
      </g>
      {/* armanın altında ince terracotta mühür çizgisi */}
      <rect className="hv-fb hv-grow-x" x={EX - 40} y={EY + ER + 26} width="80" height="3" fill={C.terra}
        opacity=".85" style={d(5.4, 1)} />
    </>
  );
}

/* ───────────────────────── 3 · HİZMETLER ─────────────────────────
   "Fikirden teslime kadar uçtan uca."
   TEK kesintisiz çizgi: solda kalemin eskiz kıvrımı olarak başlar, sağa
   gittikçe sakinleşir, doğrulur ve bitmiş binanın net konturuna dönüşür.
   Çizgi kalınlaştıkça fikir maddeye geçer; terracotta işaret tüm yolu
   baştan sona kat eder. */
function HizmetlerScene({ u }: { u: string }) {
  const BX = 682, BW = 202, BY = 202;      // binanın sol kenarı, genişliği, tepe kotu
  const SKETCH =
    "M92 410 C96 372 148 366 152 402 C156 436 112 434 122 398 " +
    "C180 354 214 418 272 390 C330 362 360 412 420 394 C474 378 504 414 560 410 " +
    `L624 420 L${BX} ${HORIZON}`;
  const BUILD = `M${BX} ${HORIZON} L${BX} ${BY} L${BX + BW} ${BY} L${BX + BW} ${HORIZON} L${BX + BW + 68} ${HORIZON}`;
  const FULL = SKETCH + " " + BUILD.slice(BUILD.indexOf("L", 1));

  return (
    <>
      <Defs u={u} />
      <Sky u={u} />
      <SunDisc u={u} delay={0.3} />
      <FarCity />
      <Birds del={-20} y={170} s={0.85} />
      <GroundBand u={u} />
      <Contact cx={BX + BW / 2} rx={148} delay={1.6} />

      {/* bağlam yapısı — solda alçak, bitmiş */}
      <Mass u={u} x={188} y={330} w={108} h={HORIZON - 330} delay={0.9} face="blue" />
      <Windows x={200} y={344} cols={5} rows={5} gx={19} gy={16} w={11} seed={61} delay={2.6} still litRate={0.34} />

      {/* ── bitmiş kütle: çizginin içi dolar ── */}
      <Mass u={u} x={BX + 2} y={BY + 2} w={BW - 4} h={HORIZON - BY - 2} delay={2.2} face="blue" cap={false} />
      <Windows x={BX + 18} y={BY + 22} cols={8} rows={12} gx={22} gy={16} w={13} seed={23} delay={3.2} litRate={0.48} />
      <rect x={BX + 74} y={HORIZON - 44} width="54" height="44" fill={C.warm} opacity=".94" className="hv-glow" />
      <rect x={BX + 74} y={HORIZON - 44} width="54" height="4" fill={C.inkDeep} />

      {/* teslim bayrağı */}
      <g className="hv-fade" style={d(4.4)}>
        <rect x={BX + BW - 4} y={BY - 54} width="4" height="54" fill={C.ink} />
        <g className="hv-sway" style={origin(BX + BW, BY - 54, { "--dur": "3.6s" })}>
          <path d={`M${BX + BW} ${BY - 54} l44 14 l-44 14 z`} fill={C.terra} />
        </g>
      </g>

      {/* ── TEK ÇİZGİ: eskiz ince ve soluk, yapı kalın ve kesin ── */}
      <path d={SKETCH} fill="none" stroke={C.line2} strokeWidth="2.6" strokeLinecap="round"
        pathLength={1} className="hv-draw" style={d(0.4, 3.4)} />
      <path d={BUILD} fill="none" stroke={C.ink} strokeWidth="5" strokeLinejoin="miter" strokeLinecap="butt"
        pathLength={1} className="hv-draw" style={d(3.2, 2.6)} />
      {/* başlangıç işareti: kalemin ilk dokunuşu */}
      <circle cx="92" cy="410" r="5" fill={C.line2} className="hv-fade" style={d(0.3)} />

      {/* yolculuk işareti — eğri boyunca ilerler */}
      <circle cx="0" cy="0" r="7" fill={C.terra} className="hv-trace"
        style={st({ offsetPath: `path("${FULL}")`, "--d": "4.6s", "--dur": "15s", opacity: 0 })} />
      <circle cx="0" cy="0" r="13" fill="none" stroke={C.terra} strokeWidth="1.6" opacity=".5" className="hv-trace"
        style={st({ offsetPath: `path("${FULL}")`, "--d": "4.6s", "--dur": "15s", opacity: 0 })} />
    </>
  );
}

/* ───────────────────────── 4 · PROJELER ─────────────────────────
   "Proje portföyümüz hazırlanıyor."
   Şantiye perdesi: herkesin sokakta gördüğü o gerçek nesne. Perdenin
   üstünde gelecek binanın basılı tanıtım görseli, arkasında vinç ve
   yükselmeye başlamış gerçek katlar, önünde kaldırım ve tabela.
   Dürüst ve umutlu — sahte proje yok, hazırlığın kendisi var. */
function ProjelerScene({ u }: { u: string }) {
  const HX = 140, HW = 920, HT = 232;      // perde
  const RX = 424, RW = 372, RY = 258, RH = 142;  // basılı görsel çerçevesi
  const MX = 906, MW = 22, JIB = 134;      // vinç

  return (
    <>
      <Defs u={u} />
      <defs>
        <clipPath id={`${u}rn`}><rect x={RX + 7} y={RY + 7} width={RW - 14} height={RH - 14} /></clipPath>
      </defs>

      <Sky u={u} />
      <SunDisc u={u} delay={0.22} />
      <FarCity />
      <Birds del={-9} y={152} />
      <Birds del={-33} y={186} s={0.7} />
      <GroundBand u={u} />

      {/* ── perdenin arkasında yükselen gerçek yapı ── */}
      <Mass u={u} x={618} y={166} w={234} h={HT - 166 + 12} delay={0.8} face="blue" cap={false} />
      <g className="hv-fade" style={d(2.2)} stroke={C.warm} strokeWidth="2" opacity=".7">
        {[196, 218].map((y) => <path key={y} d={`M624 ${y} L846 ${y}`} fill="none" />)}
      </g>

      {/* ── kule vinç ── */}
      <g className="hv-fade" style={d(1.2, 1.8)}>
        <rect x={MX} y={JIB} width={MW} height={HT - JIB + 8} fill={C.ink} />
        <rect x={MX + MW - 6} y={JIB} width="6" height={HT - JIB + 8} fill={C.blueLit} opacity=".4" />
        <rect x={636} y={JIB} width="486" height="12" fill={C.ink} />
        <rect x={636} y={JIB + 12} width="46" height="32" fill={C.ink} />
        <path d={`M${MX + 2} ${JIB} L${MX + MW / 2} ${JIB - 30} L${MX + MW - 2} ${JIB}`} fill={C.ink} />
        <path d={`M${MX + MW / 2} ${JIB - 28} L${644} ${JIB} M${MX + MW / 2} ${JIB - 28} L1116 ${JIB}`}
          stroke={C.ink} strokeWidth="2.2" fill="none" strokeLinecap="round" />
        <Beacon x={1116} y={JIB - 6} />
        <g className="hv-sway" style={origin(760, JIB + 12, { "--dur": "5.5s" })}>
          <rect x={752} y={JIB + 12} width="16" height="8" fill={C.ink} />
          <rect x={758} y={JIB + 20} width="3" height="40" fill={C.ink} />
          <rect x={748} y={JIB + 60} width="24" height="11" fill={C.blue} />
        </g>
      </g>

      {/* ── şantiye perdesi ── */}
      <g className="hv-fb hv-grow-x" style={d(0.5, 1.8)}>
        <rect x={HX} y={HT} width={HW} height={HORIZON - HT} fill={C.ground} />
        <rect x={HX} y={HT} width={HW} height={HORIZON - HT} fill={`url(#${u}gp)`} opacity=".55" />
        <rect x={HX - 8} y={HT - 10} width={HW + 16} height="10" fill={C.inkDeep} />
        <rect x={HX} y={HORIZON - 18} width={HW} height="18" fill={C.inkDeep} opacity=".82" />
      </g>
      {/* panel derzleri */}
      <g className="hv-fade" style={d(1.8)} stroke={C.line2} strokeWidth="1.2" opacity=".65">
        {Array.from({ length: 10 }, (_, i) => HX + 92 * (i + 1)).filter((x) => x < HX + HW).map((x) => (
          <path key={x} d={`M${x} ${HT} L${x} ${HORIZON - 18}`} fill="none" />
        ))}
      </g>
      {/* perde üstünde soyut marka işareti: altıgen mühür */}
      <g className="hv-fb hv-pop" style={d(2.4, 1)}>
        <path d={`M246 300 L276 317 L276 351 L246 368 L216 351 L216 317 Z`} fill="none" stroke={C.ink}
          strokeWidth="3" opacity=".55" />
        <path d={`M246 314 L264 324 L264 344 L246 354 L228 344 L228 324 Z`} fill={C.ink} opacity=".16" />
      </g>
      <rect className="hv-fb hv-grow-x" x={HX + 40} y={HT + 24} width="120" height="4" fill={C.terra}
        opacity=".8" style={d(2.6, 1)} />

      {/* ── perdede basılı tanıtım görseli ── */}
      <g className="hv-fb hv-pop" style={d(2.2, 1.3)}>
        <rect x={RX} y={RY} width={RW} height={RH} fill={C.paper} stroke={C.inkDeep} strokeWidth="3" />
      </g>
      <g clipPath={`url(#${u}rn)`}>
        <rect x={RX} y={RY} width={RW} height={RH} fill="#e8eef2" className="hv-fade" style={d(2.8)} />
        {/* basılı gökte güneş */}
        <circle cx={RX + RW - 62} cy={RY + 42} r="26" fill={C.terra} opacity=".55" className="hv-fade" style={d(3)} />
        {/* basılı uzak siluet */}
        <g className="hv-fade" style={d(3.1)} fill="#c3ccd2">
          {[[RX + 16, 30, 44], [RX + 54, 22, 62], [RX + 250, 26, 52], [RX + 286, 34, 38]].map(([x, w, h], i) => (
            <rect key={i} x={x} y={RY + RH - 22 - (h as number)} width={w} height={h} />
          ))}
        </g>
        {/* basılı bitmiş kule */}
        <g className="hv-fb-b hv-rise" style={d(3.2, 1.6)}>
          <rect x={RX + 128} y={RY + 26} width="116" height={RH - 48} fill={C.blue} />
          <rect x={RX + 214} y={RY + 26} width="30" height={RH - 48} fill={C.blueLit} opacity=".85" />
          <rect x={RX + 122} y={RY + 20} width="128" height="7" fill={C.inkDeep} />
        </g>
        <g className="hv-fade" style={d(4)}>
          {Array.from({ length: 6 }, (_, r) =>
            Array.from({ length: 5 }, (_, c) => {
              const lit = rnd(r * 31 + c * 7) < 0.55;
              return (
                <rect key={`${r}-${c}`} x={RX + 138 + c * 21} y={RY + 38 + r * 15} width="13" height="6"
                  fill={lit ? C.warm : "#8fb0c6"} opacity={lit ? 0.9 : 0.22} />
              );
            }),
          )}
        </g>
        {/* basılı zemin çizgisi */}
        <rect x={RX} y={RY + RH - 22} width={RW} height="22" fill="#d7dee2" className="hv-fade" style={d(3.1)} />
        <path d={`M${RX} ${RY + RH - 22} L${RX + RW} ${RY + RH - 22}`} stroke={C.inkDeep} strokeWidth="2"
          fill="none" className="hv-fade" style={d(3.3)} />
      </g>

      {/* ── ön plan: kaldırım donanımı ── */}
      <g className="hv-fade" style={d(2.6, 1.4)}>
        <ellipse cx="266" cy={KERB + 58} rx="76" ry="8" fill={C.ink} opacity=".11" />
        {/* tabela: iki ayak + terracotta pano */}
        <rect x="222" y={KERB + 18} width="7" height="44" fill={C.ink} />
        <rect x="303" y={KERB + 18} width="7" height="44" fill={C.ink} />
        <rect x="212" y={KERB - 12} width="108" height="42" fill={C.terra} />
        <rect x="212" y={KERB - 12} width="108" height="5" fill={C.inkDeep} opacity=".5" />
        <rect x="224" y={KERB + 2} width="62" height="4" fill={C.paper} opacity=".8" />
        <rect x="224" y={KERB + 12} width="40" height="4" fill={C.paper} opacity=".55" />
      </g>
      <g className="hv-fade" style={d(2.8, 1.4)}>
        <ellipse cx="978" cy={KERB + 56} rx="82" ry="8" fill={C.ink} opacity=".11" />
        {[0, 1, 2].map((i) => (
          <rect key={i} x={918 + i * 9} y={KERB + 34 - i * 12} width="120" height="12"
            fill={i === 2 ? C.blue : C.ink} opacity={i === 1 ? ".85" : ".92"} />
        ))}
      </g>
      {/* galeri ışığı perdenin önünden geçer */}
      <rect className="hv-gallery" x="-260" y={HT - 10} width="230" height={HORIZON - HT + 10} fill={`url(#${u}gl)`} />
    </>
  );
}
/* ───────────────────────── 5 · İLETİŞİM ─────────────────────────
   "Bize ulaşın."
   Alt kenardan gelip binanın kapısına varan bir yol, üzerinde konum
   iğnesi ve yayılan halkalar. Kapıda sıcak ışık: davet. */
function IletisimScene({ u }: { u: string }) {
  const BX = 690, BW = 178, BY = 224;
  const PIN = { x: BX + BW / 2, y: BY + 74 };
  const roadD = `M392 ${VH} L${BX + 34} ${HORIZON} L${BX + BW - 34} ${HORIZON} L672 ${VH} Z`;

  return (
    <>
      <Defs u={u} />
      <defs>
        <clipPath id={`${u}rd`}><path d={roadD} /></clipPath>
      </defs>

      <Sky u={u} />
      <SunDisc u={u} delay={0.28} />
      <FarCity />
      <MidCity delay={0.5} />
      <Birds del={-17} y={172} s={0.9} />
      <GroundBand u={u} />

      {/* ── yol: izleyiciden binaya ── */}
      <g className="hv-fade" style={d(1.1, 1.8)}>
        <path d={roadD} fill="#dcd6c9" />
        <path d={roadD} fill="none" stroke={C.line2} strokeWidth="1.6" opacity=".8" />
        <g clipPath={`url(#${u}rd)`}>
          {[0, 1, 2, 3, 4, 5].map((i) => {
            const t = i / 5;
            const y = VH - t * (VH - HORIZON);
            const wHalf = 140 - t * 106;
            const cx = 532 + t * (BX + BW / 2 - 532);
            return (
              <rect key={i} x={cx - wHalf * 0.14} y={y - 13 + t * 9} width={wHalf * 0.28} height={13 - t * 8}
                fill={C.paper} opacity=".85" className="hv-fade" style={d(1.8 + i * 0.14)} />
            );
          })}
        </g>
      </g>

      <Contact cx={BX + BW / 2} rx={148} delay={1.6} />

      {/* ── bina: kapıda sıcak ışık ── */}
      <Mass u={u} x={BX} y={BY} w={BW} h={HORIZON - BY} delay={0.8} face="blue" />
      <Windows x={BX + 18} y={BY + 22} cols={8} rows={10} gx={20} gy={17} w={12} seed={59} delay={2.6} litRate={0.52} />
      <rect x={BX - 5} y={BY - 9} width={BW + 10} height="9" fill={C.inkDeep} />
      {/* giriş */}
      <rect x={BX + 60} y={HORIZON - 52} width="58" height="52" fill={C.warm} className="hv-glow" />
      <rect x={BX + 60} y={HORIZON - 52} width="58" height="5" fill={C.inkDeep} />
      <rect x={BX + 87} y={HORIZON - 47} width="4" height="47" fill={C.inkDeep} opacity=".55" />
      {/* giriş ışığının yola vuran parıltısı */}
      <path d={`M${BX + 60} ${HORIZON} L${BX + 118} ${HORIZON} L${BX + 150} ${HORIZON + 44} L${BX + 28} ${HORIZON + 44} Z`}
        fill={C.warm} opacity=".22" className="hv-fade hv-glow" style={d(3.2)} />

      {/* iki sade ağaç — insan ölçeği ve sıcaklık */}
      {[BX - 74, BX + BW + 52].map((tx, i) => (
        <g key={tx} className="hv-fb-b hv-rise" style={d(1.9 + i * 0.2, 1.2)}>
          <rect x={tx - 3} y={HORIZON - 46} width="6" height="46" fill={C.ink} />
          <circle cx={tx} cy={HORIZON - 60} r={i ? 22 : 27} fill={C.blue} opacity=".9" />
          <circle cx={tx + (i ? -9 : 11)} cy={HORIZON - 74} r={i ? 14 : 17} fill={C.blueLit} opacity=".75" />
        </g>
      ))}

      {/* ── konum iğnesi ve yayılan halkalar ── */}
      {[0, 1.2, 2.4].map((del) => (
        <ellipse key={del} cx={PIN.x} cy={HORIZON} rx="128" ry="30" fill="none" stroke={C.terra} strokeWidth="2"
          className="hv-fb hv-ring" style={st({ "--del": `${del + 3}s`, opacity: 0 })} />
      ))}
      <g className="hv-drop" style={d(2.8, 1.1)}>
        <g transform={`translate(${PIN.x} ${PIN.y})`}>
          <g className="hv-bob" style={st({ animationDuration: "3.6s" })}>
            <path d="M0 0 C-26 -32 -30 -47 -30 -58 a30 30 0 1 1 60 0 C30 -47 26 -32 0 0Z" fill={C.terra} />
            <circle cx="0" cy="-58" r="12" fill={C.paper} />
          </g>
        </g>
      </g>
    </>
  );
}

/* ───────────────────────── Dışa açılan bileşen ───────────────────────── */

export function HeroScene({
  page,
  className = "h-full w-full",
  fit = "slice",
  decorative = false,
  alt,
}: {
  page: SceneId;
  className?: string;
  /** "slice" → alanı tamamen kaplar; "meet" → tümü görünür (mobil bant). */
  fit?: "slice" | "meet";
  decorative?: boolean;
  alt: string;
}) {
  const u = "hv" + useId().replace(/[^a-zA-Z0-9]/g, "");
  return (
    <svg
      viewBox={`0 0 ${VW} ${VH}`}
      preserveAspectRatio={fit === "slice" ? "xMidYMid slice" : "xMidYMid meet"}
      className={`hv-svg ${className}`}
      role={decorative ? undefined : "img"}
      aria-label={decorative ? undefined : alt}
      aria-hidden={decorative ? true : undefined}
      focusable="false"
    >
      {page === "home" && <HomeScene u={u} />}
      {page === "kurumsal" && <KurumsalScene u={u} />}
      {page === "hizmetler" && <HizmetlerScene u={u} />}
      {page === "projeler" && <ProjelerScene u={u} />}
      {page === "iletisim" && <IletisimScene u={u} />}
    </svg>
  );
}
