"use client";

import { useSyncExternalStore } from "react";
import { nowTimeOfDay } from "./timeOfDay";
import type { TimeOfDay } from "./units";

const TICK_MS = 1000;

function subscribe(onChange: () => void): () => void {
  const timer = window.setInterval(onChange, TICK_MS);
  return () => window.clearInterval(timer);
}

/**
 * The current time of day, as a subscription rather than an effect.
 *
 * The clock is an external system, which is exactly what useSyncExternalStore
 * is for: no state to seed, no effect to synchronise, and nothing to tear
 * down by hand. Because the snapshot is a plain number of minutes, React
 * re-renders only when the minute actually changes, not once a second.
 *
 * The server snapshot is null: there is no meaningful clock during a static
 * prerender, and callers already render "N/A" for it.
 */
export function useClock(): TimeOfDay | null {
  return useSyncExternalStore(
    subscribe,
    () => nowTimeOfDay(),
    () => null
  );
}
