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
  <div className="flex w-full flex-col gap-2">
    <div className="grid grid-cols-2 gap-2">
      <Button variant="outlined" disabled={!canSave} onClick={onSave}>
        Salvar definições
      </Button>
      <Button variant="outlined" color="primary" onClick={onReset}>
        Resetar
      </Button>
    </div>
    <p
      className="min-h-[20px] text-center text-sm font-semibold text-brand"
      role="status"
      aria-live="polite"
    >
      {confirmation ?? ""}
    </p>
  </div>
);

export default JornadaSettings;
