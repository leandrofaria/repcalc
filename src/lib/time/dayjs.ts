import dayjs, { type Dayjs } from "dayjs";
import { MINUTES_PER_DAY, type Duration, type TimeOfDay } from "./units";
import * as D from "./duration";
import * as T from "./timeOfDay";

/**
 * The only module in the app that imports dayjs.
 *
 * MUI's TimePicker speaks Dayjs, and Dayjs is an instant, not a duration.
 * Everything past this boundary works in integer minutes.
 */

/**
 * Picker values anchor to a fixed date, never to dayjs().
 *
 * Anchoring to "now" is what forced the live panel to reload the page at
 * midnight: the stored values belonged to yesterday. With a constant epoch,
 * the calendar date of a picker value carries no meaning and cannot go stale.
 */
export const PICKER_EPOCH = "2000-01-01T00:00:00";

function isUsable(value: Dayjs | null | undefined): value is Dayjs {
  return value != null && value.isValid();
}

export function pickerReferenceDate(): Dayjs {
  return dayjs(PICKER_EPOCH);
}

export function dayjsToDuration(
  value: Dayjs | null | undefined
): Duration | null {
  if (!isUsable(value)) return null;
  return D.fromHM(value.hour(), value.minute());
}

/**
 * Durations only flow back into a picker when a picker can hold them.
 *
 * Every duration that reaches a picker is an input (jornada, intervalo,
 * tolerancia), all under 24h by construction. Every duration that can exceed
 * 24h is an output, rendered as text by formatHHMM. That asymmetry is what
 * makes totals above 24h representable at all.
 */
export function durationToDayjs(value: Duration | null): Dayjs | null {
  if (value === null || value < 0 || value >= MINUTES_PER_DAY) return null;
  const { hours, minutes } = D.toHM(value);
  return dayjs(PICKER_EPOCH).hour(hours).minute(minutes);
}

export function dayjsToTimeOfDay(
  value: Dayjs | null | undefined
): TimeOfDay | null {
  if (!isUsable(value)) return null;
  return T.fromHM(value.hour(), value.minute());
}

export function timeOfDayToDayjs(value: TimeOfDay | null): Dayjs | null {
  if (value === null) return null;
  return dayjs(PICKER_EPOCH)
    .hour(Math.trunc(value / 60))
    .minute(value % 60);
}
