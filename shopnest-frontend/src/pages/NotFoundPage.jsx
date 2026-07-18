import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';

const NotFoundPage = () => (
  <div className="max-w-xl mx-auto px-6 py-28 text-center">
    <p className="font-display text-7xl text-gold mb-4">404</p>
    <h1 className="font-display text-3xl text-plum mb-3">Page Not Found</h1>
    <p className="text-plum-soft mb-8">The page you're looking for doesn't exist or has moved.</p>
    <Link
      to="/"
      className="inline-flex items-center gap-2 bg-plum text-cream px-7 py-3.5 rounded-full text-sm uppercase tracking-wider hover:bg-plum-soft transition-colors"
    >
      Back to Home <FiArrowRight />
    </Link>
  </div>
);

export default NotFoundPage;
