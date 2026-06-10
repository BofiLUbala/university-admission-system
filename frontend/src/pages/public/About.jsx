import { useSettings } from '../../context/settingsContext';

const About = () => {
  const { t } = useSettings();
  return (
    <div className="container mx-auto px-4 lg:px-8 py-24 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-ulk-blue mb-8">{t.aboutTitle}</h1>
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-neutral-100 prose max-w-none">
          <p className="text-lg text-neutral-600 mb-6">
            {t.aboutDesc}
          </p>
          <h2 className="text-2xl font-bold text-neutral-800 mt-8 mb-4">{t.missionTitle}</h2>
          <p className="text-neutral-600 mb-6">
            {t.missionDesc}
          </p>
          <h2 className="text-2xl font-bold text-neutral-800 mt-8 mb-4">{t.visionTitle}</h2>
          <p className="text-neutral-600 mb-6">
            {t.visionDesc}
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
