import { describe, expect, it } from "vitest";
import {
  KEYPAD,
  NUMERIC_KEYS,
  OPERATOR_KEYS,
  findKeyByKeyboardEvent,
} from "./keypad";
import { initialState, isKeyEnabled, reduce } from "./expression";

describe("KEYPAD", () => {
  it("describes every key exactly once", () => {
    expect(new Set(KEYPAD.map((key) => key.id)).size).toBe(KEYPAD.length);
    expect(NUMERIC_KEYS).toHaveLength(12);
    expect(OPERATOR_KEYS).toHaveLength(7);
  });

  it("draws backspace on the pad", () => {
    // There is no physical keyboard on a phone, which is where this is used.
    const drawn = [...NUMERIC_KEYS, ...OPERATOR_KEYS].map((key) => key.id);
    expect(drawn).toContain("backspace");
  });

  it("maps physical keys to the same actions as the buttons", () => {
    expect(findKeyByKeyboardEvent("7")?.id).toBe("7");
    expect(findKeyByKeyboardEvent("m")?.id).toBe("min");
    expect(findKeyByKeyboardEvent("Enter")?.id).toBe("equals");
    expect(findKeyByKeyboardEvent("Escape")?.id).toBe("clear");
    expect(findKeyByKeyboardEvent("Backspace")?.id).toBe("backspace");
    expect(findKeyByKeyboardEvent("x")).toBeUndefined();
  });

  it("swaps the clear label once there is an entry to discard", () => {
    const clear = KEYPAD.find((key) => key.id === "clear")!;
    const label = clear.label as (
      state: ReturnType<typeof initialState>
    ) => string;
    expect(label(initialState())).toBe("C");
    expect(label(reduce(initialState(), { type: "digit", digit: "5" }))).toBe(
      "CE"
    );
  });

  it("gives every glyph-only key a spoken name", () => {
    for (const key of KEYPAD) {
      if (/^\d$/.test(key.id)) continue;
      expect(key.ariaLabel, `missing ariaLabel on ${key.id}`).toBeTruthy();
    }
  });

  it("asks the reducer about legality using the key id", () => {
    const state = reduce(initialState(), { type: "digit", digit: "5" });
    for (const key of KEYPAD) {
      expect(typeof isKeyEnabled(state, key.id)).toBe("boolean");
    }
  });
});
