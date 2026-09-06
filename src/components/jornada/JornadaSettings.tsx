"use client";

import { Button } from "@mui/material";

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
  <div className="mt-4 flex w-full flex-row items-center gap-2 sm:flex-col sm:gap-3">
    <Button
      variant="contained"
      className="w-full"
      disabled={!canSave}
      onClick={onSave}
    >
      Salvar definições
    </Button>
    <Button
      variant="outlined"
      color="primary"
      className="w-full"
      onClick={onReset}
    >
      Resetar definições
    </Button>
    <p
      className="min-h-[20px] text-sm font-semibold text-brand"
      role="status"
      aria-live="polite"
    >
      {confirmation ?? ""}
    </p>
  </div>
);

export default JornadaSettings;
