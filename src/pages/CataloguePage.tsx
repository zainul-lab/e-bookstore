import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  selectBrands,
  selectCategories,
  selectCurrentUser,
  selectFilteredBooks,
  selectRecommendedBooks,
} from '../store';
import { resetFilters, setBrandFilter, setCategoryFilter, setSearchFilter } from '../store/slices/catalogueSlice';
import { BookCard } from '../components/BookCard';
import { OrderHistoryCard } from '../components/OrderHistoryCard';
import { SectionHeader } from '../components/SectionHeader';

export function CataloguePage() {
  const dispatch = useAppDispatch();
  const categories = selectCategories();
  const brands = selectBrands();
  const filteredBooks = useAppSelector(selectFilteredBooks);
  const currentUser = useAppSelector(selectCurrentUser);
  const activeCategory = useAppSelector((state) => state.catalogue.category);
  const activeBrand = useAppSelector((state) => state.catalogue.brand);
  const search = useAppSelector((state) => state.catalogue.search);
  const recommendedBooks = useAppSelector(selectRecommendedBooks);

  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="Catalogue"
        title="Browse by category, brand, and search"
        description="Explore the bookstore inventory, open book details, and review recommendations alongside previous orders."
      />
      <section className="grid gap-6 lg:grid-cols-[0.75fr_1.25fr]">
        {/* Filter panel */}
        <div className="space-y-6 rounded-[2rem] border border-brand/10 bg-white/95 p-6">
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
          <button
            type="button"
            onClick={() => dispatch(resetFilters())}
            className="rounded-full border border-brand/15 px-4 py-2 text-sm font-semibold text-brand"
          >
            Reset filters
          </button>
        </div>

        {/* Results column */}
        <div className="space-y-6">
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
