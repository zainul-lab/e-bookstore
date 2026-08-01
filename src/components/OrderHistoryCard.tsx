import { useMemo } from 'react';
import { useAppDispatch } from '../store/hooks';
import { selectBook } from '../store';
import { buyAgain } from '../store/slices/cartSlice';
import { formatCurrency } from '../utils/formatCurrency';
import type { Book, Order } from '../types/store';

export function OrderHistoryCard({ order }: { order: Order }) {
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
          <h3 className="mt-2 font-serif text-xl font-semibold text-ink">
            {new Date(order.placedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
          </h3>
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
              <p className="text-sm text-brand/70">{book.author} · Qty {item.quantity}</p>
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
