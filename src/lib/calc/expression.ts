import { duration } from "../time/units";
import {
  ZERO_SCALAR,
  apply,
  durationValue,
  formatValue,
  scalar,
  type CalcError,
  type Operator,
  type Value,
} from "./engine";

export const HISTORY_LIMIT = 12;

/**
 * What the user is currently typing, or the result of the last equals.
 *
 * A buffer keeps the digits typed so far plus the hour component captured
 * when "h" was pressed; `sealed` means "min" has been pressed and the digit
 * buffer is now the minute component.
 */
export type Entry =
  | { kind: "buffer"; digits: string; hours: string | null; sealed: boolean }
  | { kind: "value"; value: Value };

export type CalcState = {
  memory: Value | null;
  operator: Operator | null;
  entry: Entry | null;
  history: readonly string[];
  error: CalcError | null;
};

export type Unit = "h" | "min";

export type CalcAction =
  | { type: "digit"; digit: string }
  | { type: "unit"; unit: Unit }
  | { type: "operator"; op: Operator }
  | { type: "equals" }
  | { type: "backspace" }
  | { type: "clear" };

const EMPTY_BUFFER: Entry = {
  kind: "buffer",
  digits: "",
  hours: null,
  sealed: false,
};

export function initialState(): CalcState {
  return {
    memory: null,
    operator: null,
    entry: null,
    history: [],
    error: null,
  };
}

function hasHour(entry: Entry | null): boolean {
  return entry?.kind === "buffer" && entry.hours !== null;
}

function hasMinute(entry: Entry | null): boolean {
  return entry?.kind === "buffer" && entry.sealed;
}

/** The display string, rebuilt from the typed components. */
export function displayLine(state: CalcState): string {
  const { entry } = state;
  if (entry === null) return "0";
  if (entry.kind === "value") return formatValue(entry.value);

  const { digits, hours, sealed } = entry;
  if (hours === null && !sealed) return digits === "" ? "0" : digits;
  if (hours === null) return `${digits}min`;
  if (!sealed) return digits === "" ? `${hours}h` : `${hours}h ${digits}`;
  return `${hours}h ${digits}min`;
}

/** The line above the display: what is held in memory and the pending operator. */
export function memoryLine(state: CalcState): string {
  const left = state.memory === null ? "0" : formatValue(state.memory);
  return `${left} ${state.operator ?? ""}`.trimEnd();
}

/** The value an entry stands for, or null when nothing has been typed. */
export function entryValue(entry: Entry | null): Value | null {
  if (entry === null) return null;
  if (entry.kind === "value") return entry.value;

  const { digits, hours, sealed } = entry;
  if (hours === null && !sealed) {
    return digits === "" ? null : scalar(Number(digits));
  }
  const minutes = Number(digits === "" ? 0 : digits);
  return durationValue(duration(Number(hours ?? 0) * 60 + minutes));
}

function pushHistory(
  history: readonly string[],
  message: string
): readonly string[] {
  return [message, ...history].slice(0, HISTORY_LIMIT);
}

/**
 * Folds the pending operation, if there is one, and returns the result plus
 * the updated history. A failed operation surfaces as an error and leaves the
 * memory untouched so the user can correct the entry.
 */
function fold(state: CalcState): {
  value: Value | null;
  history: readonly string[];
  error: CalcError | null;
} {
  const right = entryValue(state.entry);
  if (state.operator === null) {
    return { value: right, history: state.history, error: null };
  }

  const left = state.memory ?? ZERO_SCALAR;
  const result = apply(state.operator, left, right ?? ZERO_SCALAR);
  if (!result.ok) {
    return { value: null, history: state.history, error: result.error };
  }

  const message = `${formatValue(left)} ${state.operator} ${formatValue(
    right ?? ZERO_SCALAR
  )} = ${formatValue(result.value)}`;
  return {
    value: result.value,
    history: pushHistory(state.history, message),
    error: null,
  };
}

/**
 * Typing a digit or a unit onto a finished result starts a new entry.
 *
 * The previous implementation appended to the result's display string, so
 * pressing 7 after "4h 15m" showed "4h 15m7" while the value silently stayed
 * at 4h15. It also disabled every digit key whenever a result carried a
 * minute component, which left the keypad dead until the user pressed C.
 */
