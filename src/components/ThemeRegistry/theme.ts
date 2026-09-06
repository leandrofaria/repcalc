import { createTheme } from "@mui/material/styles";
import {
  COLOR_SCHEME_ATTRIBUTE,
  DARK,
  LIGHT,
  RADIUS,
  type Tokens,
} from "@/lib/design/tokens";

// Augments the palette with the neutral colour used by the calculator's
// operator keys, and a unit colour for its h and min keys.
declare module "@mui/material/styles" {
  interface Palette {
    neutral: Palette["primary"];
    unit: Palette["primary"];
  }

  interface PaletteOptions {
    neutral?: PaletteOptions["primary"];
    unit?: PaletteOptions["primary"];
  }
}

// Makes those colours available to Button's color prop.
declare module "@mui/material/Button" {
  interface ButtonPropsColorOverrides {
    neutral: true;
    unit: true;
  }
}

/**
 * Both schemes answer the same roles, so neither is an inversion of the
 * other. contrastText is always explicit: MUI computes it from luminance,
 * which is not a call to leave to a formula on a keypad.
 */
function paletteFor(t: Tokens) {
  return {
    primary: { main: t.brand, dark: t.brandDark, contrastText: t.onBrand },
    // The digit keys.
    secondary: { main: t.keyFace, contrastText: t.keyInk },
    // The operator keys.
    neutral: { main: t.opFace, contrastText: t.opInk },
    // The h and min keys: tinted, so they read as neither digit nor operator.
    unit: { main: t.unitFace, contrastText: t.unitInk },
    error: { main: t.dangerFace, contrastText: t.dangerInk },
    warning: { main: t.warn },
    success: { main: t.brand, contrastText: t.onBrand },
    background: { default: t.canvas, paper: t.surface },
    text: { primary: t.ink, secondary: t.inkMuted, disabled: t.inkFaint },
    divider: t.hairline,
  };
}

const theme = createTheme({
  // MUI stamps the attribute on <html>; globals.css redefines Tailwind's
  // dark: variant to key off the very same one, so a single toggle drives
  // both systems.
  cssVariables: { colorSchemeSelector: COLOR_SCHEME_ATTRIBUTE },
  colorSchemes: {
    light: { palette: paletteFor(LIGHT) },
    dark: { palette: paletteFor(DARK) },
  },
  shape: { borderRadius: RADIUS },
  typography: {
    // Both faces are loaded once, in the root layout, and exposed as CSS
    // variables. Calling next/font here as well produced a second @font-face
    // and made this module unusable outside a Next build.
    fontFamily: "var(--font-body), ui-sans-serif, system-ui, sans-serif",
    h1: { fontFamily: "var(--font-display), sans-serif", fontWeight: 700 },
    h2: { fontFamily: "var(--font-display), sans-serif", fontWeight: 700 },
    button: { textTransform: "none", fontWeight: 600, letterSpacing: 0 },
  },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
      // Comfortable on a phone held at arm's length in front of a clock.
      styleOverrides: { root: { minHeight: 44, paddingInline: 18 } },
    },
    MuiPaper: { styleOverrides: { root: { backgroundImage: "none" } } },
  },
});

export default theme;
