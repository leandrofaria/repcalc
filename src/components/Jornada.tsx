"use client";

import { useCallback, useMemo, useState } from "react";
import ContentContainer from "./layout/ContentContainer";
import JornadaForm from "./jornada/JornadaForm";
import JornadaHero from "./jornada/JornadaHero";
import JornadaSettings from "./jornada/JornadaSettings";
import IntervaloSection from "./jornada/IntervaloSection";
import PunchPaste from "./punches/PunchPaste";
import { breakCount, breaksBetween, stillClockedIn } from "@/lib/punches/parse";
import { formatClock } from "@/lib/time/timeOfDay";
import { computeJornada, type JornadaInput } from "@/lib/jornada/schedule";
import type { LiveInput } from "@/lib/jornada/liveStatus";
import { formatHHMM } from "@/lib/time/duration";
import {
  resetDefaults,
  saveDefaults,
  useStoredDefaults,
} from "@/lib/jornada/useStoredDefaults";

const CONFIRMATION_MS = 1500;

const Jornada = () => {
  // The saved defaults are a subscription, and what the user has typed is
  // held separately as overrides. Deriving the form from both means there is
  // no effect syncing storage into state, and no window where the server
  // render and the first client render can disagree.
  const stored = useStoredDefaults();
  const [edits, setEdits] = useState<Partial<JornadaInput>>({});

  const input: JornadaInput = useMemo(
    () => ({ start: null, ...stored, ...edits }),
    [stored, edits]
  );

  const [confirmation, setConfirmation] = useState<string | null>(null);
  // Whether the break is already off the clock. It only affects the live
  // figures, never the planned clock-out time, which always assumes the
  // break will be taken.
  const [breakTaken, setBreakTaken] = useState(true);

  const { complete, clockOut, earlyClockOut } = useMemo(
    () => computeJornada(input),
    [input]
  );

  // The live panel used to be a modal behind a button. It is now part of the
  // answer, so it needs the same inputs the schedule does.
  const liveInput: LiveInput | null = useMemo(() => {
    const { start, workday, breakTime, tolerance } = input;
    if (
      start === null ||
      workday === null ||
      breakTime === null ||
      tolerance === null
    ) {
      return null;
    }
    return { start, workday, breakTime, tolerance, breakTaken };
  }, [input, breakTaken]);

  const settingsReady =
    input.workday !== null &&
    input.breakTime !== null &&
    input.tolerance !== null;

  const patch = useCallback(
    (values: Partial<JornadaInput>) =>
      setEdits((previous) => ({ ...previous, ...values })),
    []
  );

  const announce = (message: string) => {
    setConfirmation(message);
    window.setTimeout(() => setConfirmation(null), CONFIRMATION_MS);
  };

  return (
    <ContentContainer>
      <h1 className="sr-only">Jornada de trabalho</h1>

      <JornadaHero
        complete={complete}
        startMissing={input.start === null && settingsReady}
        clockOut={clockOut}
        earlyClockOut={earlyClockOut}
        liveInput={liveInput}
        toleranceLabel={
          input.tolerance === null ? "--:--" : formatHHMM(input.tolerance)
        }
        breakTaken={breakTaken}
        onBreakTakenChange={setBreakTaken}
      />

      <JornadaForm input={input} onChange={patch} />

      <PunchPaste
        hint="A linha do sistema oficial. A última marcação é a saída que esta tela calcula, então normalmente são 1, 3 ou 5 marcações."
        describe={(times) => {
          const breaks = breakCount(times);
          const start = `Início ${formatClock(times[0])}`;
          const rest =
            breaks === 0
              ? ", sem intervalo registrado ainda"
              : `, intervalo de ${formatHHMM(breaksBetween(times))}`;
          const closed = stillClockedIn(times)
            ? ""
            : ". A última marcação é uma saída, então a jornada já foi encerrada.";
          return `${start}${rest}${closed}`;
        }}
        onApply={(times) => {
          // The first mark is the clock-in. The gaps between the marks are
          // the breaks already taken; with none yet, the saved default is
          // left alone, because the plan still assumes one will be taken.
          const taken = breakCount(times) > 0;
          patch({
            start: times[0],
            ...(taken ? { breakTime: breaksBetween(times) } : {}),
          });
          setBreakTaken(taken);
        }}
      />

      <IntervaloSection onApply={(breakTime) => patch({ breakTime })} />

      <JornadaSettings
        canSave={settingsReady}
        confirmation={confirmation}
        onSave={() => {
          saveDefaults({
            workday: input.workday!,
            breakTime: input.breakTime!,
            tolerance: input.tolerance!,
          });
          setEdits({});
          announce("Definições salvas.");
        }}
        onReset={() => {
          resetDefaults();
          setEdits({});
          announce("Definições resetadas.");
        }}
      />
    </ContentContainer>
  );
};

export default Jornada;
