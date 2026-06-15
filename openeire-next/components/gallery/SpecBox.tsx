export function SpecBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-black/40 p-4 text-center transition-colors hover:bg-white/5">
      <p className="mb-1 text-[10px] uppercase tracking-widest text-gray-500">
        {label}
      </p>
      <p className="truncate text-sm font-bold text-white">{value}</p>
    </div>
  );
}
