import { describe, expect, it } from "vitest";
import { fromHM } from "../time/timeOfDay";
import { formatHHMM } from "../time/duration";
import { computePairs, emptyPair, type PunchPair } from "./pairs";

function pair(
  id: string,
  inH: number,
  inM: number,
  outH: number,
  outM: number
): PunchPair {
  return { id, in: fromHM(inH, inM), out: fromHM(outH, outM) };
}

describe("computePairs", () => {
  it("sums a single pair", () => {
    const result = computePairs([pair("a", 8, 0, 12, 0)]);
    expect(result.valid).toBe(true);
    expect(formatHHMM(result.total!)).toBe("04:00");
  });

  it("sums consecutive pairs", () => {
    const result = computePairs([
      pair("a", 8, 0, 12, 0),
      pair("b", 13, 0, 18, 0),
    ]);
    expect(formatHHMM(result.total!)).toBe("09:00");
  });

  it("matches production on a full day of five pairs", () => {
    // Ground truth captured before the refactor: 23:55.
    const result = computePairs([
      pair("a", 0, 0, 5, 6),
      pair("b", 5, 7, 10, 13),
      pair("c", 10, 14, 15, 20),
      pair("d", 15, 21, 20, 27),
      pair("e", 20, 28, 23, 59),
    ]);
    expect(formatHHMM(result.total!)).toBe("23:55");
  });

  it("rejects a pair that ends before it starts, naming it", () => {
    const result = computePairs([pair("a", 12, 0, 8, 0)]);
    expect(result.valid).toBe(false);
    expect(result.total).toBeNull();
    expect(result.invalidIndices).toEqual([0]);
  });

  it("rejects a pair that starts before the previous one ended", () => {
    const result = computePairs([
      pair("a", 8, 0, 12, 0),
      pair("b", 11, 0, 18, 0),
    ]);
    expect(result.invalidIndices).toEqual([1]);
  });

  it("rejects a zero-length pair", () => {
    expect(computePairs([pair("a", 8, 0, 8, 0)]).valid).toBe(false);
  });

  it("treats an unfilled pair as incomplete rather than an error in the sum", () => {
    const result = computePairs([pair("a", 8, 0, 12, 0), emptyPair("b")]);
    expect(result.valid).toBe(false);
    expect(result.invalidIndices).toEqual([1]);
  });

  it("is valid and zero for no pairs at all", () => {
    expect(computePairs([])).toEqual({
      total: 0,
      valid: true,
      invalidIndices: [],
    });
  });
});
