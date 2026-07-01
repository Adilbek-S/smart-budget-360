"use client";

import { useCallback, useSyncExternalStore } from "react";
import type { ApprovalStatus } from "./types";

const STORAGE_KEY = "sb360-approval-overrides";

type Overrides = Record<string, ApprovalStatus>;

const listeners = new Set<() => void>();
let cache: Overrides = {};
let cacheRaw: string | null = null;

function readStorage(): Overrides {
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

function getServerSnapshot(): Overrides {
  return {};
}

export function useApprovalOverrides() {
  const overrides = useSyncExternalStore(subscribe, readStorage, getServerSnapshot);

  const setStatus = useCallback((id: string, status: ApprovalStatus) => {
    if (typeof window === "undefined") return;
    const next = { ...readStorage(), [id]: status };
    cache = next;
    cacheRaw = JSON.stringify(next);
    window.localStorage.setItem(STORAGE_KEY, cacheRaw);
    listeners.forEach((listener) => listener());
  }, []);

  return { overrides, setStatus };
}
