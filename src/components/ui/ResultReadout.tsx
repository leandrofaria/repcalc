import { useId } from "react";

/**
 * A computed result.
 *
 * These were rendered as disabled text inputs, which cannot be focused, are
 * not announced, and were the sole reason globals.css reached into MUI's
 * internals with !important. An output element in a polite live region gets
 * announced when the value changes.
 */
const ResultReadout = ({
  label,
  value,
  className = "",
}: {
  label: string;
  value: string;
  className?: string;
}) => {
  const id = useId();

  return (
    <div className={`w-full ${className}`}>
      <p id={id} className="mb-1 text-sm font-medium text-ink-muted">
        {label}
      </p>
      <output
        aria-labelledby={id}
        aria-live="polite"
        className="tabular block w-full rounded-[9px] border border-result-edge bg-result px-3 py-2.5 text-center font-display text-2xl font-bold text-figure"
      >
        {value}
      </output>
    </div>
  );
};

export default ResultReadout;
