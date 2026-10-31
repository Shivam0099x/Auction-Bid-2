const fmtTime = (iso) =>
  new Date(iso).toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

export default function BidHistory({ bids, startingPrice }) {
  return (
    <section className="bg-white border border-[var(--line)] rounded-lg">
      <div className="px-4 py-3 border-b border-[var(--line)] flex items-center justify-between">
        <h2 className="text-sm font-medium">Bid history</h2>
        <span className="text-xs text-[var(--muted)]">{bids.length}</span>
      </div>
      <div className="max-h-64 overflow-auto">
        {bids.length === 0 ? (
          <p className="text-xs text-[var(--muted)] text-center py-8">
            No bids yet. Starting price is ₹{startingPrice.toLocaleString()}.
          </p>
        ) : (
          <ul className="divide-y divide-[var(--line)]">
            {bids.map((b, i) => (
              <li
                key={b._id}
                className="px-4 py-2 flex items-center justify-between text-sm"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      i === 0 ? "bg-emerald-500" : "bg-stone-300"
                    }`}
                  />
                  <span className="truncate">{b.bidder}</span>
                </div>
                <div className="flex items-center gap-3 shrink-0 text-xs">
                  <span className="tabular-nums font-medium">
                    ₹{b.amount.toLocaleString()}
                  </span>
                  <span className="text-[var(--muted)]">{fmtTime(b.createdAt)}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}