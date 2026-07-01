"use client";

import { useCallback, useSyncExternalStore } from "react";
import type { DepartmentId, IncomeProductRow, Year } from "./types";

const STORAGE_KEY = "sb360-custom-income-rows";

const listeners = new Set<() => void>();
let cache: IncomeProductRow[] = [];
let cacheRaw: string | null = null;

function readStorage(): IncomeProductRow[] {
  if (typeof window === "undefined") return cache;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (raw === cacheRaw) return cache;
  cacheRaw = raw;
  try {
    cache = raw ? JSON.parse(raw) : [];
  } catch {
    cache = [];
  }
  return cache;
}

function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

function getServerSnapshot(): IncomeProductRow[] {
  return [];
}

export interface NewIncomeRowInput {
  year: Year;
  quarter: 1 | 2 | 3 | 4;
  department: DepartmentId;
  productId: string;
  isActiveService: boolean;
  volumePlan: number;
  unit: string;
  incomePlan: number;
  tariff: string;
  comment: string;
}

export function useIncomeRows() {
  const customRows = useSyncExternalStore(subscribe, readStorage, getServerSnapshot);

  const addRow = useCallback((input: NewIncomeRowInput) => {
    if (typeof window === "undefined") return;
    const now = new Date().toISOString();
    const id = `custom-income-${Date.now()}`;
    const newRow: IncomeProductRow = {
      id,
      year: input.year,
      quarter: input.quarter,
      department: input.department,
      productId: input.productId,
      isActiveService: input.isActiveService,
      growthRate: 0,
      volumePlan: input.volumePlan,
      volumeFact: 0,
      unit: input.unit,
      incomePlan: input.incomePlan,
      incomeFact: 0,
      factSource: "manual",
      tariff: input.tariff,
      calculation: "Расчёт будет сформирован после начала фактического исполнения.",
      comment: input.comment,
      author: "Адилбек Сагадиев",
      updatedAt: now,
      history: [
        {
          id: `${id}-h1`,
          dateTime: now,
          author: "Адилбек Сагадиев",
          field: "Плановый доход",
          oldValue: "—",
          newValue: `${input.incomePlan.toLocaleString("ru-RU")} ₸`,
          comment: "Строка добавлена вручную через форму «Новая строка».",
        },
      ],
    };
    const next = [...readStorage(), newRow];
    cache = next;
    cacheRaw = JSON.stringify(next);
    window.localStorage.setItem(STORAGE_KEY, cacheRaw);
    listeners.forEach((listener) => listener());
  }, []);

  return { customRows, addRow };
}
