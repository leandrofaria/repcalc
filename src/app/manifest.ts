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
    background_color: LIGHT.canvas,
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
