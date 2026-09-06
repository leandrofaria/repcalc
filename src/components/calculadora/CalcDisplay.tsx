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
  <div>
    <output
      className="history block w-full mb-3 h-[36px] leading-[36px] px-3 bg-calc-memory border-[1px] border-calc-edge shadow-inner text-lg font-semibold text-right text-white overflow-hidden"
      aria-label="Memória e operação pendente"
    >
      {memoryLine(state)}
    </output>
    <output
      className="display flex w-full h-[69px] border-[1px] border-calc-edge bg-surface shadow-inner p-3 flex-col justify-center items-end overflow-hidden text-3xl text-right"
      aria-live="polite"
      aria-label="Resultado"
    >
      {displayLine(state)}
    </output>
    {state.error !== null && (
      <p
        role="alert"
        className="mt-3 text-[color:var(--mui-palette-error-main)] font-semibold text-center"
      >
        {ERROR_MESSAGES[state.error]}
      </p>
    )}
  </div>
);

export default CalcDisplay;
