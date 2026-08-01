import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { selectCartItems, selectCartSummary, selectCurrentUser, selectPaymentOptions } from '../store';
import { clearCart } from '../store/slices/cartSlice';
import { setPaymentOption, submitOrder } from '../store/slices/checkoutSlice';
import { deductPoints } from '../store/slices/usersSlice';
import { formatCurrency } from '../utils/formatCurrency';
import { SectionHeader } from '../components/SectionHeader';

export function PaymentPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const paymentOptions = selectPaymentOptions();
  const selectedPaymentOption = useAppSelector((state) => state.checkout.paymentOptionId);
  const cartSummary = useAppSelector(selectCartSummary);
  const cartItems = useAppSelector(selectCartItems);
  const currentUser = useAppSelector(selectCurrentUser);
  const redeemedPoints = useAppSelector((state) => state.checkout.redeemedPoints);

  if (cartItems.length === 0) {
    return (
      <section className="rounded-[2rem] border border-dashed border-brand/20 bg-white/95 px-6 py-12 text-center">
        <p className="text-sm font-medium uppercase tracking-[0.3em] text-accent">Nothing to pay for</p>
        <h2 className="mt-4 text-3xl font-semibold text-ink">Your basket is empty.</h2>
        <p className="mt-3 text-sm text-brand/70">Add books to your basket before completing payment.</p>
        <Link to="/catalogue" className="mt-6 inline-flex rounded-full bg-brand px-5 py-3 text-sm font-semibold text-white">
          Browse catalogue
        </Link>
      </section>
    );
  }

  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="Payment"
        title="Choose the right payment option"
        description="This MVP simulates payment selection and completion without a live payment gateway."
      />
      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6 rounded-[2rem] border border-brand/10 bg-white/95 p-6">
          <SectionHeader
            eyebrow="Payment screen"
            title="Select a payment method"
            description="Choose how to pay and complete the mocked purchase flow."
          />
          <div className="grid gap-4">
            {paymentOptions.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => dispatch(setPaymentOption(option.id))}
                className={`rounded-[1.75rem] border p-5 text-left ${
                  selectedPaymentOption === option.id
                    ? 'border-brand bg-parchment ring-4 ring-brand/5'
                    : 'border-brand/10 bg-parchment/60'
                }`}
              >
                <h3 className="text-lg font-semibold text-ink">{option.label}</h3>
                <p className="mt-2 text-sm text-brand/80">{option.description}</p>
              </button>
            ))}
          </div>
          <button
            type="button"
            disabled={!selectedPaymentOption}
            onClick={() => {
              if (redeemedPoints > 0) {
                dispatch(deductPoints({ userId: currentUser.id, points: redeemedPoints }));
              }
              dispatch(submitOrder());
              dispatch(clearCart());
              navigate('/confirmation');
            }}
            className="rounded-full bg-brand px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-brand/30"
          >
            Complete payment
          </button>
        </div>
        <aside className="rounded-[2rem] border border-brand/10 bg-white/95 p-6 sticky top-24 self-start">
          <SectionHeader eyebrow="Payment summary" title="Order amount" description="Mocked payment confirmation uses the basket total after discounts." />
          <dl className="mt-6 space-y-4 text-sm text-brand/80">
            <div className="flex items-center justify-between">
              <dt>Subtotal</dt>
              <dd>{formatCurrency(cartSummary.subtotal)}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt>Discount</dt>
              <dd>-{formatCurrency(cartSummary.discount)}</dd>
            </div>
            <div className="flex items-center justify-between border-t border-brand/10 pt-4 text-base font-semibold text-ink">
              <dt>Total charged</dt>
              <dd>{formatCurrency(cartSummary.total)}</dd>
            </div>
          </dl>
        </aside>
      </section>
    </div>
  );
}
