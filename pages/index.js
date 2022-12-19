import Head from "next/head";

import MenuCard from "../components/ui/menuCard";

const Home = () => {
  return (
    <>
      <Head>
        <title>REP Calc - Leandro Faria</title>
        <meta
          name="description"
          content="Calculadora de horas para uso com relógio eletrônico de ponto"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div className="menuContainer">
          <MenuCard
            title="Calculadora"
            description="Realize cálculos de horários"
            icon="/img/calc.png"
            target="/calculadora"
          />
          <MenuCard
            title="Jornada"
            description="Planejamento da jornada de trabalho"
            icon="/img/stats.png"
            target="/jornada"
          />
          <MenuCard
            title="Tempo Total"
            description="Cálculo de tempo entre pontos"
            icon="/img/steps.png"
            target="tempo-total"
          />
          <MenuCard
            title="Sobre"
            description="Informações sobre o sistema"
            icon="/img/about.png"
            target="sobre"
          />
        </div>
      </main>
    </>
  );
};

export default Home;
