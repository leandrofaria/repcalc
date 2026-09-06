import { render, type RenderOptions } from "@testing-library/react";
import { ThemeProvider } from "@mui/material/styles";
import DateLocalizationProvider from "./providers/DateLocalizationProvider";
import theme from "./ThemeRegistry/theme";

/** Renders with the providers the app supplies in its root layout. */
export function renderWithProviders(
  ui: React.ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) {
  return render(ui, {
    wrapper: ({ children }) => (
      <ThemeProvider theme={theme}>
        <DateLocalizationProvider>{children}</DateLocalizationProvider>
      </ThemeProvider>
    ),
    ...options,
  });
}
