"use client";

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

/** A "(+1)" suffix says the shift ends on the following day. */
export function formatClockOut(clock: Clock | null): string {
  if (clock === null) return "--:--";
  const suffix = clock.dayOffset > 0 ? ` (+${clock.dayOffset})` : "";
  return `${formatClock(clock.time)}${suffix}`;
}

const PHASE_LABEL: Record<ShiftPhase, string> = {
  before: "Fora da jornada",
  working: "Em jornada",
  mayLeave: "Já pode sair",
  overtime: "Em excedente",
};

/** Only the overtime pill leaves the accent hue, because only it is a warning. */
const PHASE_CLASS: Record<ShiftPhase, string> = {
  before: "bg-ok-bg text-ink-muted",
  working: "bg-ok-bg text-ok-text",
  mayLeave: "bg-ok-bg text-ok-text",
  overtime: "bg-danger-face text-danger-ink",
};

/**
 * The answer, and the live panel that used to be a modal.
 *
 * The clock subscription lives here, so it only exists while a complete
 * journey is on screen. Everything below is derived during render.
 */
const LiveBody = ({ input }: { input: LiveInput }) => {
  const now = useClock();
  const status = useMemo(
    () => (now === null ? null : computeLiveStatus(input, now)),
    [input, now]
  );

  if (status === null || status.worked === null) return null;

  const progress = Math.min(100, (status.worked / input.workday) * 100);

  return (
    <div className="mt-4 flex flex-col gap-2">
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
            status.phase === "overtime" ? "bg-warn" : "bg-brand"
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="tabular flex justify-between text-sm text-ink-muted">
        <span>
          Trabalhado <b className="text-figure">{formatHHMM(status.worked)}</b>
        </span>
        <span>
          {status.overtime !== null ? (
            <>
              Excedente{" "}
              <b className="text-warn">{formatHHMM(status.overtime)}</b>
            </>
          ) : status.remainingTotal !== null ? (
            <>
              Faltam{" "}
              <b className="text-figure">{formatHHMM(status.remainingTotal)}</b>
            </>
          ) : null}
        </span>
      </p>
    </div>
  );
};

const JornadaHero = ({
  complete,
  clockOut,
  earlyClockOut,
  liveInput,
  toleranceLabel,
}: {
  complete: boolean;
  clockOut: Clock | null;
  earlyClockOut: Clock | null;
  liveInput: LiveInput | null;
  toleranceLabel: string;
}) => {
  const now = useClock();
  const phase: ShiftPhase =
    liveInput === null || now === null
      ? "before"
      : computeLiveStatus(liveInput, now).phase;

  return (
    <section
      aria-label="Resumo da jornada"
      className="w-full rounded-[12px] border border-result-edge bg-surface p-5"
    >
      <span
        className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider ${PHASE_CLASS[phase]}`}
      >
        {complete ? PHASE_LABEL[phase] : "Informe o horário de início"}
      </span>

      <p className="mt-3 text-sm text-ink-muted">Você sai às</p>
      <output
        aria-live="polite"
        className="tabular block font-display text-5xl font-extrabold leading-none tracking-tight text-figure"
      >
        {formatClockOut(clockOut)}
      </output>

      {complete && (
        <p className="tabular mt-2 text-sm text-ink-muted">
          ou <b className="text-figure">{formatClockOut(earlyClockOut)}</b> com
          a tolerância de {toleranceLabel}
        </p>
      )}

      {liveInput !== null && <LiveBody input={liveInput} />}
    </section>
  );
};

export default JornadaHero;
