import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiFilter, FiX } from 'react-icons/fi';
import { fetchProducts } from '../redux/slices/productSlice';
import ProductCard from '../components/ProductCard';
import ProductCardSkeleton from '../components/ProductCardSkeleton';
import ErrorMessage from '../components/ErrorMessage';

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
];

const ProductsPage = () => {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.products);
  const [searchParams, setSearchParams] = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(false);

  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  const sort = searchParams.get('sort') || 'newest';
  const maxPriceParam = searchParams.get('maxPrice') || '';

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const categories = useMemo(() => {
    const set = new Set(items.map((p) => p.category).filter(Boolean));
    return Array.from(set);
  }, [items]);

  const filtered = useMemo(() => {
    let result = [...items];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
      );
    }
    if (category) {
      result = result.filter((p) => p.category === category);
    }
    if (maxPriceParam) {
      result = result.filter((p) => p.price <= Number(maxPriceParam));
    }

    switch (sort) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => (b.ratings || 0) - (a.ratings || 0));
        break;
      default:
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return result;
  }, [items, search, category, sort, maxPriceParam]);

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    setSearchParams(next);
  };

  const clearFilters = () => setSearchParams({});

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-2">
        <h1 className="font-display text-3xl sm:text-4xl text-plum">
          {category || 'All Jewelry'}
        </h1>
        <button
          className="lg:hidden flex items-center gap-1.5 text-sm text-plum-soft border border-gold/30 rounded-full px-4 py-1.5"
          onClick={() => setFiltersOpen((o) => !o)}
        >
          <FiFilter size={14} /> Filters
        </button>
      </div>
      {search && <p className="text-plum-soft text-sm mb-6">Results for "{search}"</p>}

      <div className="flex flex-col lg:flex-row gap-8 mt-6">
        {/* Filters sidebar */}
        <aside className={`${filtersOpen ? 'block' : 'hidden'} lg:block w-full lg:w-64 shrink-0`}>
          <div className="bg-white rounded-2xl shadow-card p-5 sticky top-24">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-lg">Filters</h3>
              {(category || maxPriceParam || search) && (
                <button onClick={clearFilters} className="text-xs text-coral flex items-center gap-1">
                  <FiX size={12} /> Clear
                </button>
              )}
            </div>

            <div className="mb-6">
              <p className="text-xs uppercase tracking-wider text-plum-soft mb-3">Category</p>
              <div className="space-y-2">
                <button
                  onClick={() => updateParam('category', '')}
                  className={`block text-sm w-full text-left ${!category ? 'text-gold font-medium' : 'text-plum-soft'}`}
                >
                  All
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => updateParam('category', cat)}
                    className={`block text-sm w-full text-left ${category === cat ? 'text-gold font-medium' : 'text-plum-soft'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* <div>
              <p className="text-xs uppercase tracking-wider text-plum-soft mb-3">Max Price (₹)</p>
              <input
                type="number"
                min="0"
                placeholder="No limit"
                defaultValue={maxPriceParam}
                onBlur={(e) => updateParam('maxPrice', e.target.value)}
                className="w-full border border-gold/30 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40"
              />
            </div> */}
          </div>
        </aside>

        {/* Product grid */}
        <div className="flex-grow">
          <div className="flex justify-end mb-5">
            <select
              value={sort}
              onChange={(e) => updateParam('sort', e.target.value)}
              className="border border-gold/30 rounded-full px-4 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gold/40"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          {error && <ErrorMessage message={error} onRetry={() => dispatch(fetchProducts())} />}

          {!error && (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {loading
                ? Array.from({ length: 6 }).map((_, i) => <ProductCardSkeleton key={i} />)
                : filtered.map((product) => <ProductCard key={product._id} product={product} />)}
            </div>
          )}

          {!loading && !error && filtered.length === 0 && (
            <p className="text-center text-plum-soft py-16">
              No jewelry matches your filters. Try adjusting your search.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
