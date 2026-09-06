"use client";

import { Button } from "@mui/material";
import ResultReadout from "../ui/ResultReadout";
import { formatClock } from "@/lib/time/timeOfDay";
import type { Clock } from "@/lib/jornada/schedule";

/** A "(+1)" suffix says the shift ends on the following day. */
export function formatClockOut(clock: Clock | null): string {
  if (clock === null) return "--:--";
  const suffix = clock.dayOffset > 0 ? ` (+${clock.dayOffset})` : "";
  return `${formatClock(clock.time)}${suffix}`;
}

const JornadaResults = ({
  clockOut,
  earlyClockOut,
  canOpenLivePanel,
  onOpenLivePanel,
}: {
  clockOut: Clock | null;
  earlyClockOut: Clock | null;
  canOpenLivePanel: boolean;
  onOpenLivePanel: () => void;
}) => (
  <>
    <ResultReadout label="Término Previsto:" value={formatClockOut(clockOut)} />
    <ResultReadout
      label="Saída com Tolerância:"
      value={formatClockOut(earlyClockOut)}
      className="mt-6"
    />
    <div className="w-full flex flex-col justify-start items-start mt-6">
      <Button
        variant="outlined"
        sx={{
          marginBottom: "12px",
          textTransform: "capitalize",
          fontWeight: 600,
        }}
        className="w-full my-3"
        disabled={!canOpenLivePanel}
        onClick={onOpenLivePanel}
      >
        Painel em Tempo Real
      </Button>
    </div>
  </>
);

export default JornadaResults;
