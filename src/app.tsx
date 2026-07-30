import { useMemo } from 'react';
import { Link, NavLink, Outlet, useNavigate, useParams } from 'react-router-dom';
import { fetchBooks, fetchUsers } from './services/bookstoreService';
import { useAppDispatch, useAppSelector } from './store/hooks';
import {
  selectBook,
  selectBrands,
  selectCartItems,
  selectCartSummary,
  selectCategories,
  selectCurrentUser,
  selectFeaturedBooks,
  selectFilteredBooks,
  selectPaymentOptions,
  selectRecommendedBooks,
  selectRelatedBooks,
} from './store';
import { addToCart, buyAgain, clearCart, removeFromCart, updateQuantity } from './store/slices/cartSlice';
import { resetFilters, setBrandFilter, setCategoryFilter, setSearchFilter } from './store/slices/catalogueSlice';
import {
  resetCheckout,
  setPaymentOption,
  setRedeemedPoints,
  setSelectedAddress,
  submitOrder,
} from './store/slices/checkoutSlice';
import { logout } from './store/slices/authSlice';
import { deductPoints } from './store/slices/usersSlice';
import type { Book, Order } from './types/store';

const navLinkClassName = ({ isActive }: { isActive: boolean }) =>
  `rounded-full px-4 py-2 text-sm font-medium transition ${
    isActive
      ? 'bg-brand text-white ring-4 ring-brand/10'
      : 'border border-brand/10 bg-white/70 text-ink hover:border-accent/40 hover:bg-parchment'
  }`;

void fetchBooks();
void fetchUsers();

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
  }).format(value);
}

function SectionHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="space-y-2">
      {eyebrow ? <p className="text-sm font-semibold uppercase tracking-[0.3em] text-accent">{eyebrow}</p> : null}
      <h2 className="font-serif text-3xl font-semibold tracking-tight text-ink sm:text-4xl">{title}</h2>
      {description ? <p className="max-w-3xl text-sm leading-7 text-brand/80 sm:text-base">{description}</p> : null}
    </div>
  );
}

function StatCard({ label, value, description }: { label: string; value: string; description: string }) {
  return (
    <div className="rounded-[1.75rem] border border-white/15 bg-white/10 p-5 backdrop-blur-sm">
      <p className="text-xs uppercase tracking-[0.2em] text-orange-100">{label}</p>
      <p className="mt-3 text-3xl font-semibold text-white">{value}</p>
      <p className="mt-2 text-sm text-orange-50/90">{description}</p>
    </div>
  );
}

