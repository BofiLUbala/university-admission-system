import AppRoutes from './routes/AppRoutes';
import { SettingsProvider, useSettings } from './context/settingsContext';
import './App.css';

function AppShell() {
  const { backgroundClass } = useSettings();

  return (
    <div className={`min-h-screen ${backgroundClass}`}>
      <AppRoutes />
    </div>
  );
}

function App() {
  return (
    <SettingsProvider>
      <AppShell />
    </SettingsProvider>
  );
}

export default App;
