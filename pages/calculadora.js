import { useState } from "react";
import Link from "next/link";
import CalcButton from "../components/ui/calcButton";
import classes from "../styles/calculadora.module.css";

const Calculadora = () => {
  const [memory, setMemory] = useState(null);
  const [operand, setOperand] = useState(null);
  const [operator, setOperator] = useState(null);

  const addToOperand = (value) => {
    let newValue;
    if (operand === null || operand.value === "0") {
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
          (memory?.hasHour || memory?.hasMinute) &&
          (operand?.hasHour || operand?.hasMinute) &&
          operator.value === "/"
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
    <main>
      <div className="contentContainer">
        <div className="breadcrumbs">
          <span>
            <Link href="/">Home</Link> &rarr; Calculadora
          </span>
        </div>
        <div className="feature">
          <div className={classes.calculadora}>
            <div className={classes.history}>
              <input
                className={classes.historyInput}
                type="text"
                disabled
                value={`${memory?.value || "0"} ${operator?.value || ""}`}
              />
            </div>
            <div className={classes.display}>
              <input
                className={classes.displayInput}
                type="text"
                disabled
                value={operand?.value || "0"}
              />
            </div>
            <div className={classes.clear}>
              <CalcButton
                value={operand ? "CLEAR (CE)" : "CLEAR (C)"}
                styling="clear"
                onClick={() => {
                  clear();
                }}
              />
            </div>
            <div>
              <CalcButton
                onClick={() => {
                  addToOperand("7");
                }}
                value="7"
                styling="digit"
                disabled={operand?.hasMinute}
              />
            </div>
            <div>
              <CalcButton
                onClick={() => {
                  addToOperand("8");
                }}
                value="8"
                styling="digit"
                disabled={operand?.hasMinute}
              />
            </div>
            <div>
              <CalcButton
                onClick={() => {
                  addToOperand("9");
                }}
                value="9"
                styling="digit"
                disabled={operand?.hasMinute}
              />
            </div>
            <div>
              <CalcButton
                value="/"
                styling="operator"
                onClick={() => {
                  addOperator("/");
                }}
              />
            </div>
            <div>
              <CalcButton
                onClick={() => {
                  addToOperand("4");
                }}
                value="4"
                styling="digit"
                disabled={operand?.hasMinute}
              />
            </div>
            <div>
              <CalcButton
                onClick={() => {
                  addToOperand("5");
                }}
                value="5"
                styling="digit"
                disabled={operand?.hasMinute}
              />
            </div>
            <div>
              <CalcButton
                onClick={() => {
                  addToOperand("6");
                }}
                value="6"
                styling="digit"
                disabled={operand?.hasMinute}
              />
            </div>
            <div>
              <CalcButton
                value="*"
                styling="operator"
                onClick={() => {
                  addOperator("*");
                }}
              />
            </div>
            <div>
              <CalcButton
                onClick={() => {
                  addToOperand("1");
                }}
                value="1"
                styling="digit"
                disabled={operand?.hasMinute}
              />
            </div>
            <div>
              <CalcButton
                onClick={() => {
                  addToOperand("2");
                }}
                value="2"
                styling="digit"
                disabled={operand?.hasMinute}
              />
            </div>
            <div>
              <CalcButton
                onClick={() => {
                  addToOperand("3");
                }}
                value="3"
                styling="digit"
                disabled={operand?.hasMinute}
              />
            </div>
            <div>
              <CalcButton
                value="-"
                styling="operator"
                onClick={() => {
                  addOperator("-");
                }}
              />
            </div>
            <div>
              <CalcButton
                onClick={() => {
                  addToOperand("0");
                }}
                value="0"
                styling="digit"
                disabled={operand?.hasMinute}
              />
            </div>
            <div>
              <CalcButton
                onClick={() => {
                  addToOperand("h");
                }}
                value="h"
                styling="unity"
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
            </div>
            <div>
              <CalcButton
                onClick={() => {
                  addToOperand("min");
                }}
                value="min"
                styling="unity"
                disabled={
                  operand?.hasMinute ||
                  ((memory?.hasHour || memory?.hasMinute) &&
                    operator?.value === "*") ||
                  (!memory?.hasHour &&
                    !memory?.hasMinute &&
                    operator?.value === "/")
                }
              />
            </div>
            <div>
              <CalcButton
                value="+"
                styling="operator"
                onClick={() => {
                  addOperator("+");
                }}
              />
            </div>
            <div className={classes.equal}>
              <CalcButton
                value="="
                styling="equal"
                onClick={() => {
                  execCalc();
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Calculadora;
