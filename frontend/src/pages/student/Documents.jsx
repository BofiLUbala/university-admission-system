import { useEffect, useState } from 'react';
import { Upload, FileText, CheckCircle, X, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSettings } from '../../context/settingsContext';

// Initial empty state
const initialDocumentState = {};

// Store draft in sessionStorage for persistence during session
const getStoredDocumentDraft = () => {
  try {
    const stored = sessionStorage.getItem('documentUploadDraft');
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Failed to load document draft from sessionStorage:', e);
  }
  return { ...initialDocumentState };
};

let documentUploadDraft = getStoredDocumentDraft();

const requiredDocs = (t) => [
  { id: 'diploma', name: t.docDiploma, required: true },
  { id: 'transcript', name: t.docTranscript, required: true },
  { id: 'photo', name: t.docPhoto, required: true },
  { id: 'id_card', name: t.docIdCard, required: true },
  { id: 'birth_cert', name: t.docBirthCert, required: false },
];

const Documents = () => {
  const { t } = useSettings();
  const [uploadedFiles, setUploadedFiles] = useState(documentUploadDraft);
  const docs = requiredDocs(t);

  useEffect(() => {
    documentUploadDraft = uploadedFiles;
    // Save draft to sessionStorage (only store file names, not File objects)
    try {
      const draftToSave = {};
      Object.keys(uploadedFiles).forEach(key => {
        const file = uploadedFiles[key];
        if (file && file.name) {
          draftToSave[key] = { name: file.name, size: file.size, type: file.type };
        }
      });
      sessionStorage.setItem('documentUploadDraft', JSON.stringify(draftToSave));
    } catch (e) {
      console.error('Failed to save document draft to sessionStorage:', e);
    }
  }, [uploadedFiles]);

  // Clear document draft when component unmounts (user navigates away)
  useEffect(() => {
    return () => {
      // Clear the module-level state on unmount
      documentUploadDraft = { ...initialDocumentState };
      sessionStorage.removeItem('documentUploadDraft');
    };
  }, []);

  const handleFileDrop = (docId, e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setUploadedFiles(prev => ({ ...prev, [docId]: file }));
    }
  };

  const handleFileInput = (docId, e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedFiles(prev => ({ ...prev, [docId]: file }));
    }
  };

  const removeFile = (docId) => {
    setUploadedFiles(prev => {
      const newFiles = { ...prev };
      delete newFiles[docId];
      return newFiles;
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-neutral-200">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-neutral-900">{t.docTitle}</h2>
          <p className="text-neutral-500 mt-2">{t.docDesc}</p>
        </div>

        <div className="space-y-6">
          {docs.map(doc => (
            <div key={doc.id} className="border border-neutral-200 rounded-2xl p-4 transition-all hover:border-ulk-blue/30 bg-neutral-50/50">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  <h4 className="font-bold text-neutral-800 flex items-center gap-2">
                    {doc.name} 
                    {doc.required && <span className="text-xs font-bold text-red-500 px-2 py-0.5 bg-red-50 rounded-full">{t.docRequired}</span>}
                  </h4>
                  <p className="text-sm text-neutral-500 mt-1">
                    {uploadedFiles[doc.id] ? `${t.docSelected}: ${uploadedFiles[doc.id].name}` : t.docNoFile}
                  </p>
                </div>

                <div className="w-full md:w-auto">
                  {uploadedFiles[doc.id] ? (
                    <motion.div 
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="flex items-center gap-3 bg-green-50 text-green-700 px-4 py-2 rounded-xl border border-green-200"
                    >
                      <CheckCircle size={18} />
                      <span className="text-sm font-bold">{t.docUploaded}</span>
                      <button onClick={() => removeFile(doc.id)} className="ml-2 text-red-500 hover:bg-red-100 p-1 rounded-lg transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </motion.div>
                  ) : (
                    <div 
                      className="relative flex items-center justify-center p-4 border-2 border-dashed border-neutral-300 rounded-xl hover:bg-ulk-blue/5 hover:border-ulk-blue transition-colors cursor-pointer"
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => handleFileDrop(doc.id, e)}
                    >
                      <input 
                        type="file" 
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        onChange={(e) => handleFileInput(doc.id, e)}
                        accept=".pdf,.jpg,.jpeg,.png"
                      />
                      <div className="flex flex-col items-center gap-1 text-ulk-blue">
                        <Upload size={20} />
                        <span className="text-xs font-medium">{t.docClickOrDrag}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 pt-6 border-t border-neutral-100 flex justify-end">
          <button className="bg-ulk-blue text-white px-8 py-3 rounded-xl font-bold shadow-md hover:bg-ulk-blue-dark transition-all flex items-center gap-2">
            {t.docSubmit}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Documents;
