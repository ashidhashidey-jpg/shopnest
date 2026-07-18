import { Link } from 'react-router-dom';
import { FiInstagram, FiFacebook, FiTwitter, FiMail } from 'react-icons/fi';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-plum text-cream mt-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <h3 className="font-display text-2xl mb-3">ShopNest</h3>
            <div className="hairline-short mb-4" style={{ background: '#C9A66B' }} />
            <p className="text-sm text-cream/70 leading-relaxed">
              Fine jewelry, thoughtfully curated. Every piece chosen to be worn, loved, and passed down.
            </p>
          </div>

          <div>
            <h4 className="text-sm uppercase tracking-wider mb-4 text-gold-light">Shop</h4>
            <ul className="space-y-2 text-sm text-cream/70">
              <li><Link to="/products" className="hover:text-gold transition-colors">All Jewelry</Link></li>
              <li><Link to="/products?category=Rings" className="hover:text-gold transition-colors">Rings</Link></li>
              <li><Link to="/products?category=Necklaces" className="hover:text-gold transition-colors">Necklaces</Link></li>
              <li><Link to="/products?category=Earrings" className="hover:text-gold transition-colors">Earrings</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm uppercase tracking-wider mb-4 text-gold-light">Account</h4>
            <ul className="space-y-2 text-sm text-cream/70">
              <li><Link to="/profile" className="hover:text-gold transition-colors">My Profile</Link></li>
              <li><Link to="/orders" className="hover:text-gold transition-colors">Order History</Link></li>
              <li><Link to="/wishlist" className="hover:text-gold transition-colors">Wishlist</Link></li>
              <li><Link to="/cart" className="hover:text-gold transition-colors">Cart</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm uppercase tracking-wider mb-4 text-gold-light">Stay Connected</h4>
            <p className="text-sm text-cream/70 mb-4">Follow for new arrivals and care tips.</p>
            <div className="flex gap-4">
              <a href="#" aria-label="Instagram" className="hover:text-gold transition-colors"><FiInstagram size={18} /></a>
              <a href="#" aria-label="Facebook" className="hover:text-gold transition-colors"><FiFacebook size={18} /></a>
              <a href="#" aria-label="Twitter" className="hover:text-gold transition-colors"><FiTwitter size={18} /></a>
              <a href="#" aria-label="Email" className="hover:text-gold transition-colors"><FiMail size={18} /></a>
            </div>
          </div>
        </div>

        <div className="border-t border-cream/10 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="text-xs text-cream/50">© {year} ShopNest. All rights reserved.</p>
          <p className="text-xs text-cream/50">Crafted with care.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
