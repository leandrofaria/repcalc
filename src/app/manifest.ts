import type { MetadataRoute } from "next";
import { DARK, LIGHT } from "@/lib/design/tokens";

/**
 * Declared as a Metadata Route rather than a static file so it cannot drift
 * from the palette or from the routes the app actually has.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "REP Calc",
    short_name: "REP Calc",
    description:
      "Calculadora de horas e planejamento de jornada para uso com relógio eletrônico de ponto.",
    lang: "pt-BR",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    // Experiment, 2026-09-07: the strip Android paints under the installed
    // app is the same colour this is, and the page has no reach into it —
    // the diagnostics put every safe-area inset at zero in standalone, with
    // the window 68px shorter than the screen, so those 68px are outside it.
    // If the strip follows this value it turns brand; if it stays pale, it is
    // the body's own background or the system default, and neither is ours.
    //
    // It also happens to be the better splash: the app opens on a brand
    // header, and starting there is less of a jump than starting on canvas.
    background_color: LIGHT.brand,
    theme_color: LIGHT.brand,
    categories: ["productivity", "utilities"],
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      {
        src: "/icons/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    // Long-press the installed icon to jump straight to a feature.
    shortcuts: [
      {
        name: "Calculadora",
        url: "/calculadora",
        icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }],
      },
      {
        name: "Jornada de Trabalho",
        url: "/jornada",
        icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }],
      },
      {
        name: "Tempo Total",
        url: "/tempo-total",
        icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }],
      },
    ],
  };
}
