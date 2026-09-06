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
  <div className="flex w-full flex-col gap-4">
    <ResultReadout label="Término previsto" value={formatClockOut(clockOut)} />
    <ResultReadout
      label="Saída com tolerância"
      value={formatClockOut(earlyClockOut)}
    />
    <Button
      variant="outlined"
      className="w-full"
      disabled={!canOpenLivePanel}
      onClick={onOpenLivePanel}
    >
      Painel em tempo real
    </Button>
  </div>
);

export default JornadaResults;
