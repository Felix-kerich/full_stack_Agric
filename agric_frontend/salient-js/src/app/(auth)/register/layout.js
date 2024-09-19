// src/app/(auth)/register/layout.js

import { ReactNode } from 'react';

export const metadata = {
  title: 'Sign Up',
};

export default function Layout({ children }) {
  return (
    <div>
      {children}
    </div>
  );
}
