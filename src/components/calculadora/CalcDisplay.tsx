"use client";

import type { CalcState } from "@/lib/calc/expression";
import { displayLine, memoryLine } from "@/lib/calc/expression";

const ERROR_MESSAGES: Record<string, string> = {
  DIVIDE_BY_ZERO: "Não é possível dividir por zero",
  INVALID_UNITS: "Operação inválida entre estas unidades",
};

/**
 * The two readout lines.
 *
 * These were disabled text inputs, which are unfocusable and announce
 * nothing. As output elements in a live region, a screen reader reports the
 * result as it changes.
 */
const CalcDisplay = ({ state }: { state: CalcState }) => (
  <div className="flex flex-col gap-2">
    <output
      className="tabular block min-h-[28px] w-full rounded-[9px] bg-calc-memory px-3 py-1 text-right text-sm font-medium text-ink-muted"
      aria-label="Memória e operação pendente"
    >
      {memoryLine(state)}
    </output>
    <output
      className="tabular flex min-h-[64px] w-full flex-col items-end justify-center overflow-hidden rounded-[9px] border border-field-edge bg-surface px-4 py-2 font-display text-4xl font-bold text-figure"
      aria-live="polite"
      aria-label="Resultado"
    >
      {displayLine(state)}
    </output>
    {state.error !== null && (
      <p
        role="alert"
        className="rounded-[9px] bg-danger-face px-3 py-2 text-center text-sm font-semibold text-danger-ink"
      >
        {ERROR_MESSAGES[state.error]}
      </p>
    )}
  </div>
);

export default CalcDisplay;
