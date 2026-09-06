import { describe, expect, it, vi } from "vitest";
import { fromHM } from "../time/duration";
import {
  JORNADA_DEFAULTS,
  STORAGE_KEYS,
  clearStoredDefaults,
  readStoredDefaults,
  writeStoredDefaults,
} from "./defaults";

function fakeStorage(seed: Record<string, string> = {}) {
  const data = new Map(Object.entries(seed));
  return {
    data,
    getItem: (key: string) => data.get(key) ?? null,
    setItem: (key: string, value: string) => void data.set(key, value),
    removeItem: (key: string) => void data.delete(key),
  };
}

describe("storage contract", () => {
  it("keeps the key names users already have saved", () => {
    expect(STORAGE_KEYS).toEqual({
      workday: "defaultJornada",
      breakTime: "defaultIntervalo",
      tolerance: "defaultTolerancia",
    });
  });

  it("writes the HH:mm format those keys have always held", () => {
    const storage = fakeStorage();
    writeStoredDefaults(storage, JORNADA_DEFAULTS);
    expect(storage.data.get("defaultJornada")).toBe("05:45");
    expect(storage.data.get("defaultIntervalo")).toBe("00:15");
    expect(storage.data.get("defaultTolerancia")).toBe("00:10");
  });
});

describe("readStoredDefaults", () => {
  it("returns the built-in defaults when nothing is stored", () => {
    expect(readStoredDefaults(fakeStorage())).toEqual(JORNADA_DEFAULTS);
  });

  it("reads a stored value and leaves the rest at their defaults", () => {
    const result = readStoredDefaults(fakeStorage({ defaultJornada: "06:00" }));
    expect(result.workday).toBe(360);
    expect(result.breakTime).toBe(JORNADA_DEFAULTS.breakTime);
    expect(result.tolerance).toBe(JORNADA_DEFAULTS.tolerance);
  });

  it("falls back per field on an unparseable value", () => {
    // Production turned this into dayjs().hour(NaN) and bricked the form.
    const result = readStoredDefaults(
      fakeStorage({ defaultJornada: "abc", defaultIntervalo: "00:30" })
    );
    expect(result.workday).toBe(JORNADA_DEFAULTS.workday);
    expect(result.breakTime).toBe(30);
  });

  it("survives storage that throws", () => {
    const storage = {
      getItem: vi.fn(() => {
        throw new DOMException("denied");
      }),
      setItem: vi.fn(),
      removeItem: vi.fn(),
    };
    expect(readStoredDefaults(storage)).toEqual(JORNADA_DEFAULTS);
  });

  it("round-trips a written set of values", () => {
    const storage = fakeStorage();
    const values = {
      workday: fromHM(7, 30),
      breakTime: fromHM(1, 0),
      tolerance: fromHM(0, 5),
    };
    writeStoredDefaults(storage, values);
    expect(readStoredDefaults(storage)).toEqual(values);
  });
});

describe("clearStoredDefaults", () => {
  it("removes every key and restores the built-in defaults", () => {
    const storage = fakeStorage({
      defaultJornada: "06:00",
      defaultIntervalo: "00:30",
      defaultTolerancia: "00:05",
    });
    clearStoredDefaults(storage);
    expect(storage.data.size).toBe(0);
    expect(readStoredDefaults(storage)).toEqual(JORNADA_DEFAULTS);
  });
});
