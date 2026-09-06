import MenuCard from "@/components/ui/MenuCard";

const Page = () => {
  return (
    <div className="page-container flex h-full w-full flex-col items-center justify-start sm:max-w-[760px] sm:justify-center">
      <h1 className="sr-only">REP Calc</h1>
      <div className="grid w-full grid-flow-row grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
        <MenuCard
          icon="calculadora"
          title="Calculadora"
          link="/calculadora"
          description="Realize cálculos de horários, utilizando unidades de horas e minutos."
        />
        <MenuCard
          icon="jornada"
          title="Jornada de Trabalho"
          link="/jornada"
          description="Faça o planejamento dos seus horários de entrada, saída e intervalos."
        />
        <MenuCard
          icon="tempototal"
          title="Tempo Total"
          link="/tempo-total"
          description="Insira suas marcações e calcule o tempo total decorrido entre elas."
        />
        <MenuCard
          icon="sobre"
          title="Sobre o Sistema"
          link="/sobre"
          description="Saiba mais sobre o REP Calc, seu desenvolvimento e outras informações."
        />
      </div>
    </div>
  );
};

export default Page;
