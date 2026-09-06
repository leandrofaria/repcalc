import { createTheme } from "@mui/material/styles";
import { COLOR_SCHEME_ATTRIBUTE, DARK, LIGHT } from "@/lib/design/tokens";

// Augments the palette with the neutral colour used by the calculator's
// operator keys.
declare module "@mui/material/styles" {
  interface Palette {
    neutral: Palette["primary"];
  }

  interface PaletteOptions {
    neutral?: PaletteOptions["primary"];
  }
}

// Makes that colour available to Button's color prop.
declare module "@mui/material/Button" {
  interface ButtonPropsColorOverrides {
    neutral: true;
  }
}

const theme = createTheme({
  // MUI stamps the attribute on <html>; globals.css redefines Tailwind's
  // dark: variant to key off the very same one, so a single toggle drives
  // both systems.
  cssVariables: { colorSchemeSelector: COLOR_SCHEME_ATTRIBUTE },
  colorSchemes: {
    light: {
      palette: {
        primary: { main: LIGHT.brand, dark: LIGHT.brandDark },
        // contrastText is explicit: MUI would compute dark text against
        // this blue-grey, and the calculator's digits have always been white.
        secondary: {
          main: "#90A4AE",
          light: "#CFD8DC",
          dark: "#607D8B",
          contrastText: "#FFFFFF",
        },
        neutral: {
          main: "#455A64",
          light: "#607D8B",
          dark: "#263238",
          contrastText: "#FFFFFF",
        },
        background: { default: LIGHT.canvas, paper: LIGHT.surface },
        text: { primary: LIGHT.ink, secondary: LIGHT.inkMuted },
        divider: LIGHT.hairline,
      },
    },
    dark: {
      palette: {
        primary: { main: DARK.brand, dark: DARK.brandDark },
        secondary: {
          main: "#546E7A",
          light: "#78909C",
          dark: "#37474F",
          contrastText: "#FFFFFF",
        },
        neutral: {
          main: "#37474F",
          light: "#546E7A",
          dark: "#263238",
          contrastText: "#FFFFFF",
        },
        background: { default: DARK.canvas, paper: DARK.surface },
        text: { primary: DARK.ink, secondary: DARK.inkMuted },
        divider: DARK.hairline,
      },
    },
  },
  typography: {
    // The font is loaded once, in the root layout, and exposed as a CSS
    // variable. Calling next/font here as well produced a second @font-face
    // and made this module unusable outside a Next build.
    fontFamily: "var(--font-blinker), ui-sans-serif, system-ui, sans-serif",
  },
});

export default theme;
