import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Scale, Building2, Microscope, ChevronRight, Loader, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import facultyService from '../../services/facultyService';

const iconMap = {
  'FI': BookOpen,
  'DR': Scale,
  'EG': Building2,
};

const defaultIcon = Microscope;

const colorMap = [
  { gradient: 'from-blue-600 to-blue-800', iconBg: 'bg-blue-100', iconColor: 'text-blue-700', border: 'border-blue-200', lightBg: 'from-blue-50 to-blue-100' },
  { gradient: 'from-amber-600 to-amber-800', iconBg: 'bg-amber-100', iconColor: 'text-amber-700', border: 'border-amber-200', lightBg: 'from-amber-50 to-amber-100' },
  { gradient: 'from-emerald-600 to-emerald-800', iconBg: 'bg-emerald-100', iconColor: 'text-emerald-700', border: 'border-emerald-200', lightBg: 'from-emerald-50 to-emerald-100' },
  { gradient: 'from-purple-600 to-purple-800', iconBg: 'bg-purple-100', iconColor: 'text-purple-700', border: 'border-purple-200', lightBg: 'from-purple-50 to-purple-100' },
];

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } }
};

const Faculties = () => {
  const [faculties, setFaculties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    facultyService.getFaculties()
      .then((data) => {
        const results = Array.isArray(data) ? data : data.results || [];
        setFaculties(results);
      })
      .catch(() => {
        setError("Impossible de charger les facultés pour le moment.");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="text-center">
          <Loader size={48} className="mx-auto animate-spin text-ulk-blue mb-4" />
          <p className="text-neutral-500">Chargement des facultés...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Scale size={36} className="text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-neutral-800 mb-2">Une erreur est survenue</h2>
          <p className="text-neutral-500 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-ulk-blue text-white px-6 py-3 rounded-full font-bold hover:bg-ulk-blue-light transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-neutral-50">

      {/* Header Banner */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-ulk-blue-dark via-ulk-blue to-ulk-blue-light" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523050854058-8df90110c7f1?q=80&w=2070')] bg-cover bg-center opacity-10" />
        <div className="relative container mx-auto px-4 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="text-ulk-gold font-bold text-sm tracking-widest uppercase mb-4 block">Formation d'excellence</span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">Nos Facultés</h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Découvrez nos facultés et trouvez le programme qui correspond à vos ambitions.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Faculties Grid */}
      <section className="py-20 -mt-10">
        <div className="container mx-auto px-4 lg:px-8">
          {faculties.length === 0 ? (
            <div className="text-center py-16">
              <Building2 size={64} className="mx-auto text-neutral-300 mb-4" />
              <h3 className="text-xl font-bold text-neutral-500">Aucune faculté disponible</h3>
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
            >
              {faculties.map((faculty, index) => {
                const Icon = iconMap[faculty.code] || defaultIcon;
                const colors = colorMap[index % colorMap.length];
                const departments = faculty.departments || [];
                return (
                  <motion.div
                    key={faculty.id}
                    variants={itemVariants}
                    whileHover={{ y: -4 }}
                    className="bg-white rounded-3xl shadow-lg shadow-neutral-200/50 border border-neutral-100 overflow-hidden hover:shadow-xl transition-all duration-300"
                  >
                    {/* Header */}
                    <div className="p-8 pb-6">
                      <div className="flex items-start gap-5">
                        <div className={`w-16 h-16 ${colors.iconBg} rounded-2xl flex items-center justify-center ${colors.iconColor} shrink-0`}>
                          <Icon size={32} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-bold text-ulk-gold bg-ulk-gold/10 px-3 py-1 rounded-full">
                              {faculty.code}
                            </span>
                          </div>
                          <h2 className="text-2xl font-bold text-neutral-800">{faculty.name}</h2>
                        </div>
                      </div>
                      {faculty.description && (
                        <p className="mt-4 text-neutral-600 leading-relaxed pl-[72px]">
                          {faculty.description}
                        </p>
                      )}
                    </div>

                    {/* Departments */}
                    {departments.length > 0 && (
                      <div className="border-t border-neutral-100 bg-neutral-50/50 px-8 py-5">
                        <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-3">
                          Départements ({departments.length})
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {departments.map((dept) => (
                            <div
                              key={dept.id}
                              className="flex items-center gap-2 text-sm text-neutral-600 bg-white rounded-xl px-4 py-2.5 border border-neutral-100"
                            >
                              <ChevronRight size={14} className="text-ulk-gold shrink-0" />
                              <span className="truncate">{dept.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-ulk-blue-dark via-ulk-blue to-ulk-blue-light">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Prêt à Rejoindre l'UPK ?</h2>
            <p className="text-lg text-blue-200 mb-8 max-w-lg mx-auto">
              Les admissions sont ouvertes. Postulez dès maintenant pour l'année académique 2026-2027.
            </p>
            <Link to="/register">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-ulk-gold text-ulk-blue-dark px-10 py-4 rounded-full font-bold text-lg shadow-xl hover:shadow-2xl transition-all"
              >
                Postuler maintenant
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

    </div>
  );
};

export default Faculties;
