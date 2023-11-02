import MenuCard from "@/components/ui/MenuCard";

const Page = () => {
  return (
    <div className="container mx-auto sm:w-[720px] h-full flex flex-col justify-start sm:justify-center items-center">
      <div className="grid grid-flow-row grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-9 w-full">
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
