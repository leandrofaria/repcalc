"use client";

import { FormControlLabel, Switch } from "@mui/material";
import { useMemo } from "react";
import { formatHHMM } from "@/lib/time/duration";
import type { Duration } from "@/lib/time/units";
import { formatClock } from "@/lib/time/timeOfDay";
import { useClock } from "@/lib/time/useClock";
import { clockOutFigures, type Clock } from "@/lib/jornada/schedule";
import {
  computeLiveStatus,
  liveFigures,
  type LiveInput,
  type ShiftPhase,
} from "@/lib/jornada/liveStatus";

/**
 * Says which day a clock reading falls on, in words.
 *
 * This used to render as "02:00 (+1)". A parenthesised number is a notation,
 * not a sentence, and nobody should have to learn one to read their own
 * clock-out time.
 */
export function dayNote(clock: Clock | null): string | null {
  if (clock === null || clock.dayOffset === 0) return null;
  return clock.dayOffset === 1
    ? "no dia seguinte"
    : `${clock.dayOffset} dias depois`;
}

export function formatClockOut(clock: Clock): string {
  return formatClock(clock.time);
}

const PHASE_LABEL: Record<ShiftPhase, string> = {
  notStarted: "Ainda não começou",
  breakCovers: "Intervalo cobre o período",
  working: "Em jornada",
  mayLeave: "Já pode sair",
  overtime: "Em excedente",
};

/** Only overtime leaves the accent hue, because only it is a warning. */
const PHASE_CLASS: Record<ShiftPhase, string> = {
  notStarted: "bg-ok-bg text-ink-muted",
  breakCovers: "bg-ok-bg text-ink-muted",
  working: "bg-ok-bg text-ok-text",
  mayLeave: "bg-ok-bg text-ok-text",
  overtime: "bg-danger-face text-danger-ink",
};

const PHASE_HINT: Partial<Record<ShiftPhase, string>> = {
  notStarted:
    "O horário informado ainda não chegou, então isto é o planejamento da jornada.",
  breakCovers:
    "Todo o tempo desde o início cabe dentro do intervalo. Se ainda não o tirou, desligue a opção abaixo.",
};

/**
 * Shared by both switches. The margin MUI puts on a label is what places its
 * track, so when one switch wraps beneath the other the two only line up if
 * this is literally the same object on both.
 */
const SWITCH_LABEL_SX = {
  marginLeft: 0,
  marginRight: 0,
  "& .MuiFormControlLabel-label": { fontSize: 14 },
};

/**
 * The answer, and the live figures that used to sit behind a button in a
 * modal.
 *
 * The clock subscription lives here, so it only exists while a complete
 * journey is on screen. Everything else is derived during render.
 */
