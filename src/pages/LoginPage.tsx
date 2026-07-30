import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  attemptLogin,
  clearAuthError,
  loginFailure,
  loginSuccess,
  selectAuthError,
} from '../store/slices/authSlice';
import { selectUser } from '../store/slices/sessionSlice';
import { replaceCart } from '../store/slices/cartSlice';
import { resetCheckoutForUser } from '../store/slices/checkoutSlice';
import { getPersistedCartItems } from '../store/persistence';
import { demoUsers } from '../data/mockBookstore';

export function LoginPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const authError = useAppSelector(selectAuthError);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    dispatch(clearAuthError());

    if (!username.trim() || !password) {
      dispatch(loginFailure('Please enter your username and password.'));
      return;
    }

    const user = attemptLogin(username, password);

    if (!user) {
      dispatch(loginFailure('Invalid username or password. Please try again.'));
      return;
    }

    dispatch(loginSuccess(user.id));
    dispatch(selectUser(user.id));
    dispatch(replaceCart(getPersistedCartItems(user.id)));
    dispatch(resetCheckoutForUser(user.id));
    navigate('/', { replace: true });
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo / Brand */}
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand text-2xl font-semibold text-white shadow-sm">
            EB
          </div>
          <div className="text-center">
            <p className="text-xs uppercase tracking-[0.25em] text-accent">Curated online bookstore</p>
            <h1 className="mt-1 text-3xl font-semibold text-ink">E-Bookstore</h1>
          </div>
        </div>

        {/* Card */}
        <div className="rounded-[2rem] border border-brand/10 bg-white/95 p-8 shadow-sm backdrop-blur-sm">
          <h2 className="mb-1 text-xl font-semibold text-ink">Sign in to your account</h2>
          <p className="mb-6 text-sm text-brand/70">Enter your username or email and password to continue.</p>

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            {/* Error banner */}
            {authError && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {authError}
              </div>
            )}

            {/* Username */}
            <div className="space-y-1.5">
              <label htmlFor="username" className="block text-sm font-medium text-ink">
                Username or Email
              </label>
              <input
                id="username"
                type="text"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. Maya Patel or maya@example.com"
                className="w-full rounded-xl border border-brand/20 bg-parchment/60 px-4 py-3 text-sm text-ink placeholder-brand/40 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/10"
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label htmlFor="password" className="block text-sm font-medium text-ink">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full rounded-xl border border-brand/20 bg-parchment/60 px-4 py-3 pr-12 text-sm text-ink placeholder-brand/40 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-brand/50 hover:text-brand"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full rounded-xl bg-brand px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand/90 focus:outline-none focus:ring-2 focus:ring-brand/30"
            >
              Sign in
            </button>
          </form>

          {/* Demo credentials hint */}
          <div className="mt-6 rounded-xl border border-accent/20 bg-accent/5 px-4 py-4 text-xs text-brand/70">
            <p className="mb-2 font-semibold text-brand/90">Demo credentials</p>
            <div className="space-y-1">
              {demoUsers.map((u) => (
                <p key={u.id}>
                  <span className="font-medium">{u.name}</span> — password:{' '}
                  <code className="rounded bg-accent/10 px-1">{u.password}</code>
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
