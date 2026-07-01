import { History as HistoryIcon } from "lucide-react";
import type { LineHistoryEntry } from "@/lib/types";
import { formatDateTime } from "@/lib/format";

export function HistoryTimeline({ entries }: { entries: LineHistoryEntry[] }) {
  if (entries.length === 0) {
    return <p className="py-8 text-center text-sm text-ink-muted">Изменений пока не зафиксировано.</p>;
  }

  const sorted = [...entries].sort((a, b) => (a.dateTime < b.dateTime ? 1 : -1));

  return (
    <ol className="flex flex-col">
      {sorted.map((entry, index) => {
        const isLast = index === sorted.length - 1;
        const isCreation = entry.oldValue === "—";
        return (
          <li key={entry.id} className="flex gap-3">
            <div className="flex flex-col items-center">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-canvas-4 text-primary-dark">
                <HistoryIcon size={14} />
              </span>
              {!isLast && <span className="w-px flex-1 bg-line-soft" />}
            </div>
            <div className={`min-w-0 ${isLast ? "pb-0" : "pb-5"}`}>
              <p className="text-xs font-medium text-ink-muted">{formatDateTime(entry.dateTime)}</p>
              <p className="mt-1 text-sm text-ink">
                <span className="font-semibold">{entry.author}</span>{" "}
                {isCreation ? (
                  <>
                    создал(а) значение поля «{entry.field}»: <span className="font-medium">{entry.newValue}</span>
                  </>
                ) : (
                  <>
                    изменил(а) «{entry.field}» с{" "}
                    <span className="font-medium">{entry.oldValue}</span> на{" "}
                    <span className="font-medium">{entry.newValue}</span>
                  </>
                )}
              </p>
              {entry.comment && (
                <p className="mt-1 text-sm text-ink-muted">Причина: {entry.comment}</p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
