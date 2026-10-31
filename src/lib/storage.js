const KEY = "auction.state.v1";

export const uid = () =>
  crypto.randomUUID ? crypto.randomUUID() : String(Date.now() + Math.random());

const seedAuction = () => ({
  item: {
    title: "Vintage Mechanical Keyboard",
    description:
      "1988 IBM Model M, fully restored. Cherry MX blues. Collector's piece.",
    imageUrl:
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800",
  },
  startingPrice: 500,
  endTime: Date.now() + 10 * 60 * 1000,
  status: "live",
  winner: null,
  bids: [],
});

export const loadAuction = () => {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) {
      const fresh = seedAuction();
      localStorage.setItem(KEY, JSON.stringify(fresh));
      return fresh;
    }
    return JSON.parse(raw);
  } catch {
    return seedAuction();
  }
};

export const saveAuction = (state) => {
  localStorage.setItem(KEY, JSON.stringify(state));
};

export const resetAuction = () => {
  const fresh = seedAuction();
  localStorage.setItem(KEY, JSON.stringify(fresh));
  return fresh;
};