"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

export interface SidePanelTab {
  id: string;
  label: string;
  content: React.ReactNode;
}

interface SidePanelProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  tabs: SidePanelTab[];
  resetKey?: string;
}

export function SidePanel({ open, onClose, title, subtitle, tabs, resetKey }: SidePanelProps) {
  const [activeTab, setActiveTab] = useState(tabs[0]?.id);
  const [lastResetKey, setLastResetKey] = useState(resetKey);

  if (resetKey !== lastResetKey) {
    setLastResetKey(resetKey);
    setActiveTab(tabs[0]?.id);
  }

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  const active = tabs.find((t) => t.id === activeTab) ?? tabs[0];

  return (
    <div
      className={`fixed inset-0 z-50 ${open ? "" : "pointer-events-none"}`}
      aria-hidden={!open}
    >
      <button
        aria-label="Закрыть панель"
        onClick={onClose}
        className={`fixed inset-0 bg-black/30 transition-opacity duration-200 ${
          open ? "opacity-100" : "opacity-0"
        }`}
      />
      <aside
        className={`fixed right-0 top-0 z-10 flex h-full w-full max-w-md flex-col border-l border-line bg-white shadow-lg transition-transform duration-200 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex shrink-0 items-start justify-between gap-3 border-b border-line-soft px-6 py-4">
          <div className="min-w-0">
            <h3 className="truncate text-base font-bold text-ink">{title}</h3>
            {subtitle && <p className="mt-0.5 truncate text-sm text-ink-muted">{subtitle}</p>}
          </div>
          <button
            aria-label="Закрыть"
            onClick={onClose}
            className="shrink-0 rounded-md p-1 text-ink-muted hover:bg-canvas-2 hover:text-ink"
          >
            <X size={18} />
          </button>
        </div>

        {tabs.length > 1 && (
          <div className="flex shrink-0 gap-1 border-b border-line-soft px-6 pt-3">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`rounded-t-lg px-3.5 py-2 text-sm font-semibold transition-colors ${
                  active?.id === tab.id
                    ? "border-b-2 border-primary text-primary-dark"
                    : "text-ink-muted hover:text-primary-dark"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}

        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">{active?.content}</div>
      </aside>
    </div>
  );
}
