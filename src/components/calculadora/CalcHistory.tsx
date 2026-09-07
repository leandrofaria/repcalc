"use client";

import { Button } from "@mui/material";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";

const CalcHistory = ({
  entries,
  onClear,
}: {
  entries: readonly string[];
  onClear: () => void;
}) => (
  <section
    aria-label="Histórico"
    className="w-full rounded-[12px] border border-hairline bg-surface p-4"
  >
    <div className="mb-2 flex flex-row items-center justify-between gap-2">
      <h2 className="font-display text-base font-bold">Histórico</h2>
      {entries.length > 0 && (
        <Button
          size="small"
          startIcon={<DeleteOutlinedIcon fontSize="small" />}
          onClick={onClear}
          // Distinct from the keypad's C, which is also "Limpar".
          aria-label="Limpar histórico"
          sx={{ minHeight: 32, paddingInline: 1 }}
        >
          Limpar
        </Button>
      )}
    </div>
    {entries.length === 0 ? (
      <p className="text-sm text-ink-faint">Nenhum cálculo ainda.</p>
    ) : (
      <ol className="tabular m-0 list-none divide-y divide-hairline p-0 text-sm text-ink-muted">
        {entries.map((entry, index) => (
          <li key={`${index}-${entry}`} className="py-1.5">
            {entry}
          </li>
        ))}
      </ol>
    )}
  </section>
);

export default CalcHistory;
