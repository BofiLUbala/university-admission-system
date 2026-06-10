import { Outlet, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { useSettings } from '../context/settingsContext';

const WHATSAPP_NUMBER = '243981215754';

const WhatsAppBubble = () => {
  const { t } = useSettings();
  return (
    <a
      href={`https://wa.me/${WHATSAPP_NUMBER}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-green-500 text-white px-5 py-3.5 rounded-full shadow-xl hover:bg-green-600 hover:shadow-2xl hover:scale-105 transition-all duration-300 group"
      aria-label="Contactez-nous sur WhatsApp"
    >
      <MessageCircle size={24} className="fill-white" />
        <span className="hidden sm:inline text-sm font-semibold group-hover:block transition-all">
        {t.whatsappLabel}
      </span>
    </a>
  );
};

const PublicLayout = () => {
  const { t, backgroundClass } = useSettings();
  return (
    <div className={`min-h-screen flex flex-col font-sans ${backgroundClass}`}>
      <WhatsAppBubble />
      {/* Header */}
      <header className="glass fixed w-full top-0 z-50 border-b border-white/20 shadow-sm">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 hover-lift">
              <div className="w-12 h-12 bg-ulk-blue rounded-xl flex items-center justify-center text-ulk-gold font-bold text-xl shadow-lg">
                UPK
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-ulk-blue leading-tight">Université Progressiste</h1>
                <p className="text-sm text-ulk-accent font-medium">de Kinshasa</p>
              </div>
            </Link>

            {/* Nav */}
            <nav className="hidden md:flex items-center gap-8">
              <Link to="/" className="text-neutral-800 hover:text-ulk-blue font-medium transition-colors">{t.navHome}</Link>
              <Link to="/about" className="text-neutral-800 hover:text-ulk-blue font-medium transition-colors">{t.navAbout}</Link>
              <Link to="/faculties" className="text-neutral-800 hover:text-ulk-blue font-medium transition-colors">{t.navFaculties}</Link>
              <Link to="/contact" className="text-neutral-800 hover:text-ulk-blue font-medium transition-colors">{t.navContact}</Link>
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-4">
              <Link to="/login" className="text-ulk-blue font-medium hover:text-ulk-blue-light transition-colors hidden sm:block">
                {t.logIn}
              </Link>
              <Link to="/register">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-ulk-gold text-ulk-blue-dark px-6 py-2.5 rounded-full font-bold shadow-md hover:shadow-lg transition-all"
                >
                  {t.applyNow}
                </motion.button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow pt-20">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-ulk-blue-dark text-white pt-16 pb-8">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-ulk-blue font-bold text-lg">
                  UPK
                </div>
                <h2 className="text-2xl font-bold text-white">{t.uniName}</h2>
              </div>
              <p className="text-neutral-300 max-w-md leading-relaxed">
                {t.footerDesc}
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold text-ulk-gold mb-6">{t.quickLinks}</h3>
              <ul className="space-y-4">
                <li><Link to="/about" className="text-neutral-300 hover:text-white transition-colors">{t.aboutUs}</Link></li>
                <li><Link to="/faculties" className="text-neutral-300 hover:text-white transition-colors">{t.facultiesTitle}</Link></li>
                <li><Link to="/contact" className="text-neutral-300 hover:text-white transition-colors">{t.navContact}</Link></li>
                <li><Link to="/register" className="text-neutral-300 hover:text-white transition-colors">{t.admissions}</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold text-ulk-gold mb-6">{t.contactTitle}</h3>
              <ul className="space-y-4 text-neutral-300">
                <li>{t.addressLine1}</li>
                <li>{t.addressLine2}</li>
                <li>{t.contactEmail}</li>
                <li>{t.contactPhone}</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between text-neutral-400 text-sm">
            <p>&copy; {new Date().getFullYear()} {t.uniName}. {t.rights}</p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <Link to="#" className="hover:text-white transition-colors">{t.privacy}</Link>
              <Link to="#" className="hover:text-white transition-colors">{t.terms}</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
