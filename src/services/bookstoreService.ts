import axios from 'axios';
import type { Book, BookCategory, CartItem, Order, User } from '../types/store';
import { books, demoUsers } from '../data/mockBookstore';

const mockApi = axios.create({
  adapter: async (config) => ({
    data: config.url === '/users' ? demoUsers : books,
    status: 200,
    statusText: 'OK',
    headers: {},
    config,
  }),
});

export async function fetchBooks() {
  const response = await mockApi.get<Book[]>('/books');
  return response.data;
}

export async function fetchUsers() {
  const response = await mockApi.get<User[]>('/users');
  return response.data;
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
