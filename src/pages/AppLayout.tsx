import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { fetchBooks, fetchUsers } from '../services/bookstoreService';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { selectCartSummary, selectCurrentUser } from '../store';
import { logout } from '../store/slices/authSlice';
import { ToastStack } from '../components/Toast';
void fetchBooks();
void fetchUsers();

const navLinkClassName = ({ isActive }: { isActive: boolean }) =>
  `rounded-full px-4 py-2 text-sm font-medium transition ${
    isActive
      ? 'bg-brand text-white ring-4 ring-brand/10'
      : 'border border-brand/10 bg-white/70 text-ink hover:border-accent/40 hover:bg-parchment'
  }`;

export function AppLayout() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const currentUser = useAppSelector(selectCurrentUser);
  const cartSummary = useAppSelector(selectCartSummary);

  function handleLogout() {
    dispatch(logout());
    navigate('/login', { replace: true });
  }

  return (
    <ToastStack>
      <div className="min-h-screen text-ink">

        {/* ── Header ── */}
        <header className="sticky top-0 z-10 border-b border-brand/10 bg-[#fbf6ef]/90 backdrop-blur-sm">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 sm:px-6 lg:px-8">

            {/* Top row: logo + user info + toggle */}
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <Link to="/" className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand text-lg font-semibold text-white">EB</div>
                <div>
                  <p className="text-sm uppercase tracking-[0.25em] text-accent">Curated online bookstore</p>
                  <h1 className="text-2xl font-semibold text-ink">E-Bookstore</h1>
                </div>
              </Link>
              <div className="flex flex-wrap items-center gap-3 text-sm text-brand">
                <span className="rounded-full border border-brand/10 bg-white/80 px-3 py-2">
                  Signed in as {currentUser.name}
                </span>
                <span className="rounded-full border border-accent/20 bg-accent/10 px-3 py-2 text-brand">
                  {currentUser.giftPoints} gift points
                </span>
                <span className="rounded-full border border-pine/20 bg-pine/10 px-3 py-2 text-pine">
                  {cartSummary.itemCount} {cartSummary.itemCount === 1 ? 'item' : 'items'} in basket
                </span>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-full border border-brand/20 bg-white/70 px-3 py-2 text-sm font-medium text-brand transition hover:border-brand/40 hover:bg-parchment"
                >
                  Sign out
                </button>
              </div>
            </div>

            {/* Nav links */}
            <nav className="flex flex-wrap gap-2">
              <NavLink to="/" className={navLinkClassName} end>Home</NavLink>
              <NavLink to="/catalogue" className={navLinkClassName}>Catalogue</NavLink>
              <NavLink to="/cart" className={navLinkClassName}>Cart</NavLink>
              <NavLink to="/checkout" className={navLinkClassName}>Checkout</NavLink>
              <NavLink to="/payment" className={navLinkClassName}>Payment</NavLink>
            </nav>
          </div>
        </header>

        {/* ── Page content ── */}
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <Outlet />
        </main>

        {/* ── Footer ── */}
        <footer className="border-t border-brand/10 bg-[#fbf6ef]/80">
          <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-6 text-sm text-brand sm:px-6 lg:px-8 sm:flex-row sm:items-center sm:justify-between">
            <p>Frontend-only MVP built with React, Redux Toolkit, Tailwind CSS, Axios, Vite, and TypeScript.</p>
            <p>Responsive shopping journey with a warmer, more premium bookstore presentation.</p>
          </div>
        </footer>

      </div>
    </ToastStack>
  );
}