function HeroCard() {
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

// function JourneyCard({ title, items }: { title: string; items: string[] }) {
//   return (
//     <section className="rounded-[1.75rem] border border-brand/10 bg-white/90 p-6 backdrop-blur-sm">
//       <h3 className="font-serif text-2xl font-semibold text-ink">{title}</h3>
//       <ul className="mt-4 space-y-3 text-sm leading-6 text-brand/80">
//         {items.map((item) => (
//           <li key={item} className="rounded-2xl border border-accent/10 bg-parchment px-4 py-3">
//             {item}
//           </li>
//         ))}
//       </ul>
//     </section>
//   );
// }

function BookCover({ book, large = false }: { book: Book; large?: boolean }) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-black/10 text-white ${
        large ? 'h-72 w-full' : 'h-48 w-full'
      }`}
      style={{ backgroundColor: book.coverColor }}
    >
      <div
        className="absolute inset-x-3 top-3 h-1 rounded-full opacity-90"
        style={{ backgroundColor: book.coverAccent }}
      />
      <div
        className="absolute -right-8 -top-8 h-32 w-32 rounded-full opacity-25"
        style={{ backgroundColor: book.coverAccent }}
      />
      <div
        className="absolute -bottom-10 left-4 h-28 w-28 rounded-full opacity-15"
        style={{ backgroundColor: book.coverAccent }}
      />
      <div className="relative flex h-full flex-col justify-between p-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-white/80">{book.category}</p>
        <div>
          <p className={`font-serif font-semibold leading-tight ${large ? 'text-3xl' : 'text-lg'}`}>{book.title}</p>
          <p className={`mt-1 text-white/80 ${large ? 'text-sm' : 'text-xs'}`}>{book.author}</p>
        </div>
        <p className="text-right text-[10px] font-semibold uppercase tracking-[0.3em] text-white/70">{book.cover}</p>
      </div>
    </div>
  );
}

function BookCard({ book, showDescription = true }: { book: Book; showDescription?: boolean }) {
  const dispatch = useAppDispatch();

  return (
    <article className="flex h-full flex-col rounded-[1.75rem] border border-brand/10 bg-white/95 overflow-hidden transition hover:-translate-y-1 hover:border-accent/40 hover:shadow-md">
      {/* Cover — full width, fixed height */}
      <BookCover book={book} />

      {/* Content area stretches to fill remaining height */}
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-accent">{book.category}</p>
          <h3 className="mt-1 font-serif text-base font-semibold leading-snug text-ink line-clamp-2">{book.title}</h3>
          <p className="mt-1 text-xs text-brand/70 truncate">
            {book.author} · {book.brand}
          </p>
        </div>

        {showDescription ? (
          <p className="flex-1 text-xs leading-relaxed text-brand/80 line-clamp-3">{book.shortDescription}</p>
        ) : (
          <div className="flex-1" />
        )}

        <div className="flex flex-wrap gap-1">
          {book.tags.slice(0, 2).map((tag) => (
            <span key={tag} className="rounded-full border border-accent/20 bg-accent/10 px-2 py-0.5 text-[10px] font-medium text-brand">
              {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between gap-2 pt-1 border-t border-brand/10">
          <div>
            <p className="text-lg font-semibold text-ink leading-none">{formatCurrency(book.price)}</p>
            <p className="mt-0.5 text-[10px] text-pine">
              Delivery in {book.deliveryDays} day{book.deliveryDays > 1 ? 's' : ''}
            </p>
          </div>
          <div className="flex flex-col gap-1.5 items-end shrink-0">
            <Link
              to={`/catalogue/${book.id}`}
              className="rounded-full border border-brand/20 px-3 py-1.5 text-[11px] font-semibold text-brand whitespace-nowrap"
            >
              View details
            </Link>
            <button
              type="button"
              onClick={() => dispatch(addToCart(book.id))}
              className="rounded-full bg-brand px-3 py-1.5 text-[11px] font-semibold text-white whitespace-nowrap"
            >
              Add to basket
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

function OrderHistoryCard({ order }: { order: Order }) {
  const dispatch = useAppDispatch();
  const orderBooks = useMemo(
    () =>
      order.items
        .map((item) => ({
          item,
          book: selectBook(item.bookId),
        }))
        .filter((entry): entry is { item: Order['items'][number]; book: Book } => Boolean(entry.book)),
    [order],
  );

  return (
    <article className="rounded-[1.75rem] border border-brand/10 bg-white/95 p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent">Order {order.id}</p>
          <h3 className="mt-2 font-serif text-xl font-semibold text-ink">{new Date(order.placedAt).toLocaleDateString('en-GB')}</h3>
          <p className="mt-1 text-sm text-brand/70">Status: {order.status}</p>
        </div>
        <div className="rounded-2xl border border-brand/10 bg-parchment px-4 py-3 text-sm text-brand/80">
          {orderBooks.reduce((count, entry) => count + entry.item.quantity, 0)} item(s)
        </div>
      </div>
      <div className="mt-5 space-y-4">
        {orderBooks.map(({ item, book }) => (
          <div key={book.id} className="flex flex-col gap-3 rounded-2xl border border-brand/10 bg-parchment p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-serif text-lg font-semibold text-ink">{book.title}</p>
              <p className="text-sm text-brand/70">
                {book.author} · Qty {item.quantity}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-brand">{formatCurrency(item.unitPrice)}</span>
              <button
                type="button"
                onClick={() => dispatch(buyAgain(book.id))}
                className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white"
              >
                Buy again
              </button>
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}

function ProductDetailSummary({ book }: { book: Book }) {
  const dispatch = useAppDispatch();
  const relatedBooks = selectRelatedBooks(book.id);

  return (
    <div className="space-y-8">
      <section className="grid gap-6 rounded-[2rem] border border-brand/10 bg-white/95 p-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-5">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-brand/10 bg-parchment px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-brand">
              {book.category}
            </span>
            <span className="rounded-full border border-accent/20 bg-accent/10 px-4 py-2 text-sm font-medium text-brand">
              Tentative delivery in {book.deliveryDays} day{book.deliveryDays > 1 ? 's' : ''}
            </span>
          </div>
          <div>
            <h2 className="font-serif text-4xl font-semibold leading-tight text-ink">{book.title}</h2>
            <p className="mt-2 text-sm text-brand/70">
              {book.author} · {book.brand} · Rated {book.rating}/5
            </p>
          </div>
          <p className="text-base leading-8 text-brand/80">{book.description}</p>
          <div className="flex flex-wrap gap-2">
            {book.formats.map((format) => (
              <span key={format} className="rounded-full border border-brand/10 bg-white px-4 py-2 text-sm text-brand/80">
                {format}
              </span>
            ))}
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => dispatch(addToCart(book.id))}
              className="rounded-full bg-brand px-5 py-3 text-sm font-semibold text-white"
            >
              Add to basket
            </button>
            <Link to="/cart" className="rounded-full border border-brand/15 px-5 py-3 text-sm font-semibold text-brand">
              Review basket
            </Link>
          </div>
        </div>
        <div className="rounded-[1.75rem] border border-brand/10 bg-parchment p-6">
          <BookCover book={book} large />
          <p className="mt-6 text-sm font-semibold uppercase tracking-[0.25em] text-accent">Purchase snapshot</p>
          <p className="mt-4 font-serif text-4xl font-semibold tracking-tight text-ink">{formatCurrency(book.price)}</p>
          <ul className="mt-6 space-y-3 text-sm leading-7 text-brand/80">
            <li>Available formats: {book.formats.join(', ')}</li>
            <li>Publisher or brand: {book.brand}</li>
            <li>Related recommendations shown below</li>
            <li>Eligible for gift point redemption during checkout</li>
          </ul>
        </div>
      </section>
      <section className="space-y-5">
        <SectionHeader
          eyebrow="Related books"
          title="Customers also explored"
          description="Books with shared category, brand, or theme are surfaced to support cross-sell and discovery."
        />
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4" style={{ gridAutoRows: '1fr' }}>
          {relatedBooks.map((relatedBook) => (
            <BookCard key={relatedBook.id} book={relatedBook} showDescription={false} />
          ))}
        </div>
      </section>
    </div>
  );
}

export function AppLayout() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const currentUser = useAppSelector(selectCurrentUser);
  const cartSummary = useAppSelector(selectCartSummary);

  function handleLogout() {
    dispatch(logout());
    navigate('/login', { replace: true });
  }

  return (
    <div className="min-h-screen text-ink">
      <header className="sticky top-0 z-10 border-b border-brand/10 bg-[#fbf6ef]/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <Link to="/" className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand text-lg font-semibold text-white">EB</div>
              <div>
                <p className="text-sm uppercase tracking-[0.25em] text-accent">Curated online bookstore</p>
                <h1 className="text-2xl font-semibold text-ink">E-Bookstore</h1>
              </div>
            </Link>
            <div className="flex flex-wrap items-center gap-3 text-sm text-brand/80">
              <span className="rounded-full border border-brand/10 bg-white/80 px-3 py-2">Signed in as {currentUser.name}</span>
              <span className="rounded-full border border-accent/20 bg-accent/10 px-3 py-2 text-brand">{currentUser.giftPoints} gift points</span>
              <span className="rounded-full border border-pine/20 bg-pine/10 px-3 py-2 text-pine">{cartSummary.itemCount} item(s) in basket</span>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-full border border-brand/20 bg-white/70 px-3 py-2 text-sm font-medium text-brand/80 transition hover:border-brand/40 hover:bg-parchment"
              >
                Sign out
              </button>
            </div>
          </div>
          <nav className="flex flex-wrap gap-2">
            <NavLink to="/" className={navLinkClassName} end>
              Home
            </NavLink>
            <NavLink to="/catalogue" className={navLinkClassName}>
              Catalogue
            </NavLink>
            <NavLink to="/cart" className={navLinkClassName}>
              Cart
            </NavLink>
            <NavLink to="/checkout" className={navLinkClassName}>
              Checkout
            </NavLink>
            <NavLink to="/payment" className={navLinkClassName}>
              Payment
            </NavLink>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Outlet />
      </main>
      <footer className="border-t border-brand/10 bg-[#fbf6ef]/80">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-6 text-sm text-brand/70 sm:px-6 lg:px-8 sm:flex-row sm:items-center sm:justify-between">
          <p>Frontend-only MVP built with React, Redux Toolkit, Tailwind CSS, Axios, Vite, and TypeScript.</p>
          <p>Responsive shopping journey with a warmer, more premium bookstore presentation.</p>
        </div>
      </footer>
    </div>
  );
}

export function HomePage() {
  const currentUser = useAppSelector(selectCurrentUser);
  const featuredBooks = selectFeaturedBooks();
  const recommendedBooks = useAppSelector(selectRecommendedBooks);

  return (
    <div className="space-y-8">
      <HeroCard />
      <section className="space-y-5">
        <SectionHeader
          eyebrow="Available books"
          title="Featured picks on the landing page"
          description="Customers can browse highlighted books immediately, then move into the catalogue or detail pages."
        />
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4" style={{ gridAutoRows: '1fr' }}>
          {featuredBooks.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </section>
      <section className="space-y-5">
        <SectionHeader
          eyebrow="Recommendations"
          title={`Suggested for ${currentUser.name}`}
          description="Recommendations are derived from the selected demo customer's prior purchases and preferred categories or brands."
        />
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4" style={{ gridAutoRows: '1fr' }}>
          {recommendedBooks.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </section>
    </div>
  );
}

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
        <div className="space-y-6 rounded-[2rem] border border-brand/10 bg-white/95 p-6">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-accent">Category</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => dispatch(setCategoryFilter('All'))}
                className={`rounded-full px-4 py-2 text-sm font-medium ${
                  activeCategory === 'All' ? 'bg-brand text-white' : 'border border-brand/10 bg-parchment text-brand'
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
                    activeCategory === category.name ? 'bg-brand text-white' : 'border border-brand/10 bg-parchment text-brand'
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
        <div className="space-y-6">
          {/* Book grid — items align to uniform card height via CSS grid */}
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

export function ProductDetailPage() {
  const navigate = useNavigate();
  const params = useParams();
  const book = params.bookId ? selectBook(params.bookId) : undefined;

  if (!book) {
    return (
      <section className="rounded-[2rem] border border-dashed border-brand/20 bg-white/95 px-6 py-12 text-center">
        <p className="text-sm font-medium uppercase tracking-[0.3em] text-accent">Book not found</p>
        <h2 className="mt-4 text-3xl font-semibold text-ink">This book is not in the current mock catalogue.</h2>
        <button
          type="button"
          onClick={() => navigate('/catalogue')}
          className="mt-6 rounded-full bg-brand px-5 py-3 text-sm font-semibold text-white"
        >
          Return to catalogue
        </button>
      </section>
    );
  }

  return <ProductDetailSummary book={book} />;
}

export function CartPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const cartItems = useAppSelector(selectCartItems);
  const cartSummary = useAppSelector(selectCartSummary);
  const recommendedBooks = useAppSelector(selectRecommendedBooks);

  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="Shopping cart"
        title="Review basket contents and recommendations"
        description="Customers can adjust quantities, remove books, review totals, and continue through the mocked purchase journey."
      />
      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-5">
          {cartItems.length === 0 ? (
            <section className="rounded-[2rem] border border-dashed border-brand/20 bg-white/95 px-6 py-12 text-center">
              <p className="text-sm font-medium uppercase tracking-[0.3em] text-accent">Basket is empty</p>
              <h2 className="mt-4 text-3xl font-semibold text-ink">Add a few books to get started.</h2>
              <Link to="/catalogue" className="mt-6 inline-flex rounded-full bg-brand px-5 py-3 text-sm font-semibold text-white">
                Browse catalogue
              </Link>
            </section>
          ) : (
            cartItems.map((item) => (
              <article key={item.bookId} className="rounded-[2rem] border border-brand/10 bg-white/95 overflow-hidden">
                {/* Item row: cover + info + price/controls */}
                <div className="flex flex-col gap-0 sm:flex-row sm:items-stretch">
                  {/* Book cover — fixed width column */}
                  <div className="w-full sm:w-36 shrink-0">
                    <div
                      className="relative h-40 w-full overflow-hidden sm:h-full"
                      style={{ backgroundColor: item.book.coverColor }}
                    >
                      <div
                        className="absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-20"
                        style={{ backgroundColor: item.book.coverAccent }}
                      />
                      <div className="relative flex h-full flex-col justify-between p-4 text-white">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-white/70">{item.book.category}</p>
                        <div>
                          <p className="font-serif text-base font-semibold leading-tight">{item.book.title}</p>
                          <p className="mt-1 text-xs text-white/70">{item.book.author}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Book info */}
                  <div className="flex flex-1 flex-col justify-center gap-2 p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent">{item.book.category}</p>
                    <h3 className="font-serif text-xl font-semibold text-ink">{item.book.title}</h3>
                    <p className="text-sm text-brand/70">
                      {item.book.author} · {item.book.brand}
                    </p>
                    <p className="text-sm leading-6 text-brand/80">{item.book.shortDescription}</p>
                    <p className="text-sm text-pine">Estimated delivery in {item.book.deliveryDays} day{item.book.deliveryDays > 1 ? 's' : ''}</p>
                  </div>

                  {/* Price + controls */}
                  <div className="flex shrink-0 flex-col justify-between gap-4 border-t border-brand/10 bg-parchment p-5 sm:w-48 sm:border-l sm:border-t-0">
                    <div>
                      <p className="text-xs text-brand/70">Line total</p>
                      <p className="text-2xl font-semibold text-ink">{formatCurrency(item.lineTotal)}</p>
                    </div>
                    <label className="block text-sm text-brand/80">
                      Quantity
                      <select
                        value={item.quantity}
                        onChange={(event) => dispatch(updateQuantity({ bookId: item.bookId, quantity: Number(event.target.value) }))}
                        className="mt-2 w-full rounded-2xl border border-brand/10 bg-white px-4 py-3 text-sm text-brand"
                      >
                        {[1, 2, 3, 4, 5].map((quantity) => (
                          <option key={quantity} value={quantity}>
                            {quantity}
                          </option>
                        ))}
                      </select>
                    </label>
                    <button
                      type="button"
                      onClick={() => dispatch(removeFromCart(item.bookId))}
                      className="w-full rounded-full border border-brand/15 px-4 py-2 text-sm font-semibold text-brand"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </article>
            ))
          )}
          <section className="rounded-[2rem] border border-brand/10 bg-white/95 p-6">
            <SectionHeader
              eyebrow="Recommended next"
              title="Items based on order history"
              description="Additional recommendations help grow basket size from the selected customer profile."
            />
            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3" style={{ gridAutoRows: '1fr' }}>
              {recommendedBooks.map((book) => (
                <BookCard key={book.id} book={book} showDescription={false} />
              ))}
            </div>
          </section>
        </div>
        <aside className="rounded-[2rem] border border-brand/10 bg-white/95 p-6">
          <SectionHeader
            eyebrow="Summary"
            title="Order totals"
            description="A lightweight summary for the current basket before address and payment selection."
          />
          <dl className="mt-6 space-y-4 text-sm text-brand/80">
            <div className="flex items-center justify-between">
              <dt>Items</dt>
              <dd>{cartSummary.itemCount}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt>Subtotal</dt>
              <dd>{formatCurrency(cartSummary.subtotal)}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt>Gift point discount</dt>
              <dd>-{formatCurrency(cartSummary.discount)}</dd>
            </div>
            <div className="flex items-center justify-between border-t border-brand/10 pt-4 text-base font-semibold text-ink">
              <dt>Total</dt>
              <dd>{formatCurrency(cartSummary.total)}</dd>
            </div>
          </dl>
          <div className="mt-6 flex flex-col gap-3">
            <button
              type="button"
              onClick={() => navigate('/checkout')}
              disabled={cartItems.length === 0}
              className="rounded-full bg-brand px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-brand/30"
            >
              Continue to checkout
            </button>
            <Link to="/catalogue" className="rounded-full border border-brand/15 px-5 py-3 text-center text-sm font-semibold text-brand">
              Continue shopping
            </Link>
          </div>
        </aside>
      </section>
    </div>
  );
}

