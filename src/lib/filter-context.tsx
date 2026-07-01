"use client";

import { createContext, useContext, useMemo, useState } from "react";
import type { DepartmentId, FilterMode, PeriodId, Year } from "./types";

interface FiltersState {
  year: Year;
  period: PeriodId;
  mode: FilterMode;
  department: DepartmentId;
  scope: "org" | DepartmentId;
  setYear: (year: Year) => void;
  setPeriod: (period: PeriodId) => void;
  setMode: (mode: FilterMode) => void;
  setDepartment: (department: DepartmentId) => void;
}

const FilterContext = createContext<FiltersState | null>(null);

export function FilterProvider({ children }: { children: React.ReactNode }) {
  const [year, setYear] = useState<Year>(2026);
  const [period, setPeriod] = useState<PeriodId>("year");
  const [mode, setMode] = useState<FilterMode>("org");
  const [department, setDepartment] = useState<DepartmentId>("it");

  const value = useMemo<FiltersState>(
    () => ({
      year,
      period,
      mode,
      department,
      scope: mode === "org" ? "org" : department,
      setYear,
      setPeriod,
      setMode,
      setDepartment,
    }),
    [year, period, mode, department]
  );

  return <FilterContext.Provider value={value}>{children}</FilterContext.Provider>;
}

export function useFilters(): FiltersState {
  const ctx = useContext(FilterContext);
  if (!ctx) throw new Error("useFilters must be used within FilterProvider");
  return ctx;
}
