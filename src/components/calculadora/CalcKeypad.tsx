"use client";

import CalcKey from "./CalcKey";
import { NUMERIC_KEYS, OPERATOR_KEYS } from "@/lib/calc/keypad";
import type { CalcAction, CalcState } from "@/lib/calc/expression";
import { isKeyEnabled } from "@/lib/calc/expression";

const CalcKeypad = ({
  state,
  dispatch,
}: {
  state: CalcState;
  dispatch: (action: CalcAction) => void;
}) => {
  const render = (keys: typeof NUMERIC_KEYS) =>
    keys.map((def) => (
      <CalcKey
        key={def.id}
        def={def}
        state={state}
        disabled={!isKeyEnabled(state, def.id)}
        onPress={() => dispatch(def.action)}
      />
    ));

  return (
    <div className="mt-4 flex flex-row items-start justify-center gap-2">
      <div className="grid w-3/5 grid-cols-3 gap-2">{render(NUMERIC_KEYS)}</div>
      <div className="grid w-2/5 grid-cols-2 gap-2">
        {render(OPERATOR_KEYS)}
      </div>
    </div>
  );
};

export default CalcKeypad;