export function CheckoutPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const currentUser = useAppSelector(selectCurrentUser);
  const cartSummary = useAppSelector(selectCartSummary);
  const selectedAddressId = useAppSelector((state) => state.checkout.selectedAddressId);
  const redeemedPoints = useAppSelector((state) => state.checkout.redeemedPoints);
  const maxRedeemablePoints = Math.min(currentUser.giftPoints, Math.round(cartSummary.subtotal * 100));

  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="Checkout"
        title="Select delivery address and redeem gift points"
        description="Customers choose where the books should be delivered and apply available gift points before payment."
      />
      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <section className="rounded-[2rem] border border-brand/10 bg-white/95 p-6">
            <SectionHeader
              eyebrow="Delivery address"
              title="Choose where to send the order"
              description="Addresses come from the active demo customer profile."
            />
            <div className="mt-6 grid gap-4">
              {currentUser.addresses.map((address) => (
                <button
                  key={address.id}
                  type="button"
                  onClick={() => dispatch(setSelectedAddress(address.id))}
                  className={`rounded-[1.75rem] border p-5 text-left ${
                    selectedAddressId === address.id ? 'border-brand bg-parchment ring-4 ring-brand/5' : 'border-brand/10 bg-parchment/60'
                  }`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-accent">{address.label}</p>
                      <h3 className="mt-2 text-lg font-semibold text-ink">{address.recipient}</h3>
                      <p className="mt-2 text-sm text-brand/80">
                        {address.line1}
                        {address.line2 ? `, ${address.line2}` : ''}
                        <br />
                        {address.city}, {address.postcode}, {address.country}
                      </p>
                    </div>
                    {address.isDefault ? <span className="rounded-full border border-accent/20 bg-accent/10 px-3 py-2 text-xs font-semibold text-brand">Default</span> : null}
                  </div>
                </button>
              ))}
            </div>
          </section>
          <section className="rounded-[2rem] border border-brand/10 bg-white/95 p-6">
            <SectionHeader
              eyebrow="Gift points"
              title="Redeem available points"
              description={`The selected customer has ${currentUser.giftPoints} points available. 100 points equals ${formatCurrency(1)}.`}
            />
            <label className="mt-6 block">
              <span className="text-sm text-brand/80">Redeem points</span>
              <input
                type="range"
                min={0}
                max={maxRedeemablePoints}
                step={10}
                value={Math.min(redeemedPoints, maxRedeemablePoints)}
                onChange={(event) => dispatch(setRedeemedPoints(Number(event.target.value)))}
                className="mt-4 w-full"
              />
            </label>
            <div className="mt-4 flex flex-col gap-2 rounded-2xl border border-brand/10 bg-parchment p-4 text-sm text-brand/80 sm:flex-row sm:items-center sm:justify-between">
              <span>{redeemedPoints} points selected</span>
              <span>Discount applied: {formatCurrency(redeemedPoints / 100)}</span>
            </div>
          </section>
        </div>
        <aside className="rounded-[2rem] border border-brand/10 bg-white/95 p-6">
          <SectionHeader eyebrow="Review" title="Ready for payment" description="Confirm delivery choices before moving to payment." />
          <dl className="mt-6 space-y-4 text-sm text-brand/80">
            <div className="flex items-center justify-between">
              <dt>Saved addresses</dt>
              <dd>{currentUser.addresses.length}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt>Gift points used</dt>
              <dd>{redeemedPoints}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt>Subtotal</dt>
              <dd>{formatCurrency(cartSummary.subtotal)}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt>Total after discount</dt>
              <dd>{formatCurrency(cartSummary.total)}</dd>
            </div>
          </dl>
          <div className="mt-6 flex flex-col gap-3">
            <button
              type="button"
              onClick={() => navigate('/payment')}
              className="rounded-full bg-brand px-5 py-3 text-sm font-semibold text-white"
            >
              Continue to payment
            </button>
            <Link to="/cart" className="rounded-full border border-brand/15 px-5 py-3 text-center text-sm font-semibold text-brand">
              Back to basket
            </Link>
          </div>
        </aside>
      </section>
    </div>
  );
}

