"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, Users } from "lucide-react";
import { DEPARTMENTS } from "@/lib/mock-data";
import type { DepartmentId } from "@/lib/types";

interface DepartmentMultiSelectProps {
  selected: DepartmentId[];
  onChange: (ids: DepartmentId[]) => void;
}

export function DepartmentMultiSelect({ selected, onChange }: DepartmentMultiSelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  const allSelected = selected.length === DEPARTMENTS.length;
  const label = allSelected
    ? "Все подразделения"
    : selected.length === 0
      ? "Подразделения не выбраны"
      : selected.length === 1
        ? DEPARTMENTS.find((d) => d.id === selected[0])?.short
        : `Выбрано: ${selected.length}`;

  function toggle(id: DepartmentId) {
    if (selected.includes(id)) {
      onChange(selected.filter((s) => s !== id));
    } else {
      onChange([...selected, id]);
    }
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 rounded-full border border-line-soft bg-white px-3.5 py-1.5 text-sm font-medium text-ink transition-colors hover:border-teal"
      >
        <Users size={15} className="text-ink-muted" />
        {label}
        <ChevronDown size={14} className={`text-ink-muted transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute left-0 top-[calc(100%+6px)] z-20 w-80 max-h-80 overflow-y-auto rounded-xl border border-line bg-white p-3 shadow-lg sm:w-96">
          <div className="mb-2 flex items-center justify-between gap-2 border-b border-line-soft pb-2">
            <button
              onClick={() => onChange(DEPARTMENTS.map((d) => d.id))}
              className="text-xs font-semibold text-primary hover:text-primary-dark"
            >
              Выбрать все
            </button>
            <button
              onClick={() => onChange([])}
              className="text-xs font-semibold text-ink-muted hover:text-risk"
            >
              Сбросить
            </button>
          </div>
          <ul className="flex flex-col gap-1">
            {DEPARTMENTS.map((d) => (
              <li key={d.id}>
                <label className="flex cursor-pointer items-start gap-2.5 rounded-lg px-2 py-1.5 text-sm leading-snug text-ink-soft hover:bg-canvas-3">
                  <input
                    type="checkbox"
                    checked={selected.includes(d.id)}
                    onChange={() => toggle(d.id)}
                    className="mt-0.5 h-4 w-4 shrink-0 rounded border-line-soft accent-primary"
                  />
                  {d.name}
                </label>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
