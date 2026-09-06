/**
 * The single source of truth for colour: the "Turno" direction.
 *
 * TypeScript holds it rather than CSS because MUI's alpha() and
 * getContrastText() need real hex values, not var() references. tokens.css
 * mirrors these onto custom properties for Tailwind, and a test asserts the
 * two never drift apart.
 *
 * Roles, not shades: a token says what a colour is for, so the dark scheme
 * can answer each role differently instead of inverting the light one.
 */
export type Tokens = {
  /** The accent. One hue, used sparingly, on actions and figures. */
  brand: string;
  brandDark: string;
  onBrand: string;

  canvas: string;
  surface: string;

  ink: string;
  inkMuted: string;
  inkFaint: string;

  hairline: string;
  fieldEdge: string;

  /** Computed times: the numbers the app exists to show. */
  figure: string;
  result: string;
  resultEdge: string;

  calcFace: string;
  calcEdge: string;
  calcMemory: string;

  /* Three visibly distinct steps, so digits, operators and units are told
     apart by weight of fill, not only by position on the pad. */
  keyFace: string;
  keyInk: string;
  unitFace: string;
  unitInk: string;
  opFace: string;
  opInk: string;

  dangerFace: string;
  dangerInk: string;

  /** Past the tolerance. Semantic, and deliberately not the accent hue. */
  warn: string;
  okBg: string;
  okText: string;
};

export const LIGHT: Tokens = {
  brand: "#0F766E",
  brandDark: "#0B5D57",
  onBrand: "#FFFFFF",

  canvas: "#F2F4F3",
  surface: "#FFFFFF",

  ink: "#131817",
  inkMuted: "#576260",
  inkFaint: "#8A9491",

  hairline: "#E6EBE9",
  fieldEdge: "#DDE2E0",

  figure: "#0B3D38",
  result: "#E6F2F0",
  resultEdge: "#B9D6D2",

  calcFace: "#F7F9F8",
  calcEdge: "#DDE2E0",
  calcMemory: "#EEF2F1",

  keyFace: "#E9EDEC",
  keyInk: "#1A2422",
  unitFace: "#A7D5CE",
  unitInk: "#06322E",
  opFace: "#CFDCDA",
  opInk: "#17332F",

  dangerFace: "#F5DED9",
  dangerInk: "#9C3520",

  warn: "#B4531D",
  okBg: "#DCECE9",
  okText: "#0F766E",
};

export const DARK: Tokens = {
  brand: "#4FD1C5",
  brandDark: "#3BB5AA",
  onBrand: "#08201E",

  canvas: "#0F1413",
  surface: "#171D1C",

  ink: "#E7ECEA",
  inkMuted: "#9AA5A2",
  inkFaint: "#6F7A77",

  hairline: "#212827",
  fieldEdge: "#2B3433",

  figure: "#B8F0E9",
  result: "#142825",
  resultEdge: "#2F4B47",

  calcFace: "#141A19",
  calcEdge: "#242C2B",
  calcMemory: "#131817",

  keyFace: "#1E2625",
  keyInk: "#E7ECEA",
  unitFace: "#17423C",
  unitInk: "#8FE5DB",
  opFace: "#2A3937",
  opInk: "#BFD0CD",

  dangerFace: "#33201C",
  dangerInk: "#EB9481",

  warn: "#E8975A",
  okBg: "#122B28",
  okText: "#4FD1C5",
};

export const COLOR_SCHEME_ATTRIBUTE = "data-mui-color-scheme";

/** Generous enough to read as a touch target on a phone. */
export const RADIUS = 9;
