import type { Attempt } from "./types";

const STORAGE_KEY = "feynmannai.history";
const MAX_SAVED_ATTEMPTS = 20;

export function loadHistory(): Attempt[] {
  if (typeof window === "undefined") {
    return [];
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return [];
  }

  try {
    return JSON.parse(raw) as Attempt[];
  } catch {
    return [];
  }
}

export function saveAttempt(attempt: Attempt): Attempt[] {
  const current = loadHistory();
  const updated = [attempt, ...current].slice(0, MAX_SAVED_ATTEMPTS);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}
