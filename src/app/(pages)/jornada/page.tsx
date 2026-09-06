import { Metadata } from "next";
import Jornada from "@/components/Jornada";

export const metadata: Metadata = {
  title: "Jornada de Trabalho",
};

const Page = () => {
  return <Jornada />;
};

export default Page;
