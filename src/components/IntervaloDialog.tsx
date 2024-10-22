"use client";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  TextField,
} from "@mui/material";
import { TimePicker } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import { useState, useEffect } from "react";

const IntervaloDialog = (props: {
  showIntervaloDialog: boolean;
  setShowIntervaloDialog: (value: boolean) => void;
  setBreakDuration: (value: Dayjs | null) => void;
}) => {
  const [allValid, setAllValid] = useState<boolean>(false);
  const [duration, setDuration] = useState<Dayjs | null>(null);
  const [total, setTotal] = useState<Dayjs | null>(null);

  type entry = Dayjs | null;
  const [entries, setEntries] = useState<[entry, entry]>([
    null, // Início
    null, // Término
  ]);

  useEffect(() => {
    let validEntries = true;
    let total: Dayjs | null = null;

    setDuration(total);

    entries.forEach((entry) => {
      if (entry === null || !entry.isValid()) {
        validEntries = false;
        return;
      }
    });

    setAllValid(validEntries);
    if (validEntries) {
      total = dayjs(entries[1])
        .subtract(entries[0]!.hour(), "hour")
        .subtract(entries[0]!.minute(), "minute");
      setDuration(total);
    }
  }, [entries]);

  const closeModal = () => {
    setDuration(null);
    setEntries([null, null]);
    props.setShowIntervaloDialog(false);
  };

  return (
    <Dialog
      maxWidth={"sm"}
      open={props.showIntervaloDialog}
      onClose={() => closeModal()}
    >
      <DialogTitle>Cálculo de Duração</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Para calcular automaticamente a duração do intervalo, preencha os
          campos abaixo.
        </DialogContentText>
        <div className="mt-3 w-full grid grid-flow-row grid-cols-2 md:grid-cols-3 gap-3">
          <div>
            <p className="font-semibold">Início:</p>
            <TimePicker
              sx={{ width: "100%" }}
              ampm={false}
              value={entries[0]}
              onChange={(value) => {
                const updatedEntries: [entry, entry] = [...entries];
                updatedEntries[0] = value;
                setEntries(updatedEntries);
              }}
            />
          </div>
          <div>
            <p className="font-semibold">Fim:</p>
            <TimePicker
              sx={{ width: "100%" }}
              ampm={false}
              value={entries[1]}
              onChange={(value) => {
                const updatedEntries: [entry, entry] = [...entries];
                updatedEntries[1] = value;
                setEntries(updatedEntries);
              }}
            />
          </div>
          <div className="block md:hidden">
            <p>&nbsp;</p>
          </div>
          <div>
            <p className="font-semibold">Duração Calculada:</p>
            <TextField
              id="duracaoCalculada"
              disabled
              fullWidth
              variant="outlined"
              color="primary"
              value={
                duration?.isValid()
                  ? duration?.format("HH") + ":" + duration?.format("mm")
                  : "--:--"
              }
            />
          </div>
        </div>
        {!allValid && total === null && (
          <p className="mt-3 font-semibold text-red-600 text-center text-base">
            Aguardando o preenchimento correto de todos os campos.
          </p>
        )}
        {!allValid && total !== null && (
          <p className="mt-3 font-semibold text-blue-600 text-center text-base">
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
              onClick={() => {
                setTotal(null);
              }}
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
                setDuration(null);
                setEntries([null, null]);
                setTotal((prevState) => {
                  if (prevState?.isValid()) {
                    return prevState
                      ?.add(duration!.hour(), "hour")
                      .add(duration!.minute(), "minute");
                  } else {
                    return duration;
                  }
                });
              }}
            >
              Adicionar ao Total
            </Button>
          </div>
          <div className="block md:hidden">
            <p>&nbsp;</p>
          </div>
          <div>
            <p className="font-semibold">Total:</p>
            <TextField
              id="total"
              disabled
              fullWidth
              variant="outlined"
              color="primary"
              value={total === null ? "--:--" : total.format("HH:mm")}
            />
          </div>
        </div>
      </DialogContent>
      <Divider className="!mt-6 !mb-6" />
      <DialogActions>
        <Button variant="outlined" onClick={() => closeModal()}>
          Cancelar
        </Button>
        <Button
          variant="contained"
          disabled={total === null}
          onClick={() => {
            setTotal(null);
            setEntries([null, null]);
            setDuration(null);
            props.setBreakDuration(total);
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
