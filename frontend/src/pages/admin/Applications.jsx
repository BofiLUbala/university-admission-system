import { useState } from 'react';
import { Search, Filter, Eye, Check, X, Download } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSettings } from '../../context/settingsContext';

const MOCK_APPLICATIONS = [
  { id: 'APP-001', name: 'John Doe', faculty: 'Computer Science', date: '2026-05-20', status: 'Pending' },
  { id: 'APP-002', name: 'Jane Smith', faculty: 'Law', date: '2026-05-21', status: 'Approved' },
  { id: 'APP-003', name: 'Michael Johnson', faculty: 'Economics', date: '2026-05-22', status: 'Rejected' },
  { id: 'APP-004', name: 'Sarah Williams', faculty: 'Medicine', date: '2026-05-23', status: 'Pending' },
  { id: 'APP-005', name: 'David Brown', faculty: 'Computer Science', date: '2026-05-23', status: 'Pending' },
];

const getStatusBadge = (t, status) => {
  switch (status) {
    case 'Approved':
      return <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">{t.appStatusApproved}</span>;
    case 'Rejected':
      return <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold">{t.appStatusRejected}</span>;
    default:
      return <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-bold">{t.appStatusPending}</span>;
  }
};

const Applications = () => {
  const { t } = useSettings();
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-800">{t.appTitle}</h1>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-colors font-medium text-sm shadow-sm">
            <Filter size={16} /> {t.appFilter}
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-ulk-blue text-white rounded-xl hover:bg-ulk-blue-dark transition-colors font-medium text-sm shadow-sm">
            <Download size={16} /> {t.appExport}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="relative w-full max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-slate-400" />
            </div>
            <input
              type="text"
              placeholder={t.appSearch}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ulk-blue focus:bg-white transition-colors"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-bold border-b border-slate-200">{t.appId}</th>
                <th className="px-6 py-4 font-bold border-b border-slate-200">{t.appName}</th>
                <th className="px-6 py-4 font-bold border-b border-slate-200">{t.appFaculty}</th>
                <th className="px-6 py-4 font-bold border-b border-slate-200">{t.appDate}</th>
                <th className="px-6 py-4 font-bold border-b border-slate-200">{t.appStatus}</th>
                <th className="px-6 py-4 font-bold border-b border-slate-200 text-right">{t.appActions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {MOCK_APPLICATIONS.map((app, index) => (
                <motion.tr 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  key={app.id} 
                  className="hover:bg-slate-50/50 transition-colors"
                >
                  <td className="px-6 py-4 text-sm font-medium text-slate-900">{app.id}</td>
                  <td className="px-6 py-4 text-sm font-bold text-ulk-blue">{app.name}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{app.faculty}</td>
                  <td className="px-6 py-4 text-sm text-slate-500">{app.date}</td>
                  <td className="px-6 py-4">
                    {getStatusBadge(t, app.status)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 text-slate-400 hover:text-ulk-blue bg-white hover:bg-blue-50 border border-slate-200 rounded-lg transition-colors" title="View details">
                        <Eye size={16} />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-green-600 bg-white hover:bg-green-50 border border-slate-200 rounded-lg transition-colors" title="Approve">
                        <Check size={16} />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-red-600 bg-white hover:bg-red-50 border border-slate-200 rounded-lg transition-colors" title="Reject">
                        <X size={16} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500">
          <span>{t.appShowing} 1 {t.appTo} 5 {t.appOf} 142 {t.appEntries}</span>
          <div className="flex gap-1">
            <button className="px-3 py-1 rounded-lg border border-slate-200 hover:bg-slate-50">{t.appPrev}</button>
            <button className="px-3 py-1 rounded-lg bg-ulk-blue text-white">1</button>
            <button className="px-3 py-1 rounded-lg border border-slate-200 hover:bg-slate-50">2</button>
            <button className="px-3 py-1 rounded-lg border border-slate-200 hover:bg-slate-50">3</button>
            <button className="px-3 py-1 rounded-lg border border-slate-200 hover:bg-slate-50">{t.appNext}</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Applications;
