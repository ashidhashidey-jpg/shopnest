import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiArrowRight, FiTruck, FiShield, FiRefreshCw } from 'react-icons/fi';
import { fetchProducts } from '../redux/slices/productSlice';
import ProductCard from '../components/ProductCard';
import ProductCardSkeleton from '../components/ProductCardSkeleton';
import SectionDivider from '../components/SectionDivider';

const CATEGORY_TILES = [
  { name: 'Ring', img: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=600&q=80' },
  { name: 'Necklace', img: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80' },
  { name: 'Earrings', img: 'https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?auto=format&fit=crop&w=600&q=80' },
];

const HomePage = () => {
  const dispatch = useDispatch();
  const { items, loading } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const featured = items.slice(0, 4);

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-gradient-to-b from-cream to-ivory overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20 sm:py-28 flex flex-col items-center text-center">
          <span className="hairline-short mb-6" />
          <h1 className="font-display text-4xl sm:text-6xl text-plum font-semibold leading-tight max-w-3xl">
            Jewelry that holds your story
          </h1>
          <p className="text-plum-soft mt-5 max-w-xl text-base sm:text-lg">
            Thoughtfully designed pieces in gold, silver, and gemstone — chosen to be worn every day and kept for years to come.
          </p>
          <Link
            to="/products"
            className="mt-8 inline-flex items-center gap-2 bg-plum text-cream px-7 py-3.5 rounded-full text-sm uppercase tracking-wider hover:bg-plum-soft transition-colors"
          >
            Explore Collection <FiArrowRight />
          </Link>
        </div>
      </section>

      {/* Category tiles */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <SectionDivider label="Shop by Category" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8">
          {CATEGORY_TILES.map((cat) => (
            <Link
              key={cat.name}
              to={`/products?category=${encodeURIComponent(cat.name)}`}
              className="group relative rounded-2xl overflow-hidden aspect-[4/5] shadow-card"
            >
              <img
                src={cat.img}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-plum/30 group-hover:bg-plum/40 transition-colors" />
              <span className="absolute bottom-5 left-5 text-cream font-display text-2xl">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured products */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <SectionDivider label="New Arrivals" />
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-8">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)
            : featured.map((product) => <ProductCard key={product._id} product={product} />)}
        </div>
        {!loading && featured.length === 0 && (
          <p className="text-center text-plum-soft py-10">No products available yet. Check back soon.</p>
        )}
        <div className="flex justify-center mt-10">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 border border-plum text-plum px-6 py-3 rounded-full text-sm uppercase tracking-wider hover:bg-plum hover:text-cream transition-colors"
          >
            View All Jewelry <FiArrowRight />
          </Link>
        </div>
      </section>

      {/* Trust badges */}
      <section className="bg-cream py-14">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          <div className="flex flex-col items-center">
            <FiTruck size={28} className="text-gold mb-3" />
            <h4 className="font-display text-lg mb-1">Free Shipping</h4>
            <p className="text-sm text-plum-soft">On all orders, delivered safely to your door.</p>
          </div>
          <div className="flex flex-col items-center">
            <FiShield size={28} className="text-gold mb-3" />
            <h4 className="font-display text-lg mb-1">Secure Payments</h4>
            <p className="text-sm text-plum-soft">Encrypted checkout, every time you shop.</p>
          </div>
          <div className="flex flex-col items-center">
            <FiRefreshCw size={28} className="text-gold mb-3" />
            <h4 className="font-display text-lg mb-1">Easy Returns</h4>
            <p className="text-sm text-plum-soft">Not the right fit? We'll make it right.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
