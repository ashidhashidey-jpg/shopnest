import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiHeart, FiShoppingBag, FiTrash2, FiArrowRight } from 'react-icons/fi';
import { removeFromWishlist } from '../redux/slices/wishlistSlice';
import { addToCart } from '../redux/slices/cartSlice';
import { resolveImageUrl, formatCurrency } from '../utils/helpers';
import { toast } from 'react-toastify';

const WishlistPage = () => {
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.wishlist);

  const handleAddToCart = (item) => {
    dispatch(addToCart({ ...item, qty: 1 }));
    toast.success(`${item.name} added to bag`);
  };

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-24 text-center">
        <FiHeart size={48} className="text-gold mx-auto mb-5" />
        <h1 className="font-display text-3xl text-plum mb-3">Your wishlist is empty</h1>
        <p className="text-plum-soft mb-8">Save the pieces that catch your eye.</p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 bg-plum text-cream px-7 py-3.5 rounded-full text-sm uppercase tracking-wider hover:bg-plum-soft transition-colors"
        >
          Browse Jewelry <FiArrowRight />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 lg:px-8 py-10">
      <h1 className="font-display text-3xl sm:text-4xl text-plum mb-8">Your Wishlist</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {items.map((item) => (
          <div key={item.productId} className="flex items-center gap-4 bg-white rounded-2xl shadow-card p-4">
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
            <button
              onClick={() => handleAddToCart(item)}
              aria-label="Add to bag"
              className="p-2.5 rounded-full border border-gold/30 text-plum hover:bg-cream transition-colors shrink-0"
            >
              <FiShoppingBag size={16} />
            </button>
            <button
              onClick={() => dispatch(removeFromWishlist(item.productId))}
              aria-label="Remove from wishlist"
              className="text-plum-soft hover:text-coral transition-colors shrink-0"
            >
              <FiTrash2 size={18} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WishlistPage;
