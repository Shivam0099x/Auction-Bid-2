const pad = (n) => String(n).padStart(2, "0");

export default function Countdown({ remaining, live }) {
  if (!live) {
    return (
      <span className="text-xs font-medium text-rose-600">
        Auction ended
      </span>
    );
  }
  const total = Math.floor(remaining / 1000);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const urgent = remaining < 60_000;

  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-md ${
        urgent ? "bg-rose-50 text-rose-700" : "bg-stone-100 text-stone-700"
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${urgent ? "bg-rose-500 animate-pulse" : "bg-emerald-500"}`} />
      {h > 0 && <span>{pad(h)}:</span>}
      <span>{pad(m)}:{pad(s)}</span>
      <span className="opacity-60">left</span>
    </span>
  );
}