"use client";

import { Button, Collapse, TextField } from "@mui/material";
import ContentPasteIcon from "@mui/icons-material/ContentPaste";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useMemo, useState } from "react";
import type { TimeOfDay } from "@/lib/time/units";
import { MAX_PUNCHES, parsePunches } from "@/lib/punches/parse";

/**
 * Takes the line the bank's time clock reports — "08:00 09:00 09:10" — and
 * fills the screen in from it.
 *
 * A text field rather than a button that reads the clipboard: Firefox does
 * not grant clipboard reads to a plain button press, and Ctrl+V works
 * everywhere without asking for a permission.
 *
 * What the marks mean is the screen's business, so this component only reads
 * them and hands them over; `describe` lets each screen say what it will do
 * with them before anything is applied.
 */
const PunchPaste = ({
  hint,
  describe,
  onApply,
}: {
  hint: string;
  describe: (times: readonly TimeOfDay[]) => string;
  onApply: (times: readonly TimeOfDay[]) => void;
}) => {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");

  const parsed = useMemo(() => parsePunches(text), [text]);
  const { times, rejected, truncated } = parsed;

  const problem =
    rejected.length > 0
      ? `Não entendi: ${rejected.join(", ")}`
      : truncated
        ? `O relógio registra no máximo ${MAX_PUNCHES} marcações; as demais foram ignoradas.`
        : null;

  const apply = () => {
    if (times.length === 0) return;
    onApply(times);
    setText("");
    setOpen(false);
  };

  return (
    <div className="w-full rounded-[9px] border border-hairline">
      <Button
        fullWidth
        onClick={() => setOpen((previous) => !previous)}
        aria-expanded={open}
        startIcon={<ContentPasteIcon fontSize="small" />}
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
        Colar marcações do ponto
      </Button>

      {/* unmountOnExit: a collapsed section is still in the DOM, and without
          this Tab walks into a field nobody can see. */}
      <Collapse in={open} unmountOnExit>
        <div className="flex flex-col gap-3 border-t border-hairline p-3">
          <TextField
            fullWidth
            size="small"
            autoComplete="off"
            label="Marcações"
            placeholder="08:00 12:00 13:00"
            helperText={hint}
            value={text}
            onChange={(event) => setText(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                apply();
              }
            }}
          />

          {times.length > 0 && (
            <p className="text-sm text-ink-muted">{describe(times)}</p>
          )}
          {problem !== null && (
            <p className="text-sm font-medium text-danger-ink">{problem}</p>
          )}

          <Button
            variant="contained"
            disabled={times.length === 0}
            onClick={apply}
          >
            Preencher
          </Button>
        </div>
      </Collapse>
    </div>
  );
};

export default PunchPaste;
