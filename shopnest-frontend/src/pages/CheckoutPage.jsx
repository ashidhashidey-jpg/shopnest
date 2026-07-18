import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { FiMapPin, FiCreditCard } from 'react-icons/fi';
import { placeOrder, clearLastOrder } from '../redux/slices/orderSlice';
import { clearCart } from '../redux/slices/cartSlice';
import { openRazorpayCheckout } from '../api/razorpay';
import { formatCurrency } from '../utils/helpers';

const CheckoutPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);

  const [address, setAddress] = useState({
    fullName: userInfo?.name || '',
    street: '',
    city: '',
    postalCode: '',
    country: 'India',
  });
  const [errors, setErrors] = useState({});
  const [processing, setProcessing] = useState(false);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);

  useEffect(() => {
    if (items.length === 0) navigate('/cart', { replace: true });
  }, [items, navigate]);

  const validate = () => {
    const errs = {};
    Object.entries(address).forEach(([key, val]) => {
      if (!val.trim()) errs[key] = 'Required';
    });
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setProcessing(true);
    try {
      // 1. Open Razorpay checkout, returns verified payment response
      const paymentResponse = await openRazorpayCheckout({
        amountInRupees: subtotal,
        name: userInfo.name,
        email: userInfo.email,
      });

      // 2. Create the order in our backend, attaching the Razorpay payment id
      const orderPayload = {
        items: items.map((item) => ({
          productId: item.productId,
          qty: item.qty,
          price: item.price,
        })),
        totalAmount: subtotal,
        address,
        paymentId: paymentResponse.razorpay_payment_id,
      };

      const result = await dispatch(placeOrder(orderPayload)).unwrap();

      dispatch(clearCart());
      toast.success('Order placed successfully!');
      navigate('/order-success', { state: { order: result } });
    } catch (err) {
      const message = typeof err === 'string' ? err : err?.message || 'Something went wrong with your order.';
      toast.error(message);
      navigate('/order-error', { state: { message } });
    } finally {
      setProcessing(false);
      dispatch(clearLastOrder());
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 lg:px-8 py-10">
      <h1 className="font-display text-3xl sm:text-4xl text-plum mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <form onSubmit={handlePlaceOrder} className="lg:col-span-2 space-y-6" noValidate>
          <div className="bg-white rounded-2xl shadow-card p-6">
            <h2 className="font-display text-xl text-plum mb-5 flex items-center gap-2">
              <FiMapPin className="text-gold" /> Shipping Address
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs uppercase tracking-wider text-plum-soft mb-1.5">Full Name</label>
                <input
                  type="text"
                  value={address.fullName}
                  onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                  className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 ${
                    errors.fullName ? 'border-coral' : 'border-gold/30'
                  }`}
                />
                {errors.fullName && <p className="text-coral text-xs mt-1">{errors.fullName}</p>}
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs uppercase tracking-wider text-plum-soft mb-1.5">Street Address</label>
                <input
                  type="text"
                  value={address.street}
                  onChange={(e) => setAddress({ ...address, street: e.target.value })}
                  className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 ${
                    errors.street ? 'border-coral' : 'border-gold/30'
                  }`}
                />
                {errors.street && <p className="text-coral text-xs mt-1">{errors.street}</p>}
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-plum-soft mb-1.5">City</label>
                <input
                  type="text"
                  value={address.city}
                  onChange={(e) => setAddress({ ...address, city: e.target.value })}
                  className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 ${
                    errors.city ? 'border-coral' : 'border-gold/30'
                  }`}
                />
                {errors.city && <p className="text-coral text-xs mt-1">{errors.city}</p>}
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-plum-soft mb-1.5">Postal Code</label>
                <input
                  type="text"
                  value={address.postalCode}
                  onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
                  className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 ${
                    errors.postalCode ? 'border-coral' : 'border-gold/30'
                  }`}
                />
                {errors.postalCode && <p className="text-coral text-xs mt-1">{errors.postalCode}</p>}
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs uppercase tracking-wider text-plum-soft mb-1.5">Country</label>
                <input
                  type="text"
                  value={address.country}
                  onChange={(e) => setAddress({ ...address, country: e.target.value })}
                  className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 ${
                    errors.country ? 'border-coral' : 'border-gold/30'
                  }`}
                />
                {errors.country && <p className="text-coral text-xs mt-1">{errors.country}</p>}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-card p-6">
            <h2 className="font-display text-xl text-plum mb-3 flex items-center gap-2">
              <FiCreditCard className="text-gold" /> Payment
            </h2>
            <p className="text-sm text-plum-soft">
              You'll be redirected to Razorpay's secure checkout to complete payment of{' '}
              <span className="font-medium text-plum">{formatCurrency(subtotal)}</span>.
            </p>
          </div>

          <button
            type="submit"
            disabled={processing}
            className="w-full bg-plum text-cream py-4 rounded-full text-sm uppercase tracking-wider hover:bg-plum-soft transition-colors disabled:opacity-60"
          >
            {processing ? 'Processing...' : `Pay ${formatCurrency(subtotal)} & Place Order`}
          </button>
        </form>

        {/* Order summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-card p-6 sticky top-24">
            <h2 className="font-display text-xl text-plum mb-5">Order Summary</h2>
            <div className="space-y-3 max-h-72 overflow-y-auto mb-4 pr-1">
              {items.map((item) => (
                <div key={item.productId} className="flex justify-between text-sm">
                  <span className="text-plum-soft truncate pr-2">
                    {item.name} × {item.qty}
                  </span>
                  <span className="text-plum shrink-0">{formatCurrency(item.price * item.qty)}</span>
                </div>
              ))}
            </div>
            <div className="hairline my-4" />
            <div className="flex justify-between font-semibold text-plum text-lg">
              <span>Total</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
