import { Metadata } from "next";
import TempoTotal from "@/components/TempoTotal";

export const metadata: Metadata = {
  title: "REP Calc v3 - Tempo Total de Trabalho",
};

const Page = () => {
  return <TempoTotal />;
};

export default Page;
