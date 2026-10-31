import { useState } from "react";

export default function BidForm({ disabled, floor, onSubmit }) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [err, setErr] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    if (!name.trim()) { setErr("Enter your name"); return; }
    const n = Number(amount);
    if (!Number.isFinite(n) || n <= 0) { setErr("Enter a valid amount"); return; }
    if (n <= floor) { setErr(`Bid must be greater than ₹${floor.toLocaleString()}`); return; }

    setSubmitting(true);
    try {
      await onSubmit(name.trim(), n);
      setAmount("");
    } catch (e) {
      setErr(e.message);
    } finally {
      setSubmitting(false);
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
          disabled={disabled}
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder={`> ${floor}`}
          className="border border-[var(--line)] rounded-md px-3 py-2 text-sm focus:border-stone-400"
        />
      </div>
      {err && <p className="text-xs text-rose-600">{err}</p>}
      <button
        disabled={disabled || submitting}
        type="submit"
        className="w-full bg-[var(--ink)] text-white text-sm font-medium py-2 rounded-md hover:opacity-90 disabled:opacity-50 transition"
      >
        {disabled ? "Bidding closed" : submitting ? "Placing…" : "Place bid"}
      </button>
    </form>
  );
}