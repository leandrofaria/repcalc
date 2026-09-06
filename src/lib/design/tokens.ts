/**
 * The single source of truth for colour.
 *
 * TypeScript holds it rather than CSS because MUI's alpha() and
 * getContrastText() need real hex values, not var() references. tokens.css
 * mirrors these onto custom properties for Tailwind, and a test asserts the
 * two never drift apart.
 */
export type Tokens = {
  brand: string;
  brandDark: string;
  canvas: string;
  surface: string;
  ink: string;
  inkMuted: string;
  hairline: string;
  calcFace: string;
  calcEdge: string;
  calcMemory: string;
  footerEdge: string;
};

export const LIGHT: Tokens = {
  brand: "#1976D2",
  brandDark: "#115293",
  canvas: "#EFF3F8",
  surface: "#FFFFFF",
  ink: "#333333",
  inkMuted: "#696969",
  hairline: "#E9E9E9",
  calcFace: "#EFF3F8",
  calcEdge: "#C6D1DF",
  calcMemory: "#94A3B8",
  footerEdge: "#A4D1FF",
};

export const DARK: Tokens = {
  brand: "#7CB8F5",
  brandDark: "#4E93D8",
  canvas: "#0B1017",
  surface: "#121A24",
  ink: "#E6EDF5",
  inkMuted: "#9FB0C3",
  hairline: "#243040",
  calcFace: "#121A24",
  calcEdge: "#2A3947",
  calcMemory: "#37474F",
  footerEdge: "#2A3947",
};

export const COLOR_SCHEME_ATTRIBUTE = "data-mui-color-scheme";
