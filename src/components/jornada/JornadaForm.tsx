"use client";

import { Button } from "@mui/material";
import CalculateIcon from "@mui/icons-material/Calculate";
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
  onOpenBreakCalculator,
}: {
  input: JornadaInput;
  onChange: (patch: Partial<JornadaInput>) => void;
  onOpenBreakCalculator: () => void;
}) => (
  <div className="w-full grid grid-flow-row grid-cols-2 gap-6 mb-6">
    <TimeField
      label="Horário de Início"
      value={timeOfDayToDayjs(input.start)}
      onChange={(value) => onChange({ start: dayjsToTimeOfDay(value) })}
    />
    <TimeField
      label="Duração da Jornada"
      value={durationToDayjs(input.workday)}
      onChange={(value) => onChange({ workday: dayjsToDuration(value) })}
    />
    <TimeField
      label="Duração do Intervalo"
      value={durationToDayjs(input.breakTime)}
      onChange={(value) => onChange({ breakTime: dayjsToDuration(value) })}
      startAdornment={
        <Button
          variant="contained"
          disableElevation
          size="medium"
          aria-label="Calcular a duração do intervalo"
          sx={{ padding: "6.6px", borderRadius: "4px 0 0 4px" }}
          onClick={onOpenBreakCalculator}
        >
          <CalculateIcon fontSize="large" />
        </Button>
      }
    />
    <TimeField
      label="Tolerância Permitida"
      value={durationToDayjs(input.tolerance)}
      onChange={(value) => onChange({ tolerance: dayjsToDuration(value) })}
    />
  </div>
);

export default JornadaForm;
