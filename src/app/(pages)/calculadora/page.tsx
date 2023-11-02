import { Metadata } from "next";
import Calculadora from "@/components/Calculadora";

export const metadata: Metadata = {
  title: "REP Calc v3 - Calculadora",
};

const Page = () => {
  return <Calculadora />;
};

export default Page;
