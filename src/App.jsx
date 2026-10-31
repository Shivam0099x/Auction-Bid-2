import { useEffect, useState, useRef, useMemo } from "react";
import { loadAuction, saveAuction, resetAuction, uid } from "./lib/storage";
import ItemPanel from "./components/ItemPanel";
import Countdown from "./components/Countdown";
import CurrentBid from "./components/CurrentBid";
import BidForm from "./components/BidForm";
import BidHistory from "./components/BidHistory";
import WinnerBanner from "./components/WinnerBanner";
import BidderLeaderboard from "./components/BidderLeaderboard";
import AuctionSettings from "./components/AuctionSettings";
import ActivityBadge from "./components/ActivityBadge";

export default function App() {
  const [state, setState] = useState(loadAuction);
  const [now, setNow] = useState(Date.now());
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [flash, setFlash] = useState(false);
  const lastBidCount = useRef(state.bids.length);

  useEffect(() => saveAuction(state), [state]);

  // 1s tick
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  // flash on new bid
  useEffect(() => {
    if (state.bids.length > lastBidCount.current) {
      setFlash(true);
      const t = setTimeout(() => setFlash(false), 700);
      lastBidCount.current = state.bids.length;
      return () => clearTimeout(t);
    }
    lastBidCount.current = state.bids.length;
  }, [state.bids.length]);

  const remaining = Math.max(0, state.endTime - now);
  const isLive = state.status === "live" && remaining > 0;

  const currentBid = useMemo(
    () =>
      state.bids.length
        ? state.bids.reduce(
            (top, b) => (b.amount > (top?.amount ?? 0) ? b : top),
            null
          )
        : null,
    [state.bids]
  );

  // auto end
  useEffect(() => {
    if (state.status === "live" && remaining === 0) {
      setState((s) => ({
        ...s,
        status: "ended",
        winner: currentBid
          ? {
              bidder: currentBid.bidder,
              amount: currentBid.amount,
              awardedAt: Date.now(),
            }
          : null,
      }));
    }
  }, [remaining, state.status, currentBid]);

  const placeBid = (bidder, amount) => {
    if (!isLive) throw new Error("Auction has ended");
    if (!bidder.trim()) throw new Error("Enter your name");
    if (!Number.isFinite(amount) || amount <= 0)
      throw new Error("Enter a valid amount");

    const floor = currentBid
      ? currentBid.amount + state.minIncrement
      : state.startingPrice;
    if (amount < floor)
      throw new Error(
        `Minimum bid is ₹${floor.toLocaleString()} (+₹${state.minIncrement} increment)`
      );
    if (currentBid && currentBid.bidder.toLowerCase() === bidder.toLowerCase())
      throw new Error("You are already the highest bidder");

    setState((s) => {
      let newEndTime = s.endTime;
      let extensions = s.extensions || 0;
      // anti-snipe
      const left = s.endTime - Date.now();
      if (left > 0 && left <= s.antiSnipeSec * 1000) {
        newEndTime = s.endTime + s.antiSnipeSec * 1000;
        extensions += 1;
      }
      return {
        ...s,
        endTime: newEndTime,
        extensions,
        bids: [
          { id: uid(), bidder: bidder.trim(), amount, at: Date.now() },
          ...s.bids,
        ],
      };
    });
  };

  const simulateBidder = () => {
    if (!isLive) return;
    const names = ["Rahul", "Priya", "Aarav", "Neha", "Vikram", "Ananya", "Karan"];
    const floor = currentBid
      ? currentBid.amount + state.minIncrement
      : state.startingPrice;
    const amount = floor + Math.floor(Math.random() * 150);
    const bidder = names[Math.floor(Math.random() * names.length)];
    try {
      placeBid(bidder, amount);
    } catch {}
  };

  const endNow = () => {
    setState((s) => ({
      ...s,
      status: "ended",
      endTime: Date.now(),
      winner: currentBid
        ? { bidder: currentBid.bidder, amount: currentBid.amount, awardedAt: Date.now() }
        : null,
    }));
  };

  const reset = () => {
    setState(resetAuction());
    setSettingsOpen(false);
  };

  const applySettings = (cfg) => {
    setState(resetAuction(cfg));
    setSettingsOpen(false);
  };

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `auction-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // keyboard shortcuts
  useEffect(() => {
    const handler = (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
      if (e.key.toLowerCase() === "b") document.getElementById("bid-input")?.focus();
      if (e.key.toLowerCase() === "e") endNow();
      if (e.key.toLowerCase() === "r") reset();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isLive, currentBid]);

  return (
    <div className="min-h-screen">
      <header className="border-b border-[var(--line)] bg-white sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-[var(--ink)] flex items-center justify-center">
              <span className="text-white text-xs font-bold">A</span>
            </div>
            <span className="font-semibold tracking-tight">Auction House</span>
          </div>

          <div className="flex items-center gap-3">
            <ActivityBadge bids={state.bids} now={now} />
            <Countdown remaining={remaining} live={isLive} extensions={state.extensions} />
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8 grid gap-6 lg:grid-cols-[1.15fr_1fr]">
        <ItemPanel auction={state} isLive={isLive} remaining={remaining} />

        <div className={`space-y-4 transition ${flash ? "ring-2 ring-emerald-200 rounded-xl" : ""}`}>
          {!isLive && state.winner && <WinnerBanner winner={state.winner} auction={state} />}
          {!isLive && !state.winner && (
            <div className="border border-[var(--line)] bg-white rounded-lg p-4 text-sm text-[var(--muted)]">
              Auction ended with no bids.
            </div>
          )}

          <CurrentBid
            currentBid={currentBid}
            startingPrice={state.startingPrice}
            minIncrement={state.minIncrement}
            bids={state.bids}
            now={now}
          />

          <BidForm
            disabled={!isLive}
            floor={currentBid ? currentBid.amount + state.minIncrement : state.startingPrice}
            minIncrement={state.minIncrement}
            onSubmit={placeBid}
          />

          <BidderLeaderboard bids={state.bids} />

          <BidHistory bids={state.bids} startingPrice={state.startingPrice} />
        </div>
      </main>

      <footer className="max-w-6xl mx-auto px-6 py-6 flex flex-wrap items-center gap-3 text-xs border-t border-[var(--line)] mt-8">
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
          onClick={() => setSettingsOpen(true)}
          className="text-stone-500 hover:text-stone-800 transition"
        >
          New auction
        </button>
        <span className="text-stone-300">·</span>
        <button
          onClick={exportJson}
          className="text-stone-500 hover:text-stone-800 transition"
        >
          Export JSON
        </button>
        <span className="text-stone-300">·</span>
        <button
          onClick={reset}
          className="text-stone-400 hover:text-rose-600 transition"
        >
          Reset
        </button>
        <span className="ml-auto text-stone-400">
          Shortcuts: <kbd className="px-1.5 py-0.5 border border-stone-200 rounded">B</kbd> bid ·{" "}
          <kbd className="px-1.5 py-0.5 border border-stone-200 rounded">E</kbd> end ·{" "}
          <kbd className="px-1.5 py-0.5 border border-stone-200 rounded">R</kbd> reset
        </span>
      </footer>

      {settingsOpen && (
        <AuctionSettings
          initial={state}
          onClose={() => setSettingsOpen(false)}
          onApply={applySettings}
        />
      )}
    </div>
  );
}