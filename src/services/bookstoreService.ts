import type { Book, BookCategory, CartItem, Order, User } from '../types/store';
import { books, demoUsers } from '../data/mockBookstore';
import { bookService } from './bookService';
import { retryWithBackoff } from '../utils/retry';

/**
 * Hybrid service that attempts API calls first, then falls back to mock data
 * This allows gradual migration from mock to real API
 */

export async function fetchBooksHybrid(filters?: {
  category?: BookCategory | 'All';
  brand?: string;
  search?: string;
}): Promise<Book[]> {
  try {
    // Try API first
    const data = await retryWithBackoff(() => bookService.getBooks(filters));
    return data;
  } catch (error) {
    console.warn('API call failed, falling back to mock data:', error);
    // Fallback to mock data
    let result = books;

    if (filters?.category && filters.category !== 'All') {
      result = result.filter((book) => book.category === filters.category);
    }

    if (filters?.brand && filters.brand !== 'All') {
      result = result.filter((book) => book.brand === filters.brand);
    }

    if (filters?.search) {
      const query = filters.search.toLowerCase();
      result = result.filter(
        (book) =>
          book.title.toLowerCase().includes(query) ||
          book.author.toLowerCase().includes(query) ||
          book.description.toLowerCase().includes(query)
      );
    }

    return result;
  }
}

export async function fetchUsersHybrid(): Promise<User[]> {
  try {
    // Try API first
    const data = await retryWithBackoff(() =>
      fetch('/api/users').then((res) => res.json())
    );
    return data;
  } catch (error) {
    console.warn('API call failed, falling back to mock data:', error);
    // Fallback to mock data
    return demoUsers;
  }
}

// Export for backwards compatibility
export async function fetchBooks() {
  return fetchBooksHybrid();
}

export async function fetchUsers() {
  return fetchUsersHybrid();
}

export function getBookById(bookId: string) {
  return books.find((book) => book.id === bookId);
}

export function getBooksByCategory(category: BookCategory | 'All') {
  return category === 'All' ? books : books.filter((book) => book.category === category);
}

export function getBrands() {
  return Array.from(new Set(books.map((book) => book.brand))).sort();
}

export function getFeaturedBooks() {
  return books.filter((book) => book.featured);
}

export function getRelatedBooks(bookId: string) {
  const currentBook = getBookById(bookId);

  if (!currentBook) {
    return [];
  }

  return books
    .filter(
      (book) =>
        book.id !== bookId &&
        (book.category === currentBook.category || book.brand === currentBook.brand || book.tags.some((tag) => currentBook.tags.includes(tag))),
    )
    .slice(0, 4);
}

export function getOrderHistoryBooks(orders: Order[]) {
  return orders.flatMap((order) =>
    order.items
      .map((item) => getBookById(item.bookId))
      .filter((book): book is Book => Boolean(book)),
  );
}

export function getRecommendedBooksFromHistory(user: User | undefined) {
  if (!user) {
    return getFeaturedBooks().slice(0, 4);
  }

  const historyBooks = getOrderHistoryBooks(user.orderHistory);
  const purchasedIds = new Set(historyBooks.map((book) => book.id));
  const preferredCategories = new Set(historyBooks.map((book) => book.category));
  const preferredBrands = new Set(historyBooks.map((book) => book.brand));

  return books
    .filter(
      (book) =>
        !purchasedIds.has(book.id) && (preferredCategories.has(book.category) || preferredBrands.has(book.brand)),
    )
    .slice(0, 4);
}

export function getCartDetailedItems(cartItems: CartItem[]) {
  return cartItems
    .map((item) => {
      const book = getBookById(item.bookId);

      if (!book) {
        return null;
      }

      return {
        ...item,
        book,
        lineTotal: Number((item.quantity * book.price).toFixed(2)),
      };
    })
    .filter((item): item is NonNullable<typeof item> => Boolean(item));
}
