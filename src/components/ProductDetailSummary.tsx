import { Link } from 'react-router-dom';
import { useAppDispatch } from '../store/hooks';
import { selectRelatedBooks } from '../store';
import { addToCart } from '../store/slices/cartSlice';
import { formatCurrency } from '../utils/formatCurrency';
import { useToast } from './Toast';
import { BookCover } from './BookCover';
import { BookCard } from './BookCard';
import { SectionHeader } from './SectionHeader';
import type { Book } from '../types/store';

export function ProductDetailSummary({ book }: { book: Book }) {
  const dispatch = useAppDispatch();
  const showToast = useToast();
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
            <p className="mt-2 text-sm text-brand/70">{book.author} · {book.brand} · Rated {book.rating}/5</p>
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
              onClick={() => {
                dispatch(addToCart(book.id));
                showToast(`"${book.title}" added to basket`);
              }}
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
