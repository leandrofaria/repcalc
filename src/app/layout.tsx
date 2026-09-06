import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Public_Sans } from "next/font/google";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter";
import InitColorSchemeScript from "@mui/material/InitColorSchemeScript";
import "./globals.css";
import ThemeRegistry from "@/components/ThemeRegistry/ThemeRegistry";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import DateLocalizationProvider from "@/components/providers/DateLocalizationProvider";
import Analytics from "@/components/Analytics/Analytics";
import { COLOR_SCHEME_ATTRIBUTE, DARK, LIGHT } from "@/lib/design/tokens";

// Loaded once here and exposed as CSS variables, which both the MUI theme
// and Tailwind read.
const display = Bricolage_Grotesque({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
});

const body = Public_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "REP Calc",
  description:
    "Calculadora de horas e funcionalidades adicionais de planejamento de jornada de trabalho para uso com relógio eletrônico de ponto.",
  metadataBase: new URL("https://repcalc.leandrofaria.com/"),
  openGraph: {
    title: "REP Calc",
    description:
      "Calculadora de horas e funcionalidades adicionais de planejamento de jornada de trabalho para uso com relógio eletrônico de ponto.",
    url: "https://repcalc.leandrofaria.com",
    siteName: "REP Calc",
    images: [
      {
        url: "https://repcalc.leandrofaria.com/og.jpg",
        width: 1200,
        height: 630,
        alt: "REP Calc",
      },
    ],
    locale: "pt_BR",
    type: "website",
  },
};

// A separate export since Next 14: themeColor inside metadata is deprecated.
// Two entries so the browser chrome follows the colour scheme.
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: LIGHT.brand },
    { media: "(prefers-color-scheme: dark)", color: DARK.canvas },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="pt-br"
      className={`${display.variable} ${body.variable} h-dvh`}
      suppressHydrationWarning
    >
      <body className="h-dvh flex flex-col justify-between items-stretch bg-canvas text-ink antialiased">
        {/* Must be the first child of body: it stamps the colour scheme
            before first paint, so the page never flashes the wrong theme. */}
        <InitColorSchemeScript attribute={COLOR_SCHEME_ATTRIBUTE} />
        {/* enableCssLayer is what puts MUI's styles into @layer mui, which is
            the whole mechanism behind the Tailwind interop in globals.css. */}
        <AppRouterCacheProvider options={{ key: "mui", enableCssLayer: true }}>
          <ThemeRegistry>
            <DateLocalizationProvider>
              <Header />
              <main className="grow px-4 py-6 sm:px-6 flex flex-col justify-center items-stretch">
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
