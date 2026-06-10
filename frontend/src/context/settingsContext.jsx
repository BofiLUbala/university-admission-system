import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const defaultSettings = {
  language: 'en',
  background: 'steel',
  theme: 'light'
};

export const backgroundClasses = {
  steel: 'bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.16),transparent_34%),linear-gradient(135deg,#f8fafc_0%,#e5e7eb_45%,#cbd5e1_100%)]',
  circuit: 'bg-[linear-gradient(90deg,rgba(15,23,42,0.06)_1px,transparent_1px),linear-gradient(0deg,rgba(15,23,42,0.06)_1px,transparent_1px),linear-gradient(135deg,#f8fafc,#dbeafe)] bg-[size:34px_34px,34px_34px,auto]',
  warehouse: 'bg-[repeating-linear-gradient(135deg,rgba(245,158,11,0.12)_0_12px,transparent_12px_24px),linear-gradient(135deg,#fafafa,#d4d4d8)]',
  carbon: 'bg-[radial-gradient(circle_at_20%_20%,rgba(250,204,21,0.14),transparent_28%),repeating-linear-gradient(45deg,#f5f5f5_0_10px,#e5e7eb_10px_20px)]',
  deepSea: 'bg-[radial-gradient(circle_at_20%_10%,rgba(20,184,166,0.24),transparent_32%),radial-gradient(circle_at_80%_30%,rgba(59,130,246,0.22),transparent_30%),linear-gradient(135deg,#061826_0%,#0f3b52_48%,#082f49_100%)]',
  iron: 'bg-[repeating-linear-gradient(90deg,rgba(15,23,42,0.12)_0_2px,transparent_2px_18px),radial-gradient(circle_at_70%_15%,rgba(244,211,94,0.16),transparent_30%),linear-gradient(135deg,#d1d5db_0%,#71717a_52%,#27272a_100%)]'
};

