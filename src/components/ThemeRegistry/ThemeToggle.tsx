"use client";

import { IconButton, Tooltip } from "@mui/material";
import { useColorScheme } from "@mui/material/styles";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";

/**
 * Switches the colour scheme for MUI and Tailwind at once, since both key off
 * the same attribute on <html>.
 *
 * useColorScheme returns undefined on the first render by design, because the
 * real value is only known in the browser. Rendering a same-sized placeholder
 * until then keeps the header from shifting and avoids a hydration mismatch;
 * InitColorSchemeScript has already painted the right scheme by that point.
 */
const ThemeToggle = () => {
  const { mode, systemMode, setMode } = useColorScheme();

  if (mode === undefined) {
    return <span aria-hidden className="inline-block w-10 h-10" />;
  }

  const resolved = mode === "system" ? systemMode : mode;
  const goingDark = resolved !== "dark";
  const label = goingDark ? "Ativar o modo escuro" : "Ativar o modo claro";

  return (
    <Tooltip title={label}>
      <IconButton
        onClick={() => setMode(goingDark ? "dark" : "light")}
        aria-label={label}
        size="small"
        sx={{ color: "inherit" }}
      >
        {goingDark ? (
          <DarkModeOutlinedIcon fontSize="small" />
        ) : (
          <LightModeOutlinedIcon fontSize="small" />
        )}
      </IconButton>
    </Tooltip>
  );
};

export default ThemeToggle;
