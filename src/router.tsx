import { Navigate, Outlet, createBrowserRouter } from 'react-router-dom';
import { useAppSelector } from './store/hooks';
import { selectIsAuthenticated } from './store/slices/authSlice';
import { LoginPage } from './pages/LoginPage';
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

function ProtectedRoute() {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: <ProtectedRoute />,
    children: [
      {
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
    ],
  },
]);
