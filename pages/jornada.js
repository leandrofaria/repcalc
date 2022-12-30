import { useState, useEffect, useCallback } from "react";
import Head from "next/head";
import Link from "next/link";
import MaskedInput from "react-text-mask";
import classes from "../styles/jornada.module.css";

const Jornada = () => {
  const [inicio, setInicio] = useState({ value: "", valid: false });
  const [jornada, setJornada] = useState({ value: "05:45", valid: true });
  const [intervalo, setIntervalo] = useState({ value: "00:15", valid: true });
  const [tolerancia, setTolerancia] = useState({ value: "00:10", valid: true });
  const [fimDaJornada, setFimDaJornada] = useState({ value: "" });
  const [fimDaJornadaComTolerancia, setFimDaJornadaComTolerancia] = useState({
    value: "",
  });

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

  const onInicioChangeHandler = (e) => {
    const input = e.target.value;

    setInicio((prevState) => {
      return {
        ...prevState,
        value: input,
        valid: input.match(regex),
      };
    });
  };
  const onJornadaChangeHandler = (e) => {
    const input = e.target.value;

    setJornada((prevState) => {
      return {
        ...prevState,
        value: input,
        valid: input.match(regex),
      };
    });
  };
  const onIntervaloChangeHandler = (e) => {
    const input = e.target.value;

    setIntervalo((prevState) => {
      return {
        ...prevState,
        value: input,
        valid: input.match(regex),
      };
    });
  };
  const onToleranciaChangeHandler = (e) => {
    const input = e.target.value;

    setTolerancia((prevState) => {
      return {
        ...prevState,
        value: input,
        valid: input.match(regex),
      };
    });
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
    if (inicio.valid && jornada.valid && intervalo.valid && tolerancia.valid) {
      const convInicio = convertFromTime(inicio.value);
      const convJornada = convertFromTime(jornada.value);
      const convIntervalo = convertFromTime(intervalo.value);
      const convTolerancia = convertFromTime(tolerancia.value);

      let fim = convInicio + convJornada + convIntervalo;
      let fimTol = fim - convTolerancia;

      fim = convertToTime(fim);
      fimTol = convertToTime(fimTol);

      setFimDaJornada({ value: fim });
      setFimDaJornadaComTolerancia({ value: fimTol });
    }
  }, [inicio, jornada, intervalo, tolerancia]);

  return (
    <>
      <Head>
        <title>REP Calc - Jornada de Trabalho - Leandro Faria</title>
      </Head>
      <main>
        <div className="contentContainer">
          <div className="breadcrumbs">
            <span>
              <Link href="/">Home</Link> &rarr; Jornada de Trabalho
            </span>
          </div>
          <div className="feature">
            <span>
              Para planejamento da sua jornada de trabalho preencha os campos
              abaixo.
            </span>
            <div className={classes.jornadaDisplay}>
              <div>
                <p>Horário de Início</p>
                <MaskedInput
                  mask={[/[0-2]/, /[0-9]/, ":", /[0-5]/, /[0-9]/]}
                  guide={true}
                  placeholder="__:__"
                  type="phone"
                  value={inicio.value}
                  onKeyDown={validateInput}
                  onChange={onInicioChangeHandler}
                  onPaste={(e) => {
                    e.preventDefault();
                  }}
                />
              </div>
              <div>
                <p>Duração da Jornada</p>
                <MaskedInput
                  mask={[/[0-2]/, /[0-9]/, ":", /[0-5]/, /[0-9]/]}
                  guide={true}
                  placeholder="__:__"
                  type="phone"
                  value={jornada.value}
                  onKeyDown={validateInput}
                  onChange={onJornadaChangeHandler}
                  onPaste={(e) => {
                    e.preventDefault();
                  }}
                />
              </div>
              <div>
                <p>Duração do Intervalo</p>
                <MaskedInput
                  mask={[/[0-2]/, /[0-9]/, ":", /[0-5]/, /[0-9]/]}
                  guide={true}
                  placeholder="__:__"
                  type="phone"
                  value={intervalo.value}
                  onKeyDown={validateInput}
                  onChange={onIntervaloChangeHandler}
                  onPaste={(e) => {
                    e.preventDefault();
                  }}
                />
              </div>
              <div>
                <p>Tolerância Permitida</p>
                <MaskedInput
                  mask={[/[0-2]/, /[0-9]/, ":", /[0-5]/, /[0-9]/]}
                  guide={true}
                  placeholder="__:__"
                  type="phone"
                  value={tolerancia.value}
                  onKeyDown={validateInput}
                  onChange={onToleranciaChangeHandler}
                  onPaste={(e) => {
                    e.preventDefault();
                  }}
                />
              </div>
            </div>
            <hr />
            {(!inicio.valid ||
              !jornada.valid ||
              !intervalo.valid ||
              !tolerancia.valid) && (
              <p className={classes.error}>
                Aguardando o preenchimento correto de todos os campos.
              </p>
            )}
            {inicio.valid &&
              jornada.valid &&
              intervalo.valid &&
              tolerancia.valid && (
                <>
                  <div
                    className={`${classes.jornadaDisplay} ${classes.resultado}`}
                  >
                    <p>Sua jornada está prevista para terminar às:</p>
                    <input type="text" disabled value={fimDaJornada.value} />
                  </div>
                  <div
                    className={`${classes.jornadaDisplay} ${classes.resultado}`}
                  >
                    <p>Contando a tolerância, você pode sair às:</p>
                    <input
                      type="text"
                      disabled
                      value={fimDaJornadaComTolerancia.value}
                    />
                  </div>
                </>
              )}
          </div>
        </div>
      </main>
    </>
  );
};

export default Jornada;
