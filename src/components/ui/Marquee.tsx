const items = [
  "İnşaat ve Uygulama",
  "Proje ve Mühendislik",
  "Teknik Koordinasyon",
  "Kalite Kontrol",
  "Kocaeli",
  "Teknik Danışmanlık",
];

export function Marquee() {
  const row = [...items, ...items];
  return (
    <div className="marquee overflow-hidden border-y border-ink/10 bg-ink py-4 text-bg" aria-hidden="true">
      <div className="marquee-track">
        {[0, 1].map((half) => (
          <div key={half} className="flex shrink-0 items-center">
            {row.map((item, i) => (
              <span key={`${half}-${i}`} className="flex items-center whitespace-nowrap">
                <span className="px-6 font-display text-xl italic tracking-wide md:text-2xl">{item}</span>
                <span className="h-1.5 w-1.5 rotate-45 bg-accent-soft" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}