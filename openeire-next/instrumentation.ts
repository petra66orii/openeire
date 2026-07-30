export async function register(): Promise<void> {
  if (process.env.NEXT_RUNTIME !== "nodejs") {
    return;
  }

  const { registerServerMemoryLogging } = await import(
    "@/lib/server/memoryLogging"
  );

  registerServerMemoryLogging();
}
