import { useEffect, useMemo, useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, ArrowRight, ArrowLeft, Camera, Upload, Check } from 'lucide-react';
import { useSettings } from '../../context/settingsContext';

const getSteps = (t) => [
  { id: 1, title: t.formPersonalInfo },
  { id: 2, title: t.formParentInfo },
  { id: 3, title: t.formAcademicBg },
  { id: 4, title: t.formProgramSelection }
];

const fallbackCountryCodes = [
  'AD', 'AE', 'AF', 'AG', 'AI', 'AL', 'AM', 'AO', 'AR', 'AS', 'AT', 'AU', 'AW', 'AX', 'AZ',
  'BA', 'BB', 'BD', 'BE', 'BF', 'BG', 'BH', 'BI', 'BJ', 'BL', 'BM', 'BN', 'BO', 'BQ', 'BR',
  'BS', 'BT', 'BW', 'BY', 'BZ', 'CA', 'CC', 'CD', 'CF', 'CG', 'CH', 'CI', 'CK', 'CL', 'CM',
  'CN', 'CO', 'CR', 'CU', 'CV', 'CW', 'CX', 'CY', 'CZ', 'DE', 'DJ', 'DK', 'DM', 'DO', 'DZ',
  'EC', 'EE', 'EG', 'EH', 'ER', 'ES', 'ET', 'FI', 'FJ', 'FK', 'FM', 'FO', 'FR', 'GA', 'GB',
  'GD', 'GE', 'GF', 'GG', 'GH', 'GI', 'GL', 'GM', 'GN', 'GP', 'GQ', 'GR', 'GT', 'GU', 'GW',
  'GY', 'HK', 'HN', 'HR', 'HT', 'HU', 'ID', 'IE', 'IL', 'IM', 'IN', 'IO', 'IQ', 'IR', 'IS',
  'IT', 'JE', 'JM', 'JO', 'JP', 'KE', 'KG', 'KH', 'KI', 'KM', 'KN', 'KP', 'KR', 'KW', 'KY',
  'KZ', 'LA', 'LB', 'LC', 'LI', 'LK', 'LR', 'LS', 'LT', 'LU', 'LV', 'LY', 'MA', 'MC', 'MD',
  'ME', 'MF', 'MG', 'MH', 'MK', 'ML', 'MM', 'MN', 'MO', 'MP', 'MQ', 'MR', 'MS', 'MT', 'MU',
  'MV', 'MW', 'MX', 'MY', 'MZ', 'NA', 'NC', 'NE', 'NF', 'NG', 'NI', 'NL', 'NO', 'NP', 'NR',
  'NU', 'NZ', 'OM', 'PA', 'PE', 'PF', 'PG', 'PH', 'PK', 'PL', 'PM', 'PN', 'PR', 'PS', 'PT',
  'PW', 'PY', 'QA', 'RE', 'RO', 'RS', 'RU', 'RW', 'SA', 'SB', 'SC', 'SD', 'SE', 'SG', 'SH',
  'SI', 'SJ', 'SK', 'SL', 'SM', 'SN', 'SO', 'SR', 'SS', 'ST', 'SV', 'SX', 'SY', 'SZ', 'TC',
  'TD', 'TG', 'TH', 'TJ', 'TK', 'TL', 'TM', 'TN', 'TO', 'TR', 'TT', 'TV', 'TW', 'TZ', 'UA',
  'UG', 'US', 'UY', 'UZ', 'VA', 'VC', 'VE', 'VG', 'VI', 'VN', 'VU', 'WF', 'WS', 'YE', 'YT',
  'ZA', 'ZM', 'ZW'
];

