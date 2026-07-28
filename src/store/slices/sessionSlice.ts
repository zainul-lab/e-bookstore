import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { getPersistedSelectedUserId } from '../persistence';

interface SessionState {
  selectedUserId: string;
}

const initialState: SessionState = {
  selectedUserId: getPersistedSelectedUserId(),
};

const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    selectUser(state, action: PayloadAction<string>) {
      state.selectedUserId = action.payload;
    },
  },
});

export const { selectUser } = sessionSlice.actions;
export const sessionReducer = sessionSlice.reducer;
