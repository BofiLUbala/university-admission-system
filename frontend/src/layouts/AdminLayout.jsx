import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  LogOut, 
  Bell, 
  Menu, 
  X,
  Settings
} from 'lucide-react';
import { useState } from 'react';

const AdminLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Applications', path: '/admin/applications', icon: Users },
    { name: 'Faculties & Depts', path: '/admin/faculties', icon: BookOpen },
  ];

  return (
    <div className="min-h-screen bg-transparent flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-72 bg-ulk-blue-dark text-slate-300 fixed h-full z-20">
        <div className="h-20 flex items-center px-8 bg-ulk-blue-slate border-b border-white/5">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-ulk-blue-dark font-bold shadow-md">
              UPK
            </div>
            <div>
              <h1 className="text-lg font-bold text-white leading-tight">Admin</h1>
              <p className="text-xs text-ulk-gold font-medium">Control Panel</p>
            </div>
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto py-8 px-4">
          <div className="mb-6 px-4">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Menu</p>
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname.startsWith(item.path);
              const Icon = item.icon;
              return (
                <Link key={item.name} to={item.path}>
                  <div className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive 
                      ? 'bg-ulk-blue text-white shadow-lg shadow-ulk-blue/20' 
                      : 'hover:bg-white/5 hover:text-white'
                  }`}>
                    <Icon size={20} className={isActive ? 'text-ulk-gold' : 'text-slate-400'} />
                    <span className="font-medium">{item.name}</span>
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-4 bg-ulk-blue-slate border-t border-white/5">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 text-slate-400 rounded-xl hover:bg-white/5 hover:text-white transition-colors"
          >
            <LogOut size={20} />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-neutral-900/60 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-72 bg-ulk-blue-dark text-slate-300 z-50 flex flex-col shadow-2xl lg:hidden"
            >
              <div className="h-20 flex items-center justify-between px-6 bg-ulk-blue-slate border-b border-white/5">
                <Link to="/" className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-ulk-blue-dark font-bold">
                    UPK
                  </div>
                  <span className="text-lg font-bold text-white">Admin Panel</span>
                </Link>
                <button onClick={() => setMobileMenuOpen(false)} className="text-slate-400 hover:text-white">
                  <X size={24} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto py-6 px-4">
                <nav className="space-y-1">
                  {navItems.map((item) => {
                    const isActive = location.pathname.startsWith(item.path);
                    const Icon = item.icon;
                    return (
                      <Link key={item.name} to={item.path} onClick={() => setMobileMenuOpen(false)}>
                        <div className={`flex items-center gap-3 px-4 py-3 rounded-xl ${
                          isActive ? 'bg-ulk-blue text-white' : 'hover:bg-white/5 text-slate-300'
                        }`}>
                          <Icon size={20} className={isActive ? 'text-ulk-gold' : ''} />
                          <span className="font-medium">{item.name}</span>
                        </div>
                      </Link>
                    );
                  })}
                </nav>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-1 lg:ml-72 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-slate-200 sticky top-0 z-10 px-4 sm:px-8 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              <Menu size={24} />
            </button>
            <h2 className="text-xl font-bold text-slate-800 hidden sm:block">
              {navItems.find(item => location.pathname.startsWith(item.path))?.name || 'Dashboard'}
            </h2>
          </div>

          <div className="flex items-center gap-4 sm:gap-6">
            <button className="relative p-2 text-slate-500 hover:text-ulk-blue transition-colors">
              <Bell size={22} />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-ulk-accent rounded-full border-2 border-white"></span>
            </button>
            <div className="h-8 w-px bg-slate-200 hidden sm:block"></div>
            <div className="flex items-center gap-3 cursor-pointer hover:bg-slate-50 p-1.5 rounded-lg transition-colors">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-bold text-slate-900">{user?.first_name || 'Admin'}</p>
                <p className="text-xs text-slate-500 capitalize">{user?.role || 'Administrator'}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-slate-800 text-white flex items-center justify-center font-bold shadow-sm">
                <Settings size={20} />
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
