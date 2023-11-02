import type { Metadata } from "next";
import { Blinker } from "next/font/google";
import "./globals.css";
import ThemeRegistry from "@/components/ThemeRegistry/ThemeRegistry";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MultiProvider from "@/components/providers/MultiProvider";
import Analytics from "@/components/Analytics/Analytics";

const blinker = Blinker({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: "REP Calc v3",
  description:
    "Calculadora de horas e funcionalidades adicionais de planejamento de jornada de trabalho para uso com relógio eletrônico de ponto.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-br" className="h-[100vh]">
      <ThemeRegistry>
        <MultiProvider>
          <body
            className={`${blinker.className} h-[100vh] flex flex-col justify-between items-stretch`}
          >
            <Header />
            <main className="grow py-6 px-6 bg-[#EFF3F8] text-[#333333] flex flex-col justify-center items-stretch">
              {children}
            </main>
            <Footer />
            <Analytics />
          </body>
        </MultiProvider>
      </ThemeRegistry>
    </html>
  );
}
