import { Link, useLocation } from 'react-router-dom';
import { FiXCircle } from 'react-icons/fi';

const OrderErrorPage = () => {
  const location = useLocation();
  const message = location.state?.message || 'Something went wrong while processing your order.';

  return (
    <div className="max-w-xl mx-auto px-6 py-24 text-center">
      <FiXCircle size={56} className="text-coral mx-auto mb-6" />
      <h1 className="font-display text-3xl sm:text-4xl text-plum mb-3">Order Failed</h1>
      <p className="text-plum-soft mb-8">{message}</p>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          to="/cart"
          className="inline-flex items-center justify-center gap-2 border border-plum text-plum px-6 py-3 rounded-full text-sm uppercase tracking-wider hover:bg-plum hover:text-cream transition-colors"
        >
          Back to Bag
        </Link>
        <Link
          to="/checkout"
          className="inline-flex items-center justify-center gap-2 bg-plum text-cream px-6 py-3 rounded-full text-sm uppercase tracking-wider hover:bg-plum-soft transition-colors"
        >
          Try Again
        </Link>
      </div>
    </div>
  );
};

export default OrderErrorPage;
