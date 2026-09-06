"use client";

import { useEffect } from "react";
import { findKeyByKeyboardEvent } from "@/lib/calc/keypad";
import {
  isKeyEnabled,
  type CalcAction,
  type CalcState,
} from "@/lib/calc/expression";

function isEditable(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  return (
    target.isContentEditable ||
    ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)
  );
}

/**
 * Drives the calculator from the physical keyboard.
 *
 * Three things the previous handler got wrong: it listened for the deprecated
 * keypress event, which never fires for Escape or Delete; it called
 * preventDefault() on every key before checking whether it handled it, so the
 * page swallowed Ctrl+R, Ctrl+C and Ctrl+V; and it restated the keypad's
 * legality rules in a second place.
 */
export function useCalcKeyboard(
  state: CalcState,
  dispatch: (action: CalcAction) => void
): void {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey || event.altKey) return;
      if (isEditable(event.target)) return;

      const key = findKeyByKeyboardEvent(event.key);
      if (key === undefined || !isKeyEnabled(state, key.id)) return;

      event.preventDefault();
      dispatch(key.action);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [state, dispatch]);
}
