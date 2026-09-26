import { lazy } from 'react';
import { Navigate, Outlet, createBrowserRouter } from 'react-router-dom';
import { useAppSelector } from './store/hooks';
import { selectIsAuthenticated } from './store/slices/authSlice';
// AppLayout is eagerly loaded — it wraps every protected route and must be
// available immediately on any authenticated navigation.
import { AppLayout } from './pages/AppLayout';

// Each page is now in its own file — lazy() gives each route its own JS chunk,
// fetched only when the user first navigates to that path.
const LoginPage         = lazy(() => import('./pages/LoginPage').then((m) => ({ default: m.LoginPage })));
const HomePage          = lazy(() => import('./pages/HomePage').then((m) => ({ default: m.HomePage })));
const CataloguePage     = lazy(() => import('./pages/CataloguePage').then((m) => ({ default: m.CataloguePage })));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage').then((m) => ({ default: m.ProductDetailPage })));
const CartPage          = lazy(() => import('./pages/CartPage').then((m) => ({ default: m.CartPage })));
const WishlistPage      = lazy(() => import('./pages/WishlistPage').then((m) => ({ default: m.WishlistPage })));
const CheckoutPage      = lazy(() => import('./pages/CheckoutPage').then((m) => ({ default: m.CheckoutPage })));
const PaymentPage       = lazy(() => import('./pages/PaymentPage').then((m) => ({ default: m.PaymentPage })));
const ConfirmationPage  = lazy(() => import('./pages/ConfirmationPage').then((m) => ({ default: m.ConfirmationPage })));

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
          { path: 'wishlist', element: <WishlistPage /> },
          { path: 'checkout', element: <CheckoutPage /> },
          { path: 'payment', element: <PaymentPage /> },
          { path: 'confirmation', element: <ConfirmationPage /> },
        ],
      },
    ],
  },
]);