export function PaymentPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const paymentOptions = selectPaymentOptions();
  const selectedPaymentOption = useAppSelector((state) => state.checkout.paymentOptionId);
  const cartSummary = useAppSelector(selectCartSummary);
  const currentUser = useAppSelector(selectCurrentUser);
  const redeemedPoints = useAppSelector((state) => state.checkout.redeemedPoints);

  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="Payment"
        title="Choose the right payment option"
        description="This MVP simulates payment selection and completion without a live payment gateway."
      />
      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6 rounded-[2rem] border border-brand/10 bg-white/95 p-6">
          <SectionHeader
            eyebrow="Payment screen"
            title="Select a payment method"
            description="Choose how to pay and complete the mocked purchase flow."
          />
          <div className="grid gap-4">
            {paymentOptions.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => dispatch(setPaymentOption(option.id))}
                className={`rounded-[1.75rem] border p-5 text-left ${
                  selectedPaymentOption === option.id ? 'border-brand bg-parchment ring-4 ring-brand/5' : 'border-brand/10 bg-parchment/60'
                }`}
              >
                <h3 className="text-lg font-semibold text-ink">{option.label}</h3>
                <p className="mt-2 text-sm text-brand/80">{option.description}</p>
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => {
              if (redeemedPoints > 0) {
                dispatch(deductPoints({ userId: currentUser.id, points: redeemedPoints }));
              }
              dispatch(submitOrder());
              dispatch(clearCart());
              navigate('/confirmation');
            }}
            className="rounded-full bg-brand px-5 py-3 text-sm font-semibold text-white"
          >
            Complete payment
          </button>
        </div>
        <aside className="rounded-[2rem] border border-brand/10 bg-white/95 p-6">
          <SectionHeader eyebrow="Payment summary" title="Order amount" description="Mocked payment confirmation uses the basket total after discounts." />
          <dl className="mt-6 space-y-4 text-sm text-brand/80">
            <div className="flex items-center justify-between">
              <dt>Subtotal</dt>
              <dd>{formatCurrency(cartSummary.subtotal)}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt>Discount</dt>
              <dd>-{formatCurrency(cartSummary.discount)}</dd>
            </div>
            <div className="flex items-center justify-between border-t border-brand/10 pt-4 text-base font-semibold text-ink">
              <dt>Total charged</dt>
              <dd>{formatCurrency(cartSummary.total)}</dd>
            </div>
          </dl>
        </aside>
      </section>
    </div>
  );
}

