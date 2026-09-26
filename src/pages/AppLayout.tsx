import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { fetchBooks, fetchUsers } from '../services/bookstoreService';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { selectCartSummary, selectCurrentUser } from '../store';
import { logout } from '../store/slices/authSlice';
import { ToastStack } from '../components/Toast';
void fetchBooks();
void fetchUsers();

const navLinkClassName = ({ isActive }: { isActive: boolean }) =>
  `shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition ${
    isActive
      ? 'bg-brand text-white ring-4 ring-brand/10'
      : 'border border-brand/10 bg-white/70 text-ink hover:border-accent/40 hover:bg-parchment'
  }`;

export function AppLayout() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const currentUser = useAppSelector(selectCurrentUser);
  const cartSummary = useAppSelector(selectCartSummary);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.key]);

  function handleLogout() {
    dispatch(logout());
    navigate('/login', { replace: true });
  }

  return (
    <ToastStack>
      <div className="min-h-screen text-ink">

        {/* ── Header ── */}
        <header className="sticky top-0 z-[1] max-h-[80dvh] overflow-y-auto border-b border-brand/10 bg-[#fbf6ef]/95 backdrop-blur-sm sm:max-h-none sm:overflow-visible">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 sm:px-6 lg:px-8">

            {/* Top row: logo + user info + toggle */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex shrink-0 items-center justify-between gap-3">
                <Link to="/" className="flex min-w-0 items-center gap-3 sm:gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand text-lg font-semibold text-white">EB</div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.25em] text-accent sm:text-sm">Curated online bookstore</p>
                    <h1 className="text-xl font-semibold text-ink sm:text-2xl">E-Bookstore</h1>
                  </div>
                </Link>
                <button
                  type="button"
                  aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                  aria-controls="main-navigation"
                  aria-expanded={menuOpen}
                  onClick={() => setMenuOpen((open) => !open)}
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-brand/20 bg-white/80 text-brand transition hover:bg-parchment focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:hidden"
                >
                  <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    {menuOpen ? (
                      <path d="M5 5l14 14M19 5L5 19" />
                    ) : (
                      <path d="M4 6h16M4 12h16M4 18h16" />
                    )}
                  </svg>
                </button>
              </div>
              <div className="flex flex-wrap items-center justify-end gap-2 text-xs text-brand sm:min-w-0 sm:gap-3 sm:text-sm">
                <span className="rounded-full border border-brand/10 bg-white/80 px-3 py-2">
                  Signed in as {currentUser.name}
                </span>
                <span className="rounded-full border border-accent/20 bg-accent/10 px-3 py-2 text-brand">
                  {currentUser.giftPoints} gift points
                </span>
                <Link to="/cart" className="rounded-full border border-pine/20 bg-pine/10 px-3 py-2 text-pine transition hover:bg-pine/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pine">
                  {cartSummary.itemCount} {cartSummary.itemCount === 1 ? 'item' : 'items'} in basket
                </Link>
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
            <nav
              id="main-navigation"
              aria-label="Main navigation"
              className={`${menuOpen ? 'grid' : 'hidden'} grid-cols-2 gap-2 rounded-2xl border border-brand/10 bg-white/80 p-3 sm:flex sm:flex-wrap sm:border-0 sm:bg-transparent sm:p-0`}
            >
              <NavLink to="/" className={navLinkClassName} onClick={() => setMenuOpen(false)} end>Home</NavLink>
              <NavLink to="/catalogue" className={navLinkClassName} onClick={() => setMenuOpen(false)}>Catalogue</NavLink>
              <NavLink to="/cart" className={navLinkClassName} onClick={() => setMenuOpen(false)}>Cart</NavLink>
              <NavLink to="/wishlist" className={navLinkClassName} onClick={() => setMenuOpen(false)}>Wishlist</NavLink>
              <NavLink to="/checkout" className={navLinkClassName} onClick={() => setMenuOpen(false)}>Checkout</NavLink>
              <NavLink to="/payment" className={navLinkClassName} onClick={() => setMenuOpen(false)}>Payment</NavLink>
            </nav>
          </div>
        </header>

        {/* ── Page content ── */}
        <main className="relative z-0 mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <Outlet />
        </main>

        {/* ── Footer ── */}
        <footer className="border-t border-brand/10 bg-[#fbf6ef]/80">
          <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 text-sm text-brand sm:grid-cols-2 sm:px-6 lg:grid-cols-3 lg:px-8">
            <nav aria-label="Explore the bookstore" className="space-y-3">
              <h2 className="font-serif text-lg font-semibold text-ink">Explore</h2>
              <div className="flex flex-col items-start gap-2">
                <Link to="/" className="hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent">Home</Link>
                <Link to="/catalogue" className="hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent">Browse books</Link>
              </div>
            </nav>
            <nav aria-label="Shopping shortcuts" className="space-y-3">
              <h2 className="font-serif text-lg font-semibold text-ink">Your shopping</h2>
              <div className="flex flex-col items-start gap-2">
                <Link to="/wishlist" className="hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent">Saved books</Link>
                <Link to="/cart" className="hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent">
                  Basket ({cartSummary.itemCount})
                </Link>
                <Link to="/checkout" className="hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent">Checkout</Link>
              </div>
            </nav>
            <div className="space-y-3">
              <h2 className="font-serif text-lg font-semibold text-ink">Your account</h2>
              <p>Signed in as {currentUser.name}</p>
              <p>{currentUser.giftPoints} gift points available</p>
              <button
                type="button"
                onClick={handleLogout}
                className="text-left font-semibold hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
              >
                Sign out
              </button>
            </div>
          </div>
        </footer>

      </div>
    </ToastStack>
  );
}