const getCountryOptions = () => {
  const regionNames = typeof Intl.DisplayNames === 'function'
    ? new Intl.DisplayNames(['en'], { type: 'region' })
    : null;
  let regionCodes = fallbackCountryCodes;

  if (typeof Intl.supportedValuesOf === 'function') {
    try {
      regionCodes = Intl.supportedValuesOf('region');
    } catch {
      regionCodes = fallbackCountryCodes;
    }
  }

  return regionCodes
    .filter((code) => /^[A-Z]{2}$/.test(code))
    .map((code) => ({
      code,
      name: regionNames?.of(code) || code,
      flag: code
        .split('')
        .map((letter) => String.fromCodePoint(127397 + letter.charCodeAt(0)))
        .join('')
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
};

const countryOptions = getCountryOptions();

const fieldsByStep = {
  1: [
    'fullName',
    'gender',
    'dob',
    'maritalStatus',
    'nationality',
    'disabilityCondition',
    'permanentCountry',
    'currentCountry',
    'permanentResidence',
    'currentResidence',
    'phone',
    'email'
  ],
  2: ['parentFullName', 'parentRelationship', 'parentPhone', 'parentEmail', 'parentAddress'],
  3: ['previousSchool', 'section', 'percentage'],
  4: ['faculty', 'department']
};

const RequiredMark = () => <span className="text-red-600">*</span>;

// Use a ref to track if this is the initial mount
// This helps us avoid clearing state on first render but clear on return visits
const initialDraftState = {
  currentStep: 1,
  values: {},
  profilePhoto: null,
  profilePhotoPreview: '',
  sameResidence: false,
  sameCountry: false
};

// Store draft in sessionStorage for persistence during session
const getStoredDraft = () => {
  try {
    const stored = sessionStorage.getItem('admissionFormDraft');
    if (stored) {
      const parsed = JSON.parse(stored);
      // Note: profilePhoto File object cannot be serialized, so we start fresh for that
      return {
        ...initialDraftState,
        ...parsed,
        profilePhoto: null,
        profilePhotoPreview: ''
      };
    }
  } catch (e) {
    console.error('Failed to load draft from sessionStorage:', e);
  }
  return { ...initialDraftState };
};

let admissionFormDraft = getStoredDraft();

const AdmissionForm = () => {
  const { t } = useSettings();
  const steps = useMemo(() => getSteps(t), [t]);
  const [currentStep, setCurrentStep] = useState(admissionFormDraft.currentStep);
  const [profilePhoto, setProfilePhoto] = useState(admissionFormDraft.profilePhoto);
  const [profilePhotoPreview, setProfilePhotoPreview] = useState(admissionFormDraft.profilePhotoPreview);
  const [sameResidence, setSameResidence] = useState(admissionFormDraft.sameResidence);
  const [sameCountry, setSameCountry] = useState(admissionFormDraft.sameCountry);
  const [emptySubmitError, setEmptySubmitError] = useState('');
  const [profilePhotoError, setProfilePhotoError] = useState('');
  const { register, handleSubmit, watch, getValues, setValue, trigger, formState: { errors } } = useForm({
    defaultValues: admissionFormDraft.values
  });

  const permanentResidence = watch('permanentResidence');
  const permanentCountry = watch('permanentCountry');
  const countrySelectOptions = useMemo(() => countryOptions, []);

  useEffect(() => {
    const subscription = watch((values) => {
      admissionFormDraft = {
        ...admissionFormDraft,
        values
      };
    });

    return () => subscription.unsubscribe();
  }, [watch]);

  useEffect(() => {
    admissionFormDraft = {
      ...admissionFormDraft,
      currentStep,
      sameResidence,
      sameCountry
    };
    
    // Save draft to sessionStorage (excluding File objects)
    try {
      const draftToSave = {
        ...admissionFormDraft,
        profilePhoto: null, // Cannot serialize File objects
        profilePhotoPreview: '' // Clear preview URL for security
      };
      sessionStorage.setItem('admissionFormDraft', JSON.stringify(draftToSave));
    } catch (e) {
      console.error('Failed to save draft to sessionStorage:', e);
    }
  }, [currentStep, sameResidence, sameCountry, watch]);

  // Clear form draft when component unmounts (user navigates away)
  // This ensures when user returns, they start fresh unless they explicitly saved
  useEffect(() => {
    return () => {
      // Clear the module-level state on unmount
      admissionFormDraft = { ...initialDraftState };
      sessionStorage.removeItem('admissionFormDraft');
    };
  }, []);

  useEffect(() => {
    if (sameResidence) {
      setValue('currentResidence', permanentResidence || '', {
        shouldDirty: true,
        shouldValidate: true
      });
    }
  }, [permanentResidence, sameResidence, setValue]);

  useEffect(() => {
    if (sameCountry) {
      setValue('currentCountry', permanentCountry || '', {
        shouldDirty: true,
        shouldValidate: true
      });
    }
  }, [permanentCountry, sameCountry, setValue]);

  const onSubmit = (data) => {
    setEmptySubmitError('');
    console.log({ ...data, profilePhoto });
    alert('Application submitted successfully!');
  };

  const handleFormSubmit = (event) => {
    const values = getValues();
    const isEmpty = !Object.values(values).some((value) => {
      if (value === null || value === undefined) return false;
      return String(value).trim() !== '';
    }) && !profilePhoto;

    if (isEmpty) {
      event.preventDefault();
      setEmptySubmitError(t.formEmptyError);
      return;
    }

    if (!profilePhoto) {
      event.preventDefault();
      setProfilePhotoError(t.formPhotoRequired);
      return;
    }

    setEmptySubmitError('');
    handleSubmit(onSubmit)(event);
  };

  const nextStep = async () => {
    if (currentStep === 1 && !profilePhoto) {
      setProfilePhotoError(t.formPhotoRequired);
      return;
    }

    const stepIsValid = await trigger(fieldsByStep[currentStep] || []);
    if (!stepIsValid) return;

    setEmptySubmitError('');
    setCurrentStep((prev) => Math.min(prev + 1, steps.length));
  };
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const handleProfilePhotoChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setProfilePhoto(file);
    setProfilePhotoPreview((currentPreview) => {
      if (currentPreview?.startsWith('blob:')) {
        URL.revokeObjectURL(currentPreview);
      }
      return previewUrl;
    });
    setEmptySubmitError('');
    setProfilePhotoError('');
  };

  const handleSameResidenceToggle = () => {
    setSameResidence((current) => {
      const next = !current;

      if (next) {
        setValue('currentResidence', getValues('permanentResidence') || '', {
          shouldDirty: true,
          shouldValidate: true
        });
      }

      return next;
    });
  };

  const handleSameCountryToggle = () => {
    setSameCountry((current) => {
      const next = !current;

      if (next) {
        setValue('currentCountry', getValues('permanentCountry') || '', {
          shouldDirty: true,
          shouldValidate: true
        });
      }

      return next;
    });
  };

  const renderCountryOptions = () => (
    <>
      <option value="">{t.formSelectCountry}</option>
      {countrySelectOptions.map((country) => (
        <option key={country.code} value={country.name}>
          {country.flag} {country.name}
        </option>
      ))}
    </>
  );

  return (
    <div className="max-w-4xl mx-auto">
      {/* Stepper */}
      <div className="mb-8">
        <div className="flex items-center justify-between relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-neutral-200 rounded-full -z-10"></div>
          <div 
            className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-ulk-blue rounded-full -z-10 transition-all duration-500 ease-in-out"
            style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
          ></div>
          
          {steps.map((step) => (
            <div key={step.id} className="flex flex-col items-center gap-2 bg-neutral-50 px-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-4 transition-colors duration-300 ${
                currentStep >= step.id 
                  ? 'bg-ulk-blue border-white text-white shadow-md' 
                  : 'bg-neutral-200 border-white text-neutral-500'
              }`}>
                {step.id}
              </div>
              <span className={`text-xs font-medium hidden sm:block ${currentStep >= step.id ? 'text-ulk-blue' : 'text-neutral-500'}`}>
                {step.title}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-neutral-200 p-6 md:p-10">
        <form onSubmit={handleFormSubmit}>
          <AnimatePresence mode="wait">
            
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h3 className="text-2xl font-bold text-neutral-800 mb-6">{t.formPersonalInfo}</h3>
                <div className="flex flex-col sm:flex-row sm:items-center gap-5 rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
                  <div className="h-24 w-24 shrink-0 overflow-hidden rounded-full border-4 border-white bg-white shadow-sm flex items-center justify-center">
                    {profilePhotoPreview ? (
                      <img
                        src={profilePhotoPreview}
                        alt="Profile preview"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Camera className="text-neutral-400" size={34} />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <label className="block text-sm font-medium text-neutral-700 mb-2">{t.formProfilePicture}</label>
                    <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-ulk-blue px-4 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-ulk-blue-dark">
                      <Upload size={16} />
                      {t.formChoosePhoto}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleProfilePhotoChange}
                        className="sr-only"
                      />
                    </label>
                    {profilePhoto && (
                      <p className="mt-2 truncate text-sm text-neutral-500">{profilePhoto.name}</p>
                    )}
                  </div>
                </div>
                {profilePhotoError && (
                  <p className="-mt-3 text-sm font-medium text-red-600">{profilePhotoError}</p>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">{t.formFullName} <RequiredMark /></label>
                    <input
                      {...register("fullName", { required: true })}
                      className="w-full px-4 py-3 border border-neutral-200 rounded-xl bg-neutral-50 focus:bg-white focus:ring-2 focus:ring-ulk-blue focus:border-transparent transition-all outline-none"
                    />
                    {errors.fullName && <p className="mt-1 text-sm font-medium text-red-600">{t.formFullNameRequired}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">{t.formGender} <RequiredMark /></label>
                    <select
                      {...register("gender", { required: true })}
                      className="w-full px-4 py-3 border border-neutral-200 rounded-xl bg-neutral-50 focus:bg-white focus:ring-2 focus:ring-ulk-blue focus:border-transparent transition-all outline-none"
                    >
                      <option value="">{t.formSelectGender}</option>
                      <option value="M">{t.formMale}</option>
                      <option value="F">{t.formFemale}</option>
                    </select>
                    {errors.gender && <p className="mt-1 text-sm font-medium text-red-600">{t.formGenderRequired}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">{t.formMaritalStatus} <RequiredMark /></label>
                    <select
                      {...register("maritalStatus", { required: true })}
                      className="w-full px-4 py-3 border border-neutral-200 rounded-xl bg-neutral-50 focus:bg-white focus:ring-2 focus:ring-ulk-blue focus:border-transparent transition-all outline-none"
                    >
                      <option value="">{t.formSelectStatus}</option>
                      <option value="SINGLE">{t.formSingle}</option>
                      <option value="MARRIED">{t.formMarried}</option>
                      <option value="DIVORCED">{t.formDivorced}</option>
                      <option value="WIDOWED">{t.formWidowed}</option>
                    </select>
                    {errors.maritalStatus && <p className="mt-1 text-sm font-medium text-red-600">{t.formMaritalRequired}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">{t.formDob} <RequiredMark /></label>
                    <input
                      type="date"
                      {...register("dob", { required: true })}
                      className="w-full px-4 py-3 border border-neutral-200 rounded-xl bg-neutral-50 focus:bg-white focus:ring-2 focus:ring-ulk-blue focus:border-transparent transition-all outline-none"
                    />
                    {errors.dob && <p className="mt-1 text-sm font-medium text-red-600">{t.formDobRequired}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">{t.formNationality} <RequiredMark /></label>
                    <select
                      {...register("nationality", { required: true })}
                      className="w-full px-4 py-3 border border-neutral-200 rounded-xl bg-neutral-50 focus:bg-white focus:ring-2 focus:ring-ulk-blue focus:border-transparent transition-all outline-none"
                    >
                      {renderCountryOptions()}
                    </select>
                    {errors.nationality && <p className="mt-1 text-sm font-medium text-red-600">{t.formNationalityRequired}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">{t.formSecondNationality} <span className="text-neutral-400">{t.formOptional}</span></label>
                    <select
                      {...register("secondNationality")}
                      className="w-full px-4 py-3 border border-neutral-200 rounded-xl bg-neutral-50 focus:bg-white focus:ring-2 focus:ring-ulk-blue focus:border-transparent transition-all outline-none"
                    >
                      {renderCountryOptions()}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">{t.formDisability} <RequiredMark /></label>
                    <select
                      {...register("disabilityCondition", { required: true })}
                      className="w-full px-4 py-3 border border-neutral-200 rounded-xl bg-neutral-50 focus:bg-white focus:ring-2 focus:ring-ulk-blue focus:border-transparent transition-all outline-none"
                    >
                      <option value="">{t.formSelectCondition}</option>
                      <option value="NONE">{t.formNoDisability}</option>
                      <option value="PHYSICAL">{t.formPhysical}</option>
                      <option value="VISUAL">{t.formVisual}</option>
                      <option value="HEARING">{t.formHearing}</option>
                      <option value="LEARNING">{t.formLearning}</option>
                      <option value="OTHER">{t.formDisabilityOther}</option>
                    </select>
                    {errors.disabilityCondition && <p className="mt-1 text-sm font-medium text-red-600">{t.formDisabilityRequired}</p>}
                  </div>
                  <div className="md:col-span-2">
                    <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <label className="block text-sm font-medium text-neutral-700">{t.formPermanentCountry} <RequiredMark /></label>
                      <button
                        type="button"
                        onClick={handleSameCountryToggle}
                        className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition-all ${
                          sameCountry
                            ? 'bg-ulk-blue text-white shadow-sm'
                            : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                        }`}
                      >
                        <span className={`flex h-5 w-5 items-center justify-center rounded-md border ${
                          sameCountry ? 'border-white bg-white text-ulk-blue' : 'border-neutral-300 bg-white'
                        }`}>
                          {sameCountry && <Check size={14} />}
                        </span>
                        {t.formSameCountry}
                      </button>
                    </div>
                    <select
                      {...register("permanentCountry", { required: true })}
                      className="w-full px-4 py-3 border border-neutral-200 rounded-xl bg-neutral-50 focus:bg-white focus:ring-2 focus:ring-ulk-blue focus:border-transparent transition-all outline-none"
                    >
                      {renderCountryOptions()}
                    </select>
                    {errors.permanentCountry && <p className="mt-1 text-sm font-medium text-red-600">{t.formPermanentCountryRequired}</p>}
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-neutral-700 mb-1">{t.formCurrentCountry} <RequiredMark /></label>
                    <select
                      {...register("currentCountry", { required: true })}
                      disabled={sameCountry}
                      className={`w-full px-4 py-3 border border-neutral-200 rounded-xl bg-neutral-50 focus:bg-white focus:ring-2 focus:ring-ulk-blue focus:border-transparent transition-all outline-none ${
                        sameCountry ? 'cursor-not-allowed text-neutral-500' : ''
                      }`}
                    >
                      {renderCountryOptions()}
                    </select>
                    {errors.currentCountry && <p className="mt-1 text-sm font-medium text-red-600">{t.formCurrentCountryRequired}</p>}
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-neutral-700 mb-1">{t.formPermanentResidence} <RequiredMark /></label>
                    <input
                      {...register("permanentResidence", { required: true })}
                      className="w-full px-4 py-3 border border-neutral-200 rounded-xl bg-neutral-50 focus:bg-white focus:ring-2 focus:ring-ulk-blue focus:border-transparent transition-all outline-none"
                    />
                    {errors.permanentResidence && <p className="mt-1 text-sm font-medium text-red-600">{t.formPermanentResidenceRequired}</p>}
                  </div>
                  <div className="md:col-span-2">
                    <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <label className="block text-sm font-medium text-neutral-700">{t.formCurrentResidence} <RequiredMark /></label>
                      <button
                        type="button"
                        onClick={handleSameResidenceToggle}
                        className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition-all ${
                          sameResidence
                            ? 'bg-ulk-blue text-white shadow-sm'
                            : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                        }`}
                      >
                        <span className={`flex h-5 w-5 items-center justify-center rounded-md border ${
                          sameResidence ? 'border-white bg-white text-ulk-blue' : 'border-neutral-300 bg-white'
                        }`}>
                          {sameResidence && <Check size={14} />}
                        </span>
                        {t.formSameResidence}
                      </button>
                    </div>
                    <input
                      {...register("currentResidence", { required: true })}
                      readOnly={sameResidence}
                      className={`w-full px-4 py-3 border border-neutral-200 rounded-xl bg-neutral-50 focus:bg-white focus:ring-2 focus:ring-ulk-blue focus:border-transparent transition-all outline-none ${
                        sameResidence ? 'cursor-not-allowed text-neutral-500' : ''
                      }`}
                    />
                    {errors.currentResidence && <p className="mt-1 text-sm font-medium text-red-600">{t.formCurrentResidenceRequired}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">{t.formPhone} <RequiredMark /></label>
                    <input
                      {...register("phone", { required: true })}
                      className="w-full px-4 py-3 border border-neutral-200 rounded-xl bg-neutral-50 focus:bg-white focus:ring-2 focus:ring-ulk-blue focus:border-transparent transition-all outline-none"
                    />
                    {errors.phone && <p className="mt-1 text-sm font-medium text-red-600">{t.formPhoneRequired}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">{t.formEmail} <RequiredMark /></label>
                    <input
                      type="email"
                      {...register("email", { required: true })}
                      className="w-full px-4 py-3 border border-neutral-200 rounded-xl bg-neutral-50 focus:bg-white focus:ring-2 focus:ring-ulk-blue focus:border-transparent transition-all outline-none"
                    />
                    {errors.email && <p className="mt-1 text-sm font-medium text-red-600">{t.formEmailRequired}</p>}
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h3 className="text-2xl font-bold text-neutral-800 mb-6">{t.formParentInfo}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">{t.formParentName} <RequiredMark /></label>
                    <input
                      {...register("parentFullName", { required: true })}
                      className="w-full px-4 py-3 border border-neutral-200 rounded-xl bg-neutral-50 focus:bg-white focus:ring-2 focus:ring-ulk-blue focus:border-transparent transition-all outline-none"
                    />
                    {errors.parentFullName && <p className="mt-1 text-sm font-medium text-red-600">{t.formParentNameRequired}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">{t.formRelationship} <RequiredMark /></label>
                    <select
                      {...register("parentRelationship", { required: true })}
                      className="w-full px-4 py-3 border border-neutral-200 rounded-xl bg-neutral-50 focus:bg-white focus:ring-2 focus:ring-ulk-blue focus:border-transparent transition-all outline-none"
                    >
                      <option value="">{t.formSelectRelationship}</option>
                      <option value="FATHER">{t.formFather}</option>
                      <option value="MOTHER">{t.formMother}</option>
                      <option value="GUARDIAN">{t.formGuardian}</option>
                      <option value="OTHER">{t.formDisabilityOther}</option>
                    </select>
                    {errors.parentRelationship && <p className="mt-1 text-sm font-medium text-red-600">{t.formRelationshipRequired}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">{t.formParentPhone} <RequiredMark /></label>
                    <input
                      {...register("parentPhone", { required: true })}
                      className="w-full px-4 py-3 border border-neutral-200 rounded-xl bg-neutral-50 focus:bg-white focus:ring-2 focus:ring-ulk-blue focus:border-transparent transition-all outline-none"
                    />
                    {errors.parentPhone && <p className="mt-1 text-sm font-medium text-red-600">{t.formParentPhoneRequired}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">{t.formParentEmail} <RequiredMark /></label>
                    <input
                      type="email"
                      {...register("parentEmail", { required: true })}
                      className="w-full px-4 py-3 border border-neutral-200 rounded-xl bg-neutral-50 focus:bg-white focus:ring-2 focus:ring-ulk-blue focus:border-transparent transition-all outline-none"
                    />
                    {errors.parentEmail && <p className="mt-1 text-sm font-medium text-red-600">{t.formParentEmailRequired}</p>}
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-neutral-700 mb-1">{t.formParentAddress} <RequiredMark /></label>
                    <input
                      {...register("parentAddress", { required: true })}
                      className="w-full px-4 py-3 border border-neutral-200 rounded-xl bg-neutral-50 focus:bg-white focus:ring-2 focus:ring-ulk-blue focus:border-transparent transition-all outline-none"
                    />
                    {errors.parentAddress && <p className="mt-1 text-sm font-medium text-red-600">{t.formParentAddressRequired}</p>}
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h3 className="text-2xl font-bold text-neutral-800 mb-6">{t.formAcademicBg}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-neutral-700 mb-1">{t.formPreviousSchool} <RequiredMark /></label>
                    <input
                      {...register("previousSchool", { required: true })}
                      className="w-full px-4 py-3 border border-neutral-200 rounded-xl bg-neutral-50 focus:bg-white focus:ring-2 focus:ring-ulk-blue focus:border-transparent transition-all outline-none"
                    />
                    {errors.previousSchool && <p className="mt-1 text-sm font-medium text-red-600">{t.formPreviousSchoolRequired}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">{t.formSection} <RequiredMark /></label>
                    <input
                      {...register("section", { required: true })}
                      className="w-full px-4 py-3 border border-neutral-200 rounded-xl bg-neutral-50 focus:bg-white focus:ring-2 focus:ring-ulk-blue focus:border-transparent transition-all outline-none"
                    />
                    {errors.section && <p className="mt-1 text-sm font-medium text-red-600">{t.formSectionRequired}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">{t.formPercentage} <RequiredMark /></label>
                    <input
                      type="number"
                      step="0.1"
                      {...register("percentage", { required: true })}
                      className="w-full px-4 py-3 border border-neutral-200 rounded-xl bg-neutral-50 focus:bg-white focus:ring-2 focus:ring-ulk-blue focus:border-transparent transition-all outline-none"
                    />
                    {errors.percentage && <p className="mt-1 text-sm font-medium text-red-600">{t.formPercentageRequired}</p>}
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h3 className="text-2xl font-bold text-neutral-800 mb-6">{t.formProgramSelection}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">{t.formFaculty} <RequiredMark /></label>
                    <select
                      {...register("faculty", { required: true })}
                      className="w-full px-4 py-3 border border-neutral-200 rounded-xl bg-neutral-50 focus:bg-white focus:ring-2 focus:ring-ulk-blue focus:border-transparent transition-all outline-none"
                    >
                      <option value="">{t.formSelectFaculty}</option>
                      <option value="1">Faculty of Computer Science</option>
                      <option value="2">Faculty of Law</option>
                      <option value="3">Faculty of Economics</option>
                    </select>
                    {errors.faculty && <p className="mt-1 text-sm font-medium text-red-600">{t.formFacultyRequired}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">{t.formDepartment} <RequiredMark /></label>
                    <select
                      {...register("department", { required: true })}
                      className="w-full px-4 py-3 border border-neutral-200 rounded-xl bg-neutral-50 focus:bg-white focus:ring-2 focus:ring-ulk-blue focus:border-transparent transition-all outline-none"
                    >
                      <option value="">{t.formSelectDepartment}</option>
                      <option value="1">Software Engineering</option>
                      <option value="2">Network Engineering</option>
                    </select>
                    {errors.department && <p className="mt-1 text-sm font-medium text-red-600">{t.formDepartmentRequired}</p>}
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>

          {emptySubmitError && (
            <p className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {emptySubmitError}
            </p>
          )}

          <div className="mt-10 flex items-center justify-between border-t border-neutral-100 pt-6">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all ${
                currentStep === 1 ? 'text-neutral-400 cursor-not-allowed' : 'text-ulk-blue bg-blue-50 hover:bg-blue-100'
              }`}
            >
              <ArrowLeft size={18} /> {t.formBack}
            </button>
            
            <div className="flex gap-4">
              <button
                type="button"
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-neutral-600 bg-neutral-100 hover:bg-neutral-200 transition-all"
              >
                <Save size={18} /> {t.formSaveDraft}
              </button>
              
              {currentStep < steps.length ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-white bg-ulk-blue hover:bg-ulk-blue-dark shadow-md transition-all"
                >
                  {t.formNext} <ArrowRight size={18} />
                </button>
              ) : (
                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-ulk-blue-dark bg-ulk-gold hover:bg-yellow-400 shadow-md transition-all"
                >
                  {t.formSubmit}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdmissionForm;
