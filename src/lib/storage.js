const KEY = "auction.state.v2";

export const uid = () =>
  crypto.randomUUID ? crypto.randomUUID() : String(Date.now() + Math.random());

const DEFAULT_CONFIG = {
  title: "Vintage Mechanical Keyboard",
  description:
    "1988 IBM Model M, fully restored. Cherry MX blues. Collector's piece.",
  imageUrl:
    "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800",
  startingPrice: 500,
  durationMin: 10,       // demo ke liye 10 min
  minIncrement: 50,
  antiSnipeSec: 30,      // last 30s mein bid → +30s
};

export const DEFAULT_CONFIG_EXPORT = DEFAULT_CONFIG;

export const makeAuction = (overrides = {}) => {
  const cfg = { ...DEFAULT_CONFIG, ...overrides };
  return {
    item: {
      title: cfg.title,
      description: cfg.description,
      imageUrl: cfg.imageUrl,
    },
    startingPrice: cfg.startingPrice,
    minIncrement: cfg.minIncrement,
    antiSnipeSec: cfg.antiSnipeSec,
    endTime: Date.now() + cfg.durationMin * 60 * 1000,
    startedAt: Date.now(),
    status: "live",
    winner: null,
    bids: [],
    extensions: 0,
  };
};

export const loadAuction = () => {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) {
      const fresh = makeAuction();
      localStorage.setItem(KEY, JSON.stringify(fresh));
      return fresh;
    }
    const parsed = JSON.parse(raw);
    // backfill missing fields if v1 data was around
    if (!parsed.minIncrement) parsed.minIncrement = 50;
    if (!parsed.antiSnipeSec) parsed.antiSnipeSec = 30;
    if (parsed.extensions == null) parsed.extensions = 0;
    return parsed;
  } catch {
    return makeAuction();
  }
};

export const saveAuction = (state) =>
  localStorage.setItem(KEY, JSON.stringify(state));

export const resetAuction = (overrides) => {
  const fresh = makeAuction(overrides);
  localStorage.setItem(KEY, JSON.stringify(fresh));
  return fresh;
};