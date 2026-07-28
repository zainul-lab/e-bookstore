import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { CatalogueFilters } from '../../types/store';

const initialState: CatalogueFilters = {
  category: 'All',
  brand: 'All',
  search: '',
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
    resetFilters() {
      return initialState;
    },
  },
});

export const { resetFilters, setBrandFilter, setCategoryFilter, setSearchFilter } = catalogueSlice.actions;
export const catalogueReducer = catalogueSlice.reducer;
