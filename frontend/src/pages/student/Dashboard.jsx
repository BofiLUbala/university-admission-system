import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  UploadCloud, 
  CheckCircle, 
  Clock, 
  AlertCircle 
} from 'lucide-react';
import { useSettings } from '../../context/settingsContext';

const Dashboard = () => {
  const { t } = useSettings();
  // Mock data
  const applicationStatus = t.draft; // Draft, Submitted, Under Review, Approved, Rejected

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Status Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-200 md:col-span-2"
        >
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-lg font-bold text-neutral-800">{t.applicationStatus}</h3>
              <p className="text-sm text-neutral-500">{t.academicYear}</p>
            </div>
            <span className="px-4 py-1.5 bg-yellow-100 text-yellow-700 font-semibold text-sm rounded-full flex items-center gap-2">
              <Clock size={16} /> {applicationStatus}
            </span>
          </div>

          <div className="relative pt-4">
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-neutral-100">
              <div style={{ width: "25%" }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-ulk-blue"></div>
            </div>
            <div className="flex justify-between text-xs text-neutral-500 font-medium">
              <span className="text-ulk-blue">{t.draft}</span>
              <span>{t.submitted}</span>
              <span>{t.underReview}</span>
              <span>{t.decision}</span>
            </div>
          </div>
          
          <div className="mt-8 flex gap-4">
            <Link to="/student/admission" className="flex-1">
              <button className="w-full bg-ulk-blue text-white py-2.5 rounded-xl font-medium hover:bg-ulk-blue-dark transition-colors">
                {t.continueApplication}
              </button>
            </Link>
          </div>
        </motion.div>

        {/* Action Needed Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-200"
        >
          <h3 className="text-lg font-bold text-neutral-800 mb-4">{t.requiredDocuments}</h3>
          <ul className="space-y-4">
            <li className="flex items-center gap-3 text-sm">
              <CheckCircle size={20} className="text-green-500" />
              <span className="text-neutral-700 line-through">{t.identityCard}</span>
            </li>
            <li className="flex items-center gap-3 text-sm">
              <AlertCircle size={20} className="text-red-500" />
              <span className="text-neutral-700 font-medium">{t.academicTranscript}</span>
            </li>
            <li className="flex items-center gap-3 text-sm">
              <AlertCircle size={20} className="text-red-500" />
              <span className="text-neutral-700 font-medium">{t.passportPhoto}</span>
            </li>
          </ul>
          <Link to="/student/documents" className="block mt-6">
            <button className="w-full bg-neutral-100 text-neutral-700 py-2.5 rounded-xl font-medium hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2">
              <UploadCloud size={18} /> {t.uploadMissing}
            </button>
          </Link>
        </motion.div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden">
        <div className="p-6 border-b border-neutral-100">
          <h3 className="text-lg font-bold text-neutral-800">{t.recentNotifications}</h3>
        </div>
        <div className="divide-y divide-neutral-100">
          <div className="p-4 hover:bg-neutral-50 transition-colors flex gap-4">
            <div className="w-10 h-10 rounded-full bg-blue-50 text-ulk-blue flex items-center justify-center flex-shrink-0">
              <FileText size={20} />
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-800">Application Draft Saved</p>
              <p className="text-xs text-neutral-500 mt-1">Your application progress has been saved securely.</p>
              <p className="text-xs text-neutral-400 mt-2">2 hours ago</p>
            </div>
          </div>
          <div className="p-4 hover:bg-neutral-50 transition-colors flex gap-4">
            <div className="w-10 h-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center flex-shrink-0">
              <CheckCircle size={20} />
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-800">Account Created Successfully</p>
              <p className="text-xs text-neutral-500 mt-1">Welcome to the UPK online admission portal.</p>
              <p className="text-xs text-neutral-400 mt-2">1 day ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
