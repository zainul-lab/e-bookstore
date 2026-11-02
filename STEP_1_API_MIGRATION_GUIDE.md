# Step 1: Replace Mock Data with API Calls - Implementation Guide

## ✅ What's Been Implemented

This guide documents **Step 1** of the production migration: replacing mock data with Axios API calls. All new code has been created and tested. The application builds successfully with TypeScript.

---

## 📁 Files Created

### 1. **Core API Client** (`src/services/apiClient.ts`)
- Centralized Axios instance with request/response interceptors
- Automatic JWT token attachment to requests
- Global error handling with ApiError class
- Network timeout configuration (10s default)
- Base URL from environment variable

**Key Features:**
```typescript
- Authorization: Bearer <token> header injection
- Response error normalization
- Network failure detection
- API rate limit (429) handling
```

### 2. **Book Service** (`src/services/bookService.ts`)
- Type-safe API methods for all book-related endpoints
- Methods:
  - `getBooks(filters?)` - Fetch all books with filtering
  - `getBookById(id)` - Get single book
  - `getRelatedBooks(id)` - Get related books
  - `getFeaturedBooks()` - Get promoted books
  - `getBrands()` - Get available brands
  - `searchBooks(query)` - Search functionality

**Current Status:** Ready to connect to real API

### 3. **Redux Books Slice** (`src/store/slices/booksSlice.ts`)
- Async thunks for all book operations:
  - `fetchBooks` - Get books with filters
  - `fetchFeaturedBooks` - Get featured books
  - `fetchBrands` - Get brands
  - `fetchBookById` - Get single book
  - `fetchRelatedBooks` - Get related books
  - `searchBooks` - Search functionality

- State structure:
  ```typescript
  {
    items: Book[];           // All fetched books
    featured: Book[];        // Featured books
    brands: string[];        // Available brands
    loading: boolean;        // Loading state
    error: string | null;   // Error message if any
    retryCount: number;     // Number of retries
  }
  ```

- Actions:
  - `clearError()` - Clear error message
  - `resetRetryCount()` - Reset retry counter
  - `incrementRetryCount()` - Increment retry counter

### 4. **Retry Utility** (`src/utils/retry.ts`)
- Retry with exponential backoff for failed requests
- Configurable:
  - Max retries (default: 3)
  - Base delay (default: 1000ms)
  - Max delay (default: 30000ms)
  - Custom retry predicate function

**Automatically retries:**
- Network errors (status 0)
- Server errors (5xx)
- Rate limits (429)

### 5. **Hybrid Service** (`src/services/bookstoreService.ts`) - UPDATED
- Now attempts API calls first
- Falls back to mock data if API fails
- Allows smooth migration without breaking existing code
- Functions:
  - `fetchBooksHybrid()` - Hybrid fetch with fallback
  - `fetchUsersHybrid()` - Hybrid user fetch
  - Plus all original helper functions (unchanged)

### 6. **Error Boundary Component** (`src/components/ErrorBoundary.tsx`)
- React Error Boundary for catching rendering errors
- Displays error UI with recovery options
- Prevents white-screen crashes

### 7. **Async Boundary Component** (`src/components/AsyncBoundary.tsx`)
- Displays loading/error/empty states for async operations
- Composable UI patterns:
  - `AsyncBoundary` - Basic wrapper
  - `AsyncData` - Generic data wrapper
  - `SkeletonLoader` - Loading placeholder

### 8. **Documentation** (`API_MIGRATION.md`)
- Configuration guide
- Expected endpoint patterns
- Fallback behavior explanation
- Migration checklist

---

## 🚀 How It Works

### Architecture Diagram

