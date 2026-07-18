import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FiShield } from 'react-icons/fi';
import { fetchAllUsers } from '../../redux/slices/authSlice';
import { formatDate } from '../../utils/helpers';
import Loader from '../../components/Loader';
import ErrorMessage from '../../components/ErrorMessage';

const AdminUsersPage = () => {
  const dispatch = useDispatch();
  const { allUsers, usersLoading } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  if (usersLoading) return <Loader fullScreen />;

  return (
    <div>
      <h1 className="font-display text-3xl text-plum mb-6">Users</h1>

      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-cream text-left text-plum-soft text-xs uppercase tracking-wider">
                <th className="px-5 py-4">Name</th>
                <th className="px-5 py-4">Email</th>
                <th className="px-5 py-4">Role</th>
                <th className="px-5 py-4">Joined</th>
              </tr>
            </thead>
            <tbody>
              {allUsers.map((user) => (
                <tr key={user._id} className="border-b border-cream last:border-0 hover:bg-cream/30">
                  <td className="px-5 py-4 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gold/15 flex items-center justify-center text-gold text-xs font-display">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-plum font-medium">{user.name}</span>
                  </td>
                  <td className="px-5 py-4 text-plum-soft">{user.email}</td>
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex items-center gap-1 text-xs uppercase tracking-wider px-2.5 py-1 rounded-full ${
                        user.role === 'admin' ? 'bg-gold/15 text-gold' : 'bg-sage/10 text-sage'
                      }`}
                    >
                      {user.role === 'admin' && <FiShield size={10} />} {user.role}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-plum-soft">{formatDate(user.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {allUsers.length === 0 && (
          <p className="text-center text-plum-soft py-12">No registered users yet.</p>
        )}
      </div>
    </div>
  );
};

export default AdminUsersPage;
