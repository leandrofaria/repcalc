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

/**
 * Whether the card leads with the tolerance rather than the full journey.
 *
 * A preference rather than a jornada setting, so it lives under its own key
 * instead of joining the three above: those hold HH:mm and are a contract with
 * settings saved since 2023. "1" means on; absent, or anything else, off — so
 * a device that has never seen the switch reads exactly as it did before.
 */
export const LEAVE_WITH_TOLERANCE_KEY = "sairNaTolerancia";

export function readLeaveWithTolerance(storage: StorageLike): boolean {
  try {
    return storage.getItem(LEAVE_WITH_TOLERANCE_KEY) === "1";
  } catch {
    return false;
  }
}

/** Off is stored as no key at all, which is also what "never set" looks like. */
export function writeLeaveWithTolerance(
  storage: StorageLike,
  value: boolean
): void {
  try {
    if (value) storage.setItem(LEAVE_WITH_TOLERANCE_KEY, "1");
    else storage.removeItem(LEAVE_WITH_TOLERANCE_KEY);
  } catch {
    // Nothing useful to do if the browser refuses to persist.
  }
}

export function clearLeaveWithTolerance(storage: StorageLike): void {
  try {
    storage.removeItem(LEAVE_WITH_TOLERANCE_KEY);
  } catch {
    // As above.
  }
}
