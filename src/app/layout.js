import Footer from "../components/layout/footer";
import Header from "../components/layout/header";
import "./globals.css";

import { Blinker } from "next/font/google";

import Analytics from "../components/analytics";

const blinker = Blinker({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "REP Calc v2",
  description:
    "Uma calculadora de horas para uso com relógio eletrônico de pontos e algumas funções a mais.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-br">
      <body className={blinker.className}>
        <Header />
        {children}
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
