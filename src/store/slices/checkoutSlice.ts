import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { demoUsers, paymentOptions } from '../../data/mockBookstore';
import { getPersistedCheckoutState } from '../persistence';
import type { CheckoutState } from '../../types/store';

const initialState: CheckoutState = getPersistedCheckoutState();

function createCheckoutStateForUser(userId: string): CheckoutState {
  const user = demoUsers.find((demoUser) => demoUser.id === userId) ?? demoUsers[0];

  return {
    selectedAddressId: user.addresses.find((address) => address.isDefault)?.id ?? user.addresses[0]?.id ?? null,
    paymentOptionId: paymentOptions[0].id,
    redeemedPoints: 0,
    orderSubmitted: false,
  };
}

const checkoutSlice = createSlice({
  name: 'checkout',
  initialState,
  reducers: {
    setSelectedAddress(state, action: PayloadAction<string>) {
      state.selectedAddressId = action.payload;
    },
    setPaymentOption(state, action: PayloadAction<string>) {
      state.paymentOptionId = action.payload;
    },
    setRedeemedPoints(state, action: PayloadAction<number>) {
      state.redeemedPoints = action.payload;
    },
    submitOrder(state) {
      state.orderSubmitted = true;
    },
    resetCheckout() {
      return initialState;
    },
    resetCheckoutForUser(_state, action: PayloadAction<string>) {
      return createCheckoutStateForUser(action.payload);
    },
  },
});

export const { resetCheckout, resetCheckoutForUser, setPaymentOption, setRedeemedPoints, setSelectedAddress, submitOrder } =
  checkoutSlice.actions;
export const checkoutReducer = checkoutSlice.reducer;
