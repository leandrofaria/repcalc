import { duration, type Duration, type TimeOfDay } from "../time/units";
import * as D from "../time/duration";
import { addDuration } from "../time/timeOfDay";

export type JornadaInput = {
  start: TimeOfDay | null;
  workday: Duration | null;
  breakTime: Duration | null;
  tolerance: Duration | null;
};

/** A clock time plus how many days past the start date it falls on. */
export type Clock = { time: TimeOfDay; dayOffset: number };

export type JornadaResult = {
  complete: boolean;
  clockOut: Clock | null;
  earlyClockOut: Clock | null;
};

const INCOMPLETE: JornadaResult = {
  complete: false,
  clockOut: null,
  earlyClockOut: null,
};

/**
 * Término previsto = início + jornada + intervalo.
 * Saída com tolerância = término − tolerância.
 *
 * A shift starting at 20:00 legitimately ends at 02:00, so the wrap is
 * wanted — but the dayOffset now says which day that is, which the previous
 * Dayjs arithmetic silently discarded.
 */
export function computeJornada(input: JornadaInput): JornadaResult {
  const { start, workday, breakTime, tolerance } = input;
  if (
    start === null ||
    workday === null ||
    breakTime === null ||
    tolerance === null
  ) {
    return INCOMPLETE;
  }

  const clockOut = addDuration(start, D.add(workday, breakTime));
  const early = addDuration(clockOut.time, duration(-tolerance));

  return {
    complete: true,
    clockOut,
    earlyClockOut: {
      time: early.time,
      dayOffset: clockOut.dayOffset + early.dayOffset,
    },
  };
}
