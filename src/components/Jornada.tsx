"use client";

import { Button, TextField } from "@mui/material";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { useEffect, useMemo, useState } from "react";
import CalculateIcon from "@mui/icons-material/Calculate";
import IntervaloDialog from "@/components/IntervaloDialog";
import SectionTitle from "./ui/SectionTitle";
import ContentContainer from "./layout/ContentContainer";
import LeftAreaContainer from "./layout/LeftAreaContainer";
import RightAreaContainer from "./layout/RightAreaContainer";
import FeatureContainer from "./layout/FeatureContainer";
import TempoRealDialog from "./TempoRealDialog";
import type { Duration } from "@/lib/time/units";
import {
  dayjsToDuration,
  dayjsToTimeOfDay,
  durationToDayjs,
  pickerReferenceDate,
  timeOfDayToDayjs,
} from "@/lib/time/dayjs";
import { formatClock } from "@/lib/time/timeOfDay";
import {
  computeJornada,
  type Clock,
  type JornadaInput,
} from "@/lib/jornada/schedule";
import {
  JORNADA_DEFAULTS,
  clearStoredDefaults,
  readStoredDefaults,
  writeStoredDefaults,
} from "@/lib/jornada/defaults";

const CONFIRMATION_MS = 1500;

function formatResult(clock: Clock | null): string {
  if (clock === null) return "--:--";
  const suffix = clock.dayOffset > 0 ? ` (+${clock.dayOffset})` : "";
  return `${formatClock(clock.time)}${suffix}`;
}

const Jornada = () => {
  const [input, setInput] = useState<JornadaInput>({
    start: null,
    ...JORNADA_DEFAULTS,
  });

  // Saved defaults are loaded after mount, so the server render and the first
  // client render agree. Reading localStorage during render behind the
  // deprecated process.browser flag is what caused the hydration mismatch,
  // and the flag no longer exists in current Next.
  useEffect(() => {
    setInput((previous) => ({
      ...previous,
      ...readStoredDefaults(window.localStorage),
    }));
  }, []);

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

  const announce = (message: string) => {
    setConfirmation(message);
    window.setTimeout(() => setConfirmation(null), CONFIRMATION_MS);
  };

  const setBreakDuration = (breakTime: Duration | null) =>
    setInput((previous) => ({ ...previous, breakTime }));

  return (
    <>
      <IntervaloDialog
        showIntervaloDialog={showIntervaloDialog}
        setShowIntervaloDialog={setShowIntervaloDialog}
        setBreakDuration={setBreakDuration}
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
            <div className="w-full grid grid-flow-row grid-cols-2 gap-6 mb-6">
              <div>
                <p className="font-semibold mb-1">Horário de Início</p>
                <TimePicker
                  sx={{ width: "100%" }}
                  ampm={false}
                  referenceDate={pickerReferenceDate()}
                  value={timeOfDayToDayjs(input.start)}
                  onChange={(value) =>
                    setInput((previous) => ({
                      ...previous,
                      start: dayjsToTimeOfDay(value),
                    }))
                  }
                />
              </div>
              <div>
                <p className="font-semibold mb-1">Duração da Jornada</p>
                <TimePicker
                  sx={{ width: "100%" }}
                  ampm={false}
                  referenceDate={pickerReferenceDate()}
                  value={durationToDayjs(input.workday)}
                  onChange={(value) =>
                    setInput((previous) => ({
                      ...previous,
                      workday: dayjsToDuration(value),
                    }))
                  }
                />
              </div>
              <div>
                <p className="font-semibold mb-1">Duração do Intervalo</p>
                <div className="customInput flex flex-row justify-center items-center">
                  <Button
                    variant="contained"
                    disableElevation
                    size="medium"
                    aria-label="Calcular a duração do intervalo"
                    sx={{
                      padding: "6.6px",
                      borderRadius: "4px 0 0 4px",
                    }}
                    onClick={() => setShowIntervaloDialog(true)}
                  >
                    <CalculateIcon fontSize="large" />
                  </Button>
                  <TimePicker
                    sx={{ width: "100%" }}
                    ampm={false}
                    referenceDate={pickerReferenceDate()}
                    value={durationToDayjs(input.breakTime)}
                    onChange={(value) =>
                      setBreakDuration(dayjsToDuration(value))
                    }
                  />
                </div>
              </div>
              <div>
                <p className="font-semibold mb-1">Tolerância Permitida</p>
                <TimePicker
                  sx={{ width: "100%" }}
                  ampm={false}
                  referenceDate={pickerReferenceDate()}
                  value={durationToDayjs(input.tolerance)}
                  onChange={(value) =>
                    setInput((previous) => ({
                      ...previous,
                      tolerance: dayjsToDuration(value),
                    }))
                  }
                />
              </div>
            </div>
            {!complete && (
              <p className="mt-12 font-semibold text-red-600 text-center text-base">
                Aguardando o preenchimento correto de todos os campos.
              </p>
            )}
          </LeftAreaContainer>
          <RightAreaContainer>
            <div className="sm:hidden my-6 w-full border-b-[1px] border-b-[#E9E9E9]" />
            <h2 className="font-semibold mb-1">Término Previsto:</h2>
            <TextField
              id="jornada-termino-previsto"
              disabled
              fullWidth
              variant="outlined"
              color="primary"
              value={formatResult(clockOut)}
            />
            <h2 className="font-semibold mb-1 mt-6">Saída com Tolerância:</h2>
            <TextField
              id="jornada-saida-com-tolerancia"
              disabled
              fullWidth
              variant="outlined"
              color="primary"
              value={formatResult(earlyClockOut)}
            />
            <div className="w-full flex flex-col justify-start items-start mt-6">
              <Button
                variant="outlined"
                sx={{
                  marginBottom: "12px",
                  textTransform: "capitalize",
                  fontWeight: 600,
                }}
                className="w-full my-3"
                disabled={!complete}
                onClick={() => setShowTempoRealDialog(true)}
              >
                Painel em Tempo Real
              </Button>
            </div>
            <div className="w-full flex flex-row sm:flex-col justify-start items-center">
              <Button
                variant="contained"
                sx={{
                  marginBottom: "12px",
                  textTransform: "capitalize",
                  fontWeight: 600,
                }}
                className="w-full my-3"
                disabled={!settingsReady}
                onClick={() => {
                  writeStoredDefaults(window.localStorage, {
                    workday: input.workday!,
                    breakTime: input.breakTime!,
                    tolerance: input.tolerance!,
                  });
                  announce("Definições salvas com sucesso!");
                }}
              >
                Salvar Definições
              </Button>
              <div className="sm:hidden w-[21px]"></div>
              <Button
                variant="contained"
                sx={{
                  marginBottom: "12px",
                  textTransform: "capitalize",
                  fontWeight: 600,
                }}
                className="w-full my-3"
                color="error"
                onClick={() => {
                  clearStoredDefaults(window.localStorage);
                  setInput({ start: null, ...JORNADA_DEFAULTS });
                  announce("Definições resetadas com sucesso!");
                }}
              >
                Resetar Definições
              </Button>
              {confirmation !== null && (
                <p
                  className="pt-1 text-green-900 font-semibold"
                  role="status"
                  aria-live="polite"
                >
                  {confirmation}
                </p>
              )}
            </div>
          </RightAreaContainer>
        </FeatureContainer>
      </ContentContainer>
    </>
  );
};

export default Jornada;
