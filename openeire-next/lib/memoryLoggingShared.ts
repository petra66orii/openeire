export const SERVER_MEMORY_LOGGER_SYMBOL = Symbol.for(
  "openeire.server-memory.logger",
);

export type ServerMemoryLog = (
  event: "startup" | "interval" | "public-fetch",
  details?: Record<string, string>,
) => void;

export type ServerMemoryLoggerGlobal = typeof globalThis & {
  [SERVER_MEMORY_LOGGER_SYMBOL]?: ServerMemoryLog;
};
