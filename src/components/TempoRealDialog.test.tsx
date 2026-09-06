import { afterEach, describe, expect, it, vi } from "vitest";
import { renderWithProviders } from "./testUtils";
import TempoRealDialog from "./TempoRealDialog";
import { fromHM as durationFromHM } from "@/lib/time/duration";
import { fromHM as timeFromHM } from "@/lib/time/timeOfDay";
import type { JornadaInput } from "@/lib/jornada/schedule";

const INPUT: JornadaInput = {
  start: timeFromHM(8, 0),
  workday: durationFromHM(5, 45),
  breakTime: durationFromHM(0, 15),
  tolerance: durationFromHM(0, 10),
};

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe("TempoRealDialog", () => {
  it("creates one clock interval and keeps it across ticks", () => {
    vi.useFakeTimers();
    const setInterval = vi.spyOn(window, "setInterval");
    // MUI's dialog transition schedules timers of its own, so count only
    // the one-second tick this component owns.
    const clockIntervals = () =>
      setInterval.mock.calls.filter((call) => call[1] === 1000).length;

    renderWithProviders(
      <TempoRealDialog
        showTempoRealDialog
        setShowTempoRealDialog={() => {}}
        input={INPUT}
      />
    );

    expect(clockIntervals()).toBe(1);

    // The previous effect listed its own output in its dependency array, so
    // it tore the interval down and rebuilt it on every single tick.
    vi.advanceTimersByTime(5000);
    expect(clockIntervals()).toBe(1);
  });

  it("clears the interval when it closes", () => {
    vi.useFakeTimers();
    const clearInterval = vi.spyOn(window, "clearInterval");

    const { unmount } = renderWithProviders(
      <TempoRealDialog
        showTempoRealDialog
        setShowTempoRealDialog={() => {}}
        input={INPUT}
      />
    );
    unmount();

    expect(clearInterval).toHaveBeenCalled();
  });

  it("starts no interval while it is closed", () => {
    vi.useFakeTimers();
    const setInterval = vi.spyOn(window, "setInterval");

    renderWithProviders(
      <TempoRealDialog
        showTempoRealDialog={false}
        setShowTempoRealDialog={() => {}}
        input={INPUT}
      />
    );

    expect(setInterval).not.toHaveBeenCalled();
  });
});
