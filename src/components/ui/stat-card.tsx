import type { LucideIcon } from "lucide-react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { Card } from "./card";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  deltaText: string;
  deltaDirection: "up" | "down" | "neutral";
  deltaSentiment: "positive" | "negative" | "neutral";
  iconTone?: "primary" | "accent" | "warning" | "risk";
}

const TONE_STYLES: Record<NonNullable<StatCardProps["iconTone"]>, string> = {
  primary: "bg-canvas-4 text-primary-dark",
  accent: "bg-canvas-4 text-accent",
  warning: "bg-[#f6ecd7] text-warning",
  risk: "bg-[#f6e0dd] text-risk",
};

export function StatCard({
  icon: Icon,
  label,
  value,
  deltaText,
  deltaDirection,
  deltaSentiment,
  iconTone = "primary",
}: StatCardProps) {
  const sentimentClass =
    deltaSentiment === "positive"
      ? "text-accent"
      : deltaSentiment === "negative"
        ? "text-risk"
        : "text-ink-muted";

  return (
    <Card className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span
          className={`flex h-10 w-10 items-center justify-center rounded-lg ${TONE_STYLES[iconTone]}`}
        >
          <Icon size={20} />
        </span>
      </div>
      <div>
        <p className="text-2xl font-bold leading-tight text-ink">{value}</p>
        <p className="mt-1 text-sm text-ink-muted">{label}</p>
      </div>
      <div className={`flex items-center gap-1 text-xs font-semibold ${sentimentClass}`}>
        {deltaDirection === "up" && <ArrowUpRight size={14} />}
        {deltaDirection === "down" && <ArrowDownRight size={14} />}
        <span>{deltaText}</span>
        <span className="font-normal text-ink-muted">к прошлому периоду</span>
      </div>
    </Card>
  );
}
