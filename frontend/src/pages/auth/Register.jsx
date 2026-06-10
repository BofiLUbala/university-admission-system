import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Lock, Mail, User, Check, X, ArrowRight, MailCheck } from 'lucide-react';
import authService from '../../services/authService';
import { useSettings } from '../../context/settingsContext';

const PasswordRule = ({ label, met }) => (
  <div className={`flex items-center gap-1.5 text-xs transition-colors ${met ? 'text-green-600' : 'text-neutral-400'}`}>
    {met ? <Check size={14} className="text-green-500" /> : <X size={14} />}
    {label}
  </div>
);

const Register = () => {
  const { t } = useSettings();
  const PASSWORD_RULES = [
    { key: 'length', label: t.regRule8_16, test: (v) => v.length >= 8 && v.length <= 16 },
    { key: 'uppercase', label: t.regRuleUpper, test: (v) => /[A-Z]/.test(v) },
    { key: 'lowercase', label: t.regRuleLower, test: (v) => /[a-z]/.test(v) },
    { key: 'number', label: t.regRuleNumber, test: (v) => /[0-9]/.test(v) },
    { key: 'special', label: t.regRuleSpecial, test: (v) => /[!@#$%^&*(),.?":{}|<>_\-]/.test(v) },
  ];

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState(null);
  const [registered, setRegistered] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setServerError(null);
  };

  const passwordRules = useMemo(
    () => PASSWORD_RULES.map((rule) => ({ ...rule, met: rule.test(formData.password) })),
    [formData.password]
  );

  const allRulesMet = passwordRules.every((r) => r.met);
  const passwordsMatch = formData.password === formData.confirmPassword;
  const showMatch = formData.confirmPassword.length > 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError(null);

    if (!allRulesMet) {
      setServerError(t.regPasswordError);
      return;
    }
    if (!passwordsMatch) {
      setServerError(t.regConfirmError);
      return;
    }

    setLoading(true);
    try {
      await authService.register({
        username: formData.email,
        email: formData.email,
        password: formData.password,
        confirm_password: formData.confirmPassword,
        first_name: formData.firstName,
        last_name: formData.lastName
      });
      setLoading(false);
      setRegistered(true);
    } catch (err) {
      setLoading(false);
      const data = err.response?.data;
      if (data) {
        const messages = [];
        if (typeof data === 'string') messages.push(data);
        else if (data.detail) messages.push(data.detail);
        else {
          Object.entries(data).forEach(([key, val]) => {
            const label = { email: t.regEmailLabel, password: t.regPasswordLabel, confirm_password: t.regConfirmLabel }[key] || key;
            const msg = Array.isArray(val) ? val[0] : val;
            messages.push(`${label}: ${msg}`);
          });
        }
        setServerError(messages.join(' | '));
      } else {
        setServerError(err.message || t.regSubmitError);
      }
    }
  };

  if (registered) {
    return (
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-transparent relative overflow-hidden">
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-ulk-gold/20 rounded-full blur-3xl" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-ulk-blue/10 rounded-full blur-3xl" />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white p-10 rounded-3xl shadow-xl z-10 border border-neutral-100 text-center"
        >
          <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <MailCheck size={40} className="text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-neutral-900 mb-2">{t.regEmailSent}</h2>
          <p className="text-neutral-600 mb-2 leading-relaxed">
            {t.regEmailSentDesc} <strong className="text-neutral-800">{formData.email}</strong>.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 text-sm text-blue-700 text-left">
            <p className="font-medium mb-1">{t.regStepsTitle}</p>
            <ol className="list-decimal list-inside space-y-1 text-blue-600">
              <li>{t.regStep1}</li>
              <li>{t.regStep2}</li>
              <li>{t.regStep3}</li>
              <li>{t.regStep4}</li>
            </ol>
            <p className="mt-2 text-blue-500 text-xs">{t.regLinkExpiry}</p>
          </div>
          <div className="space-y-3">
            <button
              onClick={() => navigate('/login')}
              className="w-full flex items-center justify-center gap-2 bg-ulk-blue hover:bg-ulk-blue-dark text-white font-bold py-3 px-4 rounded-xl transition-colors shadow-md"
            >
              {t.regGoLogin}
              <ArrowRight size={18} />
            </button>
            <p className="text-xs text-neutral-500">
              {t.regNotReceived}{' '}
              <button
                onClick={async () => {
                  try {
                    await authService.resendVerification({ email: formData.email });
                    alert(t.regResendSuccess);
                  } catch {
                    alert(t.regResendError);
                  }
                }}
                className="text-ulk-blue hover:text-ulk-gold font-medium transition-colors"
              >
                {t.regResend}
              </button>
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-transparent relative overflow-hidden">
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-ulk-gold/20 rounded-full blur-3xl" />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-ulk-blue/10 rounded-full blur-3xl" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-8 bg-white p-10 rounded-3xl shadow-xl z-10 border border-neutral-100"
      >
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-ulk-blue rounded-2xl flex items-center justify-center text-ulk-gold font-bold text-2xl shadow-lg mb-6">
            UPK
          </div>
          <h2 className="mt-2 text-3xl font-bold text-neutral-900">{t.regTitle}</h2>
          <p className="mt-2 text-sm text-neutral-600">
            {t.regHaveAccount}{' '}
            <Link to="/login" className="font-medium text-ulk-blue hover:text-ulk-gold transition-colors">
              {t.regSignIn}
            </Link>
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {serverError && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium border border-red-100">
              {serverError}
            </div>
          )}

          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-neutral-700 mb-1">{t.regFirstName}</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400">
                    <User size={20} />
                  </div>
                  <input
                    name="firstName"
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    className="appearance-none block w-full pl-10 pr-3 py-3 border border-neutral-200 rounded-xl bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-ulk-blue focus:bg-white transition-colors text-sm"
                    placeholder={t.regFirstNamePlaceholder}
                  />
                </div>
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-neutral-700 mb-1">{t.regLastName}</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400">
                    <User size={20} />
                  </div>
                  <input
                    name="lastName"
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                    className="appearance-none block w-full pl-10 pr-3 py-3 border border-neutral-200 rounded-xl bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-ulk-blue focus:bg-white transition-colors text-sm"
                    placeholder={t.regLastNamePlaceholder}
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">{t.regEmailLabel}</label>
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
                  placeholder={t.regEmailPlaceholder}
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">{t.regPasswordLabel}</label>
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
                  className={`appearance-none block w-full pl-10 pr-10 py-3 border rounded-xl bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-ulk-blue focus:bg-white transition-colors text-sm ${
                    formData.password.length > 0
                      ? allRulesMet ? 'border-green-400' : 'border-red-300'
                      : 'border-neutral-200'
                  }`}
                  placeholder={t.regPasswordPlaceholder}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-ulk-blue transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {formData.password.length > 0 && (
                <div className="mt-2 grid grid-cols-2 gap-y-1">
                  {passwordRules.map((rule) => (
                    <PasswordRule key={rule.key} label={rule.label} met={rule.met} />
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">{t.regConfirmLabel}</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400">
                  <Lock size={20} />
                </div>
                <input
                  name="confirmPassword"
                  type={showConfirm ? 'text' : 'password'}
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`appearance-none block w-full pl-10 pr-10 py-3 border rounded-xl bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-ulk-blue focus:bg-white transition-colors text-sm ${
                    showMatch
                      ? passwordsMatch ? 'border-green-400' : 'border-red-300'
                      : 'border-neutral-200'
                  }`}
                  placeholder={t.regConfirmPlaceholder}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-ulk-blue transition-colors"
                >
                  {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {showMatch && (
                <div className={`mt-1.5 flex items-center gap-1.5 text-xs ${passwordsMatch ? 'text-green-600' : 'text-red-500'}`}>
                  {passwordsMatch ? <Check size={14} /> : <X size={14} />}
                  {passwordsMatch ? t.regMatch : t.regNoMatch}
                </div>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white ${
                loading ? 'bg-ulk-gold/50 cursor-not-allowed' : 'bg-ulk-gold text-ulk-blue-dark hover:bg-yellow-400 shadow-md hover:shadow-lg'
              } transition-all`}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-ulk-blue/30 border-t-ulk-blue rounded-full animate-spin" />
              ) : (
                t.regButton
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default Register;
