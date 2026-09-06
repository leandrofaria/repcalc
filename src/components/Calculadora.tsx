"use client";

import { useReducer } from "react";
import ContentContainer from "./layout/ContentContainer";
import CalcDisplay from "./calculadora/CalcDisplay";
import CalcKeypad from "./calculadora/CalcKeypad";
import CalcHistory from "./calculadora/CalcHistory";
import { useCalcKeyboard } from "./calculadora/useCalcKeyboard";
import { initialState, reduce } from "@/lib/calc/expression";

const Calculadora = () => {
  const [state, dispatch] = useReducer(reduce, undefined, initialState);
  useCalcKeyboard(state, dispatch);

  return (
    <ContentContainer>
      <h1 className="sr-only">Calculadora de horas</h1>
      <div className="w-full rounded-[12px] border border-calc-edge bg-calc-face p-4">
        <CalcDisplay state={state} />
        <CalcKeypad state={state} dispatch={dispatch} />
      </div>
      <CalcHistory entries={state.history} />
    </ContentContainer>
  );
};

export default Calculadora;
