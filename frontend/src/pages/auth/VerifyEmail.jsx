import { useState, useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Loader } from 'lucide-react';
import api from '../../services/api';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('');
  const attemptedRef = useRef(false);

  useEffect(() => {
    if (attemptedRef.current) return;
    attemptedRef.current = true;

    const token = searchParams.get('token');
    if (!token) {
      setStatus('error');
      setMessage('Token de vérification manquant. Vérifiez que vous avez bien cliqué sur le lien complet reçu par email.');
      return;
    }

    api.get(`accounts/verify-email/?token=${encodeURIComponent(token)}`)
      .then((response) => {
        setStatus('success');
        setMessage(response.data?.message || 'Email vérifié avec succès !');
      })
      .catch((err) => {
        setStatus('error');
        setMessage(
          err.response?.data?.error ||
          err.response?.data?.message ||
          'Le lien de vérification est invalide ou a expiré. Veuillez créer un nouveau compte ou contacter le support.'
        );
      });
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-transparent relative overflow-hidden">
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-ulk-gold/20 rounded-full blur-3xl" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-ulk-blue/10 rounded-full blur-3xl" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white p-10 rounded-3xl shadow-xl z-10 border border-neutral-100 text-center"
      >
        <div className="mx-auto w-16 h-16 bg-ulk-blue rounded-2xl flex items-center justify-center text-ulk-gold font-bold text-2xl shadow-lg mb-6">
          UPK
        </div>

        {status === 'loading' && (
          <div className="py-8">
            <Loader size={48} className="mx-auto animate-spin text-ulk-blue mb-4" />
            <p className="text-neutral-600">Vérification de votre email en cours...</p>
          </div>
        )}

        {status === 'success' && (
          <div className="py-8">
            <CheckCircle size={64} className="mx-auto text-green-500 mb-4" />
            <h2 className="text-2xl font-bold text-neutral-900 mb-2">Email vérifié !</h2>
            <p className="text-neutral-600 mb-6">{message}</p>
            <Link
              to="/login?verified=true"
              className="inline-block bg-ulk-blue hover:bg-ulk-blue-dark text-white font-bold py-3 px-8 rounded-xl transition-colors shadow-md"
            >
              Aller à la connexion
            </Link>
          </div>
        )}

        {status === 'error' && (
          <div className="py-8">
            <XCircle size={64} className="mx-auto text-red-500 mb-4" />
            <h2 className="text-2xl font-bold text-neutral-900 mb-2">Échec de la vérification</h2>
            <p className="text-neutral-600 mb-6">{message}</p>
            <p className="text-sm text-neutral-500 mb-6">
              Assurez-vous d'utiliser le lien le plus récent reçu par email. 
              Chaque lien ne peut être utilisé qu'une seule fois et expire après 2 heures.
            </p>
            <Link
              to="/register"
              className="inline-block bg-ulk-gold text-ulk-blue-dark font-bold py-3 px-8 rounded-xl transition-colors shadow-md hover:bg-yellow-400 mr-3"
            >
              Créer un nouveau compte
            </Link>
            <Link
              to="/login"
              className="inline-block bg-neutral-100 text-neutral-700 font-bold py-3 px-8 rounded-xl transition-colors shadow-md hover:bg-neutral-200"
            >
              Retour
            </Link>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default VerifyEmail;
