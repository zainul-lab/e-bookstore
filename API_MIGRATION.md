# API Configuration Guide

## Environment Variables

Create a `.env.local` file in the project root to configure the API:

```bash
# API Base URL (defaults to http://localhost:3000/api if not set)
VITE_API_URL=http://localhost:3000/api

# For production
# VITE_API_URL=https://api.bookstore.com

# Authentication
VITE_AUTH_TOKEN_KEY=authToken

# Stripe (for payment integration - future)
VITE_STRIPE_PUBLIC_KEY=pk_test_xxxxxxx
```

## API Endpoints Expected

The following endpoints should be implemented on your backend:

### Books
- `GET /api/books` - Get all books with filters
- `GET /api/books/:id` - Get single book
- `GET /api/books/:id/related` - Get related books
- `GET /api/books/featured` - Get featured books
- `GET /api/books/brands` - Get available brands
- `GET /api/books/search?q=query` - Search books

### Users (Future)
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/users/:id` - Get user details

### Cart (Future)
- `GET /api/cart` - Get user's cart
- `POST /api/cart/items` - Add to cart
- `PUT /api/cart/items/:id` - Update cart item
- `DELETE /api/cart/items/:id` - Remove from cart

### Orders (Future)
- `GET /api/orders` - Get user's orders
- `POST /api/orders` - Create order
- `GET /api/orders/:id` - Get order details

## Fallback Behavior

The service layer implements a **hybrid approach**:

1. **Try API first** - Attempts to fetch from the backend API
2. **Fallback to mock data** - If API fails, uses local mock data
3. **Retry with exponential backoff** - Automatically retries failed requests

This allows you to:
- Develop frontend features without waiting for backend
- Gradually migrate to real API as endpoints become available
- Have graceful error handling with mock data fallback

## Error Handling

All API calls include automatic error handling:

```typescript
try {
  const books = await bookService.getBooks();
} catch (error) {
  // Error will have:
  // - error.status: HTTP status code
  // - error.message: Error message
  // - error.details: Additional details from API
}
```

## Retry Logic

Failed requests are automatically retried with exponential backoff:

- Max retries: 3
- Base delay: 1000ms
- Max delay: 30000ms
- Retryable errors: Network errors (status 0), 5xx errors, rate limits (429)

Example: Request fails at attempt 1 → waits 1s → retries
         Request fails at attempt 2 → waits 2s → retries
         Request fails at attempt 3 → throws error

## Redux Integration

Books are fetched through Redux async thunks:

```typescript
import { fetchBooks } from '@/store/slices/booksSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

function MyComponent() {
  const dispatch = useAppDispatch();
  const { items, loading, error } = useAppSelector(state => state.books);

  useEffect(() => {
    dispatch(fetchBooks({ category: 'Technology' }));
  }, [dispatch]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {items.map(book => (
        <div key={book.id}>{book.title}</div>
      ))}
    </div>
  );
}
```

## Migration Checklist

- [ ] Set up backend API with books endpoints
- [ ] Configure `VITE_API_URL` in `.env.local`
- [ ] Test API responses match `Book` interface
- [ ] Update store to use `fetchBooks` from `booksSlice`
- [ ] Verify no errors in browser console
- [ ] Test filters and search functionality
- [ ] Implement remaining endpoints (users, cart, orders)
