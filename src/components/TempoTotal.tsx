"use client";

import { Button, TextField } from "@mui/material";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { useMemo, useRef, useState } from "react";
import SectionTitle from "./ui/SectionTitle";
import ContentContainer from "./layout/ContentContainer";
import LeftAreaContainer from "./layout/LeftAreaContainer";
import RightAreaContainer from "./layout/RightAreaContainer";
import FeatureContainer from "./layout/FeatureContainer";
import {
  MAX_PAIRS,
  MIN_PAIRS,
  computePairs,
  emptyPair,
  type PunchPair,
} from "@/lib/tempoTotal/pairs";
import { formatHHMM } from "@/lib/time/duration";
import {
  dayjsToTimeOfDay,
  pickerReferenceDate,
  timeOfDayToDayjs,
} from "@/lib/time/dayjs";

const TempoTotal = () => {
  const [pairs, setPairs] = useState<PunchPair[]>([emptyPair("pair-0")]);
  // Ids are handed out on user action only, so the server and the first
  // client render always agree on the initial pair.
  const nextId = useRef(1);

  const { total, valid, invalidIndices } = useMemo(
    () => computePairs(pairs),
    [pairs]
  );

  const addNewPair = (): void => {
    setPairs((previous) => [
      ...previous,
      emptyPair(`pair-${nextId.current++}`),
    ]);
  };

  const removeLastPair = (): void => {
    setPairs((previous) => previous.slice(0, -1));
  };

  const updateEntry = (
    id: string,
    side: "in" | "out",
    value: ReturnType<typeof timeOfDayToDayjs>
  ): void => {
    setPairs((previous) =>
      previous.map((pair) =>
        pair.id === id ? { ...pair, [side]: dayjsToTimeOfDay(value) } : pair
      )
    );
  };

  return (
    <ContentContainer>
      <SectionTitle>Tempo Total de Trabalho</SectionTitle>
      <p className="text-justify mb-6">
        Para calcular o tempo total de trabalho entre pares de pontos, preencha
        os campos abaixo.
      </p>
      <FeatureContainer>
        <LeftAreaContainer>
          {pairs.map((pair, index) => {
            const invalid = invalidIndices.includes(index);
            return (
              <div
                key={pair.id}
                className="w-full grid grid-flow-row grid-cols-2 gap-6 mb-6"
              >
                <div>
                  <p className="font-semibold mb-1">
                    Marcação {2 * index + 1}:
                  </p>
                  <TimePicker
                    sx={{ width: "100%" }}
                    ampm={false}
                    referenceDate={pickerReferenceDate()}
                    value={timeOfDayToDayjs(pair.in)}
                    onChange={(value) => updateEntry(pair.id, "in", value)}
                  />
                </div>
                <div>
                  <p className="font-semibold mb-1">
                    Marcação {2 * index + 2}:
                  </p>
                  <TimePicker
                    sx={{ width: "100%" }}
                    ampm={false}
                    referenceDate={pickerReferenceDate()}
                    value={timeOfDayToDayjs(pair.out)}
                    onChange={(value) => updateEntry(pair.id, "out", value)}
                    slotProps={{ textField: { error: invalid } }}
                  />
                </div>
              </div>
            );
          })}
          {!valid && (
            <p className="mt-12 font-semibold text-red-600 text-center text-base">
              Aguardando o preenchimento correto de todos os campos.
            </p>
          )}
        </LeftAreaContainer>
        <RightAreaContainer>
          <div className="sm:hidden my-6 w-full border-b-[1px] border-b-[#E9E9E9]" />
          <h2 className="font-semibold mb-1">O total trabalhado foi:</h2>
          <TextField
            id="tempo-total-resultado"
            disabled
            fullWidth
            variant="outlined"
            color="primary"
            value={total !== null ? formatHHMM(total) : "--:--"}
          />
          <div className="w-full flex flex-row sm:flex-col justify-start items-center mt-6">
            <Button
              variant="contained"
              sx={{
                marginBottom: "12px",
                textTransform: "capitalize",
                fontWeight: 600,
              }}
              className="w-full my-3"
              disabled={pairs.length >= MAX_PAIRS}
              onClick={addNewPair}
            >
              Adicionar Novo Par
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
              disabled={pairs.length <= MIN_PAIRS}
              onClick={removeLastPair}
            >
              Excluir Último Par
            </Button>
          </div>
        </RightAreaContainer>
      </FeatureContainer>
    </ContentContainer>
  );
};

export default TempoTotal;
