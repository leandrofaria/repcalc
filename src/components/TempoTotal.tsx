"use client";

import { Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useMemo, useRef, useState } from "react";
import type { Dayjs } from "dayjs";
import ContentContainer from "./layout/ContentContainer";
import PunchRow from "./tempoTotal/PunchRow";
import {
  MAX_PAIRS,
  MIN_PAIRS,
  computePairs,
  emptyPair,
  type PunchPair,
} from "@/lib/tempoTotal/pairs";
import { formatHHMM } from "@/lib/time/duration";
import { dayjsToTimeOfDay } from "@/lib/time/dayjs";
import PunchPaste from "./punches/PunchPaste";
import { stillClockedIn } from "@/lib/punches/parse";

const TempoTotal = () => {
  const [pairs, setPairs] = useState<PunchPair[]>([emptyPair("pair-0")]);
  // Ids are handed out on user action only, so the server and the first
  // client render always agree on the initial pair.
  const nextId = useRef(1);

  const result = useMemo(() => computePairs(pairs), [pairs]);
  const counted = result.pairs.filter(
    (state) => !state.incomplete && !state.invalid
  ).length;
  const hasInvalid = result.pairs.some((state) => state.invalid);
  const crossesMidnight = result.pairs.some((state) => state.dayOffset > 0);

  const updateEntry = (
    id: string,
    side: "in" | "out",
    value: Dayjs | null
  ): void => {
    setPairs((previous) =>
      previous.map((pair) =>
        pair.id === id ? { ...pair, [side]: dayjsToTimeOfDay(value) } : pair
      )
    );
  };

  return (
    <ContentContainer>
      <h1 className="sr-only">Tempo total de trabalho</h1>

      <section
        aria-label="Total trabalhado"
        className="w-full rounded-[12px] border border-result-edge bg-surface p-5 text-center"
      >
        <p className="text-sm text-ink-muted">Total trabalhado</p>
        <output
          aria-live="polite"
          className="tabular block font-display text-5xl font-extrabold leading-none tracking-tight text-figure"
        >
          {formatHHMM(result.total)}
        </output>
        <p className="mt-2 text-sm text-ink-muted">
          {counted === 0
            ? "Preencha pelo menos um par de marcações"
            : `em ${counted} ${counted === 1 ? "par" : "pares"} de marcações`}
          {crossesMidnight && (
            <span className="ml-1 font-medium text-brand">
              &middot; a sequência passa da meia-noite
            </span>
          )}
          {hasInvalid && (
            <span className="ml-1 font-semibold text-danger-ink">
              &middot; há marcações repetidas
            </span>
          )}
        </p>
      </section>

      <div className="flex w-full flex-col gap-3">
        {pairs.map((pair, index) => (
          <PunchRow
            key={pair.id}
            pair={pair}
            index={index}
            state={result.pairs[index]}
            canRemove={pairs.length > MIN_PAIRS}
            onChange={(side, value) => updateEntry(pair.id, side, value)}
            onRemove={() =>
              setPairs((previous) => previous.filter((p) => p.id !== pair.id))
            }
          />
        ))}
      </div>

      <PunchPaste
        hint="A linha do sistema oficial. Cada duas marcações formam um par; uma marcação sobrando fica em aberto."
        describe={(times) => {
          const complete = Math.floor(times.length / 2);
          const pairs = `${complete} ${complete === 1 ? "par" : "pares"}`;
          return stillClockedIn(times)
            ? `${pairs} e uma marcação em aberto`
            : pairs;
        }}
        onApply={(times) => {
          // Two marks make a pair; an odd one out is someone still on the
          // clock, so its row is left half-filled rather than refused.
          const filled: PunchPair[] = [];
          for (let index = 0; index < times.length; index += 2) {
            filled.push({
              id: `pair-${nextId.current++}`,
              in: times[index],
              out: times[index + 1] ?? null,
            });
          }
          setPairs(filled.slice(0, MAX_PAIRS));
        }}
      />

      <Button
        variant="outlined"
        startIcon={<AddIcon />}
        disabled={pairs.length >= MAX_PAIRS}
        onClick={() =>
          setPairs((previous) => [
            ...previous,
            emptyPair(`pair-${nextId.current++}`),
          ])
        }
        sx={{ borderStyle: "dashed" }}
      >
        Adicionar par
      </Button>
    </ContentContainer>
  );
};

export default TempoTotal;
