import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { CatalogueFilters } from '../../types/store';

const initialState: CatalogueFilters = {
  category: 'All',
  brand: 'All',
  search: '',
  maxPrice: null,
  minRating: 0,
  sortBy: 'default',
};

const catalogueSlice = createSlice({
  name: 'catalogue',
  initialState,
  reducers: {
    setCategoryFilter(state, action: PayloadAction<CatalogueFilters['category']>) {
      state.category = action.payload;
    },
    setBrandFilter(state, action: PayloadAction<CatalogueFilters['brand']>) {
      state.brand = action.payload;
    },
    setSearchFilter(state, action: PayloadAction<string>) {
      state.search = action.payload;
    },
    setMaxPriceFilter(state, action: PayloadAction<number | null>) {
      state.maxPrice = action.payload;
    },
    setMinRatingFilter(state, action: PayloadAction<number>) {
      state.minRating = action.payload;
    },
    setSortBy(state, action: PayloadAction<CatalogueFilters['sortBy']>) {
      state.sortBy = action.payload;
    },
    resetFilters() {
      return initialState;
    },
  },
});

export const {
  resetFilters,
  setBrandFilter,
  setCategoryFilter,
  setMaxPriceFilter,
  setMinRatingFilter,
  setSearchFilter,
  setSortBy,
} = catalogueSlice.actions;
export const catalogueReducer = catalogueSlice.reducer;
