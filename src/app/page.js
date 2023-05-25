import styles from "./home.module.css";
import Card from "@/components/ui/card";

export default function Home() {
  return (
    <main className={styles.main}>
      <Card
        icon="calc"
        title="Calculadora"
        description="Realize cálculo de horários"
        target="calculadora"
      />
      <Card
        icon="stats"
        title="Jornada"
        description="Planeje sua jornada de trabalho"
        target="jornada"
      />
      <Card
        icon="steps"
        title="Tempo Total"
        description="Calcule tempo entre pontos"
        target="tempo-total"
      />
      <Card
        icon="about"
        title="Sobre"
        description="Saiba mais sobre o sistema"
        target="sobre"
      />
    </main>
  );
}
