import { demoUsers, paymentOptions } from '../data/mockBookstore';
import type { CartItem, CheckoutState } from '../types/store';
import type { RootState } from './index';

const selectedUserStorageKey = 'ebookstore:selectedUserId';
const cartStorageKey = 'ebookstore:cartItems';
const checkoutStorageKey = 'ebookstore:checkoutState';

export function getPersistedSelectedUserId() {
  if (typeof window === 'undefined') {
    return demoUsers[0].id;
  }

  const value = window.localStorage.getItem(selectedUserStorageKey);

  if (!value) {
    return demoUsers[0].id;
  }

  const isValidUser = demoUsers.some((user) => user.id === value);

  return isValidUser ? value : demoUsers[0].id;
}

function getDefaultCartItems() {
  return [
    {
      bookId: 'clean-architecture',
      quantity: 1,
    },
  ] satisfies CartItem[];
}

function sanitizeCartItems(items: unknown) {
  if (!Array.isArray(items)) {
    return null;
  }

  const filtered = items.filter(
    (item): item is CartItem =>
      typeof item?.bookId === 'string' && typeof item?.quantity === 'number' && Number.isInteger(item.quantity) && item.quantity > 0,
  );

  return filtered;
}

export function getPersistedCartItems(userId = demoUsers[0].id) {
  const defaultItems = getDefaultCartItems();

  if (typeof window === 'undefined') {
    return defaultItems;
  }

  const value = window.localStorage.getItem(cartStorageKey);

  if (!value) {
    return defaultItems;
  }

  try {
    const parsed = JSON.parse(value) as Record<string, CartItem[]> | CartItem[];

    if (Array.isArray(parsed)) {
      const filtered = sanitizeCartItems(parsed);
      return filtered && filtered.length > 0 ? filtered : defaultItems;
    }

    if (!parsed || typeof parsed !== 'object') {
      return defaultItems;
    }

    const filtered = sanitizeCartItems(parsed[userId]);

    return filtered ?? [];
  } catch {
    return defaultItems;
  }
}

export function getPersistedCheckoutState() {
  const defaultState: CheckoutState = {
    selectedAddressId: demoUsers[0].addresses.find((address) => address.isDefault)?.id ?? null,
    paymentOptionId: paymentOptions[0].id,
    redeemedPoints: 0,
    orderSubmitted: false,
  };

  if (typeof window === 'undefined') {
    return defaultState;
  }

  const value = window.localStorage.getItem(checkoutStorageKey);

  if (!value) {
    return defaultState;
  }

  try {
    const parsed = JSON.parse(value) as CheckoutState;
    const validAddressIds = new Set(demoUsers.flatMap((user) => user.addresses.map((address) => address.id)));
    const validPaymentOptionIds = new Set(paymentOptions.map((option) => option.id));

    return {
      selectedAddressId:
        typeof parsed?.selectedAddressId === 'string' && validAddressIds.has(parsed.selectedAddressId)
          ? parsed.selectedAddressId
          : defaultState.selectedAddressId,
      paymentOptionId:
        typeof parsed?.paymentOptionId === 'string' && validPaymentOptionIds.has(parsed.paymentOptionId)
          ? parsed.paymentOptionId
          : defaultState.paymentOptionId,
      redeemedPoints:
        typeof parsed?.redeemedPoints === 'number' && parsed.redeemedPoints >= 0
          ? Math.floor(parsed.redeemedPoints)
          : defaultState.redeemedPoints,
      orderSubmitted: false,
    };
  } catch {
    return defaultState;
  }
}

export function persistStoreState(state: RootState) {
  if (typeof window === 'undefined') {
    return;
  }

  const existingCartValue = window.localStorage.getItem(cartStorageKey);
  let persistedCarts: Record<string, CartItem[]> = {};

  if (existingCartValue) {
    try {
      const parsed = JSON.parse(existingCartValue) as Record<string, CartItem[]>;

      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
        persistedCarts = parsed;
      }
    } catch {
      persistedCarts = {};
    }
  }

  persistedCarts[state.session.selectedUserId] = state.cart.items;

  window.localStorage.setItem(selectedUserStorageKey, state.session.selectedUserId);
  window.localStorage.setItem(cartStorageKey, JSON.stringify(persistedCarts));
  window.localStorage.setItem(
    checkoutStorageKey,
    JSON.stringify({
      selectedAddressId: state.checkout.selectedAddressId,
      paymentOptionId: state.checkout.paymentOptionId,
      redeemedPoints: state.checkout.redeemedPoints,
      orderSubmitted: state.checkout.orderSubmitted,
    }),
  );
}
