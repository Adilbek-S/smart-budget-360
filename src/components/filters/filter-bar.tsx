"use client";

import { Building2, Users } from "lucide-react";
import { useFilters } from "@/lib/filter-context";
import { DEPARTMENTS, PERIODS, YEARS } from "@/lib/mock-data";

export function FilterBar() {
  const { year, setYear, period, setPeriod, mode, setMode, department, setDepartment } =
    useFilters();

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-line bg-white p-4 shadow-sm sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-1 rounded-full bg-canvas-3 p-1">
          {YEARS.map((y) => (
            <button
              key={y}
              onClick={() => setYear(y)}
              className={`rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors ${
                year === y
                  ? "bg-primary text-white shadow-sm"
                  : "text-ink-soft hover:text-primary-dark"
              }`}
            >
              {y}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-1 rounded-full bg-canvas-3 p-1">
          {PERIODS.map((p) => (
            <button
              key={p.id}
              onClick={() => setPeriod(p.id)}
              className={`rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors ${
                period === p.id
                  ? "bg-primary text-white shadow-sm"
                  : "text-ink-soft hover:text-primary-dark"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1 rounded-full border border-line-soft bg-canvas-3 p-1">
          <button
            onClick={() => setMode("org")}
            className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors ${
              mode === "org"
                ? "bg-primary text-white shadow-sm"
                : "text-ink-soft hover:text-primary-dark"
            }`}
          >
            <Building2 size={15} />
            Организация
          </button>
          <button
            onClick={() => setMode("department")}
            className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors ${
              mode === "department"
                ? "bg-primary text-white shadow-sm"
                : "text-ink-soft hover:text-primary-dark"
            }`}
          >
            <Users size={15} />
            Подразделение
          </button>
        </div>

        <select
          value={department}
          disabled={mode !== "department"}
          onChange={(e) => setDepartment(e.target.value as typeof department)}
          className={`rounded-full border px-3.5 py-1.5 text-sm font-medium outline-none transition-colors ${
            mode === "department"
              ? "border-line-soft bg-white text-ink cursor-pointer hover:border-teal"
              : "border-line bg-canvas-3 text-ink-muted cursor-not-allowed"
          }`}
        >
          {DEPARTMENTS.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
