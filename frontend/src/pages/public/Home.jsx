import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  BookOpen, GraduationCap, Users, ArrowRight, Scale, Building2,
  Microscope, Trophy, Calendar, Newspaper, Sparkles, CheckCircle
} from 'lucide-react';
import { useSettings } from '../../context/settingsContext';
import CyclingImage from '../../components/common/CyclingImage';

const faculties = [
  {
    icon: Building2,
    name: 'Faculté des Sciences Informatiques',
    programs: 'Génie Logiciel, Réseaux, IA',
    color: 'from-blue-600 to-blue-800',
    gradient: 'from-blue-50 to-blue-100',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-700',
    border: 'border-blue-200',
    link: '#'
  },
  {
    icon: Scale,
    name: 'Faculté de Droit',
    programs: 'Droit Public, Droit Privé',
    color: 'from-amber-600 to-amber-800',
    gradient: 'from-amber-50 to-amber-100',
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-700',
    border: 'border-amber-200',
    link: '#'
  },
  {
    icon: BookOpen,
    name: 'Faculté des Sciences Économiques',
    programs: 'Gestion Financière, Économie',
    color: 'from-emerald-600 to-emerald-800',
    gradient: 'from-emerald-50 to-emerald-100',
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-700',
    border: 'border-emerald-200',
    link: '#'
  },
  {
    icon: Microscope,
    name: 'Faculté des Sciences Sociales',
    programs: 'Sociologie, Psychologie, Communication',
    color: 'from-purple-600 to-purple-800',
    gradient: 'from-purple-50 to-purple-100',
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-700',
    border: 'border-purple-200',
    link: '#'
  }
];



