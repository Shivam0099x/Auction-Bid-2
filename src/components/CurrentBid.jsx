export default function CurrentBid({ currentBid, startingPrice }) {
  const amount = currentBid ? currentBid.amount : startingPrice;
  const leader = currentBid?.bidder;
  return (
    <section className="bg-white border border-[var(--line)] rounded-lg p-5">
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
    </section>
  );
}