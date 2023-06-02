import TempoTotal from "@/components/tempoTotal";

export const metadata = {
  title: "REP Calc v2 - Tempo Total de Trabalho",
};

const TempoTotalPage = () => {
  return (
    <>
      <h2>Tempo Total de Trabalho</h2>
      <p>
        Para cálculo de tempo total de trabalho entre pontos preencha os campos
        abaixo.
      </p>
      <TempoTotal />
    </>
  );
};

export default TempoTotalPage;