export function ConfirmationPage() {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(selectCurrentUser);
  const selectedAddressId = useAppSelector((state) => state.checkout.selectedAddressId);
  const selectedAddress = currentUser.addresses.find((address) => address.id === selectedAddressId) ?? currentUser.addresses[0];
  const redeemedPoints = useAppSelector((state) => state.checkout.redeemedPoints);
  const orderSubmitted = useAppSelector((state) => state.checkout.orderSubmitted);

  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] border border-pine/20 bg-pine/10 p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-pine">Payment and purchase confirmation</p>
        <h2 className="mt-4 text-3xl font-semibold text-ink">{orderSubmitted ? 'Purchase complete' : 'Confirmation pending'}</h2>
        <p className="mt-4 max-w-3xl text-sm text-brand/80 sm:text-base">
          {orderSubmitted
            ? `${currentUser.name}, your order has been confirmed and the purchase completion message is now shown successfully.`
            : 'Complete the payment step to trigger the purchase completion message.'}
        </p>
      </section>
      <section className="grid gap-6 lg:grid-cols-2">
        <article className="rounded-[2rem] border border-brand/10 bg-white/95 p-6">
          <SectionHeader
            eyebrow="Delivery"
            title="Selected address"
            description="The confirmation view reflects the delivery destination chosen during checkout."
          />
          <div className="mt-6 rounded-[1.75rem] border border-brand/10 bg-parchment p-5 text-sm text-brand/80">
            <p className="font-semibold text-ink">{selectedAddress.recipient}</p>
            <p className="mt-2">
              {selectedAddress.line1}
              {selectedAddress.line2 ? `, ${selectedAddress.line2}` : ''}
              <br />
              {selectedAddress.city}, {selectedAddress.postcode}, {selectedAddress.country}
            </p>
          </div>
        </article>
        <article className="rounded-[2rem] border border-brand/10 bg-white/95 p-6">
          <SectionHeader
            eyebrow="Completion details"
            title="What happened"
            description="The message below confirms purchase completion and gift point usage in the mocked flow."
          />
          <ul className="mt-6 space-y-3 text-sm text-brand/80">
            <li>Payment step completed successfully</li>
            <li>Gift points redeemed: {redeemedPoints}</li>
            <li>Delivery address saved from selected customer profile</li>
            <li>Order can be browsed again from the demo history flow in future iterations</li>
          </ul>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link to="/catalogue" className="rounded-full bg-brand px-5 py-3 text-center text-sm font-semibold text-white">
              Continue browsing
            </Link>
            <button
              type="button"
              onClick={() => dispatch(resetCheckout())}
              className="rounded-full border border-brand/15 px-5 py-3 text-sm font-semibold text-brand"
            >
              Reset checkout state
            </button>
          </div>
        </article>
      </section>
    </div>
  );
}
