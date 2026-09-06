"use client";

import { Button } from "@mui/material";

const ACTION_SX = {
  marginBottom: "12px",
  textTransform: "capitalize",
  fontWeight: 600,
} as const;

const JornadaSettings = ({
  canSave,
  confirmation,
  onSave,
  onReset,
}: {
  canSave: boolean;
  confirmation: string | null;
  onSave: () => void;
  onReset: () => void;
}) => (
  <div className="w-full flex flex-row sm:flex-col justify-start items-center">
    <Button
      variant="contained"
      sx={ACTION_SX}
      className="w-full my-3"
      disabled={!canSave}
      onClick={onSave}
    >
      Salvar Definições
    </Button>
    <div className="sm:hidden w-[21px]" />
    <Button
      variant="contained"
      color="error"
      sx={ACTION_SX}
      className="w-full my-3"
      onClick={onReset}
    >
      Resetar Definições
    </Button>
    <p
      className="pt-1 text-[color:var(--mui-palette-success-dark)] font-semibold"
      role="status"
      aria-live="polite"
    >
      {confirmation ?? ""}
    </p>
  </div>
);

export default JornadaSettings;
