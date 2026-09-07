"use client";

import { Button, Collapse } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useMemo, useState } from "react";
import TimeField from "../fields/TimeField";
import type { Duration, TimeOfDay } from "@/lib/time/units";
import { ZERO, add, formatHHMM } from "@/lib/time/duration";
import { difference } from "@/lib/time/timeOfDay";
import { dayjsToTimeOfDay, timeOfDayToDayjs } from "@/lib/time/dayjs";

type Entries = { start: TimeOfDay | null; end: TimeOfDay | null };

const EMPTY: Entries = { start: null, end: null };

/**
 * Adds up one or more breaks and writes the total into the journey's break
 * field.
 *
 * This used to be a modal opened from a button glued to that field. On a
 * phone the button ate the field's width until only the colon was left, and a
 * modal hid the very field it was filling in. As a section it fixes both, and
 * the result and its destination are visible at once.
 */
const IntervaloSection = ({
  onApply,
}: {
  onApply: (value: Duration) => void;
}) => {
  const [open, setOpen] = useState(false);
  const [entries, setEntries] = useState<Entries>(EMPTY);
  const [total, setTotal] = useState<Duration | null>(null);

  const { duration, outOfOrder } = useMemo(() => {
    const { start, end } = entries;
    if (start === null || end === null) {
      return { duration: null, outOfOrder: false };
    }
    // The previous version had no chronological check at all, so an end
    // before the start produced a wrapped value that was written straight
    // into the journey's break field.
    if (end <= start) return { duration: null, outOfOrder: true };
    return { duration: difference(start, end), outOfOrder: false };
  }, [entries]);

  return (
    <div className="w-full rounded-[9px] border border-hairline">
      <Button
        fullWidth
        onClick={() => setOpen((previous) => !previous)}
        aria-expanded={open}
        endIcon={
          <ExpandMoreIcon
            sx={{
              transform: open ? "rotate(180deg)" : "none",
              transition: "transform 150ms",
            }}
          />
        }
        sx={{
          justifyContent: "space-between",
          color: "primary.main",
          fontSize: "14px",
        }}
      >
        Calcular o intervalo
      </Button>

      {/* unmountOnExit: a collapsed section is still in the DOM, and
          without this Tab walks into two fields nobody can see. */}
      <Collapse in={open} unmountOnExit>
        <div className="flex flex-col gap-3 border-t border-hairline p-3">
          <div className="grid grid-cols-2 gap-3">
            <TimeField
              label="Início"
              value={timeOfDayToDayjs(entries.start)}
              onChange={(value) =>
                setEntries((previous) => ({
                  ...previous,
                  start: dayjsToTimeOfDay(value),
                }))
              }
            />
            <TimeField
              label="Fim"
              value={timeOfDayToDayjs(entries.end)}
              onChange={(value) =>
                setEntries((previous) => ({
                  ...previous,
                  end: dayjsToTimeOfDay(value),
                }))
              }
              error={outOfOrder}
              helperText={outOfOrder ? "Precisa ser após o início." : undefined}
            />
          </div>

          <p className="tabular flex items-baseline justify-between gap-3 text-sm text-ink-muted">
            <span>Duração</span>
            {duration === null ? (
              <span className="text-right text-xs text-ink-faint">
                {outOfOrder
                  ? "Fim precisa ser após o início"
                  : "Informe início e fim"}
              </span>
            ) : (
              <b className="font-display text-lg text-figure">
                {formatHHMM(duration)}
              </b>
            )}
          </p>

          {total !== null && (
            <p className="tabular flex items-baseline justify-between text-sm text-ink-muted">
              <span>Acumulado</span>
              <b className="font-display text-lg text-figure">
                {formatHHMM(total)}
              </b>
            </p>
          )}

          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outlined"
              disabled={duration === null}
              onClick={() => {
                setTotal((previous) => add(previous ?? ZERO, duration!));
                setEntries(EMPTY);
              }}
            >
              Somar outro
            </Button>
            <Button
              variant="contained"
              disabled={total === null && duration === null}
              onClick={() => {
                onApply(add(total ?? ZERO, duration ?? ZERO));
                setTotal(null);
                setEntries(EMPTY);
                setOpen(false);
              }}
            >
              Usar
            </Button>
          </div>
        </div>
      </Collapse>
    </div>
  );
};

export default IntervaloSection;
