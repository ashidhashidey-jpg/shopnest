import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiPackage, FiArrowRight } from 'react-icons/fi';
import { fetchMyOrders } from '../redux/slices/orderSlice';
import { formatCurrency, formatDate } from '../utils/helpers';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';

const STATUS_STYLES = {
  Pending: 'bg-gold/10 text-gold',
  Shipped: 'bg-mauve/20 text-mauve',
  Delivered: 'bg-sage/10 text-sage',
};

const OrderHistoryPage = () => {
  const dispatch = useDispatch();
  const { myOrders, loading, error } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchMyOrders());
  }, [dispatch]);

  if (loading) return <Loader fullScreen />;
  if (error) return <ErrorMessage message={error} onRetry={() => dispatch(fetchMyOrders())} />;

  if (myOrders.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-24 text-center">
        <FiPackage size={48} className="text-gold mx-auto mb-5" />
        <h1 className="font-display text-3xl text-plum mb-3">No orders yet</h1>
        <p className="text-plum-soft mb-8">Your order history will appear here.</p>
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
    <div className="max-w-4xl mx-auto px-6 lg:px-8 py-10">
      <h1 className="font-display text-3xl sm:text-4xl text-plum mb-8">Order History</h1>

      <div className="space-y-4">
        {myOrders.map((order) => (
          <div key={order._id} className="bg-white rounded-2xl shadow-card p-5 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
              <div>
                <p className="text-xs uppercase tracking-wider text-plum-soft">Order ID</p>
                <p className="text-sm text-plum font-medium">{order._id}</p>
              </div>
              <span
                className={`inline-block text-xs uppercase tracking-wider px-3 py-1.5 rounded-full self-start sm:self-auto ${STATUS_STYLES[order.status] || 'bg-cream text-plum-soft'}`}
              >
                {order.status}
              </span>
            </div>

            <div className="hairline mb-4" />

            <div className="space-y-2 mb-4">
              {order.items?.map((item, idx) => (
                <div key={idx} className="flex justify-between text-sm text-plum-soft">
                  <span>Qty {item.qty}</span>
                  <span>{formatCurrency(item.price * item.qty)}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center pt-2">
              <span className="text-xs text-plum-soft">{formatDate(order.createdAt)}</span>
              <span className="font-semibold text-plum">{formatCurrency(order.totalAmount)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderHistoryPage;
