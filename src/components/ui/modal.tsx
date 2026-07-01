"use client";

import { useEffect } from "react";
import { X } from "lucide-react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export function Modal({ open, onClose, title, subtitle, children, footer }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <button
        aria-label="Закрыть"
        onClick={onClose}
        className="fixed inset-0 bg-black/35"
      />
      <div className="relative z-10 flex max-h-[90vh] w-full max-w-lg flex-col rounded-xl border border-line bg-white shadow-lg">
        <div className="flex shrink-0 items-start justify-between gap-3 border-b border-line-soft px-6 py-4">
          <div>
            <h3 className="text-base font-bold text-ink">{title}</h3>
            {subtitle && <p className="mt-0.5 text-sm text-ink-muted">{subtitle}</p>}
          </div>
          <button
            aria-label="Закрыть"
            onClick={onClose}
            className="rounded-md p-1 text-ink-muted hover:bg-canvas-2 hover:text-ink"
          >
            <X size={18} />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">{children}</div>
        {footer && (
          <div className="flex shrink-0 items-center justify-end gap-3 border-t border-line-soft px-6 py-4">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
