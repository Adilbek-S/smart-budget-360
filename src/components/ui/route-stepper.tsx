import { Check, X } from "lucide-react";

const STAGES = ["Инициатор", "Руководитель", "Финансовое подразделение", "Утверждено"];

export function RouteStepper({ stage, rejected = false }: { stage: number; rejected?: boolean }) {
  return (
    <div className="flex items-start">
      {STAGES.map((label, index) => {
        const isDone = !rejected && index < stage;
        const isCurrent = index === stage;
        const isRejectedHere = rejected && index === stage;
        const isLast = index === STAGES.length - 1;

        return (
          <div key={label} className={`flex ${isLast ? "" : "flex-1"} items-start`}>
            <div className="flex flex-col items-center">
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                  isRejectedHere
                    ? "bg-[#f6e0dd] text-risk"
                    : isDone
                      ? "bg-primary text-white"
                      : isCurrent
                        ? "bg-canvas-4 text-primary-dark ring-2 ring-primary"
                        : "bg-canvas-3 text-ink-muted"
                }`}
              >
                {isRejectedHere ? <X size={15} /> : isDone ? <Check size={15} /> : index + 1}
              </span>
              <span
                className={`mt-1.5 max-w-[86px] text-center text-[11px] font-medium leading-tight ${
                  isCurrent || isDone ? "text-ink" : "text-ink-muted"
                }`}
              >
                {label}
              </span>
            </div>
            {!isLast && (
              <div
                className={`mt-4 h-0.5 flex-1 ${index < stage && !rejected ? "bg-primary" : "bg-line-soft"}`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
