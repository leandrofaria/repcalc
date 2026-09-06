"use client";

import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import type { Dayjs } from "dayjs";
import TimeField from "../fields/TimeField";
import type { PunchPair } from "@/lib/tempoTotal/pairs";
import { timeOfDayToDayjs } from "@/lib/time/dayjs";

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
  invalid,
  canRemove,
  onChange,
  onRemove,
}: {
  pair: PunchPair;
  index: number;
  invalid: boolean;
  canRemove: boolean;
  onChange: (side: "in" | "out", value: Dayjs | null) => void;
  onRemove: () => void;
}) => (
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
        error={invalid}
        helperText={invalid ? "Fora de ordem." : undefined}
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
);

export default PunchRow;
