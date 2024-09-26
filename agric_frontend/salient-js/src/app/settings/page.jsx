// src/pages/settings.jsx

import DarkModeToggle from '../../components/DarkModeToggle';

const SettingsPage = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Settings</h1>
      <DarkModeToggle />
    </div>
  );
};

export default SettingsPage;
