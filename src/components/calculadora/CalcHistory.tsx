const CalcHistory = ({ entries }: { entries: readonly string[] }) => (
  <>
    <h2 className="font-semibold mb-1">Histórico:</h2>
    {entries.length === 0 ? (
      <p className="text-ink-muted">Nenhum cálculo ainda.</p>
    ) : (
      <ol className="list-none p-0 m-0">
        {entries.map((entry, index) => (
          <li key={`${index}-${entry}`}>{entry}</li>
        ))}
      </ol>
    )}
  </>
);

export default CalcHistory;
