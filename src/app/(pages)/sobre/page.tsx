import { Metadata } from "next";
import Sobre from "@/components/Sobre";

export const metadata: Metadata = {
  title: "Sobre o REP Calc",
};

const Page = () => {
  return <Sobre />;
};

export default Page;
