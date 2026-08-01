import { useAppSelector } from '../store/hooks';
import { selectCurrentUser, selectFeaturedBooks, selectRecommendedBooks } from '../store';
import { HeroCard } from '../components/HeroCard';
import { BookCard } from '../components/BookCard';
import { SectionHeader } from '../components/SectionHeader';

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
