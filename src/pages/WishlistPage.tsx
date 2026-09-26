import { Link } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';
import { selectWishlistBooks } from '../store';
import { BookCard } from '../components/BookCard';
import { SectionHeader } from '../components/SectionHeader';

export function WishlistPage() {
  const savedBooks = useAppSelector(selectWishlistBooks);

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Wishlist"
        title="Your saved books"
        description="Keep track of books you want to revisit or add to your basket later."
      />
      {savedBooks.length === 0 ? (
        <section className="rounded-[2rem] border border-dashed border-brand/20 bg-white/95 px-6 py-12 text-center">
          <h2 className="font-serif text-2xl font-semibold text-ink">No saved books yet</h2>
          <p className="mt-3 text-sm text-brand/70">Browse the catalogue and save books you like.</p>
          <Link to="/catalogue" className="mt-6 inline-block rounded-full bg-brand px-5 py-3 text-sm font-semibold text-white">
            Browse books
          </Link>
        </section>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4" style={{ gridAutoRows: '1fr' }}>
          {savedBooks.map((book) => <BookCard key={book.id} book={book} />)}
        </div>
      )}
    </div>
  );
}