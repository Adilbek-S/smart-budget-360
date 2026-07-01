"use client";

import { useCallback, useRef, useState } from "react";
import { CheckCircle2, Info, XCircle } from "lucide-react";

export interface ToastItem {
  id: number;
  message: string;
  tone: "success" | "warning" | "info";
}

const TONE_ICON = { success: CheckCircle2, warning: XCircle, info: Info };
const TONE_CLASS: Record<ToastItem["tone"], string> = {
  success: "border-line-soft bg-white text-accent",
  warning: "border-line-soft bg-white text-risk",
  info: "border-line-soft bg-white text-teal",
};

export function useToasts() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const counter = useRef(0);

  const push = useCallback((message: string, tone: ToastItem["tone"] = "success") => {
    counter.current += 1;
    const id = counter.current;
    setToasts((prev) => [...prev, { id, message, tone }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  }, []);

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return { toasts, push, dismiss };
}

export function ToastStack({ toasts, onDismiss }: { toasts: ToastItem[]; onDismiss: (id: number) => void }) {
  if (toasts.length === 0) return null;
  return (
    <div className="fixed bottom-5 right-5 z-[70] flex flex-col gap-2">
      {toasts.map((t) => {
        const Icon = TONE_ICON[t.tone];
        return (
          <div
            key={t.id}
            className={`flex items-center gap-2.5 rounded-xl border px-4 py-3 text-sm font-medium shadow-lg ${TONE_CLASS[t.tone]}`}
          >
            <Icon size={17} className="shrink-0" />
            <span className="text-ink">{t.message}</span>
            <button
              onClick={() => onDismiss(t.id)}
              className="ml-2 shrink-0 text-ink-muted hover:text-ink"
              aria-label="Закрыть уведомление"
            >
              ×
            </button>
          </div>
        );
      })}
    </div>
  );
}
