"use client";

import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";

/**
 * Follows the operating system by default, and remembers an explicit choice.
 */
const ThemeRegistry = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider theme={theme} defaultMode="system">
    <CssBaseline />
    {children}
  </ThemeProvider>
);

export default ThemeRegistry;
