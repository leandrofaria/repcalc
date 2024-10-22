"use client";

import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  FormControlLabel,
  Grid,
} from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import { useEffect, useState } from "react";
import { clearInterval, setInterval, setTimeout } from "timers";

type entry = Dayjs | null;

const TempoRealDialog = (props: {
  showTempoRealDialog: boolean;
  setShowTempoRealDialog: (value: boolean) => void;
  entries: [entry, entry, entry, entry];
}) => {
  const closeModal = () => {
    props.setShowTempoRealDialog(false);
  };

  const [computarComIntervalo, setComputarComIntervalo] =
    useState<boolean>(true);

  const [tempoTrabalhado, setTempoTrabalhado] = useState<Dayjs | null>(null);
  const [tempoExcedente, setTempoExcedente] = useState<Dayjs | null>(null);
  const [tempoRestanteTotal, setTempoRestanteTotal] = useState<Dayjs | null>(
    null
  );
  const [tempoRestanteComTolerancia, setTempoRestanteComTolerancia] =
    useState<Dayjs | null>(null);

  useEffect(() => {
    if (!props.showTempoRealDialog) return;

    const timer = setInterval(() => {
      const tempoTrabalhado = computarComIntervalo
        ? dayjs()
            .subtract(props.entries[0]!.hour(), "hour")
            .subtract(props.entries[0]!.minute(), "minute")
            .subtract(props.entries[2]!.hour(), "hour")
            .subtract(props.entries[2]!.minute(), "minute")
        : dayjs()
            .subtract(props.entries[0]!.hour(), "hour")
            .subtract(props.entries[0]!.minute(), "minute");
      setTempoTrabalhado(tempoTrabalhado);

      if (tempoTrabalhado.isAfter(props.entries[1]!)) {
        let tempoExcedente: Dayjs | null = tempoTrabalhado
          .subtract(props.entries[1]!.hour(), "hour")
          .subtract(props.entries[1]!.minute(), "minute");
        if (
          dayjs(props.entries[3]!.set("second", 0))?.isAfter(
            dayjs(tempoExcedente.set("second", 0))
          )
        ) {
          tempoExcedente = null;
        }
        setTempoExcedente(tempoExcedente);
        setTempoRestanteTotal(null);
        setTempoRestanteComTolerancia(null);
      } else {
        setTempoExcedente(null);
        const tempoRestanteTotal = props.entries[1]!.subtract(
          tempoTrabalhado.hour(),
          "hour"
        ).subtract(tempoTrabalhado.minute(), "minute");
        setTempoRestanteTotal(tempoRestanteTotal);

        let tempoRestanteComTolerancia = null;
        if (
          tempoTrabalhado.isAfter(
            props.entries[1]
              ?.subtract(props.entries[3]!.hour(), "hour")
              .subtract(props.entries[3]!.minute(), "minute")
          )
        ) {
          tempoRestanteComTolerancia = null;
        } else {
          tempoRestanteComTolerancia = props.entries[1]!.subtract(
            tempoTrabalhado.hour(),
            "hour"
          )
            .subtract(tempoTrabalhado.minute(), "minute")
            .subtract(props.entries[3]!.hour(), "hour")
            .subtract(props.entries[3]!.minute(), "minute");
        }
        setTempoRestanteComTolerancia(tempoRestanteComTolerancia);
      }
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [
    props.entries,
    props.showTempoRealDialog,
    computarComIntervalo,
    tempoTrabalhado,
  ]);

  return (
    <Dialog
      maxWidth={"xs"}
      open={props.showTempoRealDialog}
      onClose={() => {
        setTempoTrabalhado(null);
        setTempoExcedente(null);
        setTempoRestanteTotal(null);
        setTempoRestanteComTolerancia(null);
        setComputarComIntervalo(true);
        closeModal();
      }}
    >
      <DialogTitle>Informações em Tempo Real</DialogTitle>
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
                checked={computarComIntervalo}
                onChange={() => {
                  setComputarComIntervalo((prevState) => !prevState);
                }}
              />
            }
            label="Já tirei o intervalo"
          ></FormControlLabel>
        </div>
        <Grid container spacing={3}>
          <Grid item xs={8}>
            <p>Total a trabalhar:&nbsp;</p>
          </Grid>
          <Grid item xs={4}>
            <p className="text-blue-600 text-right">
              {props.entries[1]!.format("HH:mm")}
            </p>
          </Grid>
          <Grid item xs={8}>
            <p>Total a trabalhar com tolerância:&nbsp;</p>
          </Grid>
          <Grid item xs={4}>
            <p className="text-blue-600 text-right">
              {props.entries[1]!.subtract(props.entries[3]!.hour(), "hour")
                .subtract(props.entries[3]!.minute(), "minute")
                .format("HH:mm")}
            </p>
          </Grid>
          <Grid item xs={8}>
            <p>Tempo trabalhado:&nbsp;</p>
          </Grid>
          <Grid item xs={4}>
            <p className="text-blue-600 text-right">
              {tempoTrabalhado?.format("HH:mm")}
            </p>
          </Grid>
          <Grid item xs={8}>
            <p>Tempo excedente*:&nbsp;</p>
          </Grid>
          <Grid item xs={4}>
            <p className="text-blue-600 text-right">
              {tempoExcedente !== null
                ? tempoExcedente?.format("HH:mm")
                : "N/A"}
            </p>
          </Grid>
          <Grid item xs={8}>
            <p>Tempo restante total:&nbsp;</p>
          </Grid>
          <Grid item xs={4}>
            <p className="text-blue-600 text-right">
              {tempoRestanteTotal !== null
                ? tempoRestanteTotal?.format("HH:mm")
                : "N/A"}
            </p>
          </Grid>
          <Grid item xs={8}>
            <p>Tempo restante com tolerância:&nbsp;</p>
          </Grid>
          <Grid item xs={4}>
            <p className="text-blue-600 text-right">
              {tempoRestanteComTolerancia !== null
                ? tempoRestanteComTolerancia?.format("HH:mm")
                : "N/A"}
            </p>
          </Grid>
        </Grid>
        <p className="text-center text-sm mt-6 text-gray-600/75">
          * O excedente só é computado após exceder o total mais a tolerância.
        </p>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={() => closeModal()}>
          Fechar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TempoRealDialog;
