"use client";

import { useCallback, useSyncExternalStore } from "react";
import type { BudgetLine, DepartmentId, Year } from "./types";

const STORAGE_KEY = "sb360-custom-budget-lines";

const listeners = new Set<() => void>();
let cache: BudgetLine[] = [];
let cacheRaw: string | null = null;

function readStorage(): BudgetLine[] {
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

function getServerSnapshot(): BudgetLine[] {
  return [];
}

export interface NewBudgetLineInput {
  year: Year;
  quarter: 1 | 2 | 3 | 4;
  department: DepartmentId;
  article: string;
  type: "opex" | "capex";
  unit: string;
  quantityPlan: number;
  amountPlan: number;
  productId: string | null;
  justification: string;
}

export function useBudgetLines() {
  const customLines = useSyncExternalStore(subscribe, readStorage, getServerSnapshot);

  const addLine = useCallback((input: NewBudgetLineInput) => {
    if (typeof window === "undefined") return;
    const now = new Date().toISOString();
    const id = `custom-${Date.now()}`;
    const newLine: BudgetLine = {
      id,
      year: input.year,
      quarter: input.quarter,
      department: input.department,
      article: input.article,
      type: input.type,
      unit: input.unit,
      quantityPlan: input.quantityPlan,
      quantityFact: 0,
      amountPlan: input.amountPlan,
      amountFact: 0,
      calculation: "Расчёт будет сформирован после начала фактического исполнения.",
      justification: input.justification,
      relatedDepartments: [],
      productId: input.productId,
      status: "draft",
      risk: "none",
      author: "Адилбек Сагадиев",
      updatedAt: now,
      history: [
        {
          id: `${id}-h1`,
          dateTime: now,
          author: "Адилбек Сагадиев",
          field: "Статья",
          oldValue: "—",
          newValue: input.article,
          comment: "Строка добавлена вручную через форму «Новая строка».",
        },
      ],
    };
    const next = [...readStorage(), newLine];
    cache = next;
    cacheRaw = JSON.stringify(next);
    window.localStorage.setItem(STORAGE_KEY, cacheRaw);
    listeners.forEach((listener) => listener());
  }, []);

  return { customLines, addLine };
}
