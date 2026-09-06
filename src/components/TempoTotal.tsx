"use client";

import { Button } from "@mui/material";
import { useMemo, useRef, useState } from "react";
import type { Dayjs } from "dayjs";
import SectionTitle from "./ui/SectionTitle";
import ContentContainer from "./layout/ContentContainer";
import LeftAreaContainer from "./layout/LeftAreaContainer";
import RightAreaContainer from "./layout/RightAreaContainer";
import FeatureContainer from "./layout/FeatureContainer";
import TimeField from "./fields/TimeField";
import ResultReadout from "./ui/ResultReadout";
import {
  MAX_PAIRS,
  MIN_PAIRS,
  computePairs,
  emptyPair,
  type PunchPair,
} from "@/lib/tempoTotal/pairs";
import { formatHHMM } from "@/lib/time/duration";
import { dayjsToTimeOfDay, timeOfDayToDayjs } from "@/lib/time/dayjs";

const ACTION_SX = {
  marginBottom: "12px",
  textTransform: "capitalize",
  fontWeight: 600,
} as const;

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
    value: Dayjs | null
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
                <TimeField
                  label={`Marcação ${2 * index + 1}`}
                  value={timeOfDayToDayjs(pair.in)}
                  onChange={(value) => updateEntry(pair.id, "in", value)}
                />
                <TimeField
                  label={`Marcação ${2 * index + 2}`}
                  value={timeOfDayToDayjs(pair.out)}
                  onChange={(value) => updateEntry(pair.id, "out", value)}
                  error={invalid}
                  helperText={
                    invalid
                      ? "Deve ser posterior à marcação anterior."
                      : undefined
                  }
                />
              </div>
            );
          })}
          {!valid && (
            <p className="mt-12 font-semibold text-[color:var(--mui-palette-error-main)] text-center text-base">
              Aguardando o preenchimento correto de todos os campos.
            </p>
          )}
        </LeftAreaContainer>
        <RightAreaContainer>
          <div className="sm:hidden my-6 w-full border-b-[1px] border-b-hairline" />
          <ResultReadout
            label="O total trabalhado foi:"
            value={total !== null ? formatHHMM(total) : "--:--"}
          />
          <div className="w-full flex flex-row sm:flex-col justify-start items-center mt-6">
            <Button
              variant="contained"
              sx={ACTION_SX}
              className="w-full my-3"
              disabled={pairs.length >= MAX_PAIRS}
              onClick={addNewPair}
            >
              Adicionar Novo Par
            </Button>
            <div className="sm:hidden w-[21px]" />
            <Button
              variant="contained"
              color="error"
              sx={ACTION_SX}
              className="w-full my-3"
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
