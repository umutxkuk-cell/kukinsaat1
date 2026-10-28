import type { ServiceIcon as IconKey } from "@/data/services";

/**
 * Hizmetler için ince çizgili (line) ikon seti. currentColor kullanır; hover ve
 * reveal animasyonlarıyla birlikte çalışır.
 */
export function ServiceIcon({
  name,
  className = "h-8 w-8",
}: {
  name: IconKey;
  className?: string;
}) {
  const common = {
    viewBox: "0 0 48 48",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
    className,
  };

  switch (name) {
    case "build":
      return (
        <svg {...common}>
          <path d="M6 42h36" />
          <path d="M12 42V18l12-8 12 8v24" />
          <path d="M20 42V28h8v14" />
          <path d="M18 18h2M28 18h2M18 23h2M28 23h2" />
        </svg>
      );
    case "engineer":
      return (
        <svg {...common}>
          <path d="M24 6v8" />
          <path d="M24 14 10 40h28L24 14Z" />
          <path d="M18 30h12" />
          <circle cx="24" cy="6" r="2.5" />
        </svg>
      );
    case "coordinate":
      return (
        <svg {...common}>
          <circle cx="13" cy="13" r="5" />
          <circle cx="35" cy="35" r="5" />
          <path d="M18 13h9a8 8 0 0 1 8 8v9" />
          <path d="M30 27v8M43 35h-8" />
        </svg>
      );
    case "manage":
      return (
        <svg {...common}>
          <rect x="7" y="9" width="34" height="32" rx="2" />
          <path d="M7 17h34" />
          <path d="M14 6v6M34 6v6" />
          <path d="M14 26l4 4 8-9" />
          <path d="M30 27h6M30 33h6" />
        </svg>
      );
    case "consult":
      return (
        <svg {...common}>
          <path d="M8 10h26v18H18l-7 6v-6H8V10Z" />
          <path d="M15 17h12M15 22h8" />
          <path d="M40 20v14l-5-4h-9" />
        </svg>
      );
    default:
      return null;
  }
}