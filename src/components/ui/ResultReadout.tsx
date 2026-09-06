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
      <p id={id} className="font-semibold mb-1">
        {label}
      </p>
      <output
        aria-labelledby={id}
        aria-live="polite"
        className="block w-full rounded border border-[#1976D2] bg-[#EFF3F8] px-3 py-[9px] text-center text-[21px] font-bold text-[#1976D2]"
      >
        {value}
      </output>
    </div>
  );
};

export default ResultReadout;
