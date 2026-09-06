"use client";

import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Divider,
  DialogTitle,
  FormControlLabel,
} from "@mui/material";
import { useMemo, useState } from "react";
import { formatHHMM } from "@/lib/time/duration";
import { useClock } from "@/lib/time/useClock";
import { computeLiveStatus, type LiveInput } from "@/lib/jornada/liveStatus";
import type { JornadaInput } from "@/lib/jornada/schedule";

const show = (value: number | null | undefined) =>
  value === null || value === undefined ? "N/A" : formatHHMM(value as never);

/**
 * The live figures.
 *
 * Split out so the clock subscription only exists while the dialog is open:
 * MUI unmounts a closed dialog's content, which takes the subscription with
 * it. The panel itself holds no state and runs no effects.
 */
const LiveStatusPanel = ({ input }: { input: LiveInput }) => {
  const now = useClock();
  const status = useMemo(
    () => (now === null ? null : computeLiveStatus(input, now)),
    [input, now]
  );

  const rows: ReadonlyArray<[string, string]> = [
    ["Total a trabalhar", formatHHMM(input.workday)],
    ["Total a trabalhar com tolerância", show(status?.targetWithTolerance)],
    ["Tempo trabalhado", show(status?.worked)],
    ["Tempo excedente*", show(status?.overtime)],
    ["Tempo restante total", show(status?.remainingTotal)],
    ["Tempo restante com tolerância", show(status?.remainingWithTolerance)],
  ];

  return (
    <>
      {status !== null && status.worked === null && (
        <div className="mb-6">
          <p className="text-justify text-danger-ink">
            De acordo com os valores informados, você ainda não trabalhou. O
            horário de início informado é posterior ao atual, ou se computado
            com intervalo, todo o horário corrido refere-se ao intervalo em si.
            É impossível exibir dados em tempo real.
          </p>
        </div>
      )}
      <dl
        className="grid grid-cols-[1fr_auto] gap-x-6 gap-y-3"
        aria-live="polite"
      >
        {rows.map(([label, value]) => (
          <div key={label} className="contents">
            <dt>{label}:</dt>
            <dd className="text-brand text-right font-semibold">{value}</dd>
          </div>
        ))}
      </dl>
    </>
  );
};

const TempoRealDialog = ({
  showTempoRealDialog,
  setShowTempoRealDialog,
  input,
}: {
  showTempoRealDialog: boolean;
  setShowTempoRealDialog: (value: boolean) => void;
  input: JornadaInput;
}) => {
  const [includeBreak, setIncludeBreak] = useState(true);

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
    return { start, workday, breakTime, tolerance, includeBreak };
  }, [input, includeBreak]);

  const closeModal = () => {
    setIncludeBreak(true);
    setShowTempoRealDialog(false);
  };

  return (
    <Dialog
      maxWidth={"xs"}
      open={showTempoRealDialog}
      onClose={closeModal}
      aria-labelledby="tempo-real-titulo"
    >
      <DialogTitle id="tempo-real-titulo">
        Informações em Tempo Real
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          Acompanhe abaixo informações em tempo real sobre sua jornada de
          trabalho.
        </DialogContentText>
        <Divider className="!mt-3 !mb-3" />
        <div className="mb-6 text-center">
          <FormControlLabel
            control={
              <Checkbox
                checked={includeBreak}
                onChange={() => setIncludeBreak((previous) => !previous)}
              />
            }
            label="Calcular incluindo o intervalo"
          />
        </div>
        {liveInput !== null && <LiveStatusPanel input={liveInput} />}
        <p className="text-center text-sm mt-6 text-ink-muted">
          * O excedente só é computado após exceder o total mais a tolerância.
        </p>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={closeModal}>
          Fechar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TempoRealDialog;
