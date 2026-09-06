import { createTheme } from "@mui/material/styles";
import { blueGrey } from "@mui/material/colors";

// Augment the palette with a neutral colour, used by the calculator's
// operator keys.
declare module "@mui/material/styles" {
  interface Palette {
    neutral: Palette["primary"];
  }

  interface PaletteOptions {
    neutral?: PaletteOptions["primary"];
  }
}

// Make that colour available to Button's color prop.
declare module "@mui/material/Button" {
  interface ButtonPropsColorOverrides {
    neutral: true;
  }
}

const theme = createTheme({
  palette: {
    mode: "light",
    secondary: {
      light: blueGrey[100],
      main: blueGrey[300],
      dark: blueGrey[500],
      contrastText: "#FFFFFF",
    },
    neutral: {
      light: blueGrey[500],
      main: blueGrey[700],
      dark: blueGrey[900],
      contrastText: "#FFFFFF",
    },
  },
  typography: {
    // The font is loaded once, in the root layout, and exposed as a CSS
    // variable. Calling next/font here as well produced a second @font-face
    // and a duplicated preload, and made this module unusable outside a
    // Next build.
    fontFamily: "var(--font-blinker), ui-sans-serif, system-ui, sans-serif",
  },
  components: {
    MuiAlert: {
      styleOverrides: {
        root: ({ ownerState }) => ({
          ...(ownerState.severity === "info" && {
            backgroundColor: "#60a5fa",
          }),
        }),
      },
    },
  },
});

export default theme;
