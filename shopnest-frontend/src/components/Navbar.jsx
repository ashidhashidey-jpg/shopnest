import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FiShoppingBag, FiHeart, FiUser, FiSearch, FiMenu, FiX, FiLogOut } from 'react-icons/fi';
import { logout } from '../redux/slices/authSlice';
import { toggleMobileMenu, closeMobileMenu } from '../redux/slices/uiSlice';

const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Shop', to: '/products' },
  { label: 'Necklaces', to: '/products?category=Necklace' },
  { label: 'Rings', to: '/products?category=Ring' },
  { label: 'Earrings', to: '/products?category=Earrings' },
];

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);
  const cartCount = useSelector((state) =>
    state.cart.items.reduce((sum, item) => sum + item.qty, 0)
  );
  const wishlistCount = useSelector((state) => state.wishlist.items.length);
  const mobileMenuOpen = useSelector((state) => state.ui.mobileMenuOpen);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm('');
      setSearchOpen(false);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-ivory/95 backdrop-blur-sm border-b border-gold/20">
      {/* Top accent hairline */}
      <div className="hairline" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Mobile menu button */}
          <button
            className="lg:hidden text-plum p-2 -ml-2"
            onClick={() => dispatch(toggleMobileMenu())}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>

          {/* Logo */}
          <Link to="/" className="flex flex-col items-center mx-auto lg:mx-0">
            <span className="font-display text-2xl sm:text-3xl tracking-wide text-plum font-semibold">
              ShopNest
            </span>
            <span className="hairline-short mt-0.5" />
          </Link>

          {/* Desktop nav links */}
          <nav className="hidden lg:flex items-center gap-8 ml-12">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className="text-sm uppercase tracking-wider text-plum-soft hover:text-gold transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right icons */}
          <div className="flex items-center gap-3 sm:gap-5">
            <button
              onClick={() => setSearchOpen((s) => !s)}
              className="text-plum hover:text-gold transition-colors p-1"
              aria-label="Search"
            >
              <FiSearch size={20} />
            </button>

            <Link to="/wishlist" className="relative text-plum hover:text-gold transition-colors p-1">
              <FiHeart size={20} />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-coral text-white text-[10px] font-semibold rounded-full w-4 h-4 flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <Link to="/cart" className="relative text-plum hover:text-gold transition-colors p-1">
              <FiShoppingBag size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gold text-white text-[10px] font-semibold rounded-full w-4 h-4 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {userInfo ? (
              <div className="relative group">
                <button className="text-plum hover:text-gold transition-colors p-1 flex items-center gap-1">
                  <FiUser size={20} />
                </button>
                <div className="absolute right-0 top-full pt-2 w-44 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150">
                  <div className="bg-white rounded-lg shadow-card border border-gold/10 py-2 overflow-hidden">
                    <p className="px-4 py-1.5 text-xs text-plum-soft truncate border-b border-cream">
                      Hi, {userInfo.name?.split(' ')[0]}
                    </p>
                    <Link to="/profile" className="block px-4 py-2 text-sm hover:bg-cream transition-colors">
                      My Profile
                    </Link>
                    <Link to="/orders" className="block px-4 py-2 text-sm hover:bg-cream transition-colors">
                      My Orders
                    </Link>
                    {userInfo.role === 'admin' && (
                      <Link to="/admin" className="block px-4 py-2 text-sm hover:bg-cream transition-colors">
                        Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-coral hover:bg-cream transition-colors flex items-center gap-2"
                    >
                      <FiLogOut size={14} /> Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link to="/login" className="text-plum hover:text-gold transition-colors p-1">
                <FiUser size={20} />
              </Link>
            )}
          </div>
        </div>

        {/* Search bar dropdown */}
        {searchOpen && (
          <form onSubmit={handleSearch} className="pb-4 -mt-1">
            <div className="relative">
              <input
                type="text"
                autoFocus
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search for necklaces, rings, earrings..."
                className="w-full bg-white border border-gold/30 rounded-full px-5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40"
              />
              <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 text-plum-soft">
                <FiSearch size={18} />
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Mobile nav drawer */}
      {mobileMenuOpen && (
        <nav className="lg:hidden bg-white border-t border-gold/10 px-6 py-4 space-y-3">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              onClick={() => dispatch(closeMobileMenu())}
              className="block text-sm uppercase tracking-wider text-plum-soft hover:text-gold py-1"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
};

export default Navbar;
