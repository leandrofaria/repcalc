const CalcHistory = ({ entries }: { entries: readonly string[] }) => (
  <section
    aria-label="Histórico"
    className="w-full rounded-[12px] border border-hairline bg-surface p-4"
  >
    <h2 className="mb-2 font-display text-base font-bold">Histórico</h2>
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
