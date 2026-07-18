import { Outlet, NavLink, Link } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import {
  FiGrid,
  FiBox,
  FiShoppingBag,
  FiUsers,
  FiBarChart2,
  FiArrowLeft,
} from 'react-icons/fi';

const NAV_ITEMS = [
  { to: '/admin', label: 'Dashboard', icon: FiGrid, end: true },
  { to: '/admin/products', label: 'Products', icon: FiBox },
  { to: '/admin/orders', label: 'Orders', icon: FiShoppingBag },
  { to: '/admin/users', label: 'Users', icon: FiUsers },
  { to: '/admin/analytics', label: 'Analytics', icon: FiBarChart2 },
];

const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-ivory flex">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 flex-col bg-plum text-cream shrink-0">
        <div className="px-6 py-7">
          <Link to="/" className="font-display text-2xl">ShopNest</Link>
          <p className="text-xs text-cream/50 uppercase tracking-wider mt-1">Admin Panel</p>
        </div>
        <nav className="flex-grow px-3 space-y-1">
          {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-colors ${
                  isActive ? 'bg-gold/15 text-gold' : 'text-cream/70 hover:bg-white/5 hover:text-cream'
                }`
              }
            >
              <Icon size={17} /> {label}
            </NavLink>
          ))}
        </nav>
        <div className="px-3 pb-6">
          <Link
            to="/"
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-cream/60 hover:text-cream hover:bg-white/5 transition-colors"
          >
            <FiArrowLeft size={17} /> Back to Store
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-grow min-w-0">
        <div className="md:hidden bg-plum text-cream px-5 py-4 flex items-center justify-between sticky top-0 z-40">
          <Link to="/" className="font-display text-xl">ShopNest Admin</Link>
          <Link to="/" className="text-xs text-cream/70 flex items-center gap-1">
            <FiArrowLeft size={14} /> Store
          </Link>
        </div>
        <div className="md:hidden bg-plum text-cream px-3 py-2 flex gap-1 overflow-x-auto sticky top-[57px] z-40 border-t border-white/10">
          {NAV_ITEMS.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-full text-xs whitespace-nowrap ${
                  isActive ? 'bg-gold/20 text-gold' : 'text-cream/70'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </div>
        <main className="p-5 sm:p-8 max-w-7xl mx-auto">
          <Outlet />
        </main>
      </div>

      <ToastContainer position="top-right" autoClose={2500} hideProgressBar newestOnTop closeOnClick />
    </div>
  );
};

export default AdminLayout;
