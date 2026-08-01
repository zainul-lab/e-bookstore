import { Link } from 'react-router-dom';

function StatCard({ label, value, description }: { label: string; value: string; description: string }) {
  return (
    <div className="rounded-[1.75rem] border border-white/15 bg-white/10 p-5 backdrop-blur-sm">
      <p className="text-xs uppercase tracking-[0.2em] text-orange-100">{label}</p>
      <p className="mt-3 text-3xl font-semibold text-white">{value}</p>
      <p className="mt-2 text-sm text-orange-50/90">{description}</p>
    </div>
  );
}

export function HeroCard() {
  return (
    <section className="grid gap-6 overflow-hidden rounded-[2rem] border border-brand/15 bg-gradient-to-br from-[#1f130f] via-brand to-[#8b3e26] px-6 py-8 text-white lg:grid-cols-[1.45fr_1fr] lg:px-10">
      <div className="space-y-5">
        <div className="flex flex-wrap items-center gap-3 text-sm text-orange-100">
          <span className="rounded-full border border-white/15 bg-white/10 px-4 py-2 uppercase tracking-[0.3em]">
            Curated bookstore
          </span>
          <span className="rounded-full border border-white/15 bg-white/10 px-4 py-2">Responsive shopping journey</span>
        </div>
        <h2 className="max-w-2xl font-serif text-4xl font-semibold leading-tight text-white sm:text-6xl">
          Discover your next favorite book in a storefront designed like a warm digital bookshop.
        </h2>
        <p className="max-w-2xl text-sm text-white/90 sm:text-base">
          Browse staff picks, revisit personal reading history, explore related titles, and move from basket to purchase
          confirmation with a clean, premium bookstore presentation.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link to="/catalogue" className="rounded-full bg-accent px-5 py-3 text-sm font-semibold text-ink">
            Explore catalogue
          </Link>
          <Link
            to="/checkout"
            className="rounded-full border border-white/25 bg-white/10 px-5 py-3 text-sm font-semibold text-white"
          >
            Review checkout flow
          </Link>
        </div>
      </div>
      <div className="grid gap-4 rounded-[1.75rem] border border-white/10 bg-white/5 p-5 backdrop-blur-sm sm:grid-cols-3 lg:grid-cols-1">
        <StatCard label="Categories" value="6" description="Curated shelves across fiction, technology, business, children, history, and lifestyle" />
        <StatCard label="Demo readers" value="2" description="Profiles include saved addresses, gift points, order history, and buy again support" />
        <StatCard label="Checkout" value="Seamless" description="Gift points, delivery selection, payment method choice, and purchase confirmation" />
      </div>
    </section>
  );
}
