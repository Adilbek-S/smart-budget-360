"use client";

import { useCallback, useSyncExternalStore } from "react";
import type { ReviewStatus } from "./types";

const STORAGE_KEY = "sb360-review-decisions";

interface Decision {
  status: ReviewStatus;
  routeStage: number;
}

type Decisions = Record<string, Decision>;

const listeners = new Set<() => void>();
let cache: Decisions = {};
let cacheRaw: string | null = null;

function readStorage(): Decisions {
  if (typeof window === "undefined") return cache;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (raw === cacheRaw) return cache;
  cacheRaw = raw;
  try {
    cache = raw ? JSON.parse(raw) : {};
  } catch {
    cache = {};
  }
  return cache;
}

function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

function getServerSnapshot(): Decisions {
  return {};
}

export function useReviewDecisions() {
  const decisions = useSyncExternalStore(subscribe, readStorage, getServerSnapshot);

  const setDecision = useCallback((id: string, status: ReviewStatus, routeStage: number) => {
    if (typeof window === "undefined") return;
    const next = { ...readStorage(), [id]: { status, routeStage } };
    cache = next;
    cacheRaw = JSON.stringify(next);
    window.localStorage.setItem(STORAGE_KEY, cacheRaw);
    listeners.forEach((listener) => listener());
  }, []);

  return { decisions, setDecision };
}
