"use client";

import { Button } from "@mui/material";
import type { KeyDef } from "@/lib/calc/keypad";
import type { CalcState } from "@/lib/calc/expression";

/** Defined once here rather than repeated on each of the fifteen keys. */
const KEY_SX = { minWidth: 0, fontWeight: 900, fontSize: "21px" } as const;

/**
 * One keypad button.
 *
 * Before this component existed, the same twelve-line sx block was
 * copy-pasted onto fifteen separate buttons.
 */
const CalcKey = ({
  def,
  state,
  disabled,
  onPress,
}: {
  def: KeyDef;
  state: CalcState;
  disabled: boolean;
  onPress: () => void;
}) => {
  const label = typeof def.label === "function" ? def.label(state) : def.label;

  return (
    <Button
      variant="contained"
      color={def.color}
      size="large"
      fullWidth
      disabled={disabled}
      onClick={onPress}
      aria-label={def.ariaLabel}
      sx={[
        KEY_SX,
        {
          textTransform: def.textTransform ?? "none",
          gridColumn: def.colSpan === 2 ? "span 2" : undefined,
        },
      ]}
    >
      {label}
    </Button>
  );
};

export default CalcKey;