const JornadaHero = ({
  complete,
  startMissing,
  clockOut,
  earlyClockOut,
  liveInput,
  tolerance,
  breakTaken,
  onBreakTakenChange,
  leaveWithTolerance,
  onLeaveWithToleranceChange,
}: {
  complete: boolean;
  /** True when the start time is the only thing still to fill in. */
  startMissing: boolean;
  clockOut: Clock | null;
  earlyClockOut: Clock | null;
  liveInput: LiveInput | null;
  tolerance: Duration | null;
  breakTaken: boolean;
  onBreakTakenChange: (value: boolean) => void;
  /**
   * Lead with the tolerance rather than the full journey: the clock-out time,
   * the countdown and the bar all measure against the journey minus it.
   */
  leaveWithTolerance: boolean;
  onLeaveWithToleranceChange: (value: boolean) => void;
}) => {
  const now = useClock();

  const status = useMemo(
    () =>
      liveInput === null || now === null
        ? null
        : computeLiveStatus(liveInput, now),
    [liveInput, now]
  );

  /**
   * Nothing to show yet.
   *
   * A giant "--:--" under "Você sai às" is a placeholder pretending to be an
   * answer. While the form is incomplete the card says what is missing, and
   * says nothing else.
   */
  // Narrowing all three here is what lets the rest of this component read
  // values that exist. computeJornada only reports complete when every field
  // is filled, so the card below can never be asked to render a blank.
  if (
    !complete ||
    clockOut === null ||
    earlyClockOut === null ||
    tolerance === null
  ) {
    return (
      <section
        aria-label="Resumo da jornada"
        className="flex min-h-[112px] w-full items-center justify-center rounded-[12px] border border-dashed border-field-edge bg-surface p-5 text-center"
      >
        <p
          aria-live="polite"
          className="rounded-full bg-ok-bg px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-ink-muted"
        >
          {startMissing
            ? "Informe o horário de início para ver sua saída"
            : "Complete os campos para ver seu horário de saída"}
        </p>
      </section>
    );
  }

  const phase = status?.phase ?? "notStarted";
  const clocks = clockOutFigures(clockOut, earlyClockOut, leaveWithTolerance);
  const figures =
    status === null || liveInput === null
      ? null
      : liveFigures(liveInput, status, leaveWithTolerance);
  const figure = figures?.second ?? null;
  const alternate = figures?.alternate ?? null;
  const breakDeducted = figures?.breakDeducted ?? null;
  const progress = figures?.progress ?? 0;
  // The day note describes whichever clock leads, since the two can fall
  // either side of midnight.
  const note = dayNote(clocks.headline);
  const hint = PHASE_HINT[phase];
  const worked = status?.worked ?? null;

  return (
    <section
      aria-label="Resumo da jornada"
      className="w-full overflow-hidden rounded-[12px] border border-result-edge bg-surface"
    >
      {/* The divider is its own element rather than a border on the second
          column, so it can be inset: a rule that runs edge to edge reads as
          a seam between two cards instead of a division inside one. Halves
          either side put it on the same centre line as the navigation and
          the fields below. */}
      <div className="flex flex-col items-stretch sm:flex-row">
        {/* The answer. */}
        <div className="p-5 sm:w-1/2 sm:p-6">
          <span
            className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider ${PHASE_CLASS[phase]}`}
          >
            {PHASE_LABEL[phase]}
          </span>

          <p className="mt-3 text-sm text-ink-muted">Você sai às</p>
          <output
            aria-live="polite"
            className="tabular block font-display text-6xl font-extrabold leading-none tracking-tight text-figure"
          >
            {formatClockOut(clocks.headline)}
          </output>
          {note !== null && (
            <p className="mt-1 text-sm font-semibold text-brand">{note}</p>
          )}

          <p className="tabular mt-2 text-sm text-ink-muted">
            ou <b className="text-figure">{formatClockOut(clocks.alternate)}</b>{" "}
            {clocks.alternateWithTolerance
              ? `com a tolerância de ${formatHHMM(tolerance)}`
              : "sem a tolerância"}
          </p>
        </div>

        {liveInput !== null && (
          <div
            aria-hidden
            className="mx-5 h-px shrink-0 bg-hairline sm:mx-0 sm:my-6 sm:h-auto sm:w-px"
          />
        )}

        {/* The live figures. */}
        {liveInput !== null && (
          <div className="flex flex-col gap-3 p-5 sm:w-1/2 sm:p-6">
            {worked !== null && (
              <>
                <div
                  className="h-[7px] w-full overflow-hidden rounded-full bg-hairline"
                  role="progressbar"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={Math.round(progress)}
                  aria-label={
                    leaveWithTolerance
                      ? "Progresso até a saída na tolerância"
                      : "Progresso da jornada"
                  }
                >
                  <div
                    className={`h-full rounded-full ${
                      phase === "overtime" ? "bg-warn" : "bg-brand"
                    }`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <dl className="tabular grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <dt className="text-ink-muted">Trabalhado</dt>
                    <dd className="font-display text-xl font-bold text-figure">
                      {formatHHMM(worked)}
                    </dd>
                    {/* What the figure counts, in the same small type as the
                        line under the countdown, so the columns read alike. */}
                    <dd className="text-xs text-ink-muted">
                      {breakDeducted === null
                        ? "tempo corrido"
                        : `${formatHHMM(breakDeducted)} de intervalo`}
                    </dd>
                  </div>
                  {figure !== null && (
                    <div>
                      <dt className="text-ink-muted">
                        {figure.kind === "overtime" ? "Excedente" : "Faltam"}
                      </dt>
                      <dd
                        className={`font-display text-xl font-bold ${
                          figure.kind === "overtime"
                            ? "text-warn"
                            : "text-figure"
                        }`}
                      >
                        {formatHHMM(figure.value)}
                      </dd>
                      {/* The other reading of the same wait, small, the way
                          the left half already gives the other clock-out. */}
                      {alternate !== null && (
                        <dd className="text-xs text-ink-muted">
                          {`${formatHHMM(alternate.value)} ${
                            alternate.withTolerance ? "com" : "sem"
                          } a tolerância`}
                        </dd>
                      )}
                    </div>
                  )}
                </dl>
              </>
            )}

            {hint !== undefined && (
              <p className="text-sm text-ink-muted">{hint}</p>
            )}

            {/* Side by side while both fit; when they do not, the second
                drops beneath the first, starting at the same left edge.
                flex-wrap decides by the width of the content, so there is
                no breakpoint to keep in step with the labels. */}
            <div className="mt-auto flex flex-wrap items-center gap-x-5 gap-y-1">
              <FormControlLabel
                control={
                  <Switch
                    checked={leaveWithTolerance}
                    onChange={(event) =>
                      onLeaveWithToleranceChange(event.target.checked)
                    }
                    size="small"
                  />
                }
                label="Sair na tolerância"
                sx={SWITCH_LABEL_SX}
              />
              {/* Without this the worked figure always assumed the break was
                  already off the clock, which is wrong for the first half of
                  any shift — and for a journey short enough not to need one. */}
              <FormControlLabel
                control={
                  <Switch
                    checked={breakTaken}
                    onChange={(event) =>
                      onBreakTakenChange(event.target.checked)
                    }
                    size="small"
                  />
                }
                label="Intervalo já tirado"
                sx={SWITCH_LABEL_SX}
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default JornadaHero;
