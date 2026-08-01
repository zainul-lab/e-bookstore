import type { Book } from '../types/store';

export function BookCover({ book, large = false }: { book: Book; large?: boolean }) {
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
