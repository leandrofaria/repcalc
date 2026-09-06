"use client";

import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";

/**
 * Pinned to light for now. Both colour schemes are defined in the theme, but
 * the toggle and the system default arrive with the visual pass, so this
 * migration does not change what anyone currently sees.
 */
const ThemeRegistry = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider theme={theme} defaultMode="light">
    <CssBaseline />
    {children}
  </ThemeProvider>
);

export default ThemeRegistry;
