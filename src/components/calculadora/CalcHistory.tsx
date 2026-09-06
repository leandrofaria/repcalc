const CalcHistory = ({ entries }: { entries: readonly string[] }) => (
  <div className="w-full">
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
  </div>
);

export default CalcHistory;
