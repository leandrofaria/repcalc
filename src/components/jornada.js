"use client";

import { useState, useEffect, useCallback } from "react";
import MaskedInput from "react-text-mask";

const Jornada = () => {
  const [inicio, setInicio] = useState({ value: "", valid: false });
  const [jornada, setJornada] = useState({ value: "05:45", valid: true });
  const [intervalo, setIntervalo] = useState({ value: "00:15", valid: true });
  const [tolerancia, setTolerancia] = useState({ value: "00:10", valid: true });
  const [fimDaJornada, setFimDaJornada] = useState({ value: "--:--" });
  const [fimDaJornadaComTolerancia, setFimDaJornadaComTolerancia] = useState({
    value: "--:--",
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

  const invalid =
    !inicio.valid || !jornada.valid || !intervalo.valid || !tolerancia.valid;

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
      <div className="splitContainer">
        <div className="splitContainer mainArea">
          <div className="flexInput">
            <h4>Horário de Início</h4>
            <MaskedInput
              mask={[/[0-2]/, /[0-9]/, ":", /[0-5]/, /[0-9]/]}
              guide={true}
              placeholder="__:__"
              type="tel"
              value={inicio.value}
              onKeyDown={validateInput}
              onChange={onInicioChangeHandler}
              onPaste={(e) => {
                e.preventDefault();
              }}
            />
          </div>
          <div className="flexInput">
            <h4>Duração da Jornada</h4>
            <MaskedInput
              mask={[/[0-2]/, /[0-9]/, ":", /[0-5]/, /[0-9]/]}
              guide={true}
              placeholder="__:__"
              type="tel"
              value={jornada.value}
              onKeyDown={validateInput}
              onChange={onJornadaChangeHandler}
              onPaste={(e) => {
                e.preventDefault();
              }}
            />
          </div>
          <div className="flexInput">
            <h4>Duração do Intervalo</h4>
            <MaskedInput
              mask={[/[0-2]/, /[0-9]/, ":", /[0-5]/, /[0-9]/]}
              guide={true}
              placeholder="__:__"
              type="tel"
              value={intervalo.value}
              onKeyDown={validateInput}
              onChange={onIntervaloChangeHandler}
              onPaste={(e) => {
                e.preventDefault();
              }}
            />
          </div>
          <div className="flexInput">
            <h4>Tolerância Permitida</h4>
            <MaskedInput
              mask={[/[0-2]/, /[0-9]/, ":", /[0-5]/, /[0-9]/]}
              guide={true}
              placeholder="__:__"
              type="tel"
              value={tolerancia.value}
              onKeyDown={validateInput}
              onChange={onToleranciaChangeHandler}
              onPaste={(e) => {
                e.preventDefault();
              }}
            />
          </div>
          {invalid && (
            <div className="warning">
              <p>Aguardando o preenchimento correto de todos os campos.</p>
            </div>
          )}
        </div>
        <div className="sideBar">
          <div className="flexInput">
            <h4>Término Previsto</h4>
            <input
              type="text"
              disabled
              value={invalid ? "--:--" : fimDaJornada.value}
            />
          </div>
          <div className="flexInput">
            <h4>Saída com Tolerância</h4>
            <input
              type="text"
              disabled
              value={invalid ? "--:--" : fimDaJornadaComTolerancia.value}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Jornada;
