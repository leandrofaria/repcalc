"use client";

import { useReducer } from "react";
import ContentContainer from "./layout/ContentContainer";
import FeatureContainer from "./layout/FeatureContainer";
import LeftAreaContainer from "./layout/LeftAreaContainer";
import RightAreaContainer from "./layout/RightAreaContainer";
import SectionTitle from "./ui/SectionTitle";
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
      <SectionTitle>Calculadora</SectionTitle>
      <FeatureContainer>
        <LeftAreaContainer>
          <div className="w-full rounded-[12px] border border-calc-edge bg-calc-face p-4">
            <CalcDisplay state={state} />
            <CalcKeypad state={state} dispatch={dispatch} />
          </div>
        </LeftAreaContainer>
        <RightAreaContainer>
          <div className="my-5 w-full border-b border-hairline sm:hidden" />
          <CalcHistory entries={state.history} />
        </RightAreaContainer>
      </FeatureContainer>
    </ContentContainer>
  );
};

export default Calculadora;
