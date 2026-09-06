"use client";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
} from "@mui/material";
import { useMemo, useState } from "react";
import TimeField from "./fields/TimeField";
import ResultReadout from "./ui/ResultReadout";
import type { Duration, TimeOfDay } from "@/lib/time/units";
import { ZERO, add, formatHHMM } from "@/lib/time/duration";
import { difference } from "@/lib/time/timeOfDay";
import { dayjsToTimeOfDay, timeOfDayToDayjs } from "@/lib/time/dayjs";

type Entries = { start: TimeOfDay | null; end: TimeOfDay | null };

const EMPTY: Entries = { start: null, end: null };

const IntervaloDialog = (props: {
  showIntervaloDialog: boolean;
  setShowIntervaloDialog: (value: boolean) => void;
  setBreakDuration: (value: Duration | null) => void;
}) => {
  const [entries, setEntries] = useState<Entries>(EMPTY);
  const [total, setTotal] = useState<Duration | null>(null);

  const { duration, outOfOrder, complete } = useMemo(() => {
    const { start, end } = entries;
    if (start === null || end === null) {
      return { duration: null, outOfOrder: false, complete: false };
    }
    // The previous version had no chronological check at all, so an end
    // before the start produced a wrapped value that was then written into
    // Jornada's break field.
    if (end <= start) {
      return { duration: null, outOfOrder: true, complete: true };
    }
    return {
      duration: difference(start, end),
      outOfOrder: false,
      complete: true,
    };
  }, [entries]);

  const reset = () => setEntries(EMPTY);

  const closeModal = () => {
    reset();
    props.setShowIntervaloDialog(false);
  };

  return (
    <Dialog
      maxWidth={"sm"}
      open={props.showIntervaloDialog}
      onClose={closeModal}
    >
      <DialogTitle>Cálculo de Duração</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Para calcular automaticamente a duração do intervalo, preencha os
          campos abaixo.
        </DialogContentText>
        <div className="mt-3 w-full grid grid-flow-row grid-cols-2 md:grid-cols-3 gap-3">
          <TimeField
            label="Início"
            value={timeOfDayToDayjs(entries.start)}
            onChange={(value) =>
              setEntries((previous) => ({
                ...previous,
                start: dayjsToTimeOfDay(value),
              }))
            }
          />
          <TimeField
            label="Fim"
            value={timeOfDayToDayjs(entries.end)}
            onChange={(value) =>
              setEntries((previous) => ({
                ...previous,
                end: dayjsToTimeOfDay(value),
              }))
            }
            error={outOfOrder}
          />
          <div className="block md:hidden" />
          <ResultReadout
            label="Duração Calculada:"
            value={duration === null ? "--:--" : formatHHMM(duration)}
          />
        </div>
        {outOfOrder && (
          <p className="mt-3 font-semibold text-danger-ink text-center text-base">
            O fim do intervalo precisa ser posterior ao início.
          </p>
        )}
        {!complete && total === null && (
          <p className="mt-3 font-semibold text-danger-ink text-center text-base">
            Aguardando o preenchimento correto de todos os campos.
          </p>
        )}
        {!complete && total !== null && (
          <p className="mt-3 font-semibold text-brand text-center text-base">
            Opcionalmente, preencha novamente para adicionar mais intervalos.
          </p>
        )}
        <div className="mt-3 w-full grid grid-flow-row grid-cols-2 md:grid-cols-3 gap-3">
          <div className="flex flex-col justify-end items-center">
            <p>&nbsp;</p>
            <Button
              fullWidth
              variant="outlined"
              className="h-full"
              disabled={total === null}
              onClick={() => setTotal(null)}
            >
              Resetar o Total
            </Button>
          </div>
          <div className="flex flex-col justify-end items-center">
            <p>&nbsp;</p>
            <Button
              fullWidth
              variant="contained"
              className="h-full"
              disabled={duration === null}
              onClick={() => {
                setTotal((previous) => add(previous ?? ZERO, duration!));
                reset();
              }}
            >
              Adicionar ao Total
            </Button>
          </div>
          <div className="block md:hidden" />
          <ResultReadout
            label="Total:"
            value={total === null ? "--:--" : formatHHMM(total)}
          />
        </div>
      </DialogContent>
      <Divider className="!mt-6 !mb-6" />
      <DialogActions>
        <Button variant="outlined" onClick={closeModal}>
          Cancelar
        </Button>
        <Button
          variant="contained"
          disabled={total === null}
          onClick={() => {
            props.setBreakDuration(total);
            setTotal(null);
            closeModal();
          }}
        >
          Inserir Valor Total
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default IntervaloDialog;
