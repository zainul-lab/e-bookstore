import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { selectCartItems, selectCartSummary, selectCurrentUser } from '../store';
import { setRedeemedPoints, setSelectedAddress } from '../store/slices/checkoutSlice';
import { formatCurrency } from '../utils/formatCurrency';
import { SectionHeader } from '../components/SectionHeader';

export function CheckoutPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const currentUser = useAppSelector(selectCurrentUser);
  const cartSummary = useAppSelector(selectCartSummary);
  const cartItems = useAppSelector(selectCartItems);
  const selectedAddressId = useAppSelector((state) => state.checkout.selectedAddressId);
  const redeemedPoints = useAppSelector((state) => state.checkout.redeemedPoints);
  const maxRedeemablePoints = Math.min(currentUser.giftPoints, Math.round(cartSummary.subtotal * 100));

  if (cartItems.length === 0) {
    return (
      <section className="rounded-[2rem] border border-dashed border-brand/20 bg-white/95 px-6 py-12 text-center">
        <p className="text-sm font-medium uppercase tracking-[0.3em] text-accent">Basket is empty</p>
        <h2 className="mt-4 text-3xl font-semibold text-ink">Add books before checking out.</h2>
        <p className="mt-3 text-sm text-brand/70">You need at least one item in your basket to proceed to checkout.</p>
        <Link to="/catalogue" className="mt-6 inline-flex rounded-full bg-brand px-5 py-3 text-sm font-semibold text-white">
          Browse catalogue
        </Link>
      </section>
    );
  }

  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="Checkout"
        title="Select delivery address and redeem gift points"
        description="Customers choose where the books should be delivered and apply available gift points before payment."
      />
      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          {/* Address selection */}
          <section className="rounded-[2rem] border border-brand/10 bg-white/95 p-6">
            <SectionHeader
              eyebrow="Delivery address"
              title="Choose where to send the order"
              description="Addresses come from the active demo customer profile."
            />
            <div className="mt-6 grid gap-4">
              {currentUser.addresses.map((address) => (
                <button
                  key={address.id}
                  type="button"
                  onClick={() => dispatch(setSelectedAddress(address.id))}
                  className={`rounded-[1.75rem] border p-5 text-left ${
                    selectedAddressId === address.id
                      ? 'border-brand bg-parchment ring-4 ring-brand/5'
                      : 'border-brand/10 bg-parchment/60'
                  }`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-accent">{address.label}</p>
                      <h3 className="mt-2 text-lg font-semibold text-ink">{address.recipient}</h3>
                      <p className="mt-2 text-sm text-brand/80">
                        {address.line1}
                        {address.line2 ? `, ${address.line2}` : ''}
                        <br />
                        {address.city}, {address.postcode}, {address.country}
                      </p>
                    </div>
                    {address.isDefault ? (
                      <span className="rounded-full border border-accent/20 bg-accent/10 px-3 py-2 text-xs font-semibold text-brand">Default</span>
                    ) : null}
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* Gift points */}
          <section className="rounded-[2rem] border border-brand/10 bg-white/95 p-6">
            <SectionHeader
              eyebrow="Gift points"
              title="Redeem available points"
              description={`The selected customer has ${currentUser.giftPoints} points available. 100 points equals ${formatCurrency(1)}.`}
            />
            <label className="mt-6 block">
              <span className="text-sm text-brand/80">Redeem points</span>
              <input
                type="range"
                min={0}
                max={maxRedeemablePoints}
                step={10}
                value={Math.min(redeemedPoints, maxRedeemablePoints)}
                onChange={(event) => dispatch(setRedeemedPoints(Number(event.target.value)))}
                className="mt-4 w-full"
              />
            </label>
            <div className="mt-4 flex flex-col gap-2 rounded-2xl border border-brand/10 bg-parchment p-4 text-sm text-brand/80 sm:flex-row sm:items-center sm:justify-between">
              <span>{redeemedPoints} points selected</span>
              <span>Discount applied: {formatCurrency(redeemedPoints / 100)}</span>
            </div>
          </section>
        </div>

        {/* Summary aside */}
        <aside className="rounded-[2rem] border border-brand/10 bg-white/95 p-6 sticky top-24 self-start">
          <SectionHeader eyebrow="Review" title="Ready for payment" description="Confirm delivery choices before moving to payment." />
          <dl className="mt-6 space-y-4 text-sm text-brand/80">
            <div className="flex items-center justify-between">
              <dt>Saved addresses</dt>
              <dd>{currentUser.addresses.length}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt>Gift points used</dt>
              <dd>{redeemedPoints}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt>Subtotal</dt>
              <dd>{formatCurrency(cartSummary.subtotal)}</dd>
            </div>
            <div className="flex items-center justify-between border-t border-brand/10 pt-4 text-base font-semibold text-ink">
              <dt>Total after discount</dt>
              <dd>{formatCurrency(cartSummary.total)}</dd>
            </div>
          </dl>
          <div className="mt-6 flex flex-col gap-3">
            <button
              type="button"
              disabled={!selectedAddressId}
              onClick={() => navigate('/payment')}
              className="rounded-full bg-brand px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-brand/30"
            >
              Continue to payment
            </button>
            {!selectedAddressId && (
              <p className="text-center text-xs text-brand/60">Select a delivery address above to continue.</p>
            )}
            <Link to="/cart" className="rounded-full border border-brand/15 px-5 py-3 text-center text-sm font-semibold text-brand">
              Back to basket
            </Link>
          </div>
        </aside>
      </section>
    </div>
  );
}
