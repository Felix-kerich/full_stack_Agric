// src/components/DarkModeToggle.jsx

'use client';

import React from 'react';
import { useDarkMode } from '../context/DarkModeContext';

const DarkModeToggle = () => {
  const { darkMode, toggleDarkMode } = useDarkMode();

  return (
    <button
      onClick={toggleDarkMode}
      className={`p-2 rounded-full ${darkMode ? 'bg-gray-800 text-white' : 'bg-gray-200 text-black'}`}
    >
      {darkMode ? '🌙 Dark Mode' : '☀️ Light Mode'}
    </button>
  );
};

export default DarkModeToggle;
