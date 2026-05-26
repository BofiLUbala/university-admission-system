import { Outlet, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const PublicLayout = () => {
  return (
    <div className="min-h-screen flex flex-col font-sans bg-transparent">
      {/* Header */}
      <header className="glass fixed w-full top-0 z-50 border-b border-white/20 shadow-sm">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 hover-lift">
              <div className="w-12 h-12 bg-ulk-blue rounded-xl flex items-center justify-center text-ulk-gold font-bold text-xl shadow-lg">
                ULK
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-ulk-blue leading-tight">Université Libre</h1>
                <p className="text-sm text-ulk-accent font-medium">de Kinshasa</p>
              </div>
            </Link>

            {/* Nav */}
            <nav className="hidden md:flex items-center gap-8">
              <Link to="/" className="text-neutral-800 hover:text-ulk-blue font-medium transition-colors">Home</Link>
              <Link to="/about" className="text-neutral-800 hover:text-ulk-blue font-medium transition-colors">About</Link>
              <Link to="/contact" className="text-neutral-800 hover:text-ulk-blue font-medium transition-colors">Contact</Link>
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-4">
              <Link to="/login" className="text-ulk-blue font-medium hover:text-ulk-blue-light transition-colors hidden sm:block">
                Log in
              </Link>
              <Link to="/register">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-ulk-gold text-ulk-blue-dark px-6 py-2.5 rounded-full font-bold shadow-md hover:shadow-lg transition-all"
                >
                  Apply Now
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
                  ULK
                </div>
                <h2 className="text-2xl font-bold text-white">Université Libre de Kinshasa</h2>
              </div>
              <p className="text-neutral-300 max-w-md leading-relaxed">
                Empowering the next generation of leaders in Democratic Republic of Congo through excellence in education, research, and innovation.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold text-ulk-gold mb-6">Quick Links</h3>
              <ul className="space-y-4">
                <li><Link to="/about" className="text-neutral-300 hover:text-white transition-colors">About Us</Link></li>
                <li><Link to="/faculties" className="text-neutral-300 hover:text-white transition-colors">Faculties</Link></li>
                <li><Link to="/contact" className="text-neutral-300 hover:text-white transition-colors">Contact</Link></li>
                <li><Link to="/register" className="text-neutral-300 hover:text-white transition-colors">Admissions</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold text-ulk-gold mb-6">Contact</h3>
              <ul className="space-y-4 text-neutral-300">
                <li>15th Street, Limete Industrial</li>
                <li>Kinshasa, DRC</li>
                <li>info@ulk-kinshasa.net</li>
                <li>+243 81 000 0000</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between text-neutral-400 text-sm">
            <p>&copy; {new Date().getFullYear()} Université Libre de Kinshasa. All rights reserved.</p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <Link to="#" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link to="#" className="hover:text-white transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
