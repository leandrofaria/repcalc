"use client";

import { Button, TextField } from "@mui/material";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import dayjs, { Dayjs } from "dayjs";
import { useState, useEffect } from "react";
import CalculateIcon from "@mui/icons-material/Calculate";
import IntervaloDialog from "@/components/IntervaloDialog";
import SectionTitle from "./ui/SectionTitle";
import ContentContainer from "./layout/ContentContainer";
import LeftAreaContainer from "./layout/LeftAreaContainer";
import RightAreaContainer from "./layout/RightAreaContainer";
import FeatureContainer from "./layout/FeatureContainer";
import TempoRealDialog from "./ui/TempoRealDialog";

const Jornada = () => {
  const [allValid, setAllValid] = useState<boolean>(false);
  const [clockOut, setClockOut] = useState<Dayjs | null>(null);
  const [earlyClockOut, setEarlyClockOut] = useState<Dayjs | null>(null);

  const [showIntervaloDialog, setShowIntervaloDialog] = useState(false);
  const [showTempoRealDialog, setShowTempoRealDialog] = useState(false);
  const [showSalvoComSucesso, setShowSalvoComSucesso] = useState(false);
  const [showResetadoComSucesso, setShowResetadoComSucesso] = useState(false);

  type entry = Dayjs | null;

  let defaultJornada = "05:45";
  let defaultIntervalo = "00:15";
  let defaultTolerancia = "00:10";

  if (process.browser && window.localStorage) {
    defaultJornada = window.localStorage.getItem("defaultJornada") || "05:45";
    defaultIntervalo =
      window.localStorage.getItem("defaultIntervalo") || "00:15";
    defaultTolerancia =
      window.localStorage.getItem("defaultTolerancia") || "00:10";
  }

  const [entries, setEntries] = useState<[entry, entry, entry, entry]>([
    null, // Horário de início
    dayjs()
      .hour(Number(defaultJornada.split(":")[0]))
      .minute(Number(defaultJornada.split(":")[1])), // Duração da Jornada
    dayjs()
      .hour(Number(defaultIntervalo.split(":")[0]))
      .minute(Number(defaultIntervalo.split(":")[1])), // Duração do Intervalo
    dayjs()
      .hour(Number(defaultTolerancia.split(":")[0]))
      .minute(Number(defaultTolerancia.split(":")[1])), // Tolerância Permitida
  ]);

  useEffect(() => {
    let validEntries = true;
    let total: Dayjs | null = null;
    let totalMinusTolerance: Dayjs | null = null;

    setClockOut(total);
    setEarlyClockOut(totalMinusTolerance);

    entries.forEach((entry, index) => {
      if (entry === null || !entry.isValid()) {
        validEntries = false;
        return;
      } else {
        if (index !== 3) {
          total =
            total === null
              ? entry
              : total.add(entry.hour(), "hour").add(entry.minute(), "minute");
        } else {
          totalMinusTolerance =
            total === null
              ? null
              : total
                  .subtract(entries[3]!.hour(), "hour")
                  .subtract(entries[3]!.minute(), "minute");
        }
      }
    });

    setAllValid(validEntries);
    if (validEntries) {
      setClockOut(total);
      setEarlyClockOut(totalMinusTolerance);
    }
  }, [entries]);

  const handleClickOpen = () => {
    setShowIntervaloDialog(true);
  };

  const setBreakDuration = (duration: Dayjs | null) => {
    const updatedEntries: [entry, entry, entry, entry] = [...entries];
    updatedEntries[2] = duration;
    setEntries(updatedEntries);
  };

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
        entries={entries}
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
                  value={entries[0]}
                  onChange={(value) => {
                    const updatedEntries: [entry, entry, entry, entry] = [
                      ...entries,
                    ];
                    updatedEntries[0] = value;
                    setEntries(updatedEntries);
                  }}
                />
              </div>
              <div>
                <p className="font-semibold mb-1">Duração da Jornada</p>
                <TimePicker
                  sx={{ width: "100%" }}
                  ampm={false}
                  value={entries[1]}
                  onChange={(value) => {
                    const updatedEntries: [entry, entry, entry, entry] = [
                      ...entries,
                    ];
                    updatedEntries[1] = value;
                    setEntries(updatedEntries);
                  }}
                />
              </div>
              <div>
                <p className="font-semibold mb-1">Duração do Intervalo</p>
                <div className="customInput flex flex-row justify-center items-center">
                  <Button
                    variant="contained"
                    disableElevation
                    size="medium"
                    sx={{
                      padding: "6.6px",
                      borderRadius: "4px 0 0 4px",
                    }}
                    onClick={handleClickOpen}
                  >
                    <CalculateIcon fontSize="large" />
                  </Button>
                  <TimePicker
                    sx={{ width: "100%" }}
                    ampm={false}
                    value={entries[2]}
                    onChange={(value) => {
                      const updatedEntries: [entry, entry, entry, entry] = [
                        ...entries,
                      ];
                      updatedEntries[2] = value;
                      setEntries(updatedEntries);
                    }}
                  />
                </div>
              </div>
              <div>
                <p className="font-semibold mb-1">Tolerância Permitida</p>
                <TimePicker
                  sx={{ width: "100%" }}
                  ampm={false}
                  value={entries[3]}
                  onChange={(value) => {
                    const updatedEntries: [entry, entry, entry, entry] = [
                      ...entries,
                    ];
                    updatedEntries[3] = value;
                    setEntries(updatedEntries);
                  }}
                />
              </div>
            </div>
            {!allValid && (
              <p className="mt-12 font-semibold text-red-600 text-center text-base">
                Aguardando o preenchimento correto de todos os campos.
              </p>
            )}
          </LeftAreaContainer>
          <RightAreaContainer>
            <div className="sm:hidden my-6 w-full border-b-[1px] border-b-[#E9E9E9]" />
            <h2 className="font-semibold mb-1">Término Previsto:</h2>
            <TextField
              id="outlined-basic"
              disabled
              fullWidth
              variant="outlined"
              color="primary"
              value={
                clockOut?.isValid()
                  ? clockOut?.format("HH") + ":" + clockOut?.format("mm")
                  : "--:--"
              }
            />
            <h2 className="font-semibold mb-1 mt-6">Saída com Tolerância:</h2>
            <TextField
              id="outlined-basic"
              disabled
              fullWidth
              variant="outlined"
              color="primary"
              value={
                earlyClockOut?.isValid()
                  ? earlyClockOut?.format("HH") +
                    ":" +
                    earlyClockOut?.format("mm")
                  : "--:--"
              }
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
                disabled={
                  !entries[0]?.isValid() ||
                  !entries[1]?.isValid() ||
                  !entries[2]?.isValid() ||
                  !entries[3]?.isValid()
                }
                onClick={() => {
                  setShowTempoRealDialog(true);
                }}
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
                disabled={
                  !entries[1]?.isValid() ||
                  !entries[2]?.isValid() ||
                  !entries[3]?.isValid()
                }
                onClick={() => {
                  window.localStorage.setItem(
                    "defaultJornada",
                    entries[1]!.format("HH:mm")
                  );
                  window.localStorage.setItem(
                    "defaultIntervalo",
                    entries[2]!.format("HH:mm")
                  );
                  window.localStorage.setItem(
                    "defaultTolerancia",
                    entries[3]!.format("HH:mm")
                  );
                  setShowSalvoComSucesso(true);
                  setTimeout(() => {
                    setShowSalvoComSucesso(false);
                  }, 1500);
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
                disabled={false}
                onClick={() => {
                  window.localStorage.removeItem("defaultJornada");
                  window.localStorage.removeItem("defaultIntervalo");
                  window.localStorage.removeItem("defaultTolerancia");
                  setEntries([
                    null,
                    dayjs().hour(5).minute(45),
                    dayjs().hour(0).minute(15),
                    dayjs().hour(0).minute(10),
                  ]);
                  setShowResetadoComSucesso(true);
                  setTimeout(() => {
                    setShowResetadoComSucesso(false);
                  }, 1500);
                }}
              >
                Resetar Definições
              </Button>
              {showSalvoComSucesso && (
                <p className="pt-1 text-green-900 font-semibold">
                  Definições salvas com sucesso!
                </p>
              )}
              {showResetadoComSucesso && (
                <p className="pt-1 text-green-900 font-semibold">
                  Definições resetadas com sucesso!
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
