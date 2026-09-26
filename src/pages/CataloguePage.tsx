import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  selectBrands,
  selectBooks,
  selectCategories,
  selectCurrentUser,
  selectFilteredBooks,
  selectRecommendedBooks,
} from '../store';
import {
  resetFilters,
  setBrandFilter,
  setCategoryFilter,
  setMaxPriceFilter,
  setMinRatingFilter,
  setSearchFilter,
  setSortBy,
} from '../store/slices/catalogueSlice';
import { BookCard } from '../components/BookCard';
import { OrderHistoryCard } from '../components/OrderHistoryCard';
import { SectionHeader } from '../components/SectionHeader';
import { formatCurrency } from '../utils/formatCurrency';
import type { CatalogueFilters } from '../types/store';

export function CataloguePage() {
  const dispatch = useAppDispatch();
  const categories = selectCategories();
  const brands = selectBrands();
  const priceLimit = Math.ceil(selectBooks().reduce((highest, book) => Math.max(highest, book.price), 1));
  const filteredBooks = useAppSelector(selectFilteredBooks);
  const currentUser = useAppSelector(selectCurrentUser);
  const activeCategory = useAppSelector((state) => state.catalogue.category);
  const activeBrand = useAppSelector((state) => state.catalogue.brand);
  const search = useAppSelector((state) => state.catalogue.search);
  const maxPrice = useAppSelector((state) => state.catalogue.maxPrice);
  const minRating = useAppSelector((state) => state.catalogue.minRating);
  const sortBy = useAppSelector((state) => state.catalogue.sortBy);
  const recommendedBooks = useAppSelector(selectRecommendedBooks);

  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="Catalogue"
        title="Browse by category, price, rating, and search"
        description="Explore the bookstore inventory, open book details, and review recommendations alongside previous orders."
      />
      <section className="grid gap-6 lg:grid-cols-[0.75fr_1.25fr]">
        {/* Filter panel */}
        <div className="min-w-0 space-y-6 rounded-[2rem] border border-brand/10 bg-white/95 p-6">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-accent">Category</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => dispatch(setCategoryFilter('All'))}
                className={`rounded-full px-4 py-2 text-sm font-medium ${
                  activeCategory === 'All'
                    ? 'bg-brand text-white'
                    : 'border border-brand/10 bg-parchment text-brand'
                }`}
              >
                All categories
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => dispatch(setCategoryFilter(category.name))}
                  className={`rounded-full px-4 py-2 text-sm font-medium ${
                    activeCategory === category.name
                      ? 'bg-brand text-white'
                      : 'border border-brand/10 bg-parchment text-brand'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
          <label className="block">
            <span className="text-sm font-semibold uppercase tracking-[0.25em] text-accent">Brand or publisher</span>
            <select
              value={activeBrand}
              onChange={(event) => dispatch(setBrandFilter(event.target.value))}
              className="mt-4 w-full rounded-2xl border border-brand/10 bg-parchment px-4 py-3 text-sm text-brand"
            >
              <option value="All">All brands</option>
              {brands.map((brand) => (
                <option key={brand} value={brand}>
                  {brand}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-sm font-semibold uppercase tracking-[0.25em] text-accent">Search titles and authors</span>
            <input
              value={search}
              onChange={(event) => dispatch(setSearchFilter(event.target.value))}
              placeholder="Search books, authors, or brands"
              className="mt-4 w-full rounded-2xl border border-brand/10 bg-parchment px-4 py-3 text-sm text-brand"
            />
          </label>
          <div>
            <label htmlFor="maximum-price" className="text-sm font-semibold uppercase tracking-[0.25em] text-accent">
              Maximum price
            </label>
            <output htmlFor="maximum-price" className="mt-3 block text-sm font-medium text-brand">
              {maxPrice === null ? 'Any price' : `Up to ${formatCurrency(maxPrice)}`}
            </output>
            <input
              id="maximum-price"
              type="range"
              min={0}
              max={priceLimit}
              step={1}
              value={maxPrice ?? priceLimit}
              aria-valuetext={maxPrice === null ? 'Any price' : `Up to ${formatCurrency(maxPrice)}`}
              onChange={(event) => {
                const value = Number(event.target.value);
                dispatch(setMaxPriceFilter(value === priceLimit ? null : value));
              }}
              className="mt-3 w-full cursor-pointer accent-brand"
            />
            <div className="flex justify-between text-xs text-brand/70">
              <span>{formatCurrency(0)}</span>
              <span>Any price</span>
            </div>
          </div>
          <label className="block">
            <span className="text-sm font-semibold uppercase tracking-[0.25em] text-accent">Minimum rating</span>
            <select
              value={minRating}
              onChange={(event) => dispatch(setMinRatingFilter(Number(event.target.value)))}
              className="mt-4 w-full rounded-2xl border border-brand/10 bg-parchment px-4 py-3 text-sm text-brand"
            >
              <option value={0}>Any rating</option>
              <option value={3}>3 stars & up</option>
              <option value={4}>4 stars & up</option>
              <option value={4.5}>4.5 stars & up</option>
            </select>
          </label>
          <label className="block">
            <span className="text-sm font-semibold uppercase tracking-[0.25em] text-accent">Sort books</span>
            <select
              value={sortBy}
              onChange={(event) => dispatch(setSortBy(event.target.value as CatalogueFilters['sortBy']))}
              className="mt-4 w-full rounded-2xl border border-brand/10 bg-parchment px-4 py-3 text-sm text-brand"
            >
              <option value="default">Featured order</option>
              <option value="price-asc">Price: low to high</option>
              <option value="price-desc">Price: high to low</option>
              <option value="rating-desc">Rating: high to low</option>
            </select>
          </label>
          <button
            type="button"
            onClick={() => dispatch(resetFilters())}
            className="rounded-full border border-brand/15 px-4 py-2 text-sm font-semibold text-brand"
          >
            Reset filters
          </button>
        </div>

        {/* Results column */}
        <div className="min-w-0 space-y-6">
          {filteredBooks.length === 0 ? (
            <div className="rounded-[2rem] border border-dashed border-brand/20 bg-white/95 px-6 py-12 text-center">
              <p className="text-sm font-medium uppercase tracking-[0.3em] text-accent">No results</p>
              <h2 className="mt-4 text-2xl font-semibold text-ink">No books match the current filters.</h2>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3" style={{ gridAutoRows: '1fr' }}>
              {filteredBooks.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          )}
          <section className="rounded-[2rem] border border-brand/10 bg-white/95 p-6">
            <SectionHeader
              eyebrow="Buy again"
              title="Order history for the selected customer"
              description="Customers can revisit previous orders and send the same titles back to the basket using the buy again shortcut."
            />
            <div className="mt-6 space-y-5">
              {currentUser.orderHistory.map((order) => (
                <OrderHistoryCard key={order.id} order={order} />
              ))}
            </div>
          </section>
          <section className="rounded-[2rem] border border-brand/10 bg-white/95 p-6">
            <SectionHeader
              eyebrow="Recommendations"
              title="Based on order history"
              description="These additional books are recommended from the selected customer's prior purchases."
            />
            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3" style={{ gridAutoRows: '1fr' }}>
              {recommendedBooks.map((book) => (
                <BookCard key={book.id} book={book} showDescription={false} />
              ))}
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}
