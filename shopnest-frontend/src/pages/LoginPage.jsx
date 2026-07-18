import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { loginUser, clearAuthError } from '../redux/slices/authSlice';

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { userInfo, loading, error } = useSelector((state) => state.auth);

  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const redirectTo = location.state?.from?.pathname || '/';

  useEffect(() => {
    if (userInfo) navigate(redirectTo, { replace: true });
  }, [userInfo, navigate, redirectTo]);

  useEffect(() => {
    if (error) toast.error(error);
    return () => dispatch(clearAuthError());
  }, [error, dispatch]);

  const validate = () => {
    const errs = {};
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = 'Enter a valid email';
    if (!form.password) errs.password = 'Password is required';
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    dispatch(loginUser(form));
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-card p-8">
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl text-plum mb-2">Welcome Back</h1>
          <p className="text-sm text-plum-soft">Sign in to continue to ShopNest</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          <div>
            <label className="block text-xs uppercase tracking-wider text-plum-soft mb-1.5">Email</label>
            <div className="relative">
              <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-plum-soft" size={16} />
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className={`w-full border rounded-full pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 ${
                  fieldErrors.email ? 'border-coral' : 'border-gold/30'
                }`}
                placeholder="you@example.com"
              />
            </div>
            {fieldErrors.email && <p className="text-coral text-xs mt-1.5">{fieldErrors.email}</p>}
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-plum-soft mb-1.5">Password</label>
            <div className="relative">
              <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-plum-soft" size={16} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className={`w-full border rounded-full pl-11 pr-11 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 ${
                  fieldErrors.password ? 'border-coral' : 'border-gold/30'
                }`}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-plum-soft"
              >
                {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
              </button>
            </div>
            {fieldErrors.password && <p className="text-coral text-xs mt-1.5">{fieldErrors.password}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-plum text-cream py-3.5 rounded-full text-sm uppercase tracking-wider hover:bg-plum-soft transition-colors disabled:opacity-60"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-sm text-plum-soft mt-6">
          New to ShopNest?{' '}
          <Link to="/register" className="text-gold font-medium hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
