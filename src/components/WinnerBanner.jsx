import { useState } from "react";

export default function WinnerBanner({ winner, auction }) {
  const [copied, setCopied] = useState(false);

  const share = async () => {
    const text = `🏆 Auction result: "${auction.item.title}" won by ${winner.bidder} for ₹${winner.amount.toLocaleString()} after ${auction.bids.length} bids.`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <section className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 relative overflow-hidden">
      <div className="absolute -right-2 -top-2 text-5xl opacity-20 select-none pointer-events-none">
        🏆
      </div>
      <p className="text-[11px] uppercase tracking-wider text-emerald-700">
        Winner
      </p>
      <p className="text-lg font-semibold text-emerald-900 mt-0.5">
        {winner.bidder}
      </p>
      <p className="text-sm text-emerald-800 mt-0.5 tabular-nums">
        ₹{winner.amount.toLocaleString()}
      </p>
      <div className="mt-3 flex items-center gap-2">
        <button
          onClick={share}
          className="text-xs border border-emerald-300 text-emerald-800 px-2 py-1 rounded hover:bg-emerald-100 transition"
        >
          {copied ? "Copied ✓" : "Share result"}
        </button>
        <span className="text-[11px] text-emerald-700/70">
          {auction.bids.length} bids · {auction.extensions || 0} extension{auction.extensions === 1 ? "" : "s"}
        </span>
      </div>
    </section>
  );
}