import { useEffect, useState, useCallback } from "react";
import { fetchAuction, placeBid, endAuction, AUCTION_ID } from "./lib/api";
import ItemPanel from "./components/ItemPanel";
import Countdown from "./components/Countdown";
import CurrentBid from "./components/CurrentBid";
import BidForm from "./components/BidForm";
import BidHistory from "./components/BidHistory";
import WinnerBanner from "./components/WinnerBanner";

export default function App() {
  const [data, setData] = useState(null);   // { auction, currentBid, bids }
  const [error, setError] = useState("");
  const [now, setNow] = useState(Date.now());
  const [notConfigured, setNotConfigured] = useState(false);

  useEffect(() => {
    if (!AUCTION_ID) { setNotConfigured(true); return; }
    load();
  }, []);

  // live tick — 1s
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  // poll the server every 3s so OTHER devices' bids appear
  useEffect(() => {
    if (!AUCTION_ID) return;
    const t = setInterval(load, 3000);
    return () => clearInterval(t);
  }, []);

  const load = useCallback(async () => {
    try {
      const d = await fetchAuction();
      setData(d);
      setError("");
    } catch (e) {
      setError(e.message);
    }
  }, []);

  const handleBid = async (bidder, amount) => {
    await placeBid(bidder, amount);
    await load();
  };

  if (notConfigured) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="max-w-md text-center">
          <h1 className="text-lg font-semibold mb-2">Auction not configured</h1>
          <p className="text-sm text-[var(--muted)]">
            Add <code className="bg-stone-100 px-1.5 py-0.5 rounded">VITE_AUCTION_ID</code> to{" "}
            <code className="bg-stone-100 px-1.5 py-0.5 rounded">client/.env</code>. Seed one by
            calling <code className="bg-stone-100 px-1.5 py-0.5 rounded">POST /api/auction/seed</code>.
          </p>
        </div>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-rose-600 text-sm">
        {error}
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm text-[var(--muted)]">
        Loading auction…
      </div>
    );
  }

  const { auction, currentBid, bids } = data;
  const remaining = Math.max(0, new Date(auction.endTime).getTime() - now);
  const isLive = auction.status === "live" && remaining > 0;

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
        <ItemPanel auction={auction} />

        <div className="space-y-4">
          {!isLive && auction.winner && (
            <WinnerBanner winner={auction.winner} />
          )}
          {!isLive && !auction.winner && (
            <div className="border border-[var(--line)] bg-white rounded-lg p-4 text-sm text-[var(--muted)]">
              Auction ended with no bids.
            </div>
          )}

          <CurrentBid
            currentBid={currentBid}
            startingPrice={auction.startingPrice}
          />

          <BidForm
            disabled={!isLive}
            floor={currentBid ? currentBid.amount : auction.startingPrice}
            onSubmit={handleBid}
          />

          <BidHistory bids={bids} startingPrice={auction.startingPrice} />

          <button
            onClick={endAuction}
            className="text-xs text-stone-400 hover:text-stone-700 transition"
            title="Dev: end auction now"
          >
            Dev · End auction now
          </button>
        </div>
      </main>
    </div>
  );
}