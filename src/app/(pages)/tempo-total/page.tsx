import { Metadata } from "next";
import TempoTotal from "@/components/TempoTotal";

export const metadata: Metadata = {
  title: "Tempo Total de Trabalho",
};

const Page = () => {
  return <TempoTotal />;
};

export default Page;
