import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { BookOpen, GraduationCap, Users, ArrowRight } from 'lucide-react';

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-ulk-blue-dark via-ulk-blue to-ulk-blue-light -z-10" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2070')] bg-cover bg-center mix-blend-overlay opacity-20 -z-10" />
        
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl text-white">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-5xl md:text-7xl font-bold leading-tight mb-6"
            >
              Shape Your Future at <span className="text-ulk-gold">ULK</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl md:text-2xl text-blue-100 mb-10 max-w-2xl"
            >
              Join the premier institution in the Democratic Republic of Congo for excellence in education, research, and innovation.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link to="/register">
                <button className="bg-ulk-gold text-ulk-blue-dark px-8 py-4 rounded-full font-bold text-lg hover:shadow-xl hover:bg-white hover:text-ulk-blue transition-all flex items-center justify-center gap-2">
                  Apply for Admission <ArrowRight size={20} />
                </button>
              </Link>
              <Link to="/about">
                <button className="glass text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white/20 transition-all">
                  Discover ULK
                </button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-neutral-50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-4xl font-bold text-ulk-blue mb-4">Why Choose ULK?</h2>
            <p className="text-neutral-600 text-lg">We provide a world-class educational experience designed to prepare you for success in the modern global economy.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              whileHover={{ y: -10 }}
              className="bg-white p-8 rounded-3xl shadow-xl shadow-neutral-200/50"
            >
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-ulk-blue mb-6">
                <BookOpen size={32} />
              </div>
              <h3 className="text-2xl font-bold text-neutral-800 mb-4">Excellence in Teaching</h3>
              <p className="text-neutral-600 leading-relaxed">
                Our faculty consists of renowned professors and industry experts committed to providing the highest quality education.
              </p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -10 }}
              className="bg-white p-8 rounded-3xl shadow-xl shadow-neutral-200/50 border-t-4 border-ulk-gold"
            >
              <div className="w-16 h-16 bg-yellow-50 rounded-2xl flex items-center justify-center text-ulk-gold mb-6">
                <GraduationCap size={32} />
              </div>
              <h3 className="text-2xl font-bold text-neutral-800 mb-4">Modern Facilities</h3>
              <p className="text-neutral-600 leading-relaxed">
                State-of-the-art laboratories, comprehensive libraries, and modern classrooms designed to enhance learning.
              </p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -10 }}
              className="bg-white p-8 rounded-3xl shadow-xl shadow-neutral-200/50"
            >
              <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center text-ulk-accent mb-6">
                <Users size={32} />
              </div>
              <h3 className="text-2xl font-bold text-neutral-800 mb-4">Vibrant Campus Life</h3>
              <p className="text-neutral-600 leading-relaxed">
                Join a diverse community of students engaged in numerous clubs, sports, and cultural activities.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-ulk-blue text-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-bold text-ulk-gold mb-2">15,000+</div>
              <div className="text-blue-200 font-medium text-lg">Students Enrolled</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-ulk-gold mb-2">50+</div>
              <div className="text-blue-200 font-medium text-lg">Academic Programs</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-ulk-gold mb-2">95%</div>
              <div className="text-blue-200 font-medium text-lg">Employment Rate</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-ulk-gold mb-2">30+</div>
              <div className="text-blue-200 font-medium text-lg">Years of Excellence</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
