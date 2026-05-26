import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  FileText, 
  UploadCloud, 
  LogOut, 
  Bell, 
  Menu, 
  X,
  User,
  Camera,
  Save,
  Settings,
  Trash2
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { updateUser } from '../store/slices/authSlice';
import { useSettings } from '../context/settingsContext';
import authService from '../services/authService';

const StudentLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);
  const { t } = useSettings();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileEditorOpen, setProfileEditorOpen] = useState(false);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileForm, setProfileForm] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    email: user?.email || '',
    profile_picture: user?.profile_picture || '',
  });
  const getProfilePictureUrl = (pic) => {
    if (!pic) return null;
    if (pic.startsWith('data:') || pic.startsWith('http')) return pic;
    // Base API URL configuration
    const baseUrl = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api/', '') : 'http://localhost:8000';
    return `${baseUrl}${pic}`;
  };

  useEffect(() => {
    // Session blocking storage is removed
  }, [location.pathname]);
  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const handleProfilePictureChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setProfileForm((current) => ({
        ...current,
        profile_picture: reader.result,
      }));
    };
    reader.readAsDataURL(file);
  };

  const openProfileEditor = () => {
    setProfileForm({
      first_name: user?.first_name || '',
      last_name: user?.last_name || '',
      email: user?.email || '',
      profile_picture: user?.profile_picture || '',
    });
    setProfileEditorOpen(true);
  };

  const closeProfileEditor = () => {
    setProfileForm({
      first_name: user?.first_name || '',
      last_name: user?.last_name || '',
      email: user?.email || '',
      profile_picture: user?.profile_picture || '',
    });
    setProfileEditorOpen(false);
  };

  const persistProfile = async (nextProfile) => {
    setProfileSaving(true);
    try {
      console.log('Saving profile:', {
        ...nextProfile,
        profile_picture: nextProfile.profile_picture ? nextProfile.profile_picture.substring(0, 50) + '...' : ''
      });
      const savedProfile = await authService.patchProfile(nextProfile);
      console.log('Profile saved successfully:', savedProfile);
      dispatch(updateUser(savedProfile));
      // Also update localStorage to ensure persistence
      localStorage.setItem('ulk_user', JSON.stringify(savedProfile));
      return { success: true, profile: savedProfile };
    } catch (error) {
      console.error('Failed to save profile:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      // Check if it's a 401 error - clear local storage and redirect to login
      if (error.response && error.response.status === 401) {
        alert('Session expired. Please log in again.');
        dispatch(logout());
        navigate('/login');
      } else if (error.response) {
        alert(`Failed to save profile: ${JSON.stringify(error.response.data)}`);
      } else {
        alert('Failed to save profile. Please try again.');
      }
      // Don't update local state on failure to maintain consistency with backend
      return { success: false, error };
    } finally {
      setProfileSaving(false);
    }
  };

  const handleProfileSave = async (event) => {
    event.preventDefault();
    const result = await persistProfile(profileForm);
    if (result.success) {
      setProfileEditorOpen(false);
    }
  };

  const handleProfilePictureDelete = async () => {
    const nextProfile = {
      ...profileForm,
      profile_picture: ''
    };

    const result = await persistProfile(nextProfile);
    if (result.success) {
      setProfileForm(nextProfile);
      // Update the user in Redux with the new profile
      dispatch(updateUser(result.profile));
      setProfileEditorOpen(false);
    }
  };

  const navItems = [
    { name: t.dashboard, path: '/student/dashboard', icon: LayoutDashboard },
    { name: t.admissionForm, path: '/student/admission', icon: FileText },
    { name: t.documents, path: '/student/documents', icon: UploadCloud },
    { name: t.settings, path: '/student/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen flex bg-transparent">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-72 bg-white border-r border-neutral-200 fixed h-full z-20">
        <div className="h-20 flex items-center px-8 border-b border-neutral-100">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-ulk-blue rounded-xl flex items-center justify-center text-ulk-gold font-bold shadow-md">
              ULK
            </div>
            <div>
              <h1 className="text-lg font-bold text-ulk-blue leading-tight">{t.student}</h1>
              <p className="text-xs text-ulk-accent font-medium">{t.portal}</p>
            </div>
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto py-8 px-4">
          <nav className="space-y-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <Link key={item.name} to={item.path}>
                  <div className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive 
                      ? 'bg-ulk-blue text-white shadow-md' 
                      : 'text-neutral-600 hover:bg-neutral-100 hover:text-ulk-blue'
                  }`}>
                    <Icon size={20} className={isActive ? 'text-ulk-gold' : ''} />
                    <span className="font-medium">{item.name}</span>
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-neutral-100">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 text-red-600 rounded-xl hover:bg-red-50 transition-colors"
          >
            <LogOut size={20} />
            <span className="font-medium">{t.logout}</span>
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
              className="fixed inset-0 bg-neutral-900/50 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-72 bg-white z-50 flex flex-col shadow-2xl lg:hidden"
            >
              <div className="h-20 flex items-center justify-between px-6 border-b border-neutral-100">
                <Link to="/" className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-ulk-blue rounded-xl flex items-center justify-center text-ulk-gold font-bold shadow-md">
                    ULK
                  </div>
                  <span className="text-lg font-bold text-ulk-blue">{t.studentPortal}</span>
                </Link>
                <button onClick={() => setMobileMenuOpen(false)} className="text-neutral-500 hover:text-neutral-900">
                  <X size={24} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto py-6 px-4">
                <nav className="space-y-2">
                  {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    const Icon = item.icon;
                    return (
                      <Link key={item.name} to={item.path} onClick={() => setMobileMenuOpen(false)}>
                        <div className={`flex items-center gap-3 px-4 py-3 rounded-xl ${
                          isActive ? 'bg-ulk-blue text-white' : 'text-neutral-600'
                        }`}>
                          <Icon size={20} />
                          <span className="font-medium">{item.name}</span>
                        </div>
                      </Link>
                    );
                  })}
                </nav>
              </div>
              <div className="p-4 border-t border-neutral-100">
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full px-4 py-3 text-red-600 rounded-xl hover:bg-red-50"
                >
                  <LogOut size={20} />
                  <span className="font-medium">{t.logout}</span>
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-1 lg:ml-72 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-neutral-200 sticky top-0 z-10 px-4 sm:px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 text-neutral-600 hover:bg-neutral-100 rounded-lg"
            >
              <Menu size={24} />
            </button>
            <h2 className="text-xl font-bold text-neutral-800 hidden sm:block">
              {navItems.find(item => item.path === location.pathname)?.name || t.portal}
            </h2>
          </div>

          <div className="flex items-center gap-4 sm:gap-6">
            <button className="relative p-2 text-neutral-500 hover:text-ulk-blue transition-colors">
              <Bell size={22} />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <button
              type="button"
              onClick={openProfileEditor}
              className="flex items-center gap-3 rounded-2xl px-2 py-1 text-left transition-colors hover:bg-neutral-100"
            >
              <div className="hidden sm:block text-right">
                <p className="text-sm font-bold text-neutral-900">{user?.first_name || t.student}</p>
                <p className="text-xs text-neutral-500">{t.applicant}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-ulk-blue-light text-white flex items-center justify-center font-bold shadow-sm overflow-hidden">
                {user?.profile_picture ? (
                  <img
                    src={getProfilePictureUrl(user.profile_picture)}
                    alt="Profile"
                    className="h-full w-full rounded-full object-cover"
                  />
                ) : user?.first_name ? (
                  user.first_name.charAt(0)
                ) : (
                  <User size={20} />
                )}
              </div>
            </button>
          </div>
        </header>

        <AnimatePresence>
          {profileEditorOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={closeProfileEditor}
                className="fixed inset-0 z-40 bg-neutral-900/40 backdrop-blur-sm"
              />
              <motion.div
                initial={{ opacity: 0, y: 24, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 24, scale: 0.98 }}
                className="fixed inset-x-4 top-24 z-50 mx-auto w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-6 shadow-2xl"
              >
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-neutral-900">ID Details</h3>
                    <p className="text-sm text-neutral-500">Update your profile information.</p>
                  </div>
                  <button
                    type="button"
                    onClick={closeProfileEditor}
                    className="rounded-full p-2 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900"
                  >
                    <X size={20} />
                  </button>
                </div>

                <form onSubmit={handleProfileSave} className="space-y-5">
                  <div className="flex items-center gap-4">
                    <div className="h-20 w-20 overflow-hidden rounded-full bg-ulk-blue-light text-white flex items-center justify-center text-2xl font-bold shadow-sm">
                      {profileForm.profile_picture ? (
                        <img
                          src={getProfilePictureUrl(profileForm.profile_picture)}
                          alt="Profile preview"
                          className="h-full w-full rounded-full object-cover"
                        />
                      ) : profileForm.first_name ? (
                        profileForm.first_name.charAt(0)
                      ) : (
                        <User size={28} />
                      )}
                    </div>
                    <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-ulk-blue px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-ulk-blue-dark">
                      <Camera size={16} />
                      Upload Picture
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleProfilePictureChange}
                        className="sr-only"
                      />
                    </label>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-neutral-700">First Name</label>
                      <input
                        value={profileForm.first_name}
                        onChange={(event) => setProfileForm((current) => ({ ...current, first_name: event.target.value }))}
                        className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 outline-none transition-all focus:border-transparent focus:bg-white focus:ring-2 focus:ring-ulk-blue"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-neutral-700">Last Name</label>
                      <input
                        value={profileForm.last_name}
                        onChange={(event) => setProfileForm((current) => ({ ...current, last_name: event.target.value }))}
                        className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 outline-none transition-all focus:border-transparent focus:bg-white focus:ring-2 focus:ring-ulk-blue"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-neutral-700">Email</label>
                    <input
                      type="email"
                      value={profileForm.email}
                      onChange={(event) => setProfileForm((current) => ({ ...current, email: event.target.value }))}
                      className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 outline-none transition-all focus:border-transparent focus:bg-white focus:ring-2 focus:ring-ulk-blue"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <button
                      type="button"
                      onClick={closeProfileEditor}
                      disabled={profileSaving}
                      className="flex items-center justify-center gap-2 rounded-xl bg-neutral-100 px-4 py-3 font-bold text-neutral-700 transition-colors hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleProfilePictureDelete}
                      disabled={profileSaving || !profileForm.profile_picture}
                      className="flex items-center justify-center gap-2 rounded-xl bg-red-50 px-4 py-3 font-bold text-red-600 transition-colors hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Trash2 size={18} />
                      Delete
                    </button>
                    <button
                      type="submit"
                      disabled={profileSaving}
                      className="flex items-center justify-center gap-2 rounded-xl bg-ulk-gold px-4 py-3 font-bold text-ulk-blue-dark shadow-sm transition-colors hover:bg-yellow-400 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      <Save size={18} />
                      {profileSaving ? 'Saving...' : 'Save'}
                    </button>
                  </div>
                </form>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default StudentLayout;
