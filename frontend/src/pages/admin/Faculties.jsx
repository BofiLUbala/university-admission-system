import { useState } from 'react';
import { Plus, Edit2, Trash2, ChevronDown, FolderOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MOCK_FACULTIES = [
  {
    id: 1,
    name: 'Faculty of Computer Science',
    departments: [
      { id: 101, name: 'Software Engineering', status: 'Active' },
      { id: 102, name: 'Network Engineering', status: 'Active' },
      { id: 103, name: 'Artificial Intelligence', status: 'Active' },
    ]
  },
  {
    id: 2,
    name: 'Faculty of Law',
    departments: [
      { id: 201, name: 'Public Law', status: 'Active' },
      { id: 202, name: 'Private Law', status: 'Active' },
    ]
  },
  {
    id: 3,
    name: 'Faculty of Economics',
    departments: [
      { id: 301, name: 'Business Administration', status: 'Active' },
      { id: 302, name: 'Accounting', status: 'Inactive' },
    ]
  }
];

const FacultyRow = ({ faculty }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-4">
      <div 
        className="p-5 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-blue-50 text-ulk-blue rounded-xl flex items-center justify-center">
            <FolderOpen size={20} />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-lg">{faculty.name}</h3>
            <p className="text-sm text-slate-500">{faculty.departments.length} Departments</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
            <button className="p-2 text-slate-400 hover:text-ulk-blue hover:bg-blue-50 rounded-lg transition-colors">
              <Edit2 size={16} />
            </button>
            <button className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
              <Trash2 size={16} />
            </button>
          </div>
          <ChevronDown 
            size={20} 
            className={`text-slate-400 transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`} 
          />
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-slate-100 bg-slate-50/50"
          >
            <div className="p-5 pl-20 space-y-3">
              {faculty.departments.map(dept => (
                <div key={dept.id} className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-100">
                  <div>
                    <h4 className="font-medium text-slate-700">{dept.name}</h4>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${
                      dept.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-slate-200 text-slate-600'
                    }`}>
                      {dept.status}
                    </span>
                    <button className="text-slate-400 hover:text-ulk-blue">
                      <Edit2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
              <button className="mt-2 flex items-center gap-2 text-sm font-bold text-ulk-blue hover:text-ulk-blue-light transition-colors">
                <Plus size={16} /> Add Department
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Faculties = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-800">Faculties Management</h1>
        <button className="flex items-center gap-2 px-4 py-2 bg-ulk-blue text-white rounded-xl hover:bg-ulk-blue-dark transition-colors font-medium text-sm shadow-sm">
          <Plus size={16} /> Add Faculty
        </button>
      </div>

      <div className="space-y-4">
        {MOCK_FACULTIES.map(faculty => (
          <FacultyRow key={faculty.id} faculty={faculty} />
        ))}
      </div>
    </div>
  );
};

export default Faculties;
