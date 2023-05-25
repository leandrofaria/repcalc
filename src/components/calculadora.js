"use client";

import { useState } from "react";
//import CalcButton from "../components/ui/calcButton";

import styles from "./calculadora.module.css";
import CalcButton from "./ui/calcButton";

const Calculadora = () => {
  const [memory, setMemory] = useState(null);
  const [operand, setOperand] = useState(null);
  const [operator, setOperator] = useState(null);
  const [history, setHistory] = useState([]);

  const addToOperand = (value) => {
    let newValue;
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
      if (operand.value.substr(operand.value.length - 1, 1) === "h") {
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
  };

  const addOperator = (value) => {
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
  };

  const convertFromTime = (value) => {
    const p1 = value.indexOf("h");
    const h = p1 !== -1 ? Number(value.substring(0, p1)) * 60 : 0;
    const p2 = value.indexOf("m", p1);
    const m = p2 !== -1 ? Number(value.substring(p1 + 1, p2)) : 0;

    return h + m;
  };

  const convertToTime = (value) => {
    const h = parseInt(Number(value) / 60);
    const m = parseInt(Number(value) % 60);

    let resultString = h !== 0 ? h + "h" : "";
    resultString += m !== 0 ? " " + m + "m" : "";

    return resultString;
  };

  const execCalc = (newOperator = null) => {
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
          result = convertToTime(result);
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
        if (newHistory.length === 9) newHistory.pop();
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
  };

  const clear = () => {
    if (operand) {
      setOperand(null);
      return;
    }
    if (memory) {
      setMemory(null);
      setOperator(null);
      return;
    }
  };
  return (
    <>
      <div className="splitContainer">
        <div className="splitContainer mainArea">
          <div className={styles.calcBase}>
            <div className={styles.memory}>
              <input
                type="text"
                disabled
                value={`${memory?.value || "0"} ${operator?.value || ""}`}
              />
            </div>
            <div className={styles.display}>
              <input type="text" disabled value={operand?.value || "0"} />
            </div>
            <CalcButton
              value="7"
              type="number"
              onClick={() => {
                addToOperand("7");
              }}
              disabled={operand?.hasMinute}
            />
            <CalcButton
              value="8"
              type="number"
              onClick={() => {
                addToOperand("8");
              }}
              disabled={operand?.hasMinute}
            />
            <CalcButton
              value="9"
              type="number"
              onClick={() => {
                addToOperand("9");
              }}
              disabled={operand?.hasMinute}
            />
            <CalcButton
              className={styles.clear}
              type="clear"
              value={operand ? "CE" : "C"}
              onClick={() => {
                clear();
              }}
            />
            <CalcButton
              value="4"
              type="number"
              onClick={() => {
                addToOperand("4");
              }}
              disabled={operand?.hasMinute}
            />
            <CalcButton
              value="5"
              type="number"
              onClick={() => {
                addToOperand("5");
              }}
              disabled={operand?.hasMinute}
            />
            <CalcButton
              value="6"
              type="number"
              onClick={() => {
                addToOperand("6");
              }}
              disabled={operand?.hasMinute}
            />
            <CalcButton
              value="*"
              type="operator"
              onClick={() => {
                addOperator("*");
              }}
            />
            <CalcButton
              value="/"
              type="operator"
              onClick={() => {
                addOperator("/");
              }}
            />
            <CalcButton
              value="1"
              type="number"
              onClick={() => {
                addToOperand("1");
              }}
              disabled={operand?.hasMinute}
            />
            <CalcButton
              value="2"
              type="number"
              onClick={() => {
                addToOperand("2");
              }}
              disabled={operand?.hasMinute}
            />
            <CalcButton
              value="3"
              type="number"
              onClick={() => {
                addToOperand("3");
              }}
              disabled={operand?.hasMinute}
            />
            <CalcButton
              value="+"
              type="operator"
              onClick={() => {
                addOperator("+");
              }}
            />
            <CalcButton
              value="-"
              type="operator"
              onClick={() => {
                addOperator("-");
              }}
            />
            <CalcButton
              value="0"
              type="number"
              onClick={() => {
                addToOperand("0");
              }}
              disabled={
                operand?.hasMinute ||
                (operator?.value === "/" &&
                  (operand === null || operand?.value === 0))
              }
            />
            <CalcButton
              value="h"
              type="unity"
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
            />
            <CalcButton
              value="min"
              type="unity"
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
            />
            <CalcButton
              className={styles.equal}
              value="="
              type="equal"
              onClick={() => {
                execCalc();
              }}
            />
          </div>
        </div>
        <div className="sideBar">
          <div className="flexInput">
            <h4>Histórico</h4>
            {history.map((el, index) => {
              return (
                <p className={styles.historyMessage} key={index}>
                  {el}
                </p>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default Calculadora;
