import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAdminStats } from '../../api/analytics';
import { fetchAllOrders } from '../../redux/slices/orderSlice';
import { formatCurrency } from '../../utils/helpers';
import Loader from '../../components/Loader';
import ErrorMessage from '../../components/ErrorMessage';

const STATUS_COLORS = {
  Pending: '#C9A66B',
  Shipped: '#D8B4C8',
  Delivered: '#9CAF88',
};

const AdminAnalyticsPage = () => {
  const dispatch = useDispatch();
  const { allOrders } = useSelector((state) => state.orders);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAdminStats();
      setStats(data);
      dispatch(fetchAllOrders());
    } catch (err) {
      setError(err.response?.data?.message || 'Could not load analytics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) return <Loader fullScreen />;
  if (error) return <ErrorMessage message={error} onRetry={load} />;

  const statusCounts = allOrders.reduce((acc, o) => {
    acc[o.status] = (acc[o.status] || 0) + 1;
    return acc;
  }, {});
  const totalOrdersForChart = allOrders.length || 1;

  const avgOrderValue = stats.totalOrders > 0 ? stats.totalRevenue / stats.totalOrders : 0;

  return (
    <div>
      <h1 className="font-display text-3xl text-plum mb-8">Analytics</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        <div className="bg-white rounded-2xl shadow-card p-6">
          <p className="text-xs uppercase tracking-wider text-plum-soft mb-1">Total Revenue</p>
          <p className="font-display text-2xl text-plum">{formatCurrency(stats.totalRevenue)}</p>
        </div>
        <div className="bg-white rounded-2xl shadow-card p-6">
          <p className="text-xs uppercase tracking-wider text-plum-soft mb-1">Avg. Order Value</p>
          <p className="font-display text-2xl text-plum">{formatCurrency(avgOrderValue)}</p>
        </div>
        <div className="bg-white rounded-2xl shadow-card p-6">
          <p className="text-xs uppercase tracking-wider text-plum-soft mb-1">Total Orders</p>
          <p className="font-display text-2xl text-plum">{stats.totalOrders}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-card p-6">
        <h2 className="font-display text-xl text-plum mb-5">Order Status Breakdown</h2>
        {allOrders.length === 0 ? (
          <p className="text-plum-soft text-sm">No orders yet to break down.</p>
        ) : (
          <div className="space-y-4">
            {Object.entries(STATUS_COLORS).map(([status, color]) => {
              const count = statusCounts[status] || 0;
              const pct = Math.round((count / totalOrdersForChart) * 100);
              return (
                <div key={status}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-plum-soft">{status}</span>
                    <span className="text-plum font-medium">{count} ({pct}%)</span>
                  </div>
                  <div className="h-2.5 bg-cream rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%`, backgroundColor: color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminAnalyticsPage;
