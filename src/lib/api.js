const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const AUCTION_ID = import.meta.env.VITE_AUCTION_ID || "6ae5a8e9a6a02277e1ff9e6f";

export async function fetchAuction() {
  const r = await fetch(`${API}/api/auction/${AUCTION_ID}`);
  if (!r.ok) throw new Error((await r.json()).error || "Failed to load auction");
  return r.json();
}

export async function placeBid(bidder, amount) {
  const r = await fetch(`${API}/api/auction/${AUCTION_ID}/bid`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ bidder, amount }),
  });
  const data = await r.json();
  if (!r.ok) throw new Error(data.error || "Bid failed");
  return data;
}

export async function endAuction() {
  const r = await fetch(`${API}/api/auction/${AUCTION_ID}/end`, { method: "POST" });
  return r.json();
}