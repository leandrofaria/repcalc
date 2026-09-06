"use client";

import { Button } from "@mui/material";
import type { KeyDef } from "@/lib/calc/keypad";
import type { CalcState } from "@/lib/calc/expression";

/**
 * One keypad button.
 *
 * Before this component existed, the same twelve-line sx block was
 * copy-pasted onto fifteen separate buttons.
 */
const KEY_SX = {
  minWidth: 0,
  paddingInline: 0,
  minHeight: 52,
  fontFamily: "var(--font-display), sans-serif",
  fontWeight: 700,
  fontSize: "20px",
  fontVariantNumeric: "tabular-nums",
} as const;

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
      fullWidth
      disabled={disabled}
      onClick={onPress}
      aria-label={def.ariaLabel}
      sx={[
        KEY_SX,
        {
          gridColumn: def.colSpan === 2 ? "span 2" : undefined,
        },
      ]}
    >
      {label}
    </Button>
  );
};

export default CalcKey;
