import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiMinus, FiPlus, FiTrash2, FiArrowRight, FiShoppingBag } from 'react-icons/fi';
import { updateCartQty, removeFromCart } from '../redux/slices/cartSlice';
import { resolveImageUrl, formatCurrency } from '../utils/helpers';

const CartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const shipping = subtotal > 0 ? 0 : 0; // free shipping, matches site messaging
  const total = subtotal + shipping;

  const handleCheckout = () => {
    if (!userInfo) {
      navigate('/login', { state: { from: { pathname: '/checkout' } } });
      return;
    }
    navigate('/checkout');
  };

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-24 text-center">
        <FiShoppingBag size={48} className="text-gold mx-auto mb-5" />
        <h1 className="font-display text-3xl text-plum mb-3">Your bag is empty</h1>
        <p className="text-plum-soft mb-8">Discover pieces you'll want to keep.</p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 bg-plum text-cream px-7 py-3.5 rounded-full text-sm uppercase tracking-wider hover:bg-plum-soft transition-colors"
        >
          Start Shopping <FiArrowRight />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 lg:px-8 py-10">
      <h1 className="font-display text-3xl sm:text-4xl text-plum mb-8">Your Bag</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={item.productId}
              className="flex items-center gap-4 bg-white rounded-2xl shadow-card p-4"
            >
              <Link to={`/products/${item.productId}`} className="shrink-0">
                <img
                  src={resolveImageUrl(item.imageUrl)}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-xl bg-cream"
                  onError={(e) => { e.currentTarget.src = '/placeholder-product.svg'; }}
                />
              </Link>

              <div className="flex-grow min-w-0">
                <Link to={`/products/${item.productId}`}>
                  <h3 className="font-display text-lg text-plum truncate hover:text-gold transition-colors">
                    {item.name}
                  </h3>
                </Link>
                <p className="text-sm text-plum-soft">{formatCurrency(item.price)}</p>
              </div>

              <div className="flex items-center border border-gold/30 rounded-full shrink-0">
                <button
                  onClick={() => dispatch(updateCartQty({ productId: item.productId, qty: item.qty - 1 }))}
                  className="p-2 hover:text-gold"
                  aria-label="Decrease quantity"
                >
                  <FiMinus size={13} />
                </button>
                <span className="w-8 text-center text-sm">{item.qty}</span>
                <button
                  onClick={() => dispatch(updateCartQty({ productId: item.productId, qty: item.qty + 1 }))}
                  className="p-2 hover:text-gold"
                  aria-label="Increase quantity"
                >
                  <FiPlus size={13} />
                </button>
              </div>

              <p className="w-24 text-right font-medium text-plum shrink-0 hidden sm:block">
                {formatCurrency(item.price * item.qty)}
              </p>

              <button
                onClick={() => dispatch(removeFromCart(item.productId))}
                aria-label="Remove item"
                className="text-plum-soft hover:text-coral transition-colors shrink-0"
              >
                <FiTrash2 size={18} />
              </button>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-card p-6 sticky top-24">
            <h2 className="font-display text-xl text-plum mb-5">Order Summary</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-plum-soft">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-plum-soft">
                <span>Shipping</span>
                <span className="text-sage">Free</span>
              </div>
            </div>
            <div className="hairline my-4" />
            <div className="flex justify-between font-semibold text-plum text-lg mb-6">
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>
            <button
              onClick={handleCheckout}
              className="w-full flex items-center justify-center gap-2 bg-plum text-cream py-3.5 rounded-full text-sm uppercase tracking-wider hover:bg-plum-soft transition-colors"
            >
              Proceed to Checkout <FiArrowRight />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
