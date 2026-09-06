"use client";

import { useSyncExternalStore } from "react";
import {
  JORNADA_DEFAULTS,
  STORAGE_KEYS,
  clearStoredDefaults,
  readStoredDefaults,
  writeStoredDefaults,
  type JornadaDefaults,
} from "./defaults";

const listeners = new Set<() => void>();

let cachedRaw = "";
let cached: JornadaDefaults = JORNADA_DEFAULTS;

function rawValues(): string {
  try {
    return Object.values(STORAGE_KEYS)
      .map((key) => window.localStorage.getItem(key) ?? "")
      .join("|");
  } catch {
    return "";
  }
}

/**
 * Caching keeps the snapshot referentially stable, which useSyncExternalStore
 * requires: returning a fresh object on every call would loop forever.
 */
function getSnapshot(): JornadaDefaults {
  const raw = rawValues();
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    cached = readStoredDefaults(window.localStorage);
  }
  return cached;
}

function emit(): void {
  for (const listener of listeners) listener();
}

function subscribe(onChange: () => void): () => void {
  listeners.add(onChange);
  // Fires for changes made in other tabs; emit() covers this one.
  window.addEventListener("storage", onChange);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener("storage", onChange);
  };
}

/**
 * The saved jornada defaults, as a subscription.
 *
 * Reading localStorage during render behind process.browser is what caused
 * the hydration mismatch. Reading it in an effect fixed that but cascaded a
 * render. This serves the built-in defaults during the prerender and the
 * stored ones once hydrated, which is what useSyncExternalStore exists for,
 * and it keeps two open tabs in agreement.
 */
export function useStoredDefaults(): JornadaDefaults {
  return useSyncExternalStore(subscribe, getSnapshot, () => JORNADA_DEFAULTS);
}

export function saveDefaults(values: JornadaDefaults): void {
  writeStoredDefaults(window.localStorage, values);
  emit();
}

export function resetDefaults(): void {
  clearStoredDefaults(window.localStorage);
  emit();
}
