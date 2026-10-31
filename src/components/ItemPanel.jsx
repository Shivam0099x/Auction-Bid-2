export default function ItemPanel({ auction, isLive, remaining }) {
  return (
    <section className="bg-white border border-[var(--line)] rounded-lg overflow-hidden self-start">
      {auction.item.imageUrl && (
        <img
          src={auction.item.imageUrl}
          alt={auction.item.title}
          className="w-full h-72 object-cover"
        />
      )}
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <h1 className="text-xl font-semibold tracking-tight">
            {auction.item.title}
          </h1>
          <span
            className={`shrink-0 text-[11px] font-medium px-2 py-1 rounded-md ${
              isLive
                ? "bg-emerald-50 text-emerald-700"
                : "bg-stone-100 text-stone-600"
            }`}
          >
            {isLive ? "Live" : "Ended"}
          </span>
        </div>
        {auction.item.description && (
          <p className="text-sm text-[var(--muted)] mt-2 leading-relaxed">
            {auction.item.description}
          </p>
        )}
        <div className="mt-4 grid grid-cols-2 gap-4 text-xs">
          <div>
            <p className="text-[var(--muted)]">Starting price</p>
            <p className="font-medium mt-0.5">₹{auction.startingPrice.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-[var(--muted)]">Min. increment</p>
            <p className="font-medium mt-0.5">₹{auction.minIncrement}</p>
          </div>
          {auction.extensions > 0 && (
            <div className="col-span-2 text-amber-700 bg-amber-50 border border-amber-200 rounded px-2 py-1">
              ⏱ Extended {auction.extensions}× due to late bids (anti-snipe)
            </div>
          )}
        </div>
      </div>
    </section>
  );
}