import type { Metadata, Viewport } from "next";
import { Blinker } from "next/font/google";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter";
import InitColorSchemeScript from "@mui/material/InitColorSchemeScript";
import "./globals.css";
import ThemeRegistry from "@/components/ThemeRegistry/ThemeRegistry";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import DateLocalizationProvider from "@/components/providers/DateLocalizationProvider";
import Analytics from "@/components/Analytics/Analytics";
import { COLOR_SCHEME_ATTRIBUTE, LIGHT } from "@/lib/design/tokens";

const blinker = Blinker({
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
  display: "swap",
  variable: "--font-blinker",
});

export const metadata: Metadata = {
  title: "REP Calc v3",
  description:
    "Calculadora de horas e funcionalidades adicionais de planejamento de jornada de trabalho para uso com relógio eletrônico de ponto.",
  metadataBase: new URL("https://repcalc.leandrofaria.com/"),
  openGraph: {
    title: "REP Calc v3",
    description:
      "Calculadora de horas e funcionalidades adicionais de planejamento de jornada de trabalho para uso com relógio eletrônico de ponto.",
    url: "https://repcalc.leandrofaria.com",
    siteName: "REP Calc v3",
    images: [
      {
        url: "https://repcalc.leandrofaria.com/og.jpg",
        width: 1200,
        height: 630,
        alt: "REP Calc v3",
      },
    ],
    locale: "pt_BR",
    type: "website",
  },
};

// A separate export since Next 14: themeColor inside metadata is deprecated.
export const viewport: Viewport = {
  themeColor: LIGHT.brand,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="pt-br"
      className={`${blinker.variable} h-dvh`}
      suppressHydrationWarning
    >
      <body className="h-dvh flex flex-col justify-between items-stretch bg-canvas text-ink">
        {/* Must be the first child of body: it stamps the colour scheme
            before first paint, so the page never flashes the wrong theme. */}
        <InitColorSchemeScript attribute={COLOR_SCHEME_ATTRIBUTE} />
        {/* enableCssLayer is what puts MUI's styles into @layer mui, which is
            the whole mechanism behind the Tailwind interop in globals.css. */}
        <AppRouterCacheProvider options={{ key: "mui", enableCssLayer: true }}>
          <ThemeRegistry>
            <DateLocalizationProvider>
              <Header />
              <main className="grow py-6 px-6 flex flex-col justify-center items-stretch">
                {children}
              </main>
              <Footer />
            </DateLocalizationProvider>
          </ThemeRegistry>
        </AppRouterCacheProvider>
        <Analytics />
      </body>
    </html>
  );
}
