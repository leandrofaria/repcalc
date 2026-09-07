import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Public_Sans } from "next/font/google";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter";
import InitColorSchemeScript from "@mui/material/InitColorSchemeScript";
import "./globals.css";
import ThemeRegistry from "@/components/ThemeRegistry/ThemeRegistry";
import Header from "@/components/layout/Header";
import DateLocalizationProvider from "@/components/providers/DateLocalizationProvider";
import Analytics from "@/components/Analytics/Analytics";
import UpdatePrompt from "@/components/pwa/UpdatePrompt";
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
  // Pages set only their own name; the template appends the app's. They used
  // to hardcode "REP Calc v3", which went stale the moment the major changed.
  title: {
    default: "REP Calc",
    template: "%s | REP Calc",
  },
  description:
    "Calculadora de horas e funcionalidades adicionais de planejamento de jornada de trabalho para uso com relógio eletrônico de ponto.",
  metadataBase: new URL("https://repcalc.leandrofaria.com/"),
  applicationName: "REP Calc",
  appleWebApp: {
    capable: true,
    title: "REP Calc",
    statusBarStyle: "default",
  },
  openGraph: {
    title: "REP Calc",
    description:
      "Calculadora de horas e funcionalidades adicionais de planejamento de jornada de trabalho para uso com relógio eletrônico de ponto.",
    url: "https://repcalc.leandrofaria.com",
    siteName: "REP Calc",
    images: [
      {
        url: "https://repcalc.leandrofaria.com/og.png",
        width: 1200,
        height: 630,
        alt: "REP Calc — calculadora de horas para quem bate ponto",
      },
    ],
    locale: "pt_BR",
    type: "website",
  },
};

// A separate export since Next 14: themeColor inside metadata is deprecated.
// Two entries so the browser chrome follows the colour scheme.
export const viewport: Viewport = {
  // Full width on a phone, which is where this is used.
  width: "device-width",
  initialScale: 1,
  /**
   * Draw behind the phone's system bars.
   *
   * Without this the viewport stops above them, every env(safe-area-inset-*)
   * is zero, and the strip under the app is whatever colour Android paints
   * its navigation bar — white, against a screen that is otherwise edge to
   * edge. With it, those insets carry real values and the app is the one that
   * decides what shows there.
   *
   * It cuts both ways, so the header reserves the top inset in the same
   * change: the status bar area stops being Android's to paint and becomes
   * ours, and without that padding the app's name would sit under the clock.
   */
  viewportFit: "cover",
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
      className={`${display.variable} ${body.variable} app-shell overflow-hidden`}
      suppressHydrationWarning
    >
      <body className="app-shell flex flex-col items-stretch overflow-hidden bg-canvas text-ink antialiased">
        {/* Must be the first child of body: it stamps the colour scheme
            before first paint, so the page never flashes the wrong theme. */}
        <InitColorSchemeScript attribute={COLOR_SCHEME_ATTRIBUTE} />
        {/* enableCssLayer is what puts MUI's styles into @layer mui, which is
            the whole mechanism behind the Tailwind interop in globals.css. */}
        <AppRouterCacheProvider options={{ key: "mui", enableCssLayer: true }}>
          <ThemeRegistry>
            <DateLocalizationProvider>
              <Header />
              {/* Each screen brings its own AppShell, because only the tool
                  screens carry a bottom bar and it has to sit outside the
                  scrolling area. */}
              {children}
              <UpdatePrompt />
            </DateLocalizationProvider>
          </ThemeRegistry>
        </AppRouterCacheProvider>
        <Analytics />
      </body>
    </html>
  );
}
