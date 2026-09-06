import { MINUTES_PER_HOUR, type Duration, duration } from "./units";

export const ZERO = duration(0);

/** Rounds half away from zero, so negatives round symmetrically to positives. */
function roundHalfAwayFromZero(value: number): number {
  return Math.sign(value) * Math.round(Math.abs(value));
}

function pad2(value: number): string {
  return String(value).padStart(2, "0");
}

export function fromHM(hours: number, minutes: number): Duration {
  return duration(hours * MINUTES_PER_HOUR + minutes);
}

/** Splits a duration into its sign and absolute hour/minute components. */
export function toHM(d: Duration): {
  negative: boolean;
  hours: number;
  minutes: number;
} {
  const abs = Math.abs(d);
  return {
    negative: d < 0,
    hours: Math.trunc(abs / MINUTES_PER_HOUR),
    minutes: abs % MINUTES_PER_HOUR,
  };
}

export function add(a: Duration, b: Duration): Duration {
  return duration(a + b);
}

export function subtract(a: Duration, b: Duration): Duration {
  return duration(a - b);
}

export function scale(d: Duration, factor: number): Duration {
  return duration(roundHalfAwayFromZero(d * factor));
}

export function divide(d: Duration, divisor: number): Duration {
  return duration(roundHalfAwayFromZero(d / divisor));
}

/** Duration divided by duration yields a dimensionless ratio. */
export function ratio(a: Duration, b: Duration): number {
  return a / b;
}

export function sum(ds: readonly Duration[]): Duration {
  return duration(ds.reduce<number>((acc, d) => acc + d, 0));
}

/**
 * Clock-style formatting that never wraps at 24 hours.
 *
 * The absence of any modulo here is the point: a 25h30 total formats as
 * "25:30", not "01:30". Accumulating into a Dayjs and calling format("HH:mm")
 * is what produced the wrap in IntervaloDialog.
 */
export function formatHHMM(d: Duration): string {
  const { negative, hours, minutes } = toHM(d);
  return `${negative ? "-" : ""}${pad2(hours)}:${pad2(minutes)}`;
}

/**
 * Compact formatting for the calculator display: "25h 30m", "-1h 30m", "0m".
 *
 * The sign is extracted once and applied to the whole value. The previous
 * implementation propagated it into both components, printing "-1h -30m".
 */
export function formatCompact(d: Duration): string {
  const { negative, hours, minutes } = toHM(d);
  const sign = negative ? "-" : "";
  if (hours === 0 && minutes === 0) return "0m";
  if (hours === 0) return `${sign}${minutes}m`;
  if (minutes === 0) return `${sign}${hours}h`;
  return `${sign}${hours}h ${minutes}m`;
}

const COMPACT_PATTERN = /^(-)?(?:(\d+)h)?\s*(?:(\d+)(?:min|m))?$/;

/** Parses "2h 30min", "2h", "30min" or "45m". Returns null on anything else. */
export function parseCompact(value: string): Duration | null {
  const trimmed = value.trim();
  if (trimmed === "") return null;
  const match = COMPACT_PATTERN.exec(trimmed);
  if (!match) return null;
  const [, sign, hours, minutes] = match;
  if (hours === undefined && minutes === undefined) return null;
  const magnitude =
    Number(hours ?? 0) * MINUTES_PER_HOUR + Number(minutes ?? 0);
  return duration(sign ? -magnitude : magnitude);
}

const HHMM_PATTERN = /^(\d{1,2}):([0-5]\d)$/;

/** Parses a picker-representable "HH:mm". Rejects 24:00 and above. */
export function parseHHMM(value: string): Duration | null {
  const match = HHMM_PATTERN.exec(value.trim());
  if (!match) return null;
  const hours = Number(match[1]);
  if (hours > 23) return null;
  return fromHM(hours, Number(match[2]));
}
