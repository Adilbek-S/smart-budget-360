import { Database, PenLine } from "lucide-react";
import type { FactSource } from "@/lib/types";

const FACT_SOURCE_META: Record<FactSource, { icon: typeof Database; label: string; className: string }> = {
  auto: { icon: Database, label: "Факт загружен автоматически (1С)", className: "text-teal" },
  manual: { icon: PenLine, label: "Факт введён вручную", className: "text-warning" },
};

export function FactSourceIcon({ source, size = 13 }: { source: FactSource; size?: number }) {
  const meta = FACT_SOURCE_META[source];
  const Icon = meta.icon;
  return (
    <span title={meta.label} className={`inline-flex shrink-0 ${meta.className}`}>
      <Icon size={size} />
    </span>
  );
}

export function FactSourceLegend() {
  return (
    <div className="flex flex-wrap items-center gap-4 text-xs text-ink-muted">
      <span className="inline-flex items-center gap-1.5">
        <FactSourceIcon source="auto" />
        Факт из 1С
      </span>
      <span className="inline-flex items-center gap-1.5">
        <FactSourceIcon source="manual" />
        Факт введён вручную
      </span>
    </div>
  );
}
