import Link from "next/link";
import Head from "next/head";
import { useState, useEffect, useCallback } from "react";
import MaskedInput from "react-text-mask";
import classes from "../styles/tempo-total.module.css";

const TempoTotal = () => {
  const parTemplate = {
    inicio: "",
    inicioIsValid: false,
    termino: "",
    terminoIsValid: false,
  };

  const [pares, setPares] = useState([parTemplate]);

  const [invalidInput, setInvalidInput] = useState(true);
  const [total, setTotal] = useState(0);

  let multiplier = 0;

  const regex = "^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$";

  const validateInput = (e) => {
    const allowedKeys = [
      "0",
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      ":",
      "Backspace",
      "Delete",
      "ArrowRight",
      "ArrowLeft",
      "Tab",
    ];
    if (!allowedKeys.includes(e.key)) {
      e.preventDefault();
    }
  };

  const updateValue = (value, type, parIndex) => {
    const newPares = [...pares];
    newPares[parIndex][type] = value;
    const varName = `${type}IsValid`;
    newPares[parIndex][varName] = !!value.match(regex);

    setPares(newPares);
  };

  const convertFromTime = useCallback((time) => {
    let h = time.substr(0, time.indexOf(":"));
    let m = time.substr(time.indexOf(":") + 1, 2);

    return Number(h) * 60 + Number(m);
  }, []);

  const convertToTime = useCallback((value) => {
    let h = parseInt(Number(value) / 60);
    let m = parseInt(Number(value) % 60);

    h = h < 10 ? "0" + h : "" + h;
    m = m < 10 ? "0" + m : "" + m;

    return h + ":" + m;
  }, []);

  useEffect(() => {
    let invalidInput = false;
    pares.forEach((par) => {
      if (
        !par.inicioIsValid ||
        !par.terminoIsValid ||
        convertFromTime(par.termino) < convertFromTime(par.inicio)
      ) {
        invalidInput = true;
      }
    });
    setInvalidInput(invalidInput);

    if (!invalidInput) {
      let total = 0;

      pares.forEach((par) => {
        total += convertFromTime(par.termino) - convertFromTime(par.inicio);
      });

      setTotal(convertToTime(total));
    }
  }, [pares]);

  return (
    <>
      <Head>
        <title>REP Calc - Tempo Total - Leandro Faria</title>
      </Head>
      <main>
        <div className="contentContainer">
          <div className="breadcrumbs">
            <span>
              <Link href="/">Home</Link> &rarr; Tempo Total
            </span>
          </div>
          <div className="feature">
            <span>
              Para cálculo de tempo total de trabalho entre pontos preencha os
              campos abaixo.
            </span>

            {pares.map((par, index) => {
              return (
                <div key={index} className={classes.tempoTotalDisplay}>
                  <div>
                    <p>Marcação {index + 1 + multiplier}</p>
                    <MaskedInput
                      mask={[/[0-2]/, /[0-9]/, ":", /[0-5]/, /[0-9]/]}
                      guide={true}
                      placeholder="__:__"
                      type="tel"
                      value={par.inicio}
                      onKeyDown={validateInput}
                      onChange={(e) =>
                        updateValue(e.target.value, "inicio", index)
                      }
                      onPaste={(e) => {
                        e.preventDefault();
                      }}
                    />
                  </div>
                  <div>
                    <p>Marcação {index + 2 + multiplier++}</p>
                    <MaskedInput
                      mask={[/[0-2]/, /[0-9]/, ":", /[0-5]/, /[0-9]/]}
                      guide={true}
                      placeholder="__:__"
                      type="tel"
                      value={par.termino}
                      onKeyDown={validateInput}
                      onChange={(e) =>
                        updateValue(e.target.value, "termino", index)
                      }
                      onPaste={(e) => {
                        e.preventDefault();
                      }}
                    />
                  </div>
                </div>
              );
            })}
            <br />
            <div className={classes.tempoTotalDisplay}>
              <button
                onClick={() => {
                  const newPares = [...pares, { ...parTemplate }];
                  setPares(newPares);
                }}
                disabled={pares.length >= 4}
              >
                Novo Par de Pontos
              </button>
              <button
                onClick={() => {
                  const newPares = pares.slice(0, -1);
                  setPares(newPares);
                }}
                className={classes.redButton}
                disabled={pares.length === 1}
              >
                Excluir Último Par
              </button>
            </div>
            <br />
            <hr />
            {invalidInput && (
              <p className={classes.error}>
                Aguardando o preenchimento correto de todos os campos.
              </p>
            )}
            {!invalidInput && (
              <div
                className={`${classes.tempoTotalDisplay} ${classes.resultado}`}
              >
                <p>O total trabalhado foi:</p>
                <input type="text" value={total} disabled />
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
};

export default TempoTotal;
