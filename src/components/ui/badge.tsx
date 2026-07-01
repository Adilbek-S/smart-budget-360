type BadgeTone = "critical" | "warning" | "normal" | "info" | "success" | "neutral";

const TONE_STYLES: Record<BadgeTone, string> = {
  critical: "bg-[#f6e0dd] text-risk",
  warning: "bg-[#f6ecd7] text-warning",
  normal: "bg-canvas-4 text-accent",
  success: "bg-canvas-4 text-accent",
  info: "bg-canvas-3 text-teal",
  neutral: "bg-canvas-3 text-ink-muted",
};

export function Badge({ tone, children }: { tone: BadgeTone; children: React.ReactNode }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap ${TONE_STYLES[tone]}`}
    >
      {children}
    </span>
  );
}
