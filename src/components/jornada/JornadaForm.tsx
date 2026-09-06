"use client";

import TimeField from "../fields/TimeField";
import type { JornadaInput } from "@/lib/jornada/schedule";
import {
  dayjsToDuration,
  dayjsToTimeOfDay,
  durationToDayjs,
  timeOfDayToDayjs,
} from "@/lib/time/dayjs";

const JornadaForm = ({
  input,
  onChange,
}: {
  input: JornadaInput;
  onChange: (patch: Partial<JornadaInput>) => void;
}) => (
  <div className="grid w-full grid-cols-2 gap-3">
    <TimeField
      label="Início"
      value={timeOfDayToDayjs(input.start)}
      onChange={(value) => onChange({ start: dayjsToTimeOfDay(value) })}
    />
    <TimeField
      label="Jornada"
      value={durationToDayjs(input.workday)}
      onChange={(value) => onChange({ workday: dayjsToDuration(value) })}
    />
    <TimeField
      label="Intervalo"
      value={durationToDayjs(input.breakTime)}
      onChange={(value) => onChange({ breakTime: dayjsToDuration(value) })}
    />
    <TimeField
      label="Tolerância"
      value={durationToDayjs(input.tolerance)}
      onChange={(value) => onChange({ tolerance: dayjsToDuration(value) })}
    />
  </div>
);

export default JornadaForm;
