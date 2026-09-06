import { Metadata } from "next";
import Calculadora from "@/components/Calculadora";

export const metadata: Metadata = {
  title: "Calculadora",
};

const Page = () => {
  return <Calculadora />;
};

export default Page;
