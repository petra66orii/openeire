import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { register } from "@/instrumentation";
import {
  formatMemoryUsage,
  type MemorySnapshot,
} from "@/lib/server/memoryLogging";

const STARTUP_SYMBOL = Symbol.for("openeire.server-memory.startup-logged");
const INTERVAL_SYMBOL = Symbol.for("openeire.server-memory.interval");
const LOGGER_SYMBOL = Symbol.for("openeire.server-memory.logger");

type MemoryTestGlobal = typeof globalThis & {
  [STARTUP_SYMBOL]?: boolean;
  [INTERVAL_SYMBOL]?: NodeJS.Timeout;
  [LOGGER_SYMBOL]?: unknown;
};

const memoryGlobal = globalThis as MemoryTestGlobal;

describe("server memory logging", () => {
  const originalNextRuntime = process.env.NEXT_RUNTIME;
  const originalMemoryLogging = process.env.SERVER_MEMORY_LOGGING;
  const originalImageOptimizationDisabled =
    process.env.NEXT_IMAGE_OPTIMIZATION_DISABLED;

  beforeEach(() => {
    delete memoryGlobal[STARTUP_SYMBOL];
    delete memoryGlobal[INTERVAL_SYMBOL];
    delete memoryGlobal[LOGGER_SYMBOL];
    process.env.NEXT_RUNTIME = "nodejs";
    process.env.SERVER_MEMORY_LOGGING = "1";
    process.env.NEXT_IMAGE_OPTIMIZATION_DISABLED = "1";
  });

  afterEach(() => {
    delete memoryGlobal[STARTUP_SYMBOL];
    delete memoryGlobal[INTERVAL_SYMBOL];
    delete memoryGlobal[LOGGER_SYMBOL];

    if (originalNextRuntime === undefined) {
      delete process.env.NEXT_RUNTIME;
    } else {
      process.env.NEXT_RUNTIME = originalNextRuntime;
    }

    if (originalMemoryLogging === undefined) {
      delete process.env.SERVER_MEMORY_LOGGING;
    } else {
      process.env.SERVER_MEMORY_LOGGING = originalMemoryLogging;
    }

    if (originalImageOptimizationDisabled === undefined) {
      delete process.env.NEXT_IMAGE_OPTIMIZATION_DISABLED;
    } else {
      process.env.NEXT_IMAGE_OPTIMIZATION_DISABLED =
        originalImageOptimizationDisabled;
    }
  });

  it("formats every required field in MiB without combining external memory", () => {
    const mebibyte = 1024 * 1024;
    const snapshot: MemorySnapshot = formatMemoryUsage(
      {
        rss: 10 * mebibyte,
        heapUsed: 2.25 * mebibyte,
        heapTotal: 4.5 * mebibyte,
        external: 3 * mebibyte,
        arrayBuffers: 1.5 * mebibyte,
      },
      123.6,
    );

    expect(snapshot).toEqual({
      rssMiB: 10,
      heapUsedMiB: 2.25,
      heapTotalMiB: 4.5,
      externalMiB: 3,
      arrayBuffersMiB: 1.5,
      uptimeSeconds: 124,
    });
  });

  it("registers startup logging and the five-minute interval only once", async () => {
    const unref = vi.fn();
    const interval = { unref } as unknown as NodeJS.Timeout;
    const setIntervalSpy = vi
      .spyOn(globalThis, "setInterval")
      .mockReturnValue(interval);
    const consoleInfoSpy = vi
      .spyOn(console, "info")
      .mockImplementation(() => undefined);

    await register();
    await register();

    expect(setIntervalSpy).toHaveBeenCalledTimes(1);
    expect(setIntervalSpy).toHaveBeenCalledWith(
      expect.any(Function),
      5 * 60 * 1_000,
    );
    expect(unref).toHaveBeenCalledTimes(1);
    expect(
      consoleInfoSpy.mock.calls.filter(
        ([label]) => label === "[server-image-optimization]",
      ),
    ).toEqual([
      [
        "[server-image-optimization]",
        { nextImageOptimizationDisabled: true },
      ],
    ]);
    expect(
      consoleInfoSpy.mock.calls.filter(
        ([label, value]) =>
          label === "[server-memory]" &&
          typeof value === "object" &&
          value !== null &&
          "event" in value &&
          value.event === "startup",
      ),
    ).toHaveLength(1);
  });
});
