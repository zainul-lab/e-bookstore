import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { bookService } from '../../services/bookService';
import type { Book, BookCategory } from '../../types/store';

export interface BooksState {
  items: Book[];
  featured: Book[];
  brands: string[];
  loading: boolean;
  error: string | null;
  retryCount: number;
}

const initialState: BooksState = {
  items: [],
  featured: [],
  brands: [],
  loading: false,
  error: null,
  retryCount: 0,
};

// Async thunks
export const fetchBooks = createAsyncThunk(
  'books/fetchBooks',
  async (
    filters: {
      category?: BookCategory | 'All';
      brand?: string;
      search?: string;
      maxPrice?: number;
      minRating?: number;
      sortBy?: string;
    } | undefined = undefined,
    { rejectWithValue }
  ) => {
    try {
      return await bookService.getBooks(filters);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch books');
    }
  }
);

export const fetchFeaturedBooks = createAsyncThunk(
  'books/fetchFeaturedBooks',
  async (_, { rejectWithValue }) => {
    try {
      return await bookService.getFeaturedBooks();
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch featured books');
    }
  }
);

export const fetchBrands = createAsyncThunk(
  'books/fetchBrands',
  async (_, { rejectWithValue }) => {
    try {
      return await bookService.getBrands();
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch brands');
    }
  }
);

export const fetchBookById = createAsyncThunk(
  'books/fetchBookById',
  async (bookId: string, { rejectWithValue }) => {
    try {
      return await bookService.getBookById(bookId);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch book');
    }
  }
);

export const fetchRelatedBooks = createAsyncThunk(
  'books/fetchRelatedBooks',
  async (bookId: string, { rejectWithValue }) => {
    try {
      return await bookService.getRelatedBooks(bookId);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch related books');
    }
  }
);

export const searchBooks = createAsyncThunk(
  'books/searchBooks',
  async (query: string, { rejectWithValue }) => {
    try {
      return await bookService.searchBooks(query);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Search failed');
    }
  }
);

const booksSlice = createSlice({
  name: 'books',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetRetryCount: (state) => {
      state.retryCount = 0;
    },
    incrementRetryCount: (state) => {
      state.retryCount += 1;
    },
  },
  extraReducers: (builder) => {
    // Fetch all books
    builder
      .addCase(fetchBooks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBooks.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
        state.retryCount = 0;
      })
      .addCase(fetchBooks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch featured books
    builder
      .addCase(fetchFeaturedBooks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFeaturedBooks.fulfilled, (state, action) => {
        state.featured = action.payload;
        state.loading = false;
      })
      .addCase(fetchFeaturedBooks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch brands
    builder
      .addCase(fetchBrands.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBrands.fulfilled, (state, action) => {
        state.brands = action.payload;
        state.loading = false;
      })
      .addCase(fetchBrands.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch book by ID
    builder
      .addCase(fetchBookById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBookById.fulfilled, (state, action) => {
        // Update the book in items array if it exists, or add it
        const existingIndex = state.items.findIndex((b) => b.id === action.payload.id);
        if (existingIndex >= 0) {
          state.items[existingIndex] = action.payload;
        } else {
          state.items.push(action.payload);
        }
        state.loading = false;
        state.retryCount = 0;
      })
      .addCase(fetchBookById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch related books
    builder
      .addCase(fetchRelatedBooks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRelatedBooks.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(fetchRelatedBooks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Search books
    builder
      .addCase(searchBooks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchBooks.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(searchBooks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, resetRetryCount, incrementRetryCount } = booksSlice.actions;
export const booksReducer = booksSlice.reducer;
