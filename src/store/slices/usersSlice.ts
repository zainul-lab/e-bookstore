import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { demoUsers } from '../../data/mockBookstore';
import type { RootState } from '../index';
import type { User } from '../../types/store';

type UsersState = Record<string, User>;

function buildInitialState(): UsersState {
  return Object.fromEntries(demoUsers.map((u) => [u.id, { ...u }]));
}

const usersSlice = createSlice({
  name: 'users',
  initialState: buildInitialState(),
  reducers: {
    deductPoints(state, action: PayloadAction<{ userId: string; points: number }>) {
      const user = state[action.payload.userId];
      if (user) {
        user.giftPoints = Math.max(0, user.giftPoints - action.payload.points);
      }
    },
  },
});

export const { deductPoints } = usersSlice.actions;
export const usersReducer = usersSlice.reducer;

export const selectCurrentUserFromState = (state: RootState) =>
  state.users[state.session.selectedUserId] ?? Object.values(state.users)[0];
