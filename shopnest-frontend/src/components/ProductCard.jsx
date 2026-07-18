import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiHeart, FiShoppingBag } from 'react-icons/fi';
import { FaHeart, FaStar } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { addToCart } from '../redux/slices/cartSlice';
import { toggleWishlist } from '../redux/slices/wishlistSlice';
import { resolveImageUrl, formatCurrency, truncate } from '../utils/helpers';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const isWishlisted = useSelector((state) =>
    state.wishlist.items.some((i) => i.productId === product._id)
  );

  const outOfStock = product.stock <= 0;

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (outOfStock) return;
    dispatch(
      addToCart({
        productId: product._id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        stock: product.stock,
        qty: 1,
      })
    );
    toast.success(`${product.name} added to bag`);
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    dispatch(
      toggleWishlist({
        productId: product._id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
      })
    );
    toast.info(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
  };

  return (
    <Link
      to={`/products/${product._id}`}
      className="group block bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-soft transition-shadow duration-300"
    >
      <div className="relative aspect-square overflow-hidden bg-cream">
        <img
          src={resolveImageUrl(product.imageUrl)}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.currentTarget.src = '/placeholder-product.svg';
          }}
        />

        {outOfStock && (
          <span className="absolute top-3 left-3 bg-plum text-cream text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full">
            Out of Stock
          </span>
        )}

        <button
          onClick={handleWishlist}
          aria-label="Toggle wishlist"
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center shadow-sm hover:scale-105 transition-transform"
        >
          {isWishlisted ? (
            <FaHeart className="text-coral" size={15} />
          ) : (
            <FiHeart className="text-plum" size={15} />
          )}
        </button>

        <button
          onClick={handleAddToCart}
          disabled={outOfStock}
          className="absolute bottom-0 left-0 right-0 bg-plum/90 text-cream text-xs uppercase tracking-wider py-2.5 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 disabled:bg-plum/40 disabled:cursor-not-allowed"
        >
          <FiShoppingBag size={13} /> {outOfStock ? 'Unavailable' : 'Add to Bag'}
        </button>
      </div>

      <div className="p-4">
        <p className="text-[11px] uppercase tracking-wider text-gold mb-1">{product.category}</p>
        <h3 className="font-display text-lg text-plum leading-tight mb-1">{truncate(product.name, 42)}</h3>
        <div className="flex items-center justify-between mt-2">
          <span className="font-semibold text-plum">{formatCurrency(product.price)}</span>
          {product.ratings > 0 && (
            <span className="flex items-center gap-1 text-xs text-plum-soft">
              <FaStar className="text-gold" size={12} /> {product.ratings.toFixed(1)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
