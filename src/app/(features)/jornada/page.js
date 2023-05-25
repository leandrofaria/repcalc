import Jornada from "@/components/jornada";

export const metadata = {
  title: "REP Calc v2 - Jornada de Trabalho",
};

const JornadaPage = () => {
  return (
    <>
      <h2>Jornada de Trabalho</h2>
      <p>
        Para planejamento da sua jornada de trabalho preencha os campos abaixo.
      </p>
      <Jornada />
    </>
  );
};

export default JornadaPage;
