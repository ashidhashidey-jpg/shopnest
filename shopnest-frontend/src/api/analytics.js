import axiosInstance from './axiosInstance';

// GET /api/analytics (protect, admin)
export const fetchAdminStats = async () => {
  const { data } = await axiosInstance.get('/analytics');
  return data; // { totalOrders, totalProducts, totalUsers, totalRevenue }
};