```
┌─────────────────────────────────────────────────────┐
│         React Component                             │
│  (using Redux hooks & AsyncBoundary)               │
└────────────────┬────────────────────────────────────┘
                 │
                 ├──dispatch(fetchBooks())──→ Redux
                 │
┌────────────────▼────────────────────────────────────┐
│      Redux Books Slice (booksSlice.ts)              │
│  - Async Thunks                                     │
│  - State Management (loading, error, items)         │
└────────────────┬────────────────────────────────────┘
                 │
                 ├──calls──→ Book Service
                 │
┌────────────────▼────────────────────────────────────┐
│      Book Service (bookService.ts)                   │
│  - Type-safe API methods                            │
│  - Calls Axios client                              │
└────────────────┬────────────────────────────────────┘
                 │
                 ├──calls──→ API Client
                 │
┌────────────────▼────────────────────────────────────┐
│     API Client (apiClient.ts)                        │
│  - Interceptors (auth, errors)                      │
│  - Retry logic                                      │
│  - Error normalization                              │
└────────────────┬────────────────────────────────────┘
                 │
    ┌────────────┴──────────────┐
    │                           │
    ▼                           ▼
  BACKEND API          Fallback to Mock Data
  (future)             (current)
```

### Data Flow Example

```typescript
// 1. Component dispatches action
dispatch(fetchBooks({ category: 'Technology' }))

// 2. Redux thunk calls book service
const books = await bookService.getBooks({ category: 'Technology' })

// 3. Book service calls API client
const response = await apiClient.get('/books', { params: { category: 'Technology' } })

// 4. API client adds auth token, handles retries
// With interceptors:
//   - Adds: Authorization: Bearer <token>
//   - Retries on network errors
//   - Normalizes errors

// 5. Response returned through chain
// Redux state updates → Component re-renders
```

---

## 🔧 Usage Patterns

### Pattern 1: Redux (Recommended for components)

```typescript
import { fetchBooks } from '@/store/slices/booksSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

export function CataloguePage() {
  const dispatch = useAppDispatch();
  const { items, loading, error } = useAppSelector(state => state.books);

  useEffect(() => {
    dispatch(fetchBooks({ category: 'Technology' }));
  }, [dispatch]);

  return (
    <AsyncBoundary isLoading={loading} error={error} onRetry={...}>
      {/* Render books */}
    </AsyncBoundary>
  );
}
```

### Pattern 2: Direct Service (One-off calls)

```typescript
import { bookService } from '@/services/bookService';

async function getBook(id: string) {
  try {
    const book = await bookService.getBookById(id);
    return book;
  } catch (error) {
    console.error('Failed:', error);
  }
}
```

### Pattern 3: Hybrid (During transition)

```typescript
import { fetchBooksHybrid } from '@/services/bookstoreService';

async function loadBooks() {
  const books = await fetchBooksHybrid();
  // Uses API if available, falls back to mock data
  return books;
}
```

---

## 🌍 Environment Configuration

Create `.env.local` in project root:

```bash
# API Configuration
VITE_API_URL=http://localhost:3000/api

# For production
# VITE_API_URL=https://api.bookstore.com
```

---

## 📡 Expected Backend Endpoints

When you create the backend, implement these endpoints:

```
GET    /api/books                      # Get all books
GET    /api/books?category=Tech        # With filters
GET    /api/books/:bookId              # Get one book
GET    /api/books/:bookId/related      # Related books
GET    /api/books/featured             # Featured books
GET    /api/books/brands               # All brands
GET    /api/books/search?q=query       # Search
```

**Response Format (Book):**
```typescript
{
  id: string;
  title: string;
  author: string;
  brand: string;
  category: 'Fiction' | 'Technology' | 'Business' | 'Children' | 'History' | 'Lifestyle';
  price: number;
  rating: number;
  cover: string;
  coverColor: string;
  coverAccent: string;
  shortDescription: string;
  description: string;
  formats: string[];
  tags: string[];
  deliveryDays: number;
  featured?: boolean;
}
```

---

## ✨ Current Behavior (During Migration)

Since backend isn't ready yet:

1. **API Attempt**: Tries to fetch from API (will fail)
2. **Automatic Retry**: Retries 3 times with exponential backoff
3. **Fallback**: Uses mock data from `src/data/mockBookstore.ts`
4. **Console**: Shows warning "API call failed, falling back to mock data"
5. **UI**: Works perfectly with mock data

This means:
- ✅ Frontend development continues uninterrupted
- ✅ Components use Redux (production-ready pattern)
- ✅ Easy switch to API once backend is ready
- ✅ No changes needed to components

---

## 🎯 Testing the Setup

### Test 1: Check Build
```bash
npm run build
# Should succeed with no errors
```

