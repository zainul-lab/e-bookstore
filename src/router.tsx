import { createBrowserRouter } from 'react-router-dom';
import {
  AppLayout,
  CartPage,
  CataloguePage,
  CheckoutPage,
  ConfirmationPage,
  HomePage,
  PaymentPage,
  ProductDetailPage,
} from './app';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'catalogue', element: <CataloguePage /> },
      { path: 'catalogue/:bookId', element: <ProductDetailPage /> },
      { path: 'cart', element: <CartPage /> },
      { path: 'checkout', element: <CheckoutPage /> },
      { path: 'payment', element: <PaymentPage /> },
      { path: 'confirmation', element: <ConfirmationPage /> },
    ],
  },
]);
