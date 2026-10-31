export default function ActivityBadge({ bids, now }) {
  if (bids.length === 0) return null;
  const last = bids[0];
  const ago = Math.floor((now - last.at) / 1000);
  const label =
    ago < 5 ? "just now" : ago < 60 ? `${ago}s ago` : `${Math.floor(ago / 60)}m ago`;
  return (
    <span className="hidden md:inline-flex items-center gap-1.5 text-[11px] text-[var(--muted)]">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
      Last bid {label}
    </span>
  );
}