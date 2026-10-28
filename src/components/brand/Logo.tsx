/**
 * KUK İnşaat logosu.
 *
 * Marka işareti, orijinal public/brand/kuk-monogram.svg dosyasındaki geometrinin
 * birebir vektör karşılığıdır ve tek dosyalık statik çıktıda 404 riski olmaması
 * için satır içi (inline) çizilir.
 */

type Variant = "dark" | "light";

const VIEW_BOX = "0 0 329.28 372.5";
const HEX =
  "M297.08 261.26 164.79 341.36 31.00 259.41 31.00 113.09 164.79 30.22 297.08 112.63Z M164.79 3.36 6.48 98.83 6.48 273.28 164.79 369.14 321.14 273.28 321.14 98.83Z";
const K_LEFT =
  "M67.56 173.29 101.80 109.85 101.80 89.02 74.50 105.22 29.15 187.64 29.61 236.72 53.68 198.29 103.65 282.09 103.65 235.33Z";
const K_RIGHT =
  "M253.14 105.22 225.84 89.02 225.84 109.85 260.09 173.29 223.99 235.33 223.99 282.09 273.97 198.29 298.03 236.72 298.49 187.64Z";
const U =
  "M183.24 62.60 183.24 267.28 164.73 280.24 145.76 267.28 146.69 62.60 120.31 77.91 120.31 289.50 164.27 318.67 208.69 290.43 208.69 76.98Z";

export function LogoMark({
  variant = "dark",
  className = "h-10 w-auto",
}: {
  variant?: Variant;
  className?: string;
}) {
  return (
    <svg
      viewBox={VIEW_BOX}
      aria-hidden="true"
      focusable="false"
      fill={variant === "light" ? "#ffffff" : "#0d0d0d"}
      className={`select-none object-contain ${className}`}
    >
      <path fillRule="evenodd" d={HEX} />
      <path d={K_LEFT} />
      <path d={K_RIGHT} />
      <path d={U} />
    </svg>
  );
}

export function Logo({
  variant = "dark",
  className = "",
}: {
  variant?: Variant;
  className?: string;
}) {
  const color = variant === "light" ? "text-white" : "text-ink";
  return (
    <span className={`inline-flex items-center gap-3 ${color} ${className}`} aria-label="Kuk İnşaat">
      <LogoMark variant={variant} className="h-11 w-auto shrink-0" />
      <span className="flex flex-col leading-none">
        <span className="text-[1.4rem] font-extrabold tracking-[0.14em]">KUK</span>
        <span className="mt-1 text-[0.56rem] font-semibold uppercase tracking-[0.5em] opacity-70">
          İnşaat
        </span>
      </span>
    </span>
  );
}

export function LogoStacked({
  variant = "dark",
  className = "",
}: {
  variant?: Variant;
  className?: string;
}) {
  const color = variant === "light" ? "text-white" : "text-ink";
  return (
    <span className={`inline-flex flex-col ${color} ${className}`} aria-label="Kuk İnşaat">
      <LogoMark variant={variant} className="h-24 w-auto" />
      <span className="mt-5 text-3xl font-extrabold tracking-[0.16em] leading-none">KUK</span>
      <span className="mt-2 text-[0.62rem] font-semibold uppercase tracking-[0.56em] opacity-70">
        İnşaat
      </span>
    </span>
  );
}
