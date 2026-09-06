/**
 * Branded integer-minute types.
 *
 * The root cause of every time bug in this app was that an instant and a
 * duration were the same type, so `start.add(x.hour(), "hour")` type-checked.
 * Branding makes the two mutually incompatible, turning that mistake into a
 * compile error. The brands erase at runtime — these are plain numbers, and
 * the constructors below are the only runtime validation.
 */

/** A signed, unbounded amount of time, in whole minutes. */
export type Duration = number & { readonly __unit: "Duration" };

/** A point within a single day, in whole minutes since midnight (0..1439). */
export type TimeOfDay = number & { readonly __unit: "TimeOfDay" };

export const MINUTES_PER_HOUR = 60;
export const MINUTES_PER_DAY = 1440;

/** Builds a {@link Duration}. Throws on a non-integer. */
export function duration(minutes: number): Duration {
  if (!Number.isInteger(minutes)) {
    throw new RangeError(
      `Duration must be a whole number of minutes: ${minutes}`
    );
  }
  return minutes as Duration;
}

/** Builds a {@link TimeOfDay}. Throws outside 0..1439. */
export function timeOfDay(minutes: number): TimeOfDay {
  if (!Number.isInteger(minutes)) {
    throw new RangeError(
      `TimeOfDay must be a whole number of minutes: ${minutes}`
    );
  }
  if (minutes < 0 || minutes >= MINUTES_PER_DAY) {
    throw new RangeError(`TimeOfDay must be within a day: ${minutes}`);
  }
  return minutes as TimeOfDay;
}
