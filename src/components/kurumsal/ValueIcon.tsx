export type ValueIconKey = "precision" | "quality" | "communication" | "responsibility" | "sustainability" | "vision";

export function ValueIcon({
  name,
  className = "h-8 w-8",
}: {
  name: ValueIconKey;
  className?: string;
}) {
  const common = {
    viewBox: "0 0 48 48",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
    className,
  };

  switch (name) {
    case "precision":
      return (
        <svg {...common}>
          <circle cx="24" cy="24" r="16" />
          <circle cx="24" cy="24" r="8" />
          <circle cx="24" cy="24" r="1.5" fill="currentColor" />
          <path d="M24 2v6M24 40v6M2 24h6M40 24h6" />
        </svg>
      );
    case "quality":
      return (
        <svg {...common}>
          <path d="M24 5l5.2 10.6L41 17.3l-8.5 8.3 2 11.7L24 31.8 13.5 37.3l2-11.7L7 17.3l11.8-1.7L24 5Z" />
        </svg>
      );
    case "communication":
      return (
        <svg {...common}>
          <path d="M8 10h32v20H22l-8 7v-7H8V10Z" />
          <path d="M16 18h16M16 24h10" />
        </svg>
      );
    case "responsibility":
      return (
        <svg {...common}>
          <path d="M24 5l15 6v9c0 9-6.4 16.3-15 19-8.6-2.7-15-10-15-19v-9l15-6Z" />
          <path d="M17 23l5 5 10-10" />
        </svg>
      );
    case "sustainability":
      return (
        <svg {...common}>
          <path d="M24 42c10-4 14-12 14-22 0-4-1-8-1-8s-4-1-8-1c-8 0-14 5-16 13" />
          <path d="M12 42c0-12 8-20 20-22" />
        </svg>
      );
    case "vision":
      return (
        <svg {...common}>
          <path d="M4 24s7-12 20-12 20 12 20 12-7 12-20 12S4 24 4 24Z" />
          <circle cx="24" cy="24" r="5" />
        </svg>
      );
    default:
      return null;
  }
}