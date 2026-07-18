import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiHeart, FiShoppingBag, FiMinus, FiPlus, FiChevronLeft } from 'react-icons/fi';
import { FaHeart, FaStar } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { fetchProductById, clearSelectedProduct } from '../redux/slices/productSlice';
import { addToCart } from '../redux/slices/cartSlice';
import { toggleWishlist } from '../redux/slices/wishlistSlice';
import { resolveImageUrl, formatCurrency } from '../utils/helpers';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';

const ProductDetailsPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { selected: product, loading, error } = useSelector((state) => state.products);
  const isWishlisted = useSelector((state) =>
    state.wishlist.items.some((i) => i.productId === id)
  );
  const [qty, setQty] = useState(1);

  useEffect(() => {
    dispatch(fetchProductById(id));
    setQty(1);
    return () => dispatch(clearSelectedProduct());
  }, [dispatch, id]);

  if (loading) return <Loader fullScreen />;
  if (error) return <ErrorMessage message={error} />;
  if (!product) return null;

  const outOfStock = product.stock <= 0;

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        productId: product._id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        stock: product.stock,
        qty,
      })
    );
    toast.success(`${product.name} added to bag`);
  };

  const handleWishlist = () => {
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
    <div className="max-w-6xl mx-auto px-6 lg:px-8 py-10">
      <Link to="/products" className="inline-flex items-center gap-1.5 text-sm text-plum-soft hover:text-gold mb-6">
        <FiChevronLeft size={16} /> Back to Shop
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Image */}
        <div className="bg-cream rounded-2xl overflow-hidden aspect-square">
          <img
            src={resolveImageUrl(product.imageUrl)}
            alt={product.name}
            className="w-full h-full object-cover"
            onError={(e) => { e.currentTarget.src = '/placeholder-product.svg'; }}
          />
        </div>

        {/* Info */}
        <div className="flex flex-col">
          <p className="text-xs uppercase tracking-wider text-gold mb-2">{product.category}</p>
          <h1 className="font-display text-3xl sm:text-4xl text-plum mb-3">{product.name}</h1>

          {product.ratings > 0 && (
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <FaStar
                    key={i}
                    size={14}
                    className={i < Math.round(product.ratings) ? 'text-gold' : 'text-cream'}
                  />
                ))}
              </div>
              <span className="text-sm text-plum-soft">
                {product.ratings.toFixed(1)} ({product.numReviews} reviews)
              </span>
            </div>
          )}

          <p className="text-2xl font-semibold text-plum mb-5">{formatCurrency(product.price)}</p>

          <p className="text-plum-soft leading-relaxed mb-6">{product.description}</p>

          <div className="mb-6">
            {outOfStock ? (
              <span className="inline-block bg-coral/10 text-coral text-sm px-3 py-1.5 rounded-full">
                Currently out of stock
              </span>
            ) : (
              <span className="inline-block bg-sage/10 text-sage text-sm px-3 py-1.5 rounded-full">
                {product.stock} in stock
              </span>
            )}
          </div>

          {!outOfStock && (
            <div className="flex items-center gap-4 mb-6">
              <span className="text-sm text-plum-soft">Quantity</span>
              <div className="flex items-center border border-gold/30 rounded-full">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="p-2.5 hover:text-gold"
                  aria-label="Decrease quantity"
                >
                  <FiMinus size={14} />
                </button>
                <span className="w-10 text-center text-sm">{qty}</span>
                <button
                  onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                  className="p-2.5 hover:text-gold"
                  aria-label="Increase quantity"
                >
                  <FiPlus size={14} />
                </button>
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={handleAddToCart}
              disabled={outOfStock}
              className="flex-grow flex items-center justify-center gap-2 bg-plum text-cream py-3.5 rounded-full text-sm uppercase tracking-wider hover:bg-plum-soft transition-colors disabled:bg-plum/40 disabled:cursor-not-allowed"
            >
              <FiShoppingBag size={16} /> {outOfStock ? 'Unavailable' : 'Add to Bag'}
            </button>
            <button
              onClick={handleWishlist}
              aria-label="Toggle wishlist"
              className="w-14 flex items-center justify-center border border-gold/30 rounded-full hover:bg-cream transition-colors"
            >
              {isWishlisted ? <FaHeart className="text-coral" size={18} /> : <FiHeart size={18} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
