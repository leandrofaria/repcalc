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
import { useEffect, useMemo, useState } from "react";
import { formatHHMM } from "@/lib/time/duration";
import { nowTimeOfDay } from "@/lib/time/timeOfDay";
import type { TimeOfDay } from "@/lib/time/units";
import { computeLiveStatus, type LiveInput } from "@/lib/jornada/liveStatus";
import type { JornadaInput } from "@/lib/jornada/schedule";

const TICK_MS = 1000;

const TempoRealDialog = (props: {
  showTempoRealDialog: boolean;
  setShowTempoRealDialog: (value: boolean) => void;
  input: JornadaInput;
}) => {
  const { showTempoRealDialog, setShowTempoRealDialog, input } = props;
  const [includeBreak, setIncludeBreak] = useState(true);
  const [now, setNow] = useState<TimeOfDay | null>(null);

  // The interval only owns the clock. Everything derived from it is computed
  // during render, so the effect no longer depends on its own output — which
  // is what used to tear the interval down and rebuild it on every tick.
  useEffect(() => {
    if (!showTempoRealDialog) return;
    setNow(nowTimeOfDay());
    const timer = window.setInterval(() => setNow(nowTimeOfDay()), TICK_MS);
    return () => window.clearInterval(timer);
  }, [showTempoRealDialog]);

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

  const status = useMemo(
    () =>
      liveInput === null || now === null
        ? null
        : computeLiveStatus(liveInput, now),
    [liveInput, now]
  );

  const closeModal = () => {
    setNow(null);
    setIncludeBreak(true);
    setShowTempoRealDialog(false);
  };

  const show = (value: number | null | undefined) =>
    value === null || value === undefined ? "N/A" : formatHHMM(value as never);

  const rows: ReadonlyArray<[string, string]> =
    liveInput === null
      ? []
      : [
          ["Total a trabalhar", formatHHMM(liveInput.workday)],
          [
            "Total a trabalhar com tolerância",
            show(status?.targetWithTolerance),
          ],
          ["Tempo trabalhado", show(status?.worked)],
          ["Tempo excedente*", show(status?.overtime)],
          ["Tempo restante total", show(status?.remainingTotal)],
          [
            "Tempo restante com tolerância",
            show(status?.remainingWithTolerance),
          ],
        ];

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
        {status !== null && status.worked === null && (
          <div className="mb-6">
            <p className="text-justify text-red-600">
              De acordo com os valores informados, você ainda não trabalhou. O
              horário de início informado é posterior ao atual, ou se computado
              com intervalo, todo o horário corrido refere-se ao intervalo em
              si. É impossível exibir dados em tempo real.
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
              <dd className="text-blue-600 text-right font-semibold">
                {value}
              </dd>
            </div>
          ))}
        </dl>
        <p className="text-center text-sm mt-6 text-gray-600/75">
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
