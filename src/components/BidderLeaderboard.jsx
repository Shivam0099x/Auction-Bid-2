export default function BidderLeaderboard({ bids }) {
  if (bids.length === 0) return null;

  // group by bidder
  const map = new Map();
  bids.forEach((b) => {
    const k = b.bidder.toLowerCase();
    if (!map.has(k)) map.set(k, { bidder: b.bidder, count: 0, top: 0 });
    const row = map.get(k);
    row.count += 1;
    row.top = Math.max(row.top, b.amount);
  });
  const rows = [...map.values()].sort((a, b) => b.top - a.top).slice(0, 5);

  return (
    <section className="bg-white border border-[var(--line)] rounded-lg">
      <div className="px-4 py-3 border-b border-[var(--line)]">
        <h2 className="text-sm font-medium">Top bidders</h2>
      </div>
      <ul className="divide-y divide-[var(--line)]">
        {rows.map((r, i) => (
          <li key={r.bidder} className="px-4 py-2 flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-5 text-xs text-[var(--muted)] tabular-nums">
                #{i + 1}
              </span>
              <span className="truncate">{r.bidder}</span>
              <span className="text-[11px] text-[var(--muted)] shrink-0">
                {r.count} bid{r.count === 1 ? "" : "s"}
              </span>
            </div>
            <span className="text-xs tabular-nums font-medium">
              ₹{r.top.toLocaleString()}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}