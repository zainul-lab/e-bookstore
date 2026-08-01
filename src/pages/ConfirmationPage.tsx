import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { selectCurrentUser } from '../store';
import { resetCheckout } from '../store/slices/checkoutSlice';
import { SectionHeader } from '../components/SectionHeader';

export function ConfirmationPage() {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(selectCurrentUser);
  const selectedAddressId = useAppSelector((state) => state.checkout.selectedAddressId);
  const selectedAddress = currentUser.addresses.find((address) => address.id === selectedAddressId) ?? currentUser.addresses[0];
  const redeemedPoints = useAppSelector((state) => state.checkout.redeemedPoints);
  const orderSubmitted = useAppSelector((state) => state.checkout.orderSubmitted);

  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] border border-pine/20 bg-pine/10 p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-pine">Payment and purchase confirmation</p>
        <h2 className="mt-4 text-3xl font-semibold text-ink">{orderSubmitted ? 'Purchase complete' : 'Confirmation pending'}</h2>
        <p className="mt-4 max-w-3xl text-sm text-brand/80 sm:text-base">
          {orderSubmitted
            ? `${currentUser.name}, your order has been confirmed and the purchase completion message is now shown successfully.`
            : 'Complete the payment step to trigger the purchase completion message.'}
        </p>
      </section>
      <section className="grid gap-6 lg:grid-cols-2">
        <article className="rounded-[2rem] border border-brand/10 bg-white/95 p-6">
          <SectionHeader
            eyebrow="Delivery"
            title="Selected address"
            description="The confirmation view reflects the delivery destination chosen during checkout."
          />
          <div className="mt-6 rounded-[1.75rem] border border-brand/10 bg-parchment p-5 text-sm text-brand/80">
            <p className="font-semibold text-ink">{selectedAddress.recipient}</p>
            <p className="mt-2">
              {selectedAddress.line1}
              {selectedAddress.line2 ? `, ${selectedAddress.line2}` : ''}
              <br />
              {selectedAddress.city}, {selectedAddress.postcode}, {selectedAddress.country}
            </p>
          </div>
        </article>
        <article className="rounded-[2rem] border border-brand/10 bg-white/95 p-6">
          <SectionHeader
            eyebrow="Completion details"
            title="What happened"
            description="The message below confirms purchase completion and gift point usage in the mocked flow."
          />
          <ul className="mt-6 space-y-3 text-sm text-brand/80">
            <li>Payment step completed successfully</li>
            <li>Gift points redeemed: {redeemedPoints}</li>
            <li>Delivery address saved from selected customer profile</li>
            <li>Order can be browsed again from the demo history flow in future iterations</li>
          </ul>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link to="/catalogue" className="rounded-full bg-brand px-5 py-3 text-center text-sm font-semibold text-white">
              Continue browsing
            </Link>
            <button
              type="button"
              onClick={() => dispatch(resetCheckout())}
              className="rounded-full border border-brand/15 px-5 py-3 text-sm font-semibold text-brand"
            >
              Reset checkout state
            </button>
          </div>
        </article>
      </section>
    </div>
  );
}
