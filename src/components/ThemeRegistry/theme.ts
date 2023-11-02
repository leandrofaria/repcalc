import { Blinker } from "next/font/google";
import { createTheme } from "@mui/material/styles";
import { blueGrey } from "@mui/material/colors";

const blinker = Blinker({
  weight: ["300", "400", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

// Augment the palette to include an ochre color
declare module "@mui/material/styles" {
  interface Palette {
    neutral: Palette["primary"];
  }

  interface PaletteOptions {
    neutral?: PaletteOptions["primary"];
  }
}

// Update the Button's color options to include an ochre option
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
    fontFamily: blinker.style.fontFamily,
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
