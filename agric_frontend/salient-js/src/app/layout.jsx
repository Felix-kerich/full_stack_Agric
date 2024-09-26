// src/app/layout.js (or src/app/layout.jsx if using JSX)

import { Inter, Lexend } from 'next/font/google';
import clsx from 'clsx';
import { DarkModeProvider } from '../context/DarkModeContext';
import '@/styles/tailwind.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const lexend = Lexend({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-lexend',
});

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={clsx(
        'h-full scroll-smooth antialiased',
        inter.variable,
        lexend.variable
      )}
    >
      <body className="flex h-full flex-col bg-white dark:bg-gray-900"> {/* Apply default dark mode styles */}
        <DarkModeProvider>
          {children}
        </DarkModeProvider>
      </body>
    </html>
  );
}
