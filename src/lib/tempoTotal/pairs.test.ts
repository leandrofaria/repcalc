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
    expect(formatHHMM(result.total)).toBe("04:00");
  });

  it("sums consecutive pairs", () => {
    const result = computePairs([
      pair("a", 8, 0, 12, 0),
      pair("b", 13, 0, 18, 0),
    ]);
    expect(formatHHMM(result.total)).toBe("09:00");
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
    expect(formatHHMM(result.total)).toBe("23:55");
  });

  it("rejects a pair that ends before it starts, naming it", () => {
    const result = computePairs([pair("a", 12, 0, 8, 0)]);
    expect(result.valid).toBe(false);
    expect(result.invalidIndices).toEqual([0]);
    expect(result.incompleteIndices).toEqual([]);
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

  describe("incomplete is not invalid", () => {
    it("does not flag an untouched pair as an error", () => {
      // The whole point: a row nobody has typed into is unfinished, and used
      // to render red the moment it appeared.
      const result = computePairs([emptyPair("a")]);
      expect(result.invalidIndices).toEqual([]);
      expect(result.incompleteIndices).toEqual([0]);
      expect(result.valid).toBe(false);
    });

    it("does not flag a half-filled pair as an error", () => {
      const result = computePairs([{ id: "a", in: fromHM(8, 0), out: null }]);
      expect(result.invalidIndices).toEqual([]);
      expect(result.incompleteIndices).toEqual([0]);
    });

    it("still errors on a later pair that starts before an unfinished one", () => {
      const result = computePairs([
        { id: "a", in: fromHM(8, 0), out: null },
        pair("b", 7, 0, 9, 0),
      ]);
      expect(result.incompleteIndices).toEqual([0]);
      expect(result.invalidIndices).toEqual([1]);
    });
  });

  describe("the total grows as the form is filled", () => {
    it("counts complete pairs while a later one is still empty", () => {
      // Previously the total stayed blank until the very last field.
      const result = computePairs([pair("a", 8, 0, 12, 0), emptyPair("b")]);
      expect(formatHHMM(result.total)).toBe("04:00");
      expect(result.valid).toBe(false);
    });

    it("is zero for no pairs at all", () => {
      expect(computePairs([])).toEqual({
        total: 0,
        valid: true,
        invalidIndices: [],
        incompleteIndices: [],
      });
    });
  });
});
