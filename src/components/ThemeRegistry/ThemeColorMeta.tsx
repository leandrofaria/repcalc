"use client";

import { useEffect } from "react";
import { useColorScheme } from "@mui/material/styles";

/**
 * Keeps the phone's status bar the colour of the header it sits above.
 *
 * The server renders one `theme-color` per colour scheme, which answers the
 * *system* preference. This app's scheme is a switch in its own header, so the
 * two disagree the moment someone reads a light phone in dark mode: the status
 * bar came out brand green above a near-black header.
 *
 * The colour is read from the header rather than named again here. In dark
 * mode MUI's AppBar quietly drops the `primary` colour and paints itself with
 * the paper background instead, so any value written down here would have been
 * a second, wrong copy. Reading it means the bar cannot disagree with the
 * thing it continues.
 *
 * `theme-color` is the standard way to ask for this, and it is what iOS reads
 * in standalone too, so the same mechanism covers both platforms.
 */
const ThemeColorMeta = () => {
  const { mode, systemMode } = useColorScheme();
  const resolved = mode === "system" ? systemMode : mode;

  useEffect(() => {
    const source = document.querySelector("[data-theme-color-source]");
    if (source === null) return;

    const colour = getComputedStyle(source).backgroundColor;
    if (colour === "" || colour === "rgba(0, 0, 0, 0)") return;

    // The server's pair answers the system preference, which is the very
    // thing being corrected, so they go.
    for (const meta of document.querySelectorAll(
      'meta[name="theme-color"][media]'
    )) {
      meta.remove();
    }

    const existing = document.querySelector<HTMLMetaElement>(
      'meta[name="theme-color"]:not([media])'
    );
    const meta = existing ?? document.createElement("meta");
    if (existing === null) {
      meta.name = "theme-color";
      document.head.appendChild(meta);
    }
    meta.content = colour;
  }, [resolved]);

  return null;
};

export default ThemeColorMeta;
