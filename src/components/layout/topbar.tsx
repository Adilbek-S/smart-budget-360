"use client";

import { usePathname } from "next/navigation";
import { Bell, Menu, Sparkles } from "lucide-react";
import { pageTitle } from "@/lib/nav";

interface TopbarProps {
  onOpenMobile: () => void;
  onOpenAi: () => void;
}

export function Topbar({ onOpenMobile, onOpenAi }: TopbarProps) {
  const pathname = usePathname();
  const title = pageTitle(pathname);

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between gap-4 border-b border-line bg-white/90 px-4 backdrop-blur sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <button
          aria-label="Открыть меню"
          onClick={onOpenMobile}
          className="rounded-md p-1.5 text-ink-soft hover:bg-canvas-2 lg:hidden"
        >
          <Menu size={22} />
        </button>
        <h1 className="truncate text-lg font-bold text-primary-dark sm:text-xl">{title}</h1>
      </div>

      <div className="flex shrink-0 items-center gap-3 sm:gap-4">
        <button
          type="button"
          aria-label="AI-помощник"
          onClick={onOpenAi}
          className="flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-dark"
        >
          <Sparkles size={16} />
          <span className="hidden sm:inline">AI-помощник</span>
        </button>

        <button
          aria-label="Уведомления"
          className="relative rounded-full p-2 text-ink-soft hover:bg-canvas-2"
        >
          <Bell size={20} />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-risk ring-2 ring-white" />
        </button>

        <div className="flex items-center gap-2.5 border-l border-line pl-3 sm:gap-3 sm:pl-4">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-canvas-4 text-sm font-bold text-primary-dark">
            АС
          </span>
          <div className="hidden leading-tight sm:block">
            <p className="text-sm font-semibold text-ink">Адилбек Сагадиев</p>
            <p className="text-xs text-ink-muted">Руководитель подразделения</p>
          </div>
        </div>
      </div>
    </header>
  );
}
