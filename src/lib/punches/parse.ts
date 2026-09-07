import { type Duration, type TimeOfDay, timeOfDay } from "../time/units";
import * as D from "../time/duration";
import { elapsedForward } from "../time/timeOfDay";

/** The official time clock allows twelve marks in a day, and reports them all. */
export const MAX_PUNCHES = 12;

export type PunchParse = {
  times: readonly TimeOfDay[];
  /** Tokens that could not be read as a time, kept so the user can be told. */
  rejected: readonly string[];
  /** More marks than the clock itself allows: the extra ones are dropped. */
  truncated: boolean;
};

const SEPARATORS = /[\s,;]+/;
// "08:00", "8:00" and "0800" all appear depending on where the line is copied
// from, so all three are read.
const TIME = /^(\d{1,2}):?([0-5]\d)$/;

function readTime(token: string): TimeOfDay | null {
  const match = TIME.exec(token);
  if (match === null) return null;
  const hours = Number(match[1]);
  if (hours > 23) return null;
  return timeOfDay(hours * 60 + Number(match[2]));
}

/**
 * Reads a line of punch marks as reported by the bank's time clock, such as
 * "08:00 09:00 09:10".
 *
 * Anything that is not a time is kept aside rather than silently dropped: a
 * line pasted from the wrong place should say so, not quietly produce a
 * shorter day.
 */
export function parsePunches(text: string): PunchParse {
  const tokens = text.trim().split(SEPARATORS).filter(Boolean);
  const times: TimeOfDay[] = [];
  const rejected: string[] = [];

  for (const token of tokens) {
    const time = readTime(token);
    if (time === null) rejected.push(token);
    else times.push(time);
  }

  return {
    times: times.slice(0, MAX_PUNCHES),
    rejected,
    truncated: times.length > MAX_PUNCHES,
  };
}

/**
 * The gaps between marks: every clock-out paired with the clock-in after it.
 *
 * These are the breaks. A trailing mark with nothing after it is the state
 * the person is in right now, not a gap.
 */
export function breaksBetween(times: readonly TimeOfDay[]): Duration {
  let total: Duration = D.ZERO;
  for (let index = 1; index + 1 < times.length; index += 2) {
    total = D.add(total, elapsedForward(times[index], times[index + 1]));
  }
  return total;
}

/** How many gaps the marks describe, which is what makes a break "taken". */
export function breakCount(times: readonly TimeOfDay[]): number {
  return Math.max(0, Math.floor((times.length - 1) / 2));
}

/**
 * Whether the last mark was a clock-in.
 *
 * An odd count means the person is still on the clock, which is the state the
 * Jornada screen is built around: it exists to predict the mark that has not
 * happened yet. An even count means they have already clocked out.
 */
export function stillClockedIn(times: readonly TimeOfDay[]): boolean {
  return times.length % 2 === 1;
}
