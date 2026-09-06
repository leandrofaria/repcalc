"use client";

import { Button } from "@mui/material";
import type { KeyDef } from "@/lib/calc/keypad";
import type { CalcState } from "@/lib/calc/expression";

/**
 * One keypad button.
 *
 * The sx block below was copy-pasted onto fifteen separate buttons before
 * this component existed.
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
      sx={{
        minWidth: 0,
        fontWeight: 900,
        fontSize: "21px",
        textTransform: def.textTransform ?? "none",
        gridColumn: def.colSpan === 2 ? "span 2" : undefined,
      }}
    >
      {label}
    </Button>
  );
};

export default CalcKey;
