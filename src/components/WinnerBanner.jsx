export default function WinnerBanner({ winner }) {
  return (
    <section className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
      <p className="text-[11px] uppercase tracking-wider text-emerald-700">
        Winner
      </p>
      <p className="text-lg font-semibold text-emerald-900 mt-0.5">
        {winner.bidder}
      </p>
      <p className="text-sm text-emerald-800 mt-0.5 tabular-nums">
        ₹{winner.amount.toLocaleString()}
      </p>
    </section>
  );
}