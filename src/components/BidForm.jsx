import { useEffect, useState } from "react";

export default function BidForm({ disabled, floor, minIncrement, onSubmit }) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [err, setErr] = useState("");

  // reset amount when floor changes (someone else bid)
  useEffect(() => {
    setAmount("");
  }, [floor]);

  const presets = [
    floor,
    floor + minIncrement,
    floor + minIncrement * 2,
    floor + minIncrement * 4,
  ];

  const submit = (e) => {
    e.preventDefault();
    setErr("");
    try {
      onSubmit(name, Number(amount));
      setAmount("");
    } catch (e) {
      setErr(e.message);
    }
  };

  return (
    <form
      onSubmit={submit}
      className={`bg-white border border-[var(--line)] rounded-lg p-4 space-y-3 ${
        disabled ? "opacity-60" : ""
      }`}
    >
      <div className="grid grid-cols-2 gap-2">
        <input
          disabled={disabled}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          className="border border-[var(--line)] rounded-md px-3 py-2 text-sm focus:border-stone-400"
        />
        <input
          id="bid-input"
          disabled={disabled}
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder={`min ₹${floor}`}
          className="border border-[var(--line)] rounded-md px-3 py-2 text-sm focus:border-stone-400"
        />
      </div>

      {!disabled && (
        <div className="flex flex-wrap gap-1.5">
          {presets.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setAmount(String(p))}
              className="text-xs px-2 py-1 rounded border border-[var(--line)] text-stone-600 hover:border-stone-400 hover:text-stone-900 transition tabular-nums"
            >
              ₹{p.toLocaleString()}
            </button>
          ))}
        </div>
      )}

      {err && <p className="text-xs text-rose-600">{err}</p>}

      <button
        disabled={disabled}
        type="submit"
        className="w-full bg-[var(--ink)] text-white text-sm font-medium py-2 rounded-md hover:opacity-90 disabled:opacity-50 transition"
      >
        {disabled ? "Bidding closed" : "Place bid"}
      </button>
    </form>
  );
}