function bufferFor(entry: Entry | null): Extract<Entry, { kind: "buffer" }> {
  return entry !== null && entry.kind === "buffer"
    ? entry
    : (EMPTY_BUFFER as Extract<Entry, { kind: "buffer" }>);
}

export function reduce(state: CalcState, action: CalcAction): CalcState {
  switch (action.type) {
    case "digit": {
      const buffer = bufferFor(state.entry);
      if (buffer.sealed) return state;
      const digits =
        buffer.digits === "0" ? action.digit : buffer.digits + action.digit;
      return { ...state, entry: { ...buffer, digits }, error: null };
    }

    case "unit": {
      const buffer = bufferFor(state.entry);
      if (action.unit === "h") {
        if (buffer.hours !== null || buffer.sealed) return state;
        return {
          ...state,
          entry: {
            kind: "buffer",
            hours: buffer.digits === "" ? "0" : buffer.digits,
            digits: "",
            sealed: false,
          },
          error: null,
        };
      }
      if (buffer.sealed) return state;
      return {
        ...state,
        entry: {
          kind: "buffer",
          hours: buffer.hours,
          digits: buffer.digits === "" ? "0" : buffer.digits,
          sealed: true,
        },
        error: null,
      };
    }

    case "operator": {
      if (state.memory === null) {
        return {
          ...state,
          memory: entryValue(state.entry),
          operator: action.op,
          entry: null,
          error: null,
        };
      }
      if (state.entry === null) {
        return { ...state, operator: action.op, error: null };
      }
      const { value, history, error } = fold(state);
      if (error !== null) return { ...state, history, error };
      return {
        ...state,
        memory: value,
        operator: action.op,
        entry: null,
        history,
        error: null,
      };
    }

    case "equals": {
      const { value, history, error } = fold(state);
      if (error !== null) return { ...state, history, error };
      return {
        ...state,
        memory: null,
        operator: null,
        entry: value === null ? null : { kind: "value", value },
        history,
        error: null,
      };
    }

    case "backspace": {
      const { entry } = state;
      if (entry === null) return state;
      // A result is not a string of keystrokes, so there is no last one to
      // take back; the whole thing goes.
      if (entry.kind === "value") return { ...state, entry: null, error: null };

      // Otherwise undo exactly one forward step, in reverse order of how the
      // entry was built: min, then digits, then h.
      if (entry.sealed) {
        return { ...state, entry: { ...entry, sealed: false }, error: null };
      }
      if (entry.digits !== "") {
        return {
          ...state,
          entry: { ...entry, digits: entry.digits.slice(0, -1) },
          error: null,
        };
      }
      if (entry.hours !== null) {
        return {
          ...state,
          entry: {
            kind: "buffer",
            digits: entry.hours,
            hours: null,
            sealed: false,
          },
          error: null,
        };
      }
      return { ...state, entry: null, error: null };
    }

    case "clear": {
      if (state.entry !== null) return { ...state, entry: null, error: null };
      if (state.memory !== null) {
        return { ...state, memory: null, operator: null, error: null };
      }
      return { ...state, error: null };
    }
  }
}

/** True when pressing "clear" would only discard the current entry. */
export function clearsEntryOnly(state: CalcState): boolean {
  return state.entry !== null;
}

/**
 * Whether a key may be pressed right now.
 *
 * This is the single source of the rule. The keypad's disabled props and the
 * physical keyboard's guards used to restate the same booleans separately,
 * free to drift apart.
 */
export function isKeyEnabled(state: CalcState, key: string): boolean {
  const { entry, memory, operator } = state;
  const memoryIsDuration = memory?.kind === "duration";

  // A unit key would build duration * duration or scalar / duration, which
  // the engine rejects.
  const unitWouldBeIllegal =
    (memoryIsDuration && operator === "*") ||
    (!memoryIsDuration && operator === "/");

  if (key === "h") {
    return !hasHour(entry) && !hasMinute(entry) && !unitWouldBeIllegal;
  }
  if (key === "min") {
    return !hasMinute(entry) && !unitWouldBeIllegal;
  }
  if (/^\d$/.test(key)) {
    if (hasMinute(entry)) return false;
    // Refuse a bare zero as a divisor before it can be entered.
    if (key === "0" && operator === "/" && displayLine(state) === "0") {
      return false;
    }
    return true;
  }
  return true;
}
