function velocity(bids, now) {
  const last60 = bids.filter((b) => now - b.at < 60_000);
  return last60.length;
}

export default function CurrentBid({ currentBid, startingPrice, minIncrement, bids, now }) {
  const amount = currentBid ? currentBid.amount : startingPrice;
  const leader = currentBid?.bidder;
  const uniqueBidders = new Set(bids.map((b) => b.bidder.toLowerCase())).size;
  const v = velocity(bids, now);

  return (
    <section className="bg-white border border-[var(--line)] rounded-lg p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-wider text-[var(--muted)]">
            {currentBid ? "Current highest bid" : "No bids yet · starting at"}
          </p>
          <p className="text-3xl font-semibold tracking-tight mt-1 tabular-nums">
            ₹{amount.toLocaleString()}
          </p>
          {leader && (
            <p className="text-xs text-[var(--muted)] mt-1">
              by <span className="text-[var(--ink)] font-medium">{leader}</span>
            </p>
          )}
        </div>
        <div className="text-right text-[11px] text-[var(--muted)] space-y-1">
          <p>{uniqueBidders} bidder{uniqueBidders === 1 ? "" : "s"}</p>
          <p>{bids.length} bid{bids.length === 1 ? "" : "s"} total</p>
          {v > 0 && (
            <p className="text-emerald-700 font-medium">▲ {v} in last 60s</p>
          )}
        </div>
      </div>
      <p className="text-[11px] text-[var(--muted)] mt-3 pt-3 border-t border-[var(--line)]">
        Next minimum bid:{" "}
        <span className="text-[var(--ink)] font-medium tabular-nums">
          ₹{(amount + (currentBid ? minIncrement : 0)).toLocaleString()}
        </span>
      </p>
    </section>
  );
}