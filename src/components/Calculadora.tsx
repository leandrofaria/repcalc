"use client";

import ContentContainer from "./layout/ContentContainer";
import FeatureContainer from "./layout/FeatureContainer";
import LeftAreaContainer from "./layout/LeftAreaContainer";
import RightAreaContainer from "./layout/RightAreaContainer";
import SectionTitle from "./ui/SectionTitle";
import { Button } from "@mui/material";
import { useCallback, useEffect, useState } from "react";

const Calculadora = () => {
  type Operand = {
    value: string;
    hasHour: boolean | undefined;
    hasMinute: boolean | undefined;
  };

  type Operator = {
    value: string;
  };

  const [memory, setMemory] = useState<Operand | null>(null);
  const [operand, setOperand] = useState<Operand | null>(null);
  const [operator, setOperator] = useState<Operator | null>(null);
  const [history, setHistory] = useState<string[]>([]);

  const execCalc = useCallback(
    (newOperator: string | null = null) => {
      let resultObj = operand;
      if (operator) {
        let op1;
        let op2;
        if (!memory?.hasHour && !memory?.hasMinute) {
          op1 = Number(memory?.value || 0);
        } else {
          op1 = convertFromTime(memory?.value);
        }
        if (!operand?.hasHour && !operand?.hasMinute) {
          op2 = Number(operand?.value || 0);
        } else {
          op2 = convertFromTime(operand?.value);
        }
        let result;
        switch (operator.value) {
          case "+":
            result = op1 + op2;
            break;
          case "-":
            result = op1 - op2;
            break;
          case "*":
            result = op1 * op2;
            break;
          case "/":
            result = op1 / op2;
            break;
          default:
            break;
        }

        let hasHour = memory?.hasHour || operand?.hasHour;
        let hasMinute = memory?.hasMinute || operand?.hasMinute;

        if (hasHour || hasMinute) {
          if (
            ((memory?.hasHour || memory?.hasMinute) &&
              (operand?.hasHour || operand?.hasMinute) &&
              operator.value === "/") ||
            result === 0 ||
            result === Infinity
          ) {
            hasHour = false;
            hasMinute = false;
          } else {
            result = convertToTime(`${result}`);
          }
        }

        resultObj = {
          ...memory,
          value: "" + result,
          hasHour: hasHour,
          hasMinute: hasMinute,
        };

        let historyMsg =
          (memory?.value || "0") +
          " " +
          operator.value +
          " " +
          (operand?.value || "0") +
          " = " +
          result;

        setHistory((prevState) => {
          let newHistory = [...prevState];
          if (newHistory.length === 12) newHistory.pop();
          newHistory.unshift(historyMsg);
          return newHistory;
        });
      }

      if (!newOperator) {
        setMemory(null);
        setOperand(resultObj);
        setOperator(null);
      } else {
        setMemory(resultObj);
        setOperand(null);
        setOperator({ value: newOperator });
      }
    },
    [memory, operand, operator]
  );

  const clear = useCallback(() => {
    if (operand) {
      setOperand(null);
      return;
    }
    if (memory) {
      setMemory(null);
      setOperator(null);
      return;
    }
  }, [memory, operand]);

  const addToOperand = useCallback(
    (value: string) => {
      let newValue: string;
      if (
        operand === null ||
        operand.value === "0" ||
        operand.value === "Infinity"
      ) {
        if (value === "min") {
          newValue = "0" + value;
        } else if (value === "h") {
          newValue = "0" + value;
        } else {
          newValue = value;
        }
      } else {
        if (
          operand.value.substring(
            operand.value.length - 1,
            operand.value.length
          ) === "h"
        ) {
          newValue = operand.value + " ";
          if (value === "min") {
            newValue += "0";
          }
          newValue += value;
        } else {
          newValue = operand.value + value;
        }
      }
      setOperand((prevState) => {
        return {
          ...prevState,
          value: newValue,
          hasHour: value === "h" ? true : prevState?.hasHour,
          hasMinute: value === "min" ? true : prevState?.hasMinute,
        };
      });
    },
    [operand]
  );

  const addOperator = useCallback(
    (value: string) => {
      if (!memory) {
        setMemory(operand);
        setOperator((prevState) => {
          return { ...prevState, value: value };
        });
        setOperand(null);
        return;
      }
      if (memory && !operand) {
        setOperator((prevState) => {
          return { ...prevState, value: value };
        });
        return;
      }
      execCalc(value);
    },
    [execCalc, memory, operand]
  );

  const convertFromTime = (value: string) => {
    const p1 = value.indexOf("h");
    const h = p1 !== -1 ? Number(value.substring(0, p1)) * 60 : 0;
    const p2 = value.indexOf("m", p1);
    const m = p2 !== -1 ? Number(value.substring(p1 + 1, p2)) : 0;

    return h + m;
  };

  const convertToTime = (value: string) => {
    const h = parseInt("" + Number(value) / 60);
    const m = parseInt("" + (Number(value) % 60));

    let resultString = h !== 0 ? h + "h" : "";
    resultString += m !== 0 ? " " + m + "m" : "";

    return resultString;
  };

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      event.preventDefault();
      const numbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
      if (numbers.includes(event.key)) {
        return addToOperand(event.key);
      }
      if (event.key === "Enter" || event.key === "=") return execCalc();
      const operators = ["+", "-", "*", "/"];
      if (operators.includes(event.key)) {
        return addOperator(event.key);
      }
      if (event.key === "c") return clear();
      if (
        event.key === "h" &&
        !(
          operand?.hasHour ||
          operand?.hasMinute ||
          ((memory?.hasHour || memory?.hasMinute) && operator?.value === "*") ||
          (!memory?.hasHour && !memory?.hasMinute && operator?.value === "/")
        )
      )
        return addToOperand("h");
      if (
        event.key === "m" &&
        !(
          operand?.hasMinute ||
          ((memory?.hasHour || memory?.hasMinute) && operator?.value === "*") ||
          (!memory?.hasHour && !memory?.hasMinute && operator?.value === "/")
        )
      )
        return addToOperand("min");
    };

    window.addEventListener("keypress", handleKeyPress);

    return () => {
      window.removeEventListener("keypress", handleKeyPress);
    };
  }, [
    addToOperand,
    addOperator,
    clear,
    execCalc,
    memory?.hasHour,
    memory?.hasMinute,
    operand?.hasHour,
    operand?.hasMinute,
    operand?.value,
    operator?.value,
  ]);

  return (
    <ContentContainer>
      <SectionTitle>Calculadora</SectionTitle>
      <FeatureContainer>
        <LeftAreaContainer>
          <div className="calculadora w-full bg-[#eff3f8] border-[1px] border-[#c6d1df] shadow-[0_0_3px_3px_rgba(0,0,0,0.06)] p-[15px]">
            <input
              type="text"
              className="history w-full mb-3 h-[36px] !bg-slate-400 border-[1px] shadow-inner !text-lg !font-semibold"
              value={`${memory?.value || "0"} ${operator?.value || ""}`}
              disabled
            />
            <input
              type="text"
              className="display w-full h-[69px] border-[1px] shadow-inner p-3 flex flex-col justify-center items-end overflow-hidden"
              value={operand?.value || "0"}
              disabled
            />
            <div className="mt-6 flex flex-row justify-center items-center">
              <div className="w-3/5 grid grid-flow-row grid-cols-3 gap-3 mr-3">
                <div>
                  <Button
                    variant="contained"
                    color="secondary"
                    size="large"
                    fullWidth
                    sx={{
                      minWidth: 0,
                      fontWeight: "900",
                      fontSize: "21px",
                    }}
                    onClick={() => addToOperand("7")}
                    disabled={operand?.hasMinute}
                  >
                    7
                  </Button>
                </div>
                <div>
                  <Button
                    variant="contained"
                    color="secondary"
                    size="large"
                    fullWidth
                    sx={{
                      minWidth: 0,
                      fontWeight: "900",
                      fontSize: "21px",
                    }}
                    onClick={() => addToOperand("8")}
                    disabled={operand?.hasMinute}
                  >
                    8
                  </Button>
                </div>
                <div>
                  <Button
                    variant="contained"
                    color="secondary"
                    size="large"
                    fullWidth
                    sx={{
                      minWidth: 0,
                      fontWeight: "900",
                      fontSize: "21px",
                    }}
                    onClick={() => addToOperand("9")}
                    disabled={operand?.hasMinute}
                  >
                    9
                  </Button>
                </div>
                <div>
                  <Button
                    variant="contained"
                    color="secondary"
                    size="large"
                    fullWidth
                    sx={{
                      minWidth: 0,
                      fontWeight: "900",
                      fontSize: "21px",
                    }}
                    onClick={() => addToOperand("4")}
                    disabled={operand?.hasMinute}
                  >
                    4
                  </Button>
                </div>
                <div>
                  <Button
                    variant="contained"
                    color="secondary"
                    size="large"
                    fullWidth
                    sx={{
                      minWidth: 0,
                      fontWeight: "900",
                      fontSize: "21px",
                    }}
                    onClick={() => addToOperand("5")}
                    disabled={operand?.hasMinute}
                  >
                    5
                  </Button>
                </div>
                <div>
                  <Button
                    variant="contained"
                    color="secondary"
                    size="large"
                    fullWidth
                    sx={{
                      minWidth: 0,
                      fontWeight: "900",
                      fontSize: "21px",
                    }}
                    onClick={() => addToOperand("6")}
                    disabled={operand?.hasMinute}
                  >
                    6
                  </Button>
                </div>
                <div>
                  <Button
                    variant="contained"
                    color="secondary"
                    size="large"
                    fullWidth
                    sx={{
                      minWidth: 0,
                      fontWeight: "900",
                      fontSize: "21px",
                    }}
                    onClick={() => addToOperand("1")}
                    disabled={operand?.hasMinute}
                  >
                    1
                  </Button>
                </div>
                <div>
                  <Button
                    variant="contained"
                    color="secondary"
                    size="large"
                    fullWidth
                    sx={{
                      minWidth: 0,
                      fontWeight: "900",
                      fontSize: "21px",
                    }}
                    onClick={() => addToOperand("2")}
                    disabled={operand?.hasMinute}
                  >
                    2
                  </Button>
                </div>
                <div>
                  <Button
                    variant="contained"
                    color="secondary"
                    size="large"
                    fullWidth
                    sx={{
                      minWidth: 0,
                      fontWeight: "900",
                      fontSize: "21px",
                    }}
                    onClick={() => addToOperand("3")}
                    disabled={operand?.hasMinute}
                  >
                    3
                  </Button>
                </div>
                <div>
                  <Button
                    variant="contained"
                    color="secondary"
                    size="large"
                    fullWidth
                    sx={{
                      minWidth: 0,
                      fontWeight: "900",
                      fontSize: "21px",
                    }}
                    onClick={() => addToOperand("0")}
                    disabled={
                      operand?.hasMinute ||
                      (operator?.value === "/" &&
                        (operand === null || operand?.value === "0"))
                    }
                  >
                    0
                  </Button>
                </div>
                <div>
                  <Button
                    variant="contained"
                    size="large"
                    fullWidth
                    sx={{
                      minWidth: 0,
                      fontWeight: "900",
                      fontSize: "21px",
                      textTransform: "lowercase",
                    }}
                    onClick={() => {
                      addToOperand("h");
                    }}
                    disabled={
                      operand?.hasHour ||
                      operand?.hasMinute ||
                      ((memory?.hasHour || memory?.hasMinute) &&
                        operator?.value === "*") ||
                      (!memory?.hasHour &&
                        !memory?.hasMinute &&
                        operator?.value === "/")
                    }
                  >
                    h
                  </Button>
                </div>
                <div>
                  <Button
                    variant="contained"
                    size="large"
                    fullWidth
                    sx={{
                      minWidth: 0,
                      fontWeight: "900",
                      fontSize: "21px",
                      textTransform: "lowercase",
                    }}
                    onClick={() => {
                      addToOperand("min");
                    }}
                    disabled={
                      operand?.hasMinute ||
                      ((memory?.hasHour || memory?.hasMinute) &&
                        operator?.value === "*") ||
                      (!memory?.hasHour &&
                        !memory?.hasMinute &&
                        operator?.value === "/")
                    }
                  >
                    min
                  </Button>
                </div>
              </div>
              <div className="w-2/5 grid grid-flow row grid-cols-2 gap-3">
                <div className=" col-span-2">
                  <Button
                    variant="contained"
                    color="error"
                    size="large"
                    fullWidth
                    sx={{
                      minWidth: 0,
                      fontWeight: "900",
                      fontSize: "21px",
                      textTransform: "uppercase",
                    }}
                    onClick={() => {
                      clear();
                    }}
                  >
                    {operand ? "CE" : "C"}
                  </Button>
                </div>
                <div>
                  <Button
                    variant="contained"
                    size="large"
                    color="neutral"
                    fullWidth
                    sx={{
                      minWidth: 0,
                      fontWeight: "900",
                      fontSize: "21px",
                      textTransform: "lowercase",
                    }}
                    onClick={() => {
                      addOperator("*");
                    }}
                  >
                    *
                  </Button>
                </div>
                <div>
                  <Button
                    variant="contained"
                    size="large"
                    color="neutral"
                    fullWidth
                    sx={{
                      minWidth: 0,
                      fontWeight: "900",
                      fontSize: "21px",
                      textTransform: "lowercase",
                    }}
                    onClick={() => {
                      addOperator("/");
                    }}
                  >
                    /
                  </Button>
                </div>
                <div>
                  <Button
                    variant="contained"
                    size="large"
                    color="neutral"
                    fullWidth
                    sx={{
                      minWidth: 0,
                      fontWeight: "900",
                      fontSize: "21px",
                      textTransform: "lowercase",
                    }}
                    onClick={() => {
                      addOperator("+");
                    }}
                  >
                    +
                  </Button>
                </div>
                <div>
                  <Button
                    variant="contained"
                    size="large"
                    color="neutral"
                    fullWidth
                    sx={{
                      minWidth: 0,
                      fontWeight: "900",
                      fontSize: "21px",
                      textTransform: "lowercase",
                    }}
                    onClick={() => {
                      addOperator("-");
                    }}
                  >
                    -
                  </Button>
                </div>
                <div className=" col-span-2">
                  <div className=" col-span-2">
                    <Button
                      variant="contained"
                      color="success"
                      size="large"
                      fullWidth
                      sx={{
                        minWidth: 0,
                        fontWeight: "900",
                        fontSize: "21px",
                        textTransform: "uppercase",
                      }}
                      onClick={() => {
                        execCalc();
                      }}
                    >
                      =
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </LeftAreaContainer>
        <RightAreaContainer>
          <div className="sm:hidden my-6 w-full border-b-[1px] border-b-[#E9E9E9]" />
          <h2 className="font-semibold mb-1">Histórico:</h2>
          {history.map((el, index) => {
            return <p key={index}>{el}</p>;
          })}
        </RightAreaContainer>
      </FeatureContainer>
    </ContentContainer>
  );
};

export default Calculadora;
