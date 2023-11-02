"use client";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";
import { TimePicker } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import { useState, useEffect } from "react";

const IntervaloDialog = (props: {
  showModal: boolean;
  setShowModal: (value: boolean) => void;
  setBreakDuration: (value: Dayjs | null) => void;
}) => {
  const [allValid, setAllValid] = useState<boolean>(false);
  const [duration, setDuration] = useState<Dayjs | null>(null);

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
    props.setShowModal(false);
  };

  return (
    <Dialog maxWidth={"xs"} open={props.showModal} onClose={() => closeModal()}>
      <DialogTitle>Cálculo de Duração</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Para calcular automaticamente a duração do intervalo, preencha os
          campos abaixo.
        </DialogContentText>
        <div className="mt-3 w-full grid grid-flow-col grid-cols-2 gap-3">
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
        </div>
        {!allValid && (
          <p className="mt-3 font-semibold text-red-600 text-center text-base">
            Aguardando o preenchimento correto de todos os campos.
          </p>
        )}
        <div className="mt-3 w-full grid grid-flow-col grid-cols-2 gap-3">
          <div>
            <p className="font-semibold">Duração Calculada:</p>
            <TextField
              id="outlined-basic"
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
          <div></div>
        </div>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={() => closeModal()}>
          Cancelar
        </Button>
        <Button
          variant="contained"
          disabled={!allValid}
          onClick={() => {
            props.setBreakDuration(duration);
            closeModal();
          }}
        >
          Inserir Valor
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default IntervaloDialog;
