import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiShield, FiLogOut } from 'react-icons/fi';
import { logout } from '../redux/slices/authSlice';

const ProfilePage = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  if (!userInfo) return null;

  return (
    <div className="max-w-2xl mx-auto px-6 py-14">
      <h1 className="font-display text-3xl sm:text-4xl text-plum mb-8">My Profile</h1>

      <div className="bg-white rounded-2xl shadow-card p-8">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 rounded-full bg-gold/15 flex items-center justify-center text-gold font-display text-2xl">
            {userInfo.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="font-display text-2xl text-plum">{userInfo.name}</h2>
            <span className="inline-flex items-center gap-1 text-xs uppercase tracking-wider text-gold bg-gold/10 px-2.5 py-1 rounded-full mt-1">
              <FiShield size={11} /> {userInfo.role}
            </span>
          </div>
        </div>

        <div className="space-y-4 mb-8">
          <div className="flex items-center gap-3 text-plum-soft">
            <FiUser size={16} className="text-gold" />
            <span className="text-sm">{userInfo.name}</span>
          </div>
          <div className="flex items-center gap-3 text-plum-soft">
            <FiMail size={16} className="text-gold" />
            <span className="text-sm">{userInfo.email}</span>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-coral text-sm hover:underline"
        >
          <FiLogOut size={15} /> Sign Out
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
