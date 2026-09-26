import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { getPersistedWishlist } from '../persistence';

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: getPersistedWishlist(),
  reducers: {
    toggleWishlist(state, action: PayloadAction<{ userId: string; bookId: string }>) {
      const { userId, bookId } = action.payload;
      const saved = state[userId] ?? [];
      state[userId] = saved.includes(bookId)
        ? saved.filter((id) => id !== bookId)
        : [...saved, bookId];
    },
  },
});

export const { toggleWishlist } = wishlistSlice.actions;
export const wishlistReducer = wishlistSlice.reducer;