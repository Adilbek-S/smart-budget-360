"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronsLeft, ChevronsRight, X } from "lucide-react";
import { NAV_ITEMS } from "@/lib/nav";

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapsed: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export function Sidebar({
  collapsed,
  onToggleCollapsed,
  mobileOpen,
  onCloseMobile,
}: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {mobileOpen && (
        <button
          aria-label="Закрыть меню"
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
          onClick={onCloseMobile}
        />
      )}
      <aside
        className={`fixed z-50 flex h-full flex-col border-r border-line bg-white transition-all duration-200 lg:sticky lg:top-0 lg:z-0 lg:translate-x-0 ${
          collapsed ? "lg:w-[76px]" : "lg:w-[264px]"
        } w-[264px] ${mobileOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-line px-4">
          <Link href="/" className="flex items-center gap-2 overflow-hidden" onClick={onCloseMobile}>
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-sm font-bold text-white">
              SB
            </span>
            {!collapsed && (
              <span className="truncate text-[15px] font-bold leading-tight text-primary-dark">
                Smart Budget
                <span className="block text-xs font-medium text-ink-muted">360</span>
              </span>
            )}
          </Link>
          <button
            aria-label="Закрыть меню"
            onClick={onCloseMobile}
            className="rounded-md p-1 text-ink-muted hover:bg-canvas-2 lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) => {
              const active =
                item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
              const Icon = item.icon;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onCloseMobile}
                    title={collapsed ? item.label : undefined}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                      active
                        ? "bg-canvas-4 text-primary-dark"
                        : "text-ink-soft hover:bg-canvas-3 hover:text-primary-dark"
                    } ${collapsed ? "lg:justify-center" : ""}`}
                  >
                    <Icon size={20} strokeWidth={active ? 2.25 : 2} className="shrink-0" />
                    <span className={collapsed ? "lg:hidden" : "truncate"}>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="hidden shrink-0 border-t border-line p-3 lg:block">
          <button
            onClick={onToggleCollapsed}
            className="flex w-full items-center justify-center gap-2 rounded-lg py-2 text-ink-muted hover:bg-canvas-3 hover:text-primary-dark"
            aria-label={collapsed ? "Развернуть меню" : "Свернуть меню"}
          >
            {collapsed ? <ChevronsRight size={18} /> : <ChevronsLeft size={18} />}
          </button>
        </div>
      </aside>
    </>
  );
}
