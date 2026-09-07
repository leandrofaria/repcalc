import {
  MINUTES_PER_DAY,
  MINUTES_PER_HOUR,
  type Duration,
  type TimeOfDay,
  duration,
  timeOfDay,
} from "./units";

function pad2(value: number): string {
  return String(value).padStart(2, "0");
}

export function fromHM(hours: number, minutes: number): TimeOfDay {
  return timeOfDay(hours * MINUTES_PER_HOUR + minutes);
}

export function nowTimeOfDay(now: Date = new Date()): TimeOfDay {
  return fromHM(now.getHours(), now.getMinutes());
}

/**
 * Adds a duration to a clock time, reporting how many days it crossed.
 *
 * The dayOffset is what makes Jornada honest: a shift starting at 20:00 ends
 * at 02:00 the next day, and the UI can say so instead of silently showing a
 * time that looks like it is in the past.
 */
export function addDuration(
  t: TimeOfDay,
  d: Duration
): { time: TimeOfDay; dayOffset: number } {
  const total = t + d;
  const dayOffset = Math.floor(total / MINUTES_PER_DAY);
  return {
    time: timeOfDay(total - dayOffset * MINUTES_PER_DAY),
    dayOffset,
  };
}

/**
 * Signed difference between two clock times, deliberately without wrapping.
 *
 * A negative result is meaningful: it is how the live panel detects that the
 * informed start time is still in the future.
 */
export function difference(from: TimeOfDay, to: TimeOfDay): Duration {
  return duration(to - from);
}

/**
 * Time from one clock reading forward to the next, wrapping past midnight.
 *
 * Always 0..1439: reading 23:00 then 00:30 means an hour and a half has
 * passed, not minus twenty-two hours. A punch sequence is chronological by
 * construction, so a clock that appears to go backwards means the day turned.
 */
export function elapsedForward(from: TimeOfDay, to: TimeOfDay): Duration {
  return duration((to - from + MINUTES_PER_DAY) % MINUTES_PER_DAY);
}

export function compare(a: TimeOfDay, b: TimeOfDay): number {
  return a - b;
}

export function formatClock(t: TimeOfDay): string {
  return `${pad2(Math.trunc(t / MINUTES_PER_HOUR))}:${pad2(t % MINUTES_PER_HOUR)}`;
}
