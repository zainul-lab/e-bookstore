export type BookCategory =
  | 'Fiction'
  | 'Technology'
  | 'Business'
  | 'Children'
  | 'History'
  | 'Lifestyle';

export interface Category {
  id: string;
  name: BookCategory;
  description: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  brand: string;
  category: BookCategory;
  price: number;
  rating: number;
  cover: string;
  coverColor: string;
  coverAccent: string;
  shortDescription: string;
  description: string;
  formats: string[];
  tags: string[];
  deliveryDays: number;
  featured?: boolean;
}

export interface Address {
  id: string;
  label: string;
  recipient: string;
  line1: string;
  line2?: string;
  city: string;
  postcode: string;
  country: string;
  isDefault?: boolean;
}

export interface OrderItem {
  bookId: string;
  quantity: number;
  unitPrice: number;
}

export interface Order {
  id: string;
  placedAt: string;
  status: 'Delivered' | 'Processing';
  items: OrderItem[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  giftPoints: number;
  addresses: Address[];
  orderHistory: Order[];
}

export interface CartItem {
  bookId: string;
  quantity: number;
}

export interface PaymentOption {
  id: string;
  label: string;
  description: string;
}

export interface CatalogueFilters {
  category: BookCategory | 'All';
  brand: string | 'All';
  search: string;
}

export interface CheckoutState {
  selectedAddressId: string | null;
  paymentOptionId: string | null;
  redeemedPoints: number;
  orderSubmitted: boolean;
}
