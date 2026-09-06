import { type Duration } from "../time/units";
import { formatHHMM, fromHM, parseHHMM } from "../time/duration";

export type JornadaDefaults = {
  workday: Duration;
  breakTime: Duration;
  tolerance: Duration;
};

/** 5h45 of work plus a 15min break is the 6h bank-worker day. */
export const JORNADA_DEFAULTS: JornadaDefaults = {
  workday: fromHM(5, 45),
  breakTime: fromHM(0, 15),
  tolerance: fromHM(0, 10),
};

/**
 * Storage keys and the HH:mm value format are a public contract: users have
 * saved settings under these names since 2023. Neither may change.
 */
export const STORAGE_KEYS = {
  workday: "defaultJornada",
  breakTime: "defaultIntervalo",
  tolerance: "defaultTolerancia",
} as const;

type StorageLike = Pick<Storage, "getItem" | "setItem" | "removeItem">;

const FIELDS = ["workday", "breakTime", "tolerance"] as const;

/**
 * Reads saved defaults, falling back per field rather than as a whole.
 *
 * A malformed value used to reach dayjs().hour(NaN), producing an Invalid
 * Date that left the form permanently stuck. Storage access itself can also
 * throw, for instance in Safari private mode.
 */
export function readStoredDefaults(storage: StorageLike): JornadaDefaults {
  const result = { ...JORNADA_DEFAULTS };
  for (const field of FIELDS) {
    try {
      const raw = storage.getItem(STORAGE_KEYS[field]);
      if (raw === null) continue;
      const parsed = parseHHMM(raw);
      if (parsed !== null) result[field] = parsed;
    } catch {
      // Storage unavailable: keep the built-in default for this field.
    }
  }
  return result;
}

export function writeStoredDefaults(
  storage: StorageLike,
  values: JornadaDefaults
): void {
  for (const field of FIELDS) {
    try {
      storage.setItem(STORAGE_KEYS[field], formatHHMM(values[field]));
    } catch {
      // Nothing useful to do if the browser refuses to persist.
    }
  }
}

export function clearStoredDefaults(storage: StorageLike): void {
  for (const field of FIELDS) {
    try {
      storage.removeItem(STORAGE_KEYS[field]);
    } catch {
      // As above.
    }
  }
}
