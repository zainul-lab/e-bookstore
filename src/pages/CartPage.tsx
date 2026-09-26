import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { selectCartItems, selectCartSummary, selectRecommendedBooks } from '../store';
import { removeFromCart, updateQuantity } from '../store/slices/cartSlice';
import { formatCurrency } from '../utils/formatCurrency';
import { BookCard } from '../components/BookCard';
import { SectionHeader } from '../components/SectionHeader';

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
        <div className="min-w-0 space-y-5">
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
                <div className="flex flex-col gap-0 xl:flex-row xl:items-stretch">
                  {/* Book cover — fixed width column */}
                  <div className="w-full shrink-0 xl:w-36">
                    <div
                      className="relative h-40 w-full overflow-hidden xl:h-full"
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
                  <div className="flex min-w-0 flex-1 flex-col justify-center gap-2 p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent">{item.book.category}</p>
                    <h3 className="font-serif text-xl font-semibold text-ink">{item.book.title}</h3>
                    <p className="text-sm text-brand/70">{item.book.author} · {item.book.brand}</p>
                    <p className="text-sm leading-6 text-brand/80">{item.book.shortDescription}</p>
                    <p className="text-sm text-pine">Estimated delivery in {item.book.deliveryDays} day{item.book.deliveryDays > 1 ? 's' : ''}</p>
                  </div>

                  {/* Price + controls */}
                  <div className="flex shrink-0 flex-col justify-between gap-4 border-t border-brand/10 bg-parchment p-5 xl:w-48 xl:border-l xl:border-t-0">
                    <div>
                      <p className="text-xs text-brand/70">Line total</p>
                      <p className="text-2xl font-semibold text-ink">{formatCurrency(item.lineTotal)}</p>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <p className="text-sm text-brand/80">Quantity</p>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          aria-label="Decrease quantity"
                          onClick={() => dispatch(updateQuantity({ bookId: item.bookId, quantity: item.quantity - 1 }))}
                          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-brand/15 text-lg font-semibold text-brand hover:bg-parchment"
                        >
                          −
                        </button>
                        <span className="w-8 text-center text-sm font-semibold text-ink">{item.quantity}</span>
                        <button
                          type="button"
                          aria-label="Increase quantity"
                          onClick={() => dispatch(updateQuantity({ bookId: item.bookId, quantity: item.quantity + 1 }))}
                          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-brand/15 text-lg font-semibold text-brand hover:bg-parchment"
                        >
                          +
                        </button>
                      </div>
                    </div>
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
            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2" style={{ gridAutoRows: '1fr' }}>
              {recommendedBooks.map((book) => (
                <BookCard key={book.id} book={book} showDescription={false} />
              ))}
            </div>
          </section>
        </div>
        <aside className="min-w-0 self-start rounded-[2rem] border border-brand/10 bg-white/95 p-6 xl:sticky xl:top-44">
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
