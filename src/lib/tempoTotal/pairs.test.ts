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

const totalOf = (pairs: PunchPair[]) => formatHHMM(computePairs(pairs).total);

describe("computePairs", () => {
  it("sums a single pair", () => {
    const result = computePairs([pair("a", 8, 0, 12, 0)]);
    expect(result.valid).toBe(true);
    expect(formatHHMM(result.total)).toBe("04:00");
  });

  it("sums consecutive pairs", () => {
    expect(totalOf([pair("a", 8, 0, 12, 0), pair("b", 13, 0, 18, 0)])).toBe(
      "09:00"
    );
  });

  it("matches production on a full day of five pairs", () => {
    // Ground truth captured before the refactor: 23:55.
    expect(
      totalOf([
        pair("a", 0, 0, 5, 6),
        pair("b", 5, 7, 10, 13),
        pair("c", 10, 14, 15, 20),
        pair("d", 15, 21, 20, 27),
        pair("e", 20, 28, 23, 59),
      ])
    ).toBe("23:55");
  });

  describe("crossing midnight", () => {
    it("reads a later pair with an earlier clock as the next day", () => {
      // Two shifts either side of midnight: an hour, then half an hour.
      // Both previous versions called this "out of order" and refused it.
      const pairs = [pair("a", 22, 0, 23, 0), pair("b", 0, 0, 0, 30)];
      const result = computePairs(pairs);
      expect(formatHHMM(result.total)).toBe("01:30");
      expect(result.valid).toBe(true);
      expect(result.pairs.map((p) => p.dayOffset)).toEqual([0, 1]);
    });

    it("reads the same clocks in the other order as the same day", () => {
      // Called in at dawn, then the usual evening shift.
      const pairs = [pair("a", 0, 0, 0, 30), pair("b", 22, 0, 23, 0)];
      const result = computePairs(pairs);
      expect(formatHHMM(result.total)).toBe("01:30");
      expect(result.pairs.map((p) => p.dayOffset)).toEqual([0, 0]);
    });

    it("handles a single pair that runs past midnight", () => {
      const result = computePairs([pair("a", 22, 0, 6, 0)]);
      expect(formatHHMM(result.total)).toBe("08:00");
      expect(result.valid).toBe(true);
    });

    it("keeps counting past twenty-four hours across a sequence", () => {
      const result = computePairs([
        pair("a", 22, 0, 10, 0), // 12h, ends next day
        pair("b", 12, 0, 23, 0), // 11h, same day as the end above
      ]);
      expect(formatHHMM(result.total)).toBe("23:00");
      expect(result.pairs.map((p) => p.dayOffset)).toEqual([0, 1]);
    });
  });

  describe("what is still refused", () => {
    it("refuses a pair whose two readings are identical", () => {
      // Zero minutes or exactly a day, with no way to tell which.
      const result = computePairs([pair("a", 8, 0, 8, 0)]);
      expect(result.valid).toBe(false);
      expect(result.pairs[0].invalid).toBe(true);
    });

    it("refuses a pair that starts exactly when the previous one ended", () => {
      const result = computePairs([
        pair("a", 8, 0, 12, 0),
        pair("b", 12, 0, 18, 0),
      ]);
      expect(result.pairs[1].invalid).toBe(true);
    });
  });

  describe("incomplete is not invalid", () => {
    it("does not flag an untouched pair as an error", () => {
      // The whole point: a row nobody has typed into is unfinished, and used
      // to render red the moment it appeared.
      const result = computePairs([emptyPair("a")]);
      expect(result.pairs[0]).toEqual({
        dayOffset: 0,
        invalid: false,
        incomplete: true,
      });
      expect(result.valid).toBe(false);
    });

    it("does not flag a half-filled pair as an error", () => {
      const result = computePairs([{ id: "a", in: fromHM(8, 0), out: null }]);
      expect(result.pairs[0].invalid).toBe(false);
      expect(result.pairs[0].incomplete).toBe(true);
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
      expect(computePairs([])).toEqual({ total: 0, valid: true, pairs: [] });
    });
  });
});
