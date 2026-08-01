import { useNavigate, useParams } from 'react-router-dom';
import { selectBook } from '../store';
import { ProductDetailSummary } from '../components/ProductDetailSummary';

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
