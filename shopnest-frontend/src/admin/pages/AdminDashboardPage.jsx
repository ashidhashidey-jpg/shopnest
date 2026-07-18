import { useEffect, useState } from 'react';
import { FiShoppingBag, FiBox, FiUsers, FiDollarSign } from 'react-icons/fi';
import { fetchAdminStats } from '../../api/analytics';
import { formatCurrency } from '../../utils/helpers';
import Loader from '../../components/Loader';
import ErrorMessage from '../../components/ErrorMessage';

const StatCard = ({ icon: Icon, label, value, accent }) => (
  <div className="bg-white rounded-2xl shadow-card p-6 flex items-center gap-4">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${accent}`}>
      <Icon size={20} />
    </div>
    <div>
      <p className="text-xs uppercase tracking-wider text-plum-soft">{label}</p>
      <p className="font-display text-2xl text-plum">{value}</p>
    </div>
  </div>
);

const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAdminStats();
      setStats(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not load dashboard stats.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  if (loading) return <Loader fullScreen />;
  if (error) return <ErrorMessage message={error} onRetry={loadStats} />;

  return (
    <div>
      <h1 className="font-display text-3xl text-plum mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          icon={FiShoppingBag}
          label="Total Orders"
          value={stats.totalOrders}
          accent="bg-gold/15 text-gold"
        />
        <StatCard
          icon={FiBox}
          label="Total Products"
          value={stats.totalProducts}
          accent="bg-mauve/20 text-mauve"
        />
        <StatCard
          icon={FiUsers}
          label="Total Customers"
          value={stats.totalUsers}
          accent="bg-sage/15 text-sage"
        />
        <StatCard
          icon={FiDollarSign}
          label="Total Revenue"
          value={formatCurrency(stats.totalRevenue)}
          accent="bg-coral/15 text-coral"
        />
      </div>
    </div>
  );
};

export default AdminDashboardPage;
