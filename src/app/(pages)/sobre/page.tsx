import { Metadata } from "next";
import Sobre from "@/components/Sobre";

export const metadata: Metadata = {
  title: "REP Calc v3 - Sobre o REP Calc",
};

const Page = () => {
  return <Sobre />;
};

export default Page;
