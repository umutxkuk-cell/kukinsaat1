import { site } from "@/data/site";

function InstagramGlyph({ className = "h-[18px] w-[18px]" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <rect x="3.2" y="3.2" width="17.6" height="17.6" rx="5" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="12" cy="12" r="4.1" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="17.1" cy="6.9" r="1.15" fill="currentColor" />
    </svg>
  );
}

function LinkedInGlyph({ className = "h-[18px] w-[18px]" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M4.98 3.5a2.49 2.49 0 1 1 0 4.98 2.49 2.49 0 0 1 0-4.98ZM3.1 9h3.76v12H3.1V9Zm6.17 0h3.6v1.64h.05c.5-.95 1.73-1.95 3.56-1.95 3.8 0 4.5 2.5 4.5 5.76V21h-3.75v-5.3c0-1.26-.02-2.9-1.76-2.9-1.77 0-2.04 1.38-2.04 2.8V21H9.27V9Z" />
    </svg>
  );
}

function FacebookGlyph({ className = "h-[18px] w-[18px]" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M14 8.5V7c0-.8.2-1.2 1.4-1.2H17V3h-2.4C11.9 3 10.8 4.4 10.8 6.8V8.5H9V11h1.8v10H14V11h2.4l.35-2.5H14Z" />
    </svg>
  );
}

function XGlyph({ className = "h-[18px] w-[18px]" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M17.53 3h3.08l-6.73 7.69L21.75 21h-6.2l-4.86-6.35L5.13 21H2.05l7.2-8.23L1.75 3h6.36l4.39 5.8L17.53 3Zm-1.08 16.17h1.7L7.6 4.74H5.77l10.68 14.43Z" />
    </svg>
  );
}

const glyphs: Record<string, (p: { className?: string }) => React.ReactElement> = {
  Instagram: InstagramGlyph,
  LinkedIn: LinkedInGlyph,
  Facebook: FacebookGlyph,
  X: XGlyph,
};

type Props = {
  variant?: "footer" | "pill" | "ghost";
  className?: string;
};

export function SocialLinks({ variant = "footer", className = "" }: Props) {
  if (variant === "pill") {
    return (
      <div className={`flex flex-wrap gap-3 ${className}`}>
        {site.social.map((s) => {
          const Glyph = glyphs[s.label];
          return (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noreferrer"
              aria-label={`${site.name} ${s.label}`}
              className="group inline-flex items-center gap-2.5 border border-ink/20 px-4 py-2.5 text-sm font-medium transition-all duration-300 hover:border-ink hover:bg-ink hover:text-white"
            >
              {Glyph ? <Glyph className="h-[18px] w-[18px]" /> : null}
              <span>{s.label}</span>
              <span className="text-ink/40 transition-colors group-hover:text-white/60">{s.handle}</span>
            </a>
          );
        })}
      </div>
    );
  }

  if (variant === "ghost") {
    return (
      <div className={`flex gap-5 ${className}`}>
        {site.social.map((s) => {
          const Glyph = glyphs[s.label];
          return (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noreferrer"
              aria-label={`${site.name} ${s.label}`}
              className="inline-flex items-center gap-2 text-sm opacity-80 transition-opacity hover:opacity-100"
            >
              {Glyph ? <Glyph className="h-[18px] w-[18px]" /> : null}
              {s.label}
            </a>
          );
        })}
      </div>
    );
  }

  // footer
  return (
    <div className={`flex gap-3 ${className}`}>
      {site.social.map((s) => {
        const Glyph = glyphs[s.label];
        return (
          <a
            key={s.label}
            href={s.href}
            target="_blank"
            rel="noreferrer"
            aria-label={`${site.name} ${s.label}`}
            className="group relative inline-flex h-12 w-12 items-center justify-center overflow-hidden border border-white/20 text-white/90 transition-colors duration-300 hover:text-ink"
          >
            <span className="absolute inset-0 origin-bottom scale-y-0 bg-white transition-transform duration-300 ease-out group-hover:scale-y-100" />
            <span className="relative z-10">{Glyph ? <Glyph className="h-5 w-5" /> : null}</span>
          </a>
        );
      })}
    </div>
  );
}