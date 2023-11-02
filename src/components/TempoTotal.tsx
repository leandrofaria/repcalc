"use client";

import { Button, TextField } from "@mui/material";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import dayjs, { Dayjs } from "dayjs";
import { useState, useEffect } from "react";
import SectionTitle from "./ui/SectionTitle";
import ContentContainer from "./layout/ContentContainer";
import LeftAreaContainer from "./layout/LeftAreaContainer";
import RightAreaContainer from "./layout/RightAreaContainer";
import FeatureContainer from "./layout/FeatureContainer";

const TempoTotal = () => {
  const [allValid, setAllValid] = useState<boolean>(false);
  const [total, setTotal] = useState<Dayjs | null>(null);

  type pair = [Dayjs | null, Dayjs | null];
  const [pairs, setPairs] = useState<pair[]>([[null, null]]);

  const addNewPair = (): void => {
    setPairs([...pairs, [null, null]]);
  };

  const removeLastPair = (): void => {
    setPairs(pairs.slice(0, -1));
  };

  const updateEntry = (
    entryData: Dayjs | null,
    pairIndex: number,
    entryIndex: number
  ): void => {
    const updatedPairs = [...pairs];
    updatedPairs[pairIndex][entryIndex] = entryData;
    setPairs(updatedPairs);
  };

  useEffect(() => {
    let validEntries = true;
    let lastEntry = 0;
    let total: Dayjs | null = null;

    setTotal(total);

    pairs.forEach((pair) => {
      if (
        pair[0] === null ||
        pair[1] === null ||
        !pair[0].isValid() ||
        !pair[1].isValid() ||
        pair[0].unix() <= lastEntry ||
        pair[1].unix() <= lastEntry ||
        pair[1].unix() <= pair[0].unix()
      ) {
        validEntries = false;
        return;
      } else {
        lastEntry = pair[1].unix();
        const diff = dayjs(pair[1])
          .subtract(pair[0].hour(), "hour")
          .subtract(pair[0].minute(), "minute");
        total =
          total === null
            ? diff
            : total.add(diff.hour(), "hour").add(diff.minute(), "minute");
      }
    });

    setAllValid(validEntries);
    if (validEntries) setTotal(total);
  }, [pairs]);

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
            return (
              <div
                key={index}
                className="w-full grid grid-flow-row grid-cols-2 gap-6 mb-6"
              >
                <div>
                  <p className="font-semibold mb-1">
                    Marcação {index + (1 + index * 1)}:
                  </p>
                  <TimePicker
                    sx={{ width: "100%" }}
                    ampm={false}
                    value={pair[0]}
                    onChange={(value) => updateEntry(value, index, 0)}
                  />
                </div>
                <div>
                  <p className="font-semibold mb-1">
                    Marcação {index + (2 + index * 1)}:
                  </p>
                  <TimePicker
                    sx={{ width: "100%" }}
                    ampm={false}
                    value={pair[1]}
                    onChange={(value) => updateEntry(value, index, 1)}
                  />
                </div>
              </div>
            );
          })}
          {!allValid && (
            <p className="mt-12 font-semibold text-red-600 text-center text-base">
              Aguardando o preenchimento correto de todos os campos.
            </p>
          )}
        </LeftAreaContainer>
        <RightAreaContainer>
          <div className="sm:hidden my-6 w-full border-b-[1px] border-b-[#E9E9E9]" />
          <h2 className="font-semibold mb-1">O total trabalhado foi:</h2>
          <TextField
            id="outlined-basic"
            disabled
            fullWidth
            variant="outlined"
            color="primary"
            value={
              total?.isValid()
                ? total?.format("HH") + ":" + total?.format("mm")
                : "--:--"
            }
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
              disabled={pairs.length >= 6}
              onClick={() => {
                addNewPair();
              }}
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
              disabled={pairs.length <= 1}
              onClick={() => {
                removeLastPair();
              }}
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
