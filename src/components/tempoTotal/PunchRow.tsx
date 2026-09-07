"use client";

import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import type { Dayjs } from "dayjs";
import TimeField from "../fields/TimeField";
import type { PairState, PunchPair } from "@/lib/tempoTotal/pairs";
import { timeOfDayToDayjs } from "@/lib/time/dayjs";

/** Says which day a row landed on, so the reading is never silent. */
function dayLabel(offset: number): string | null {
  if (offset === 0) return null;
  return offset === 1 ? "no dia seguinte" : `${offset} dias depois`;
}

/**
 * One clock-in / clock-out row.
 *
 * Punching a clock is a sequence, so the number carries real information and
 * is not decoration. Each row deletes itself: before, only the last pair
 * could be removed, so fixing the second of five meant deleting three.
 */
const PunchRow = ({
  pair,
  index,
  state,
  canRemove,
  onChange,
  onRemove,
}: {
  pair: PunchPair;
  index: number;
  state: PairState;
  canRemove: boolean;
  onChange: (side: "in" | "out", value: Dayjs | null) => void;
  onRemove: () => void;
}) => {
  const day = dayLabel(state.dayOffset);

  return (
    <div className="w-full">
      <div className="flex w-full flex-row items-end gap-2">
        <span
          aria-hidden
          className="tabular mb-3 w-4 shrink-0 text-sm font-bold text-ink-faint"
        >
          {index + 1}
        </span>
        <div className="min-w-0 flex-1">
          <TimeField
            label="Entrada"
            a11yLabel={`Entrada ${index + 1}`}
            dense
            value={timeOfDayToDayjs(pair.in)}
            onChange={(value) => onChange("in", value)}
          />
        </div>
        <span aria-hidden className="mb-3 shrink-0 text-ink-faint">
          &rarr;
        </span>
        <div className="min-w-0 flex-1">
          <TimeField
            label="Saída"
            a11yLabel={`Saída ${index + 1}`}
            dense
            value={timeOfDayToDayjs(pair.out)}
            onChange={(value) => onChange("out", value)}
            error={state.invalid}
            helperText={state.invalid ? "Entrada e saída iguais." : undefined}
          />
        </div>
        <IconButton
          size="small"
          aria-label={`Excluir o par ${index + 1}`}
          disabled={!canRemove}
          onClick={onRemove}
          className="mb-2 shrink-0"
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </div>
      {day !== null && (
        <p className="ml-6 text-xs font-medium text-brand">{day}</p>
      )}
    </div>
  );
};

export default PunchRow;
