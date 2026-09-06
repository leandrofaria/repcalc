"use client";

import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { useId } from "react";
import type { Dayjs } from "dayjs";
import { pickerReferenceDate } from "@/lib/time/dayjs";

/**
 * A labelled 24h time picker.
 *
 * Every picker in the app used to be labelled by a neighbouring paragraph,
 * which a screen reader does not associate with the input, and three of them
 * shared the id "outlined-basic". This wrapper is the single place that gets
 * the label, the generated id, the error wiring and the fixed reference date
 * right.
 */
const TimeField = ({
  label,
  value,
  onChange,
  error = false,
  helperText,
  startAdornment,
}: {
  label: string;
  value: Dayjs | null;
  onChange: (value: Dayjs | null) => void;
  error?: boolean;
  helperText?: string;
  startAdornment?: React.ReactNode;
}) => {
  const id = useId();
  const helperId = helperText === undefined ? undefined : `${id}-helper`;

  return (
    <div>
      <label htmlFor={id} className="block font-semibold mb-1">
        {label}
      </label>
      <div className="flex flex-row justify-center items-center">
        {startAdornment}
        <TimePicker
          sx={{ width: "100%" }}
          ampm={false}
          referenceDate={pickerReferenceDate()}
          value={value}
          onChange={onChange}
          slotProps={{
            textField: {
              id,
              error,
              helperText,
              "aria-describedby": helperId,
            },
          }}
        />
      </div>
    </div>
  );
};

export default TimeField;
