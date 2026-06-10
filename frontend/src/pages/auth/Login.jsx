import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginStart, loginSuccess, loginFailure } from '../../store/slices/authSlice';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Lock, Mail, CheckCircle, AlertTriangle } from 'lucide-react';
import authService from '../../services/authService';
import { useSettings } from '../../context/settingsContext';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { loading, error } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/student/dashboard';

  const { t } = useSettings();

  const successMessage = new URLSearchParams(location.search).get('registration') === 'success'
    ? t.loginSuccess
    : null;

  const verifiedMessage = new URLSearchParams(location.search).get('verified') === 'true'
    ? t.loginVerified
    : null;

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const displayMessage = verifiedMessage || successMessage;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(loginStart());
    try {
      const response = await authService.login({
        username: formData.email,
        password: formData.password
      });
      
      const user = response.user;
      const token = response.access;
      
      dispatch(loginSuccess({ user, token }));
      
      const role = user.role?.toLowerCase();
      if (role === 'super_admin' || role === 'admin' || role === 'admission_officer' || role === 'faculty_admin') {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate('/student/dashboard', { replace: true });
      }
    } catch (err) {
      const errorMsg = err.response?.data?.detail
        || err.response?.data?.non_field_errors?.[0]
        || err.message
        || t.loginFailed;
      dispatch(loginFailure(errorMsg));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-transparent relative overflow-hidden">
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-ulk-gold/20 rounded-full blur-3xl" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-ulk-blue/10 rounded-full blur-3xl" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-8 bg-white p-10 rounded-3xl shadow-xl z-10 border border-neutral-100"
      >
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-ulk-blue rounded-2xl flex items-center justify-center text-ulk-gold font-bold text-2xl shadow-lg mb-6">
            UPK
          </div>
          <h2 className="mt-2 text-3xl font-bold text-neutral-900">{t.loginTitle}</h2>
          <p className="mt-2 text-sm text-neutral-600">
            {t.loginNoAccount}{' '}
            <Link to="/register" className="font-medium text-ulk-blue hover:text-ulk-gold transition-colors">
              {t.loginApply}
            </Link>
          </p>
        </div>

        {displayMessage && (
          <div className={`flex items-start gap-3 p-4 rounded-xl text-sm font-medium border ${
            verifiedMessage
              ? 'bg-green-50 text-green-700 border-green-200'
              : 'bg-blue-50 text-blue-700 border-blue-200'
          }`}>
            {verifiedMessage ? <CheckCircle size={20} className="shrink-0 mt-0.5" /> : <AlertTriangle size={20} className="shrink-0 mt-0.5" />}
            <span>{displayMessage}</span>
          </div>
        )}
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium border border-red-100">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">{t.loginEmailLabel}</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400">
                  <Mail size={20} />
                </div>
                <input
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="appearance-none block w-full pl-10 pr-3 py-3 border border-neutral-200 rounded-xl bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-ulk-blue focus:bg-white transition-colors text-sm"
                  placeholder={t.loginEmailPlaceholder}
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">{t.loginPasswordLabel}</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400">
                  <Lock size={20} />
                </div>
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="appearance-none block w-full pl-10 pr-10 py-3 border border-neutral-200 rounded-xl bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-ulk-blue focus:bg-white transition-colors text-sm"
                  placeholder={t.loginPasswordPlaceholder}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-ulk-blue transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-ulk-blue focus:ring-ulk-blue border-neutral-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-neutral-700">
                {t.loginRemember}
              </label>
            </div>

            <div className="text-sm">
              <a href="#" className="font-medium text-ulk-blue hover:text-ulk-gold transition-colors">
                {t.loginForgot}
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white ${
                loading ? 'bg-ulk-blue-light cursor-not-allowed' : 'bg-ulk-blue hover:bg-ulk-blue-dark shadow-md hover:shadow-lg'
              } transition-all`}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                t.loginButton
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;