export const translations = {
  en: {
    dashboard: 'Dashboard',
    admissionForm: 'Admission Form',
    documents: 'Documents',
    settings: 'Settings',
    student: 'Student',
    portal: 'Portal',
    studentPortal: 'Student Portal',
    logout: 'Logout',
    applicant: 'Applicant',
    applicationStatus: 'Application Status',
    academicYear: 'Academic Year 2026-2027',
    draft: 'Draft',
    submitted: 'Submitted',
    underReview: 'Under Review',
    decision: 'Decision',
    continueApplication: 'Continue Application',
    requiredDocuments: 'Required Documents',
    identityCard: 'Identity Card',
    academicTranscript: 'Academic Transcript',
    passportPhoto: 'Passport Photo',
    uploadMissing: 'Upload Missing',
    recentNotifications: 'Recent Notifications',
    settingsIntro: 'Choose your working language and dashboard background.',
    language: 'Language',
    industrialBackground: 'Industrial Background',
    appearance: 'Appearance',
    lightMode: 'Light Mode',
    darkMode: 'Dark Mode'
  },
  fr: {
    dashboard: 'Tableau de bord',
    admissionForm: 'Formulaire admission',
    documents: 'Documents',
    settings: 'Parametres',
    student: 'Etudiant',
    portal: 'Portail',
    studentPortal: 'Portail Etudiant',
    logout: 'Deconnexion',
    applicant: 'Candidat',
    applicationStatus: 'Statut de candidature',
    academicYear: 'Annee academique 2026-2027',
    draft: 'Brouillon',
    submitted: 'Soumis',
    underReview: 'En revision',
    decision: 'Decision',
    continueApplication: 'Continuer la candidature',
    requiredDocuments: 'Documents requis',
    identityCard: 'Carte d identite',
    academicTranscript: 'Releve de notes',
    passportPhoto: 'Photo passeport',
    uploadMissing: 'Televerser les manquants',
    recentNotifications: 'Notifications recentes',
    settingsIntro: 'Choisissez votre langue de travail et l arriere-plan.',
    language: 'Langue',
    industrialBackground: 'Arriere-plan industriel',
    appearance: 'Apparence',
    lightMode: 'Mode clair',
    darkMode: 'Mode sombre'
  },
  sw: {
    dashboard: 'Dashibodi',
    admissionForm: 'Fomu ya maombi',
    documents: 'Nyaraka',
    settings: 'Mipangilio',
    student: 'Mwanafunzi',
    portal: 'Tovuti',
    studentPortal: 'Tovuti ya Mwanafunzi',
    logout: 'Toka',
    applicant: 'Mwombaji',
    applicationStatus: 'Hali ya maombi',
    academicYear: 'Mwaka wa masomo 2026-2027',
    draft: 'Rasimu',
    submitted: 'Imewasilishwa',
    underReview: 'Inakaguliwa',
    decision: 'Uamuzi',
    continueApplication: 'Endelea na maombi',
    requiredDocuments: 'Nyaraka zinazohitajika',
    identityCard: 'Kitambulisho',
    academicTranscript: 'Matokeo ya masomo',
    passportPhoto: 'Picha ya pasipoti',
    uploadMissing: 'Pakia zilizokosekana',
    recentNotifications: 'Taarifa za hivi karibuni',
    settingsIntro: 'Chagua lugha ya kazi na mandharinyuma.',
    language: 'Lugha',
    industrialBackground: 'Mandharinyuma ya viwanda',
    appearance: 'Muonekano',
    lightMode: 'Hali angavu',
    darkMode: 'Hali nyeusi'
  },
  ln: {
    dashboard: 'Etando',
    admissionForm: 'Formilere ya kokota',
    documents: 'Mikanda',
    settings: 'Bobongisi',
    student: 'Moyekoli',
    portal: 'Portal',
    studentPortal: 'Portal ya Moyekoli',
    logout: 'Bima',
    applicant: 'Mosengi',
    applicationStatus: 'Ezaleli ya bosengi',
    academicYear: 'Mobu ya kelasi 2026-2027',
    draft: 'Brouillon',
    submitted: 'Etindami',
    underReview: 'Na botali',
    decision: 'Ekateli',
    continueApplication: 'Koba bosengi',
    requiredDocuments: 'Mikanda esengeli',
    identityCard: 'Carte ya identité',
    academicTranscript: 'Releve ya kelasi',
    passportPhoto: 'Foto passeport',
    uploadMissing: 'Tia oyo ezangi',
    recentNotifications: 'Mayebisi ya sika',
    settingsIntro: 'Pona monoko ya mosala mpe fond.',
    language: 'Monoko',
    industrialBackground: 'Fond industriel',
    appearance: 'Lolenge',
    lightMode: 'Mode polele',
    darkMode: 'Mode molili'
  },
  lua: {
    dashboard: 'Dashboard',
    admissionForm: 'Fomu wa kuyila',
    documents: 'Mikanda',
    settings: 'Malongolodi',
    student: 'Muyidi',
    portal: 'Portal',
    studentPortal: 'Portal wa Muyidi',
    logout: 'Bika',
    applicant: 'Musengi',
    applicationStatus: 'Malu a busengi',
    academicYear: 'Tshidimu tsha masomo 2026-2027',
    draft: 'Brouillon',
    submitted: 'Bitumibwe',
    underReview: 'Bidi bitangila',
    decision: 'Tshibelu',
    continueApplication: 'Kobesha busengi',
    requiredDocuments: 'Mikanda idi ikengela',
    identityCard: 'Carte d identite',
    academicTranscript: 'Releve wa masomo',
    passportPhoto: 'Foto passeport',
    uploadMissing: 'Tuma bidi bipanga',
    recentNotifications: 'Mayebisha a nshikidilu',
    settingsIntro: 'Sola munu wa mudimu ne fond.',
    language: 'Munu',
    industrialBackground: 'Fond industriel',
    appearance: 'Muenekelu',
    lightMode: 'Mode wa butoke',
    darkMode: 'Mode wa mudima'
  },
  kg: {
    dashboard: 'Dashboard',
    admissionForm: 'Fomu ya kukota',
    documents: 'Mikanda',
    settings: 'Bibongisila',
    student: 'Longoki',
    portal: 'Portal',
    studentPortal: 'Portal ya Longoki',
    logout: 'Basika',
    applicant: 'Nsengi',
    applicationStatus: 'Kifuani kia nsengolo',
    academicYear: 'Mvu ya malongi 2026-2027',
    draft: 'Brouillon',
    submitted: 'Yatumama',
    underReview: 'Na tala',
    decision: 'Nzengolo',
    continueApplication: 'Landila nsengolo',
    requiredDocuments: 'Mikanda mi mfunu',
    identityCard: 'Carte ya identité',
    academicTranscript: 'Releve ya malongi',
    passportPhoto: 'Foto passeport',
    uploadMissing: 'Tula yina kele ve',
    recentNotifications: 'Mayebisi ya mpa',
    settingsIntro: 'Sola ndinga ya kisalu mpe fond.',
    language: 'Ndinga',
    industrialBackground: 'Fond industriel',
    appearance: 'Monika',
    lightMode: 'Mode ya nsemo',
    darkMode: 'Mode ya mpimpa'
  }
};

const SettingsContext = createContext(null);

const getStoredSettings = () => {
  try {
    const storedSettings = {
      ...defaultSettings,
      ...JSON.parse(localStorage.getItem('ulk_student_settings'))
    };

    if (storedSettings.language === 'rw') {
      storedSettings.language = 'ln';
    }

    return storedSettings;
  } catch {
    return defaultSettings;
  }
};

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(getStoredSettings);

  const backgroundClass = useMemo(
    () => `${backgroundClasses[settings.background] || backgroundClasses.steel} ${settings.theme === 'dark' ? 'theme-dark-surface' : ''}`,
    [settings]
  );

  useEffect(() => {
    localStorage.setItem('ulk_student_settings', JSON.stringify(settings));
    document.documentElement.lang = settings.language;
    document.documentElement.classList.toggle('theme-dark', settings.theme === 'dark');


  }, [settings, backgroundClass]);

  const value = useMemo(() => {
    const t = translations[settings.language] || translations.en;

    return {
      settings,
      t,
      backgroundClass,
      updateSetting: (key, value) => setSettings((current) => ({ ...current, [key]: value }))
    };
  }, [settings, backgroundClass]);

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);
