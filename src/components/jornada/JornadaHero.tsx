"use client";

import { FormControlLabel, Switch } from "@mui/material";
import { useMemo } from "react";
import { formatHHMM } from "@/lib/time/duration";
import { formatClock } from "@/lib/time/timeOfDay";
import { useClock } from "@/lib/time/useClock";
import type { Clock } from "@/lib/jornada/schedule";
import {
  computeLiveStatus,
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

export function formatClockOut(clock: Clock | null): string {
  return clock === null ? "--:--" : formatClock(clock.time);
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
  toleranceLabel,
  breakTaken,
  onBreakTakenChange,
}: {
  complete: boolean;
  /** True when the start time is the only thing still to fill in. */
  startMissing: boolean;
  clockOut: Clock | null;
  earlyClockOut: Clock | null;
  liveInput: LiveInput | null;
  toleranceLabel: string;
  breakTaken: boolean;
  onBreakTakenChange: (value: boolean) => void;
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
  if (!complete) {
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
  const note = dayNote(clockOut);
  const hint = PHASE_HINT[phase];
  const worked = status?.worked ?? null;
  const progress =
    worked === null || liveInput === null
      ? 0
      : Math.min(100, (worked / liveInput.workday) * 100);

  return (
    <section
      aria-label="Resumo da jornada"
      className="w-full overflow-hidden rounded-[12px] border border-result-edge bg-surface"
    >
      {/* items-stretch, and the divider on the second column, so the rule
          runs the full height of the card and lands on its centre line —
          the same centre the navigation and the fields below share. */}
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
            {formatClockOut(clockOut)}
          </output>
          {note !== null && (
            <p className="mt-1 text-sm font-semibold text-brand">{note}</p>
          )}

          <p className="tabular mt-2 text-sm text-ink-muted">
            ou <b className="text-figure">{formatClockOut(earlyClockOut)}</b>{" "}
            com a tolerância de {toleranceLabel}
          </p>
        </div>

        {/* The live figures. */}
        {liveInput !== null && (
          <div className="flex flex-col gap-3 border-t border-hairline p-5 sm:w-1/2 sm:border-l sm:border-t-0 sm:p-6">
            {worked !== null && (
              <>
                <div
                  className="h-[7px] w-full overflow-hidden rounded-full bg-hairline"
                  role="progressbar"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={Math.round(progress)}
                  aria-label="Progresso da jornada"
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
                  </div>
                  <div>
                    <dt className="text-ink-muted">
                      {status?.overtime !== null ? "Excedente" : "Faltam"}
                    </dt>
                    <dd
                      className={`font-display text-xl font-bold ${
                        status?.overtime !== null ? "text-warn" : "text-figure"
                      }`}
                    >
                      {status?.overtime !== null
                        ? formatHHMM(status!.overtime!)
                        : status?.remainingTotal !== null
                          ? formatHHMM(status!.remainingTotal!)
                          : "--:--"}
                    </dd>
                  </div>
                </dl>
              </>
            )}

            {hint !== undefined && (
              <p className="text-sm text-ink-muted">{hint}</p>
            )}

            {/* Without this the worked figure always assumed the break was
                already off the clock, which is wrong for the first half of
                any shift — and for a journey short enough not to need one. */}
            <FormControlLabel
              control={
                <Switch
                  checked={breakTaken}
                  onChange={(event) => onBreakTakenChange(event.target.checked)}
                  size="small"
                />
              }
              label="Intervalo já tirado"
              sx={{
                marginLeft: 0,
                marginRight: 0,
                marginTop: "auto",
                "& .MuiFormControlLabel-label": { fontSize: 14 },
              }}
            />
          </div>
        )}
      </div>
    </section>
  );
};

export default JornadaHero;