### Test 2: Check Runtime
```bash
npm run dev
# App should run fine
# Check browser console for retry warnings
# App should use mock data with no errors
```

### Test 3: Simulate API Call
Update `src/services/apiClient.ts` temporarily:
```typescript
const API_BASE_URL = 'http://localhost:3000/api'; // Test with your server
```
Then run dev server - will retry and fall back gracefully.

---

## 🔄 Migration Checklist

### Phase 1: Current (Now)
- [x] API Client created
- [x] Book Service created
- [x] Redux slice with async thunks created
- [x] Retry logic implemented
- [x] Error handling components created
- [x] Hybrid service for fallback
- [x] Build passes
- [x] Mock data still works

### Phase 2: When Backend is Ready
- [ ] Create backend with `/api/books` endpoints
- [ ] Set `VITE_API_URL` environment variable
- [ ] Test API responses match `Book` interface
- [ ] Verify no console errors
- [ ] Remove mock data imports (optional)

### Phase 3: Advanced
- [ ] Implement `/api/users` for authentication
- [ ] Implement `/api/cart` for cart operations
- [ ] Implement `/api/orders` for orders
- [ ] Add payment gateway integration
- [ ] Implement caching strategy

---

## 🛡️ Error Handling

### Built-in Retry Logic

Automatically retries:
- Network errors (connection refused, timeout)
- Server errors (5xx status codes)
- Rate limits (429 status code)

Does NOT retry:
- Authentication errors (401)
- Authorization errors (403)
- Not found errors (404)
- Client errors (4xx, except 429)

### In Components

```typescript
<AsyncBoundary
  isLoading={loading}
  error={error}
  onRetry={() => dispatch(fetchBooks())}
>
  {/* Content */}
</AsyncBoundary>
```

---

## 📊 Performance Considerations

### Retry Times
- Attempt 1 → Instant
- Attempt 2 → Wait 1s → Retry
- Attempt 3 → Wait 2s → Retry
- Attempt 4 → Wait 4s → Fail (max retries: 3)

### Timeouts
- Request timeout: 10 seconds
- Max delay between retries: 30 seconds

### Bundle Size Impact
- New services: ~2KB gzipped
- Redux slice: ~1KB gzipped
- Total impact: ~3KB (minimal)

---

## 🐛 Troubleshooting

### Issue: "API call failed" in console
**Status:** ✅ Expected during development (API not ready yet)
**Solution:** This is intentional. App falls back to mock data automatically.

### Issue: TypeScript errors
**Status:** All fixed
**Solution:** Run `npm run build` to verify

### Issue: Mock data not showing
**Status:** Shouldn't happen
**Solution:** Check browser console for errors, verify mock data exists in `src/data/mockBookstore.ts`

### Issue: Slow performance
**Status:** Check retry delays
**Solution:** Increase `maxRetries` or `maxDelayMs` in retry config if needed

---

## 📚 Files Summary

| File | Purpose | Status |
|------|---------|--------|
| `apiClient.ts` | Axios instance with interceptors | ✅ Ready |
| `bookService.ts` | Type-safe API methods | ✅ Ready |
| `booksSlice.ts` | Redux async thunks + state | ✅ Ready |
| `retry.ts` | Exponential backoff logic | ✅ Ready |
| `bookstoreService.ts` | Hybrid API/mock fallback | ✅ Updated |
| `ErrorBoundary.tsx` | Error UI component | ✅ Ready |
| `AsyncBoundary.tsx` | Loading/error wrapper | ✅ Ready |
| `API_MIGRATION.md` | Config documentation | ✅ Ready |

---

## Next Steps

1. **Set up backend** with `/api/books` endpoint (see expected format above)
2. **Configure environment**: Set `VITE_API_URL` in `.env.local`
3. **Test**: Run `npm run dev` and verify API calls work
4. **Iterate**: Implement remaining endpoints as needed

Once API is ready, components automatically use it—**no code changes needed!**

---

## Questions?

Refer to:
- `API_MIGRATION.md` - Configuration guide
- `src/services/USAGE_EXAMPLES.ts` - Code patterns
- Source files - Detailed comments included

Good luck with your backend! 🚀
