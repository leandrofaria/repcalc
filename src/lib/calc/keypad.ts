import type { CalcAction, CalcState } from "./expression";
import { clearsEntryOnly } from "./expression";

export type KeyId =
  | "0"
  | "1"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "h"
  | "min"
  | "clear"
  | "add"
  | "sub"
  | "mul"
  | "div"
  | "equals";

export type KeyDef = {
  id: KeyId;
  /** A function where the label depends on state, as with the CE/C swap. */
  label: string | ((state: CalcState) => string);
  action: CalcAction;
  color: "primary" | "secondary" | "neutral" | "unit" | "error" | "success";
  group: "numeric" | "ops";
  colSpan?: 2;
  textTransform?: "lowercase" | "uppercase";
  /** KeyboardEvent.key values that trigger this key. */
  keys: readonly string[];
  /** Spoken name, since the glyph alone is not an accessible label. */
  ariaLabel?: string;
};

function digit(id: KeyId): KeyDef {
  return {
    id,
    label: id,
    action: { type: "digit", digit: id },
    color: "secondary",
    group: "numeric",
    keys: [id],
  };
}

/**
 * The keypad, and the physical keyboard, from one description.
 *
 * The `keys` field is what unifies them: the keyboard handler looks a key up
 * here and dispatches the same action the button would. Previously the two
 * paths restated the same legality rules separately.
 */
export const KEYPAD: readonly KeyDef[] = [
  digit("7"),
  digit("8"),
  digit("9"),
  digit("4"),
  digit("5"),
  digit("6"),
  digit("1"),
  digit("2"),
  digit("3"),
  digit("0"),
  {
    id: "h",
    label: "h",
    action: { type: "unit", unit: "h" },
    color: "unit",
    group: "numeric",
    textTransform: "lowercase",
    keys: ["h"],
    ariaLabel: "Horas",
  },
  {
    id: "min",
    label: "min",
    action: { type: "unit", unit: "min" },
    color: "unit",
    group: "numeric",
    textTransform: "lowercase",
    keys: ["m"],
    ariaLabel: "Minutos",
  },
  {
    id: "clear",
    label: (state) => (clearsEntryOnly(state) ? "CE" : "C"),
    action: { type: "clear" },
    color: "error",
    group: "ops",
    colSpan: 2,
    textTransform: "uppercase",
    keys: ["c", "C", "Escape", "Delete"],
    ariaLabel: "Limpar",
  },
  {
    id: "mul",
    label: "*",
    action: { type: "operator", op: "*" },
    color: "neutral",
    group: "ops",
    keys: ["*"],
    ariaLabel: "Multiplicar",
  },
  {
    id: "div",
    label: "/",
    action: { type: "operator", op: "/" },
    color: "neutral",
    group: "ops",
    keys: ["/"],
    ariaLabel: "Dividir",
  },
  {
    id: "add",
    label: "+",
    action: { type: "operator", op: "+" },
    color: "neutral",
    group: "ops",
    keys: ["+"],
    ariaLabel: "Somar",
  },
  {
    id: "sub",
    label: "-",
    action: { type: "operator", op: "-" },
    color: "neutral",
    group: "ops",
    keys: ["-"],
    ariaLabel: "Subtrair",
  },
  {
    id: "equals",
    label: "=",
    action: { type: "equals" },
    color: "success",
    group: "ops",
    colSpan: 2,
    textTransform: "uppercase",
    keys: ["=", "Enter"],
    ariaLabel: "Calcular",
  },
];

export const NUMERIC_KEYS = KEYPAD.filter((key) => key.group === "numeric");
export const OPERATOR_KEYS = KEYPAD.filter((key) => key.group === "ops");

export function findKeyByKeyboardEvent(key: string): KeyDef | undefined {
  return KEYPAD.find((def) => def.keys.includes(key));
}
