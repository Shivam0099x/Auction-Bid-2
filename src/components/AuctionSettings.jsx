import { useState } from "react";

export default function AuctionSettings({ initial, onClose, onApply }) {
  const [cfg, setCfg] = useState({
    title: initial.item.title,
    description: initial.item.description,
    imageUrl: initial.item.imageUrl,
    startingPrice: initial.startingPrice,
    durationMin: 10,
    minIncrement: initial.minIncrement || 50,
    antiSnipeSec: initial.antiSnipeSec || 30,
  });

  const set = (k) => (e) => setCfg({ ...cfg, [k]: e.target.value });

  const submit = (e) => {
    e.preventDefault();
    onApply({
      ...cfg,
      startingPrice: Number(cfg.startingPrice) || 0,
      durationMin: Number(cfg.durationMin) || 10,
      minIncrement: Number(cfg.minIncrement) || 50,
      antiSnipeSec: Number(cfg.antiSnipeSec) || 30,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-[2px] p-4">
      <form
        onSubmit={submit}
        className="w-full max-w-lg bg-white border border-[var(--line)] rounded-lg shadow-xl"
      >
        <div className="px-5 py-4 border-b border-[var(--line)] flex items-center justify-between">
          <h2 className="text-sm font-semibold">New auction</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-stone-400 hover:text-stone-700 rounded"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-5 space-y-4 max-h-[70vh] overflow-auto">
          <div>
            <label className="block text-xs font-medium text-stone-600 mb-1.5">Item title</label>
            <input
              value={cfg.title}
              onChange={set("title")}
              className="w-full border border-[var(--line)] rounded-md px-3 py-2 text-sm focus:border-stone-400"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-stone-600 mb-1.5">Description</label>
            <textarea
              rows={2}
              value={cfg.description}
              onChange={set("description")}
              className="w-full border border-[var(--line)] rounded-md px-3 py-2 text-sm resize-none focus:border-stone-400"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-stone-600 mb-1.5">Image URL</label>
            <input
              value={cfg.imageUrl}
              onChange={set("imageUrl")}
              className="w-full border border-[var(--line)] rounded-md px-3 py-2 text-sm focus:border-stone-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-stone-600 mb-1.5">Starting price (₹)</label>
              <input
                type="number"
                value={cfg.startingPrice}
                onChange={set("startingPrice")}
                className="w-full border border-[var(--line)] rounded-md px-3 py-2 text-sm focus:border-stone-400"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-600 mb-1.5">Duration (min)</label>
              <input
                type="number"
                value={cfg.durationMin}
                onChange={set("durationMin")}
                className="w-full border border-[var(--line)] rounded-md px-3 py-2 text-sm focus:border-stone-400"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-600 mb-1.5">Min increment (₹)</label>
              <input
                type="number"
                value={cfg.minIncrement}
                onChange={set("minIncrement")}
                className="w-full border border-[var(--line)] rounded-md px-3 py-2 text-sm focus:border-stone-400"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-600 mb-1.5">Anti-snipe (sec)</label>
              <input
                type="number"
                value={cfg.antiSnipeSec}
                onChange={set("antiSnipeSec")}
                className="w-full border border-[var(--line)] rounded-md px-3 py-2 text-sm focus:border-stone-400"
              />
            </div>
          </div>
        </div>

        <div className="px-5 py-3 border-t border-[var(--line)] flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 text-sm rounded-md border border-[var(--line)] text-stone-700 hover:bg-stone-50 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-3 py-1.5 text-sm rounded-md bg-[var(--ink)] text-white hover:opacity-90 transition"
          >
            Start auction
          </button>
        </div>
      </form>
    </div>
  );
}