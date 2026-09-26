import { Link } from 'react-router-dom';
import { useAppDispatch } from '../store/hooks';
import { addToCart } from '../store/slices/cartSlice';
import { formatCurrency } from '../utils/formatCurrency';
import { useToast } from './Toast';
import { BookCover } from './BookCover';
import { WishlistButton } from './WishlistButton';
import type { Book } from '../types/store';

export function BookCard({ book, showDescription = true }: { book: Book; showDescription?: boolean }) {
  const dispatch = useAppDispatch();
  const showToast = useToast();

  return (
    <article className="relative flex h-full flex-col rounded-[1.75rem] border border-brand/10 bg-white/95 overflow-hidden transition hover:-translate-y-1 hover:border-accent/40 hover:shadow-md">
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

        <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-brand/10">
          <div>
            <p className="text-lg font-semibold text-ink leading-none">{formatCurrency(book.price)}</p>
            <p className="mt-0.5 text-[10px] text-pine">
              Delivery in {book.deliveryDays} day{book.deliveryDays > 1 ? 's' : ''}
            </p>
          </div>
          <div className="flex flex-col gap-1.5 items-end shrink-0">
            <WishlistButton book={book} className="relative z-10 rounded-full border border-brand/20 px-3 py-1.5 text-[11px] font-semibold text-brand whitespace-nowrap" />
            <Link
              to={`/catalogue/${book.id}`}
              className="rounded-full border border-brand/20 px-3 py-1.5 text-[11px] font-semibold text-brand whitespace-nowrap after:absolute after:inset-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              aria-label={`View details for ${book.title}`}
            >
              View details
            </Link>
            <button
              type="button"
              onClick={() => {
                dispatch(addToCart(book.id));
                showToast(`"${book.title}" added to basket`);
              }}
              className="relative z-10 rounded-full bg-brand px-3 py-1.5 text-[11px] font-semibold text-white whitespace-nowrap"
            >
              Add to basket
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
