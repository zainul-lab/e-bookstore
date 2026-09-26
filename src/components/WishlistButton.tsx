import { useAppDispatch, useAppSelector } from '../store/hooks';
import { toggleWishlist } from '../store/slices/wishlistSlice';
import { useToast } from './Toast';
import type { Book } from '../types/store';

export function WishlistButton({ book, className }: { book: Book; className: string }) {
  const dispatch = useAppDispatch();
  const showToast = useToast();
  const userId = useAppSelector((state) => state.session.selectedUserId);
  const isSaved = useAppSelector((state) => (state.wishlist[state.session.selectedUserId] ?? []).includes(book.id));

  return (
    <button
      type="button"
      aria-pressed={isSaved}
      aria-label={`${isSaved ? 'Remove' : 'Save'} ${book.title} ${isSaved ? 'from' : 'to'} wishlist`}
      onClick={() => {
        dispatch(toggleWishlist({ userId, bookId: book.id }));
        showToast(`"${book.title}" ${isSaved ? 'removed from' : 'saved to'} wishlist`);
      }}
      className={className}
    >
      {isSaved ? 'Remove from wishlist' : 'Save for later'}
    </button>
  );
}