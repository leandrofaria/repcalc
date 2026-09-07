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
      <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-start">
        <div className="w-full rounded-[12px] border border-calc-edge bg-calc-face p-4 sm:max-w-[420px]">
          <CalcDisplay state={state} />
          <CalcKeypad state={state} dispatch={dispatch} />
        </div>
        <div className="w-full sm:flex-1">
          <CalcHistory
            entries={state.history}
            onClear={() => dispatch({ type: "clearHistory" })}
          />
        </div>
      </div>
    </ContentContainer>
  );
};

export default Calculadora;
