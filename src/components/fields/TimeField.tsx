"use client";

import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { useId } from "react";
import type { Dayjs } from "dayjs";
import { pickerReferenceDate } from "@/lib/time/dayjs";

/**
 * Large, centred figures. This used to be a global `input[type="text"]` rule
 * in globals.css, full of !important, that hit every input on every page;
 * scoping it here is what let that rule go.
 *
 * The dense size exists for rows that put two fields, a number, an arrow and
 * a delete button on one line: at 22px the placeholder clipped on a phone.
 */
function fieldSx(dense: boolean) {
  return {
    width: "100%",
    "& .MuiPickersInputBase-sectionsContainer": {
      justifyContent: "center",
      fontFamily: "var(--font-display), sans-serif",
      fontSize: dense ? "17px" : "22px",
      fontWeight: 700,
      fontVariantNumeric: "tabular-nums",
      color: "var(--rc-figure)",
      paddingBlock: dense ? "7px" : "10px",
    },
  } as const;
}

/**
 * A labelled 24h time picker.
 *
 * Every picker in the app used to be labelled by a neighbouring paragraph,
 * which a screen reader does not associate with the input, and three of them
 * shared the id "outlined-basic". This wrapper is the single place that gets
 * the label, the error wiring and the fixed reference date right.
 *
 * The name goes on via aria-labelledby rather than a label's htmlFor: since
 * x-date-pickers v9 the element carrying the id is a hidden input, and the
 * thing the user actually focuses is the role="group" wrapper around the
 * hour and minute spinbuttons.
 */
const TimeField = ({
  label,
  a11yLabel,
  value,
  onChange,
  error = false,
  helperText,
  dense = false,
}: {
  label: string;
  /** A fuller name for screen readers when the visible label is shortened. */
  a11yLabel?: string;
  value: Dayjs | null;
  onChange: (value: Dayjs | null) => void;
  error?: boolean;
  helperText?: string;
  dense?: boolean;
}) => {
  const labelId = useId();

  return (
    <div className="min-w-0">
      <p
        id={labelId}
        className={`mb-1 block font-medium text-ink-muted ${dense ? "text-xs" : "text-sm"}`}
      >
        {a11yLabel === undefined ? (
          label
        ) : (
          <>
            <span aria-hidden>{label}</span>
            <span className="sr-only">{a11yLabel}</span>
          </>
        )}
      </p>
      <div className="flex flex-row items-center justify-center gap-2">
        <TimePicker
          sx={fieldSx(dense)}
          ampm={false}
          referenceDate={pickerReferenceDate()}
          value={value}
          onChange={onChange}
          slotProps={{
            textField: {
              error,
              helperText,
              // The picker's own slotProps.input reaches the role="group"
              // element, which is what actually takes focus.
              slotProps: { input: { "aria-labelledby": labelId } },
            },
            openPickerButton: { "aria-describedby": labelId },
          }}
        />
      </div>
    </div>
  );
};

export default TimeField;
