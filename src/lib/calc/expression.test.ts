import { describe, expect, it } from "vitest";
import {
  HISTORY_LIMIT,
  clearsEntryOnly,
  displayLine,
  initialState,
  isKeyEnabled,
  memoryLine,
  reduce,
  type CalcAction,
  type CalcState,
} from "./expression";
import type { Operator } from "./engine";

/** Presses a sequence of keys: digits, "h", "min", operators, "=" and "c". */
function press(keys: string, from: CalcState = initialState()): CalcState {
  return keys.split(" ").reduce((state, key) => {
    const action: CalcAction = /^\d$/.test(key)
      ? { type: "digit", digit: key }
      : key === "h" || key === "min"
        ? { type: "unit", unit: key }
        : key === "="
          ? { type: "equals" }
          : key === "c"
            ? { type: "clear" }
            : key === "<"
              ? { type: "backspace" }
              : { type: "operator", op: key as Operator };
    return reduce(state, action);
  }, from);
}

const shown = (keys: string) => displayLine(press(keys));

describe("typing", () => {
  it("accumulates digits", () => {
    expect(shown("1 2")).toBe("12");
  });

  it("replaces a lone zero", () => {
    expect(shown("0 7")).toBe("7");
  });

  it("builds an hours-and-minutes entry", () => {
    expect(shown("2")).toBe("2");
    expect(shown("2 h")).toBe("2h");
    expect(shown("2 h 3")).toBe("2h 3");
    expect(shown("2 h 3 0")).toBe("2h 30");
    expect(shown("2 h 3 0 min")).toBe("2h 30min");
  });

  it("supplies the leading zero the original did", () => {
    expect(shown("h")).toBe("0h");
    expect(shown("min")).toBe("0min");
    expect(shown("2 h min")).toBe("2h 0min");
  });

  it("shows zero for an untouched calculator", () => {
    expect(displayLine(initialState())).toBe("0");
  });
});

describe("arithmetic through the keypad", () => {
  it("adds two durations", () => {
    expect(shown("2 h 3 0 min + 1 h 4 5 min =")).toBe("4h 15m");
  });

  it("chains operations, folding as it goes", () => {
    expect(shown("2 h + 3 h + 4 h =")).toBe("9h");
  });

  it("replaces a pending operator when pressed twice", () => {
    const state = press("2 h + -");
    expect(state.operator).toBe("-");
    expect(memoryLine(state)).toBe("2h -");
  });

  it("does nothing on equals with no operator", () => {
    expect(shown("5 =")).toBe("5");
  });

  it("reports division by zero without destroying the entry", () => {
    const state = press("2 h / 0 =");
    expect(state.error).toBe("DIVIDE_BY_ZERO");
    expect(state.memory).not.toBeNull();
  });
});

describe("starting a new entry after a result", () => {
  it("does not append to the result", () => {
    // Production showed "4h 15m7" here.
    expect(shown("2 h 3 0 min + 1 h 4 5 min = 7")).toBe("7");
  });

  it("leaves the digit keys usable after a result with minutes", () => {
    // Production disabled every digit key whenever the result had minutes.
    const state = press("2 h 3 0 min + 1 h 4 5 min =");
    expect(isKeyEnabled(state, "7")).toBe(true);
  });
});

describe("backspace", () => {
  it("undoes one forward step at a time, in reverse", () => {
    // Exactly mirrors the sequence in "builds an hours-and-minutes entry".
    expect(shown("2 h 3 0 min <")).toBe("2h 30");
    expect(shown("2 h 3 0 min < <")).toBe("2h 3");
    expect(shown("2 h 3 0 min < < <")).toBe("2h");
    expect(shown("2 h 3 0 min < < < <")).toBe("2");
    expect(shown("2 h 3 0 min < < < < <")).toBe("0");
  });

  it("takes back the implied zero the same way", () => {
    expect(shown("min <")).toBe("0");
    expect(shown("h <")).toBe("0");
  });

  it("discards a result rather than editing its digits", () => {
    // "4h 15m" is not a string of keystrokes, so there is no last one.
    expect(shown("2 h 3 0 min + 1 h 4 5 min = <")).toBe("0");
  });

  it("does nothing on an untouched calculator", () => {
    const state = press("<");
    expect(state.entry).toBeNull();
    expect(state.memory).toBeNull();
  });

  it("leaves the memory alone", () => {
    const state = press("2 h + 3 5 <");
    expect(displayLine(state)).toBe("3");
    expect(memoryLine(state)).toBe("2h +");
  });
});

describe("clear", () => {
  it("discards the entry first, then the memory", () => {
    const withEntry = press("2 h + 3");
    expect(clearsEntryOnly(withEntry)).toBe(true);

    const cleared = reduce(withEntry, { type: "clear" });
    expect(cleared.entry).toBeNull();
    expect(cleared.memory).not.toBeNull();
    expect(clearsEntryOnly(cleared)).toBe(false);

    const wiped = reduce(cleared, { type: "clear" });
    expect(wiped.memory).toBeNull();
    expect(wiped.operator).toBeNull();
  });
});

describe("history", () => {
  it("records newest first", () => {
    const state = press("2 h + 3 h = 1 h + 1 h =");
    expect(state.history[0]).toBe("1h + 1h = 2h");
    expect(state.history[1]).toBe("2h + 3h = 5h");
  });

  it("can be cleared without touching the calculation", () => {
    const state = press("2 h + 3 h =");
    expect(state.history).toHaveLength(1);

    const cleared = reduce(state, { type: "clearHistory" });
    expect(cleared.history).toEqual([]);
    expect(displayLine(cleared)).toBe("5h");
  });

  it("caps at twelve entries", () => {
    let state = initialState();
    for (let i = 0; i < HISTORY_LIMIT + 5; i += 1) {
      state = press("1 h + 1 h =", state);
    }
    expect(state.history).toHaveLength(HISTORY_LIMIT);
  });
});

describe("isKeyEnabled", () => {
  it("blocks digits once minutes are sealed", () => {
    expect(isKeyEnabled(press("2 h 3 0 min"), "5")).toBe(false);
  });

  it("blocks a second h but allows min after h", () => {
    const state = press("2 h");
    expect(isKeyEnabled(state, "h")).toBe(false);
    expect(isKeyEnabled(state, "min")).toBe(true);
  });

  it("blocks the unit keys that would build duration times duration", () => {
    const state = press("2 h *");
    expect(isKeyEnabled(state, "h")).toBe(false);
    expect(isKeyEnabled(state, "min")).toBe(false);
  });

  it("blocks the unit keys that would build scalar over duration", () => {
    const state = press("5 /");
    expect(isKeyEnabled(state, "h")).toBe(false);
    expect(isKeyEnabled(state, "min")).toBe(false);
  });

  it("allows a duration divisor after a duration", () => {
    const state = press("7 h /");
    expect(isKeyEnabled(state, "h")).toBe(true);
  });

  it("refuses a bare zero as a divisor", () => {
    expect(isKeyEnabled(press("7 h /"), "0")).toBe(false);
    expect(isKeyEnabled(press("7 h / 1"), "0")).toBe(true);
  });
});