const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const Home = () => {
  const { t } = useSettings();
  const newsItems = [
    {
      icon: Calendar,
      date: '15 Juin 2026',
      title: t.news1Title,
      description: t.news1Desc,
      tag: t.tagEnrollment,
      tagColor: 'bg-ulk-gold text-ulk-blue-dark',
      images: [
        'https://images.unsplash.com/photo-1580582932707-520aed937b7b?q=80&w=1932&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=2011&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=2070&auto=format&fit=crop',
      ]
    },
    {
      icon: Trophy,
      date: '8 Juin 2026',
      title: t.news2Title,
      description: t.news2Desc,
      tag: t.tagExcellence,
      tagColor: 'bg-green-100 text-green-700',
      images: [
        'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2070&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1529543544282-ea264073e70b?q=80&w=2070&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2070&auto=format&fit=crop',
      ]
    },
    {
      icon: Newspaper,
      date: '1 Juin 2026',
      title: t.news3Title,
      description: t.news3Desc,
      tag: t.tagPartnership,
      tagColor: 'bg-blue-100 text-blue-700',
      images: [
        'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?q=80&w=2070&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=2070&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop',
      ]
    }
  ];
  return (
    <div className="flex flex-col min-h-screen">

      {/* ===== HERO SECTION ===== */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-ulk-blue-dark via-ulk-blue to-ulk-blue-light" />
        <div
          className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1588072432836-e10032774350?q=80&w=2072&auto=format&fit=crop')] bg-cover bg-center bg-no-repeat"
          style={{ filter: 'brightness(0.35) saturate(0.8)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ulk-blue-dark/60 via-transparent to-ulk-blue-dark/30" />

        <div className="relative container mx-auto px-4 lg:px-8 py-20 mt-16">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-2 mb-8"
            >
              <Sparkles size={16} className="text-ulk-gold" />
              <span className="text-white/90 text-sm font-medium">{t.heroBadge}</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6 text-white"
            >
              {t.heroTitle}<span className="text-ulk-gold">{t.heroHighlight}</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg md:text-xl text-blue-100/90 mb-10 max-w-2xl mx-auto leading-relaxed"
            >
              {t.heroSub}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Link to="/register">
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: '0 8px 30px rgba(244, 211, 94, 0.4)' }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-ulk-gold text-ulk-blue-dark px-10 py-4 rounded-full font-bold text-lg shadow-xl shadow-ulk-gold/25 hover:shadow-2xl transition-all flex items-center justify-center gap-2"
                >
                  {t.heroCta} <ArrowRight size={20} />
                </motion.button>
              </Link>
              <Link to="/about">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-white/20 transition-all"
                >
                  {t.heroDiscover}
                </motion.button>
              </Link>
            </motion.div>

            {/* Trust indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="mt-16 flex flex-wrap items-center justify-center gap-8 text-white/60 text-sm"
            >
              <div className="flex items-center gap-2">
                <CheckCircle size={16} className="text-green-400" />
                <span>{t.trustEsu}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle size={16} className="text-green-400" />
                <span>{t.trustAuf}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle size={16} className="text-green-400" />
                <span>{t.trustIntl}</span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
            <path d="M0 60V30C240 0 480 0 720 30C960 60 1200 60 1440 30V60H0Z" fill="#f8fafc" />
          </svg>
        </div>
      </section>

      {/* ===== WHY CHOOSE UPK ===== */}
      <section className="py-24 bg-neutral-50">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto mb-16"
          >
            <span className="text-ulk-gold font-bold text-sm tracking-widest uppercase mb-4 block">{t.whyLabel}</span>
            <h2 className="text-4xl md:text-5xl font-bold text-ulk-blue mb-4">{t.whyTitle}</h2>
            <p className="text-neutral-600 text-lg">{t.whySub}</p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10"
          >
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              className="group bg-white p-10 rounded-3xl shadow-lg shadow-neutral-200/50 border border-neutral-100 hover:shadow-xl transition-all duration-300"
            >
              <div className="w-16 h-16 bg-ulk-gold/10 rounded-2xl flex items-center justify-center text-ulk-gold mb-6 group-hover:bg-ulk-gold group-hover:text-ulk-blue-dark transition-all duration-300">
                <BookOpen size={32} />
              </div>
              <h3 className="text-2xl font-bold text-neutral-800 mb-4">{t.whyCard1Title}</h3>
              <p className="text-neutral-600 leading-relaxed">
                {t.whyCard1Desc}
              </p>
            </motion.div>

            <motion.div
              variants={itemVariants}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              className="group bg-white p-10 rounded-3xl shadow-lg shadow-neutral-200/50 border border-neutral-100 hover:shadow-xl transition-all duration-300 border-t-4 border-t-ulk-gold"
            >
              <div className="w-16 h-16 bg-ulk-gold/10 rounded-2xl flex items-center justify-center text-ulk-gold mb-6 group-hover:bg-ulk-gold group-hover:text-ulk-blue-dark transition-all duration-300">
                <GraduationCap size={32} />
              </div>
              <h3 className="text-2xl font-bold text-neutral-800 mb-4">{t.whyCard2Title}</h3>
              <p className="text-neutral-600 leading-relaxed">
                {t.whyCard2Desc}
              </p>
            </motion.div>

            <motion.div
              variants={itemVariants}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              className="group bg-white p-10 rounded-3xl shadow-lg shadow-neutral-200/50 border border-neutral-100 hover:shadow-xl transition-all duration-300"
            >
              <div className="w-16 h-16 bg-ulk-gold/10 rounded-2xl flex items-center justify-center text-ulk-gold mb-6 group-hover:bg-ulk-gold group-hover:text-ulk-blue-dark transition-all duration-300">
                <Users size={32} />
              </div>
              <h3 className="text-2xl font-bold text-neutral-800 mb-4">{t.whyCard3Title}</h3>
              <p className="text-neutral-600 leading-relaxed">
                {t.whyCard3Desc}
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ===== STATISTICS ===== */}
      <section className="py-24 bg-gradient-to-br from-ulk-blue-dark via-ulk-blue to-ulk-blue-light relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
        <div className="relative container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center"
          >
            {[
              { value: '15,000+', label: t.statStudents },
              { value: '50+', label: t.statPrograms },
              { value: '95%', label: t.statRate },
              { value: '30+', label: t.statYears }
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="text-4xl md:text-5xl font-bold text-ulk-gold mb-2">{stat.value}</div>
                <div className="text-blue-200 font-medium text-lg">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===== ACADEMIC PROGRAMS ===== */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto mb-16"
          >
            <span className="text-ulk-gold font-bold text-sm tracking-widest uppercase mb-4 block">{t.progLabel}</span>
            <h2 className="text-4xl md:text-5xl font-bold text-ulk-blue mb-4">{t.progTitle}</h2>
            <p className="text-neutral-600 text-lg">{t.progSub}</p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
          >
            {faculties.map((faculty) => {
              const Icon = faculty.icon;
              return (
                <motion.div
                  key={faculty.name}
                  variants={itemVariants}
                  whileHover={{ y: -6, transition: { duration: 0.2 } }}
                  className={`group relative bg-white rounded-2xl border ${faculty.border} p-6 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${faculty.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                  <div className="relative">
                    <div className={`w-14 h-14 ${faculty.iconBg} rounded-2xl flex items-center justify-center ${faculty.iconColor} mb-5 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon size={28} />
                    </div>
                    <h3 className="text-lg font-bold text-neutral-800 mb-2 group-hover:text-ulk-blue transition-colors">
                      {faculty.name}
                    </h3>
                    <p className="text-sm text-neutral-500 mb-4">{faculty.programs}</p>
                    <Link
                      to={faculty.link}
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-ulk-blue hover:text-ulk-gold transition-colors"
                    >
                      {t.learnMore} <ArrowRight size={14} />
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link to="/register">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-ulk-blue text-white px-10 py-4 rounded-full font-bold text-lg shadow-lg hover:bg-ulk-blue-light transition-all inline-flex items-center gap-2"
              >
                {t.viewAll} <ArrowRight size={20} />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ===== NEWS & EVENTS ===== */}
      <section className="py-24 bg-neutral-50">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto mb-16"
          >
            <span className="text-ulk-gold font-bold text-sm tracking-widest uppercase mb-4 block">{t.newsLabel}</span>
            <h2 className="text-4xl md:text-5xl font-bold text-ulk-blue mb-4">{t.newsTitle}</h2>
            <p className="text-neutral-600 text-lg">{t.newsSub}</p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {newsItems.map((item) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  variants={itemVariants}
                  whileHover={{ y: -6 }}
                  className="bg-white rounded-2xl shadow-lg shadow-neutral-200/50 overflow-hidden border border-neutral-100 hover:shadow-xl transition-all duration-300"
                >
                  <div className="relative h-48 overflow-hidden">
                    <CyclingImage
                      images={item.images}
                      alt={item.title}
                      className="group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    <span className={`absolute top-4 right-4 text-xs font-bold px-3 py-1.5 rounded-full shadow-lg ${item.tagColor}`}>
                      {item.tag}
                    </span>
                  </div>
                  <div className="p-8">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-ulk-blue shrink-0">
                        <Icon size={20} />
                      </div>
                      <p className="text-xs text-neutral-400 font-medium">{item.date}</p>
                    </div>
                    <h3 className="text-lg font-bold text-neutral-800 mb-3 leading-snug">{item.title}</h3>
                    <p className="text-sm text-neutral-600 leading-relaxed mb-4">{item.description}</p>
                    <Link to="#" className="inline-flex items-center gap-1.5 text-sm font-semibold text-ulk-blue hover:text-ulk-gold transition-colors">
                      {t.readMore} <ArrowRight size={14} />
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ===== CTA BANNER ===== */}
      <section className="py-20 bg-gradient-to-br from-ulk-blue-dark via-ulk-blue to-ulk-blue-light relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-10" />
        <div className="relative container mx-auto px-4 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">{t.ctaTitle}</h2>
            <p className="text-xl text-blue-200 mb-10 max-w-xl mx-auto">
              {t.ctaSub}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-ulk-gold text-ulk-blue-dark px-10 py-4 rounded-full font-bold text-lg shadow-xl hover:shadow-2xl transition-all inline-flex items-center gap-2"
                >
                  {t.ctaApply} <ArrowRight size={20} />
                </motion.button>
              </Link>
              <Link to="/contact">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-white/20 transition-all"
                >
                  {t.ctaContact}
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
};

export default Home;
