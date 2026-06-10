import { Check, Factory, Languages, Moon, Sun } from 'lucide-react';
import { useSettings } from '../../context/settingsContext';

const getLanguages = (t) => {
  return [
  { code: 'en', name: t.langEn },
  { code: 'fr', name: t.langFr },
  { code: 'sw', name: t.langSw },
  { code: 'ln', name: t.langLn },
  { code: 'lua', name: t.langLua },
  { code: 'kg', name: t.langKg }
];};

const getBackgrounds = (t) => {
  return [
  {
    id: 'steel',
    name: t.bgSteel,
    preview: 'bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.38),transparent_34%),linear-gradient(135deg,#f8fafc_0%,#e5e7eb_45%,#94a3b8_100%)]'
  },
  {
    id: 'circuit',
    name: t.bgCircuit,
    preview: 'bg-[linear-gradient(90deg,rgba(15,23,42,0.18)_1px,transparent_1px),linear-gradient(0deg,rgba(15,23,42,0.18)_1px,transparent_1px),linear-gradient(135deg,#f8fafc,#bfdbfe)] bg-[size:22px_22px,22px_22px,auto]'
  },
  {
    id: 'warehouse',
    name: t.bgWarehouse,
    preview: 'bg-[repeating-linear-gradient(135deg,rgba(245,158,11,0.32)_0_12px,transparent_12px_24px),linear-gradient(135deg,#fafafa,#a1a1aa)]'
  },
  {
    id: 'carbon',
    name: t.bgCarbon,
    preview: 'bg-[radial-gradient(circle_at_20%_20%,rgba(250,204,21,0.3),transparent_28%),repeating-linear-gradient(45deg,#f5f5f5_0_10px,#d4d4d8_10px_20px)]'
  },
  {
    id: 'deepSea',
    name: t.bgDeepSea,
    preview: 'bg-[radial-gradient(circle_at_20%_10%,rgba(20,184,166,0.36),transparent_32%),radial-gradient(circle_at_80%_30%,rgba(59,130,246,0.32),transparent_30%),linear-gradient(135deg,#061826_0%,#0f3b52_48%,#082f49_100%)]'
  },
  {
    id: 'iron',
    name: t.bgIron,
    preview: 'bg-[repeating-linear-gradient(90deg,rgba(15,23,42,0.2)_0_2px,transparent_2px_18px),radial-gradient(circle_at_70%_15%,rgba(244,211,94,0.22),transparent_30%),linear-gradient(135deg,#d1d5db_0%,#71717a_52%,#27272a_100%)]'
  }
];};

const Settings = () => {
  const { settings, t, updateSetting } = useSettings();
  const languages = getLanguages(t);
  const backgrounds = getBackgrounds(t);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-neutral-900">{t.settings}</h3>
        <p className="mt-1 text-sm text-neutral-600">{t.settingsIntro}</p>
      </div>

      <section className="bg-white/90 rounded-2xl border border-neutral-200 p-6 shadow-sm backdrop-blur">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
            {settings.theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
          </div>
          <h4 className="text-lg font-bold text-neutral-900">{t.appearance}</h4>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {[
            { id: 'light', name: t.lightMode, icon: Sun },
            { id: 'dark', name: t.darkMode, icon: Moon }
          ].map((theme) => {
            const isSelected = settings.theme === theme.id;
            const Icon = theme.icon;

            return (
              <button
                key={theme.id}
                type="button"
                onClick={() => updateSetting('theme', theme.id)}
                className={`flex items-center justify-between rounded-xl border px-4 py-3 text-left transition-all ${
                  isSelected
                    ? 'border-ulk-blue bg-blue-50 text-ulk-blue shadow-sm'
                    : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300'
                }`}
              >
                <span className="flex items-center gap-2 font-semibold">
                  <Icon size={18} />
                  {theme.name}
                </span>
                {isSelected && <Check size={18} />}
              </button>
            );
          })}
        </div>
      </section>

      <section className="bg-white/90 rounded-2xl border border-neutral-200 p-6 shadow-sm backdrop-blur">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-ulk-blue">
            <Languages size={20} />
          </div>
          <h4 className="text-lg font-bold text-neutral-900">{t.language}</h4>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {languages.map((language) => {
            const isSelected = settings.language === language.code;

            return (
              <button
                key={language.code}
                type="button"
                onClick={() => updateSetting('language', language.code)}
                className={`flex items-center justify-between rounded-xl border px-4 py-3 text-left transition-all ${
                  isSelected
                    ? 'border-ulk-blue bg-blue-50 text-ulk-blue shadow-sm'
                    : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300'
                }`}
              >
                <span className="font-semibold">{language.name}</span>
                {isSelected && <Check size={18} />}
              </button>
            );
          })}
        </div>
      </section>

      <section className="bg-white/90 rounded-2xl border border-neutral-200 p-6 shadow-sm backdrop-blur">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-50 text-yellow-700">
            <Factory size={20} />
          </div>
          <h4 className="text-lg font-bold text-neutral-900">{t.industrialBackground}</h4>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {backgrounds.map((background) => {
            const isSelected = settings.background === background.id;

            return (
              <button
                key={background.id}
                type="button"
                onClick={() => updateSetting('background', background.id)}
                className={`overflow-hidden rounded-2xl border bg-white text-left transition-all ${
                  isSelected
                    ? 'border-ulk-blue shadow-md ring-2 ring-ulk-blue/20'
                    : 'border-neutral-200 hover:border-neutral-300 hover:shadow-sm'
                }`}
              >
                <div className={`h-28 ${background.preview}`} />
                <div className="flex items-center justify-between px-4 py-3">
                  <span className="font-bold text-neutral-800">{background.name}</span>
                  {isSelected && (
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-ulk-blue text-white">
                      <Check size={15} />
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default Settings;
