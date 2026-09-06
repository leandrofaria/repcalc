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
          <div className="calculadora w-full bg-calc-face border-[1px] border-calc-edge shadow-[0_0_3px_3px_rgba(0,0,0,0.06)] p-[15px]">
            <CalcDisplay state={state} />
            <CalcKeypad state={state} dispatch={dispatch} />
          </div>
        </LeftAreaContainer>
        <RightAreaContainer>
          <div className="sm:hidden my-6 w-full border-b-[1px] border-b-hairline" />
          <CalcHistory entries={state.history} />
        </RightAreaContainer>
      </FeatureContainer>
    </ContentContainer>
  );
};

export default Calculadora;
