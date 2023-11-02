import { Metadata } from "next";
import Jornada from "@/components/Jornada";

export const metadata: Metadata = {
  title: "REP Calc v3 - Jornada de Trabalho",
};

const Page = () => {
  return <Jornada />;
};

export default Page;
