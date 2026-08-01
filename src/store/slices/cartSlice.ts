import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { getPersistedCartItems } from '../persistence';
import type { CartItem } from '../../types/store';

interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: getPersistedCartItems(),
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<string>) {
      const existingItem = state.items.find((item) => item.bookId === action.payload);

      if (existingItem) {
        existingItem.quantity += 1;
        return;
      }

      state.items.push({
        bookId: action.payload,
        quantity: 1,
      });
    },
    updateQuantity(state, action: PayloadAction<{ bookId: string; quantity: number }>) {
      const item = state.items.find((cartItem) => cartItem.bookId === action.payload.bookId);

      if (!item) {
        return;
      }

      item.quantity = action.payload.quantity;
      state.items = state.items.filter((cartItem) => cartItem.quantity > 0);
    },
    removeFromCart(state, action: PayloadAction<string>) {
      state.items = state.items.filter((item) => item.bookId !== action.payload);
    },
    clearCart(state) {
      state.items = [];
    },
    replaceCart(state, action: PayloadAction<CartItem[]>) {
      state.items = action.payload;
    },
  },
});

export const { addToCart, clearCart, removeFromCart, replaceCart, updateQuantity } = cartSlice.actions;

// buyAgain has identical behaviour to addToCart — re-exported as an alias so
// call sites don't need to change.
export const buyAgain = cartSlice.actions.addToCart;
export const cartReducer = cartSlice.reducer;
