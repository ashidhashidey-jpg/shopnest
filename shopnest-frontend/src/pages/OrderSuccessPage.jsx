import { Link, useLocation, Navigate } from 'react-router-dom';
import { FiCheckCircle, FiArrowRight } from 'react-icons/fi';
import { formatCurrency } from '../utils/helpers';

const OrderSuccessPage = () => {
  const location = useLocation();
  const order = location.state?.order;

  if (!order) return <Navigate to="/" replace />;

  return (
    <div className="max-w-xl mx-auto px-6 py-24 text-center">
      <FiCheckCircle size={56} className="text-sage mx-auto mb-6" />
      <h1 className="font-display text-3xl sm:text-4xl text-plum mb-3">Order Confirmed!</h1>
      <p className="text-plum-soft mb-8">
        Thank you for your purchase. A confirmation email is on its way.
      </p>

      <div className="bg-white rounded-2xl shadow-card p-6 text-left mb-8">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-plum-soft">Order ID</span>
          <span className="text-plum font-medium">{order._id}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-plum-soft">Total Paid</span>
          <span className="text-plum font-medium">{formatCurrency(order.totalAmount)}</span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          to="/orders"
          className="inline-flex items-center justify-center gap-2 border border-plum text-plum px-6 py-3 rounded-full text-sm uppercase tracking-wider hover:bg-plum hover:text-cream transition-colors"
        >
          View Orders
        </Link>
        <Link
          to="/products"
          className="inline-flex items-center justify-center gap-2 bg-plum text-cream px-6 py-3 rounded-full text-sm uppercase tracking-wider hover:bg-plum-soft transition-colors"
        >
          Continue Shopping <FiArrowRight />
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
