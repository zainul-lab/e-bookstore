import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import { books, categories, demoUsers, paymentOptions } from '../data/mockBookstore';
import {
  getBookById,
  getBrands,
  getCartDetailedItems,
  getFeaturedBooks,
  getRecommendedBooksFromHistory,
  getRelatedBooks,
} from '../services/bookstoreService';
import { persistStoreState } from './persistence';
import { authReducer } from './slices/authSlice';
import { cartReducer } from './slices/cartSlice';
import { catalogueReducer } from './slices/catalogueSlice';
import { checkoutReducer } from './slices/checkoutSlice';
import { sessionReducer } from './slices/sessionSlice';
import { usersReducer } from './slices/usersSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  session: sessionReducer,
  catalogue: catalogueReducer,
  cart: cartReducer,
  checkout: checkoutReducer,
  users: usersReducer,
});

export const store = configureStore({
  reducer: rootReducer,
});

store.subscribe(() => {
  persistStoreState(store.getState());
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const selectCategories = () => categories;
export const selectBooks = () => books;
export const selectBrands = () => getBrands();
export const selectFeaturedBooks = () => getFeaturedBooks();
export const selectUsers = () => demoUsers;
export const selectPaymentOptions = () => paymentOptions;

export const selectCurrentUser = (state: RootState) =>
  state.users[state.session.selectedUserId] ?? (Object.values(state.users)[0] as (typeof state.users)[string]);

export const selectFilteredBooks = (state: RootState) => {
  const currentFilters = state.catalogue;

  return books.filter((book) => {
    const matchesCategory = currentFilters.category === 'All' || book.category === currentFilters.category;
    const matchesBrand = currentFilters.brand === 'All' || book.brand === currentFilters.brand;
    const matchesSearch =
      currentFilters.search.length === 0 ||
      `${book.title} ${book.author} ${book.brand}`.toLowerCase().includes(currentFilters.search.toLowerCase());

    return matchesCategory && matchesBrand && matchesSearch;
  });
};

export const selectBook = (bookId: string) => getBookById(bookId);

export const selectRelatedBooks = (bookId: string) => getRelatedBooks(bookId);

export const selectRecommendedBooks = (state: RootState) => getRecommendedBooksFromHistory(selectCurrentUser(state));

export const selectCartItems = (state: RootState) => getCartDetailedItems(state.cart.items);

export const selectCartSummary = (state: RootState) => {
  const items = selectCartItems(state);
  const subtotal = items.reduce((total, item) => total + item.lineTotal, 0);
  const redeemedPointsValue = Number((state.checkout.redeemedPoints / 100).toFixed(2));
  const discount = Math.min(subtotal, redeemedPointsValue);
  const total = Math.max(0, subtotal - discount);

  return {
    itemCount: items.reduce((count, item) => count + item.quantity, 0),
    subtotal: Number(subtotal.toFixed(2)),
    discount: Number(discount.toFixed(2)),
    total: Number(total.toFixed(2)),
  };
};
