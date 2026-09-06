"use client";

import { useCallback, useMemo, useState } from "react";
import IntervaloDialog from "@/components/IntervaloDialog";
import SectionTitle from "./ui/SectionTitle";
import ContentContainer from "./layout/ContentContainer";
import LeftAreaContainer from "./layout/LeftAreaContainer";
import RightAreaContainer from "./layout/RightAreaContainer";
import FeatureContainer from "./layout/FeatureContainer";
import TempoRealDialog from "./TempoRealDialog";
import JornadaForm from "./jornada/JornadaForm";
import JornadaResults from "./jornada/JornadaResults";
import JornadaSettings from "./jornada/JornadaSettings";
import { computeJornada, type JornadaInput } from "@/lib/jornada/schedule";
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

  const [showIntervaloDialog, setShowIntervaloDialog] = useState(false);
  const [showTempoRealDialog, setShowTempoRealDialog] = useState(false);
  const [confirmation, setConfirmation] = useState<string | null>(null);

  const { complete, clockOut, earlyClockOut } = useMemo(
    () => computeJornada(input),
    [input]
  );

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
    <>
      <IntervaloDialog
        showIntervaloDialog={showIntervaloDialog}
        setShowIntervaloDialog={setShowIntervaloDialog}
        setBreakDuration={(breakTime) => patch({ breakTime })}
      />

      <TempoRealDialog
        showTempoRealDialog={showTempoRealDialog}
        setShowTempoRealDialog={setShowTempoRealDialog}
        input={input}
      />

      <ContentContainer>
        <SectionTitle>Jornada de Trabalho</SectionTitle>
        <p className="text-justify mb-6">
          Para planejamento da sua jornada de trabalho preencha os campos
          abaixo.
        </p>
        <FeatureContainer>
          <LeftAreaContainer>
            <JornadaForm
              input={input}
              onChange={patch}
              onOpenBreakCalculator={() => setShowIntervaloDialog(true)}
            />
            {!complete && (
              <p className="mt-12 font-semibold text-red-600 text-center text-base">
                Aguardando o preenchimento correto de todos os campos.
              </p>
            )}
          </LeftAreaContainer>
          <RightAreaContainer>
            <div className="sm:hidden my-6 w-full border-b-[1px] border-b-[#E9E9E9]" />
            <JornadaResults
              clockOut={clockOut}
              earlyClockOut={earlyClockOut}
              canOpenLivePanel={complete}
              onOpenLivePanel={() => setShowTempoRealDialog(true)}
            />
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
                announce("Definições salvas com sucesso!");
              }}
              onReset={() => {
                resetDefaults();
                setEdits({});
                announce("Definições resetadas com sucesso!");
              }}
            />
          </RightAreaContainer>
        </FeatureContainer>
      </ContentContainer>
    </>
  );
};

export default Jornada;
