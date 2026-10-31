import { useEffect, useState } from "react";
import { loadAuction, saveAuction, resetAuction, uid } from "./lib/storage";
import ItemPanel from "./components/ItemPanel";
import Countdown from "./components/Countdown";
import CurrentBid from "./components/CurrentBid";
import BidForm from "./components/BidForm";
import BidHistory from "./components/BidHistory";
import WinnerBanner from "./components/WinnerBanner";

export default function App() {
  const [state, setState] = useState(loadAuction);
  const [now, setNow] = useState(Date.now());

  useEffect(() => saveAuction(state), [state]);

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const remaining = Math.max(0, state.endTime - now);
  const isLive = state.status === "live" && remaining > 0;

  const currentBid = state.bids.length
    ? state.bids.reduce((top, b) => (b.amount > (top?.amount ?? 0) ? b : top), null)
    : null;

  // auto-end: jab time khatam ho, winner set karo
  useEffect(() => {
    if (state.status === "live" && remaining === 0) {
      const top = currentBid;
      setState((s) => ({
        ...s,
        status: "ended",
        winner: top
          ? { bidder: top.bidder, amount: top.amount, awardedAt: Date.now() }
          : null,
      }));
    }
  }, [remaining, state.status, currentBid]);

  const placeBid = (bidder, amount) => {
    if (!isLive) throw new Error("Auction has ended");
    if (!bidder.trim()) throw new Error("Enter your name");
    if (!Number.isFinite(amount) || amount <= 0)
      throw new Error("Enter a valid amount");

    const floor = currentBid ? currentBid.amount : state.startingPrice;
    if (amount <= floor)
      throw new Error(`Bid must be greater than ₹${floor.toLocaleString()}`);
    if (currentBid && currentBid.bidder.toLowerCase() === bidder.toLowerCase())
      throw new Error("You are already the highest bidder");

    setState((s) => ({
      ...s,
      bids: [
        { id: uid(), bidder: bidder.trim(), amount, at: Date.now() },
        ...s.bids,
      ],
    }));
  };

  const simulateBidder = () => {
    if (!isLive) return;
    const names = ["Rahul", "Priya", "Aarav", "Neha", "Vikram", "Ananya"];
    const floor = currentBid ? currentBid.amount : state.startingPrice;
    const amount = floor + Math.floor(50 + Math.random() * 200);
    const bidder = names[Math.floor(Math.random() * names.length)];
    try {
      placeBid(bidder, amount);
    } catch {}
  };

  const endNow = () => {
    const top = currentBid;
    setState((s) => ({
      ...s,
      status: "ended",
      endTime: Date.now(),
      winner: top
        ? { bidder: top.bidder, amount: top.amount, awardedAt: Date.now() }
        : null,
    }));
  };

  const reset = () => {
    setState(resetAuction());
  };

  return (
    <div className="min-h-screen">
      <header className="border-b border-[var(--line)] bg-white">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-[var(--ink)] flex items-center justify-center">
              <span className="text-white text-xs font-bold">A</span>
            </div>
            <span className="font-semibold tracking-tight">Auction House</span>
          </div>
          <Countdown remaining={remaining} live={isLive} />
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <ItemPanel auction={state} />

        <div className="space-y-4">
          {!isLive && state.winner && <WinnerBanner winner={state.winner} />}
          {!isLive && !state.winner && (
            <div className="border border-[var(--line)] bg-white rounded-lg p-4 text-sm text-[var(--muted)]">
              Auction ended with no bids.
            </div>
          )}

          <CurrentBid currentBid={currentBid} startingPrice={state.startingPrice} />

          <BidForm
            disabled={!isLive}
            floor={currentBid ? currentBid.amount : state.startingPrice}
            onSubmit={placeBid}
          />

          <BidHistory bids={state.bids} startingPrice={state.startingPrice} />

          <div className="flex items-center gap-3 text-xs">
            <button
              onClick={simulateBidder}
              disabled={!isLive}
              className="text-stone-500 hover:text-stone-800 disabled:opacity-40 transition"
            >
              Demo · Simulate bidder
            </button>
            <span className="text-stone-300">·</span>
            <button
              onClick={endNow}
              disabled={!isLive}
              className="text-stone-500 hover:text-stone-800 disabled:opacity-40 transition"
            >
              End now
            </button>
            <span className="text-stone-300">·</span>
            <button
              onClick={reset}
              className="text-stone-400 hover:text-rose-600 transition"
            >
              Reset auction
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}