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
    // Android decides the system bars from these, and it does not use them as
    // colours: it reads their luminance and picks black or white. A manifest
    // carries one value, so it cannot answer per colour scheme the way the
    // page can. Black, on both, makes the frame the same in either mode —
    // where the app begins and where it ends — instead of matching one scheme
    // and fighting the other.
    background_color: "#000000",
    theme_color: "#000000",
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
