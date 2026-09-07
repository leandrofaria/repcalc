import AppShell from "@/components/layout/AppShell";
import ContentContainer from "@/components/layout/ContentContainer";
import MenuCard from "@/components/ui/MenuCard";

const FEATURES = [
  {
    href: "/jornada",
    title: "Jornada de Trabalho",
    description:
      "Informe o horário de entrada e veja na hora quando pode sair, acompanhando ao vivo quanto já trabalhou.",
  },
  {
    href: "/calculadora",
    title: "Calculadora",
    description:
      "Soma, subtrai, multiplica e divide horas e minutos. 2h30 mais 1h45 dá 4h15, sem conta de cabeça.",
  },
  {
    href: "/tempo-total",
    title: "Tempo Total",
    description:
      "Some o tempo entre pares de marcações, inclusive quando o turno atravessa a meia-noite.",
  },
  {
    href: "/sobre",
    title: "Sobre o Sistema",
    description:
      "De onde veio o REP Calc, com que ele é feito e como falar com o autor.",
  },
] as const;

/**
 * The home.
 *
 * It exists to say what the app does, which is something no other screen
 * does — each of them drops you straight into a calculation. Removing it
 * once, to save a tap, cost exactly that.
 */
const Page = () => {
  return (
    <AppShell>
      <ContentContainer className="sm:mb-10">
        <header className="w-full">
          <h1 className="font-display text-xl font-extrabold tracking-tight text-balance sm:text-2xl">
            Calculadora de horas para quem bate ponto em relógio eletrônico
          </h1>
          <p className="mt-2 text-ink-muted">
            Funciona no celular, mesmo sem conexão.
          </p>
        </header>

        <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
          {FEATURES.map((feature) => (
            <MenuCard key={feature.href} {...feature} />
          ))}
        </div>
      </ContentContainer>
    </AppShell>
  );
};

export default Page;
