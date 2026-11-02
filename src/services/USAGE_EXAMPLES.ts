/**
 * USAGE EXAMPLES - How to use the new API-based book service
 * 
 * This file shows three different approaches:
 * 1. Using Redux with async thunks (RECOMMENDED)
 * 2. Using the hybrid service (fallback to mock data)
 * 3. Using the bookService directly
 * 
 * NOTE: This is an example file showing patterns. Copy these patterns to your components.
 */

// ============================================================================
// PATTERN 1: Using Redux Async Thunks (RECOMMENDED)
// ============================================================================
// 
// In your component:
//
// import { useEffect } from 'react';
// import { useAppDispatch, useAppSelector } from '@/store/hooks';
// import { fetchBooks } from '@/store/slices/booksSlice';
//
// export function CataloguePageExample() {
//   const dispatch = useAppDispatch();
//   const { items: books, loading, error } = useAppSelector(state => state.books);
//
//   useEffect(() => {
//     dispatch(fetchBooks({ category: 'Technology', sortBy: 'rating' }));
//   }, [dispatch]);
//
//   if (loading) return <LoadingSpinner />;
//   if (error) return <ErrorMessage error={error} />;
//   return <BookGrid books={books} />;
// }

// ============================================================================
// PATTERN 2: Using Hybrid Service (Fallback to Mock Data)
// ============================================================================
//
// import { fetchBooksHybrid } from '@/services/bookstoreService';
//
// export async function useBooksHybrid(category?: string) {
//   try {
//     const books = await fetchBooksHybrid({ category: category as any });
//     return { books, error: null };
//   } catch (error) {
//     console.error('Failed to fetch books:', error);
//     return { books: [], error };
//   }
// }

// ============================================================================
// PATTERN 3: Direct Service Usage (For One-Off Calls)
// ============================================================================
//
// import { bookService } from '@/services/bookService';
//
// export async function fetchBookDetailsExample(bookId: string) {
//   try {
//     const book = await bookService.getBookById(bookId);
//     const relatedBooks = await bookService.getRelatedBooks(bookId);
//     return { book, relatedBooks };
//   } catch (error) {
//     console.error('Failed to fetch book:', error);
//     throw error;
//   }
// }

// ============================================================================
// MIGRATION CHECKLIST
// ============================================================================
//
// When your backend API is ready:
//
// 1. Update .env.local with your API URL:
//    VITE_API_URL=http://localhost:3000/api
//
// 2. Ensure your API endpoints match these patterns:
//    GET /api/books
//    GET /api/books/:id
//    GET /api/books/:id/related
//    GET /api/books/featured
//    GET /api/books/brands
//    GET /api/books/search?q=query
//
// 3. Components using Redux will automatically use the API
//    (no code changes needed!)
//
// 4. Error handling is automatic with retry logic
//
// 5. Fallback to mock data still works if API fails

export {};
