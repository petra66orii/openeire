import "server-only";

import {
  SERVER_MEMORY_LOGGER_SYMBOL,
  type ServerMemoryLoggerGlobal,
} from "@/lib/memoryLoggingShared";

const MEMORY_LOG_STARTUP_SYMBOL = Symbol.for(
  "openeire.server-memory.startup-logged",
);
const MEMORY_LOG_INTERVAL_SYMBOL = Symbol.for(
  "openeire.server-memory.interval",
);
const MEMORY_LOG_INTERVAL_MS = 5 * 60 * 1_000;
const BYTES_PER_MEBIBYTE = 1024 * 1024;

type MemoryLoggingGlobal = ServerMemoryLoggerGlobal & {
  [MEMORY_LOG_STARTUP_SYMBOL]?: boolean;
  [MEMORY_LOG_INTERVAL_SYMBOL]?: NodeJS.Timeout;
};

export type MemorySnapshot = {
  rssMiB: number;
  heapUsedMiB: number;
  heapTotalMiB: number;
  externalMiB: number;
  arrayBuffersMiB: number;
  uptimeSeconds: number;
};

const bytesToMiB = (bytes: number): number =>
  Number((bytes / BYTES_PER_MEBIBYTE).toFixed(2));

export const formatMemoryUsage = (
  usage: NodeJS.MemoryUsage,
  uptimeSeconds: number,
): MemorySnapshot => ({
  rssMiB: bytesToMiB(usage.rss),
  heapUsedMiB: bytesToMiB(usage.heapUsed),
  heapTotalMiB: bytesToMiB(usage.heapTotal),
  externalMiB: bytesToMiB(usage.external),
  arrayBuffersMiB: bytesToMiB(usage.arrayBuffers),
  uptimeSeconds: Math.round(uptimeSeconds),
});

export const logServerMemory = (
  event: "startup" | "interval" | "public-fetch",
  details?: Record<string, string>,
): void => {
  console.info("[server-memory]", {
    event,
    ...formatMemoryUsage(process.memoryUsage(), process.uptime()),
    ...(details ? { details } : {}),
  });
};

export const registerServerMemoryLogging = (): void => {
  const memoryGlobal = globalThis as MemoryLoggingGlobal;

  memoryGlobal[SERVER_MEMORY_LOGGER_SYMBOL] = logServerMemory;

  if (!memoryGlobal[MEMORY_LOG_STARTUP_SYMBOL]) {
    memoryGlobal[MEMORY_LOG_STARTUP_SYMBOL] = true;
    logServerMemory("startup");
  }

  if (
    process.env.SERVER_MEMORY_LOGGING === "1" &&
    !memoryGlobal[MEMORY_LOG_INTERVAL_SYMBOL]
  ) {
    const interval = setInterval(() => {
      logServerMemory("interval");
    }, MEMORY_LOG_INTERVAL_MS);

    interval.unref();
    memoryGlobal[MEMORY_LOG_INTERVAL_SYMBOL] = interval;
  }
};
