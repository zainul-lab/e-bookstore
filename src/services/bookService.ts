import { apiClient } from './apiClient';
import type { Book, BookCategory } from '../types/store';

export const bookService = {
  /**
   * Fetch all books with optional filters
   */
  getBooks: async (filters?: {
    category?: BookCategory | 'All';
    brand?: string;
    search?: string;
    maxPrice?: number;
    minRating?: number;
    sortBy?: string;
  }): Promise<Book[]> => {
    const response = await apiClient.get<Book[]>('/books', { params: filters });
    return response.data;
  },

  /**
   * Fetch a single book by ID
   */
  getBookById: async (bookId: string): Promise<Book> => {
    const response = await apiClient.get<Book>(`/books/${bookId}`);
    return response.data;
  },

  /**
   * Fetch related books for a given book
   */
  getRelatedBooks: async (bookId: string): Promise<Book[]> => {
    const response = await apiClient.get<Book[]>(`/books/${bookId}/related`);
    return response.data;
  },

  /**
   * Fetch featured/promoted books
   */
  getFeaturedBooks: async (): Promise<Book[]> => {
    const response = await apiClient.get<Book[]>('/books/featured');
    return response.data;
  },

  /**
   * Fetch available brands
   */
  getBrands: async (): Promise<string[]> => {
    const response = await apiClient.get<string[]>('/books/brands');
    return response.data;
  },

  /**
   * Search books by query
   */
  searchBooks: async (query: string): Promise<Book[]> => {
    const response = await apiClient.get<Book[]>('/books/search', {
      params: { q: query },
    });
    return response.data;
  },
};
