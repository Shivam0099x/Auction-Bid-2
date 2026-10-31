export default function ItemPanel({ auction }) {
  return (
    <section className="bg-white border border-[var(--line)] rounded-lg overflow-hidden">
      {auction.item.imageUrl && (
        <img
          src={auction.item.imageUrl}
          alt={auction.item.title}
          className="w-full h-72 object-cover"
        />
      )}
      <div className="p-5">
        <h1 className="text-xl font-semibold tracking-tight">
          {auction.item.title}
        </h1>
        {auction.item.description && (
          <p className="text-sm text-[var(--muted)] mt-2 leading-relaxed">
            {auction.item.description}
          </p>
        )}
        <div className="mt-4 flex items-center gap-2 text-xs">
          <span className="text-[var(--muted)]">Starting price</span>
          <span className="font-medium">₹{auction.startingPrice.toLocaleString()}</span>
        </div>
      </div>
    </section>
  );
}