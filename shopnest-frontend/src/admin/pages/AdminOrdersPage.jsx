import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { fetchAllOrders, updateOrderStatus } from '../../redux/slices/orderSlice';
import { formatCurrency, formatDate } from '../../utils/helpers';
import Loader from '../../components/Loader';
import ErrorMessage from '../../components/ErrorMessage';

const STATUS_OPTIONS = ['Pending', 'Shipped', 'Delivered'];

const STATUS_STYLES = {
  Pending: 'bg-gold/10 text-gold',
  Shipped: 'bg-mauve/20 text-mauve',
  Delivered: 'bg-sage/10 text-sage',
};

const AdminOrdersPage = () => {
  const dispatch = useDispatch();
  const { allOrders, loading, error } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchAllOrders());
  }, [dispatch]);

  const handleStatusChange = async (id, status) => {
    try {
      await dispatch(updateOrderStatus({ id, status })).unwrap();
      toast.success('Order status updated');
    } catch (err) {
      toast.error(typeof err === 'string' ? err : 'Could not update status');
    }
  };

  if (loading) return <Loader fullScreen />;
  if (error) return <ErrorMessage message={error} onRetry={() => dispatch(fetchAllOrders())} />;

  return (
    <div>
      <h1 className="font-display text-3xl text-plum mb-6">Orders</h1>

      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-cream text-left text-plum-soft text-xs uppercase tracking-wider">
                <th className="px-5 py-4">Order ID</th>
                <th className="px-5 py-4">Customer</th>
                <th className="px-5 py-4">Date</th>
                <th className="px-5 py-4">Total</th>
                <th className="px-5 py-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {allOrders.map((order) => (
                <tr key={order._id} className="border-b border-cream last:border-0 hover:bg-cream/30">
                  <td className="px-5 py-4 text-plum-soft font-mono text-xs">{order._id}</td>
                  <td className="px-5 py-4 text-plum">{order.userId?.name || '—'}</td>
                  <td className="px-5 py-4 text-plum-soft">{formatDate(order.createdAt)}</td>
                  <td className="px-5 py-4 text-plum font-medium">{formatCurrency(order.totalAmount)}</td>
                  <td className="px-5 py-4">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      className={`text-xs uppercase tracking-wider px-3 py-1.5 rounded-full border-0 focus:outline-none focus:ring-2 focus:ring-gold/40 cursor-pointer ${STATUS_STYLES[order.status] || 'bg-cream text-plum-soft'}`}
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {allOrders.length === 0 && (
          <p className="text-center text-plum-soft py-12">No orders placed yet.</p>
        )}
      </div>
    </div>
  );
};

export default AdminOrdersPage;
