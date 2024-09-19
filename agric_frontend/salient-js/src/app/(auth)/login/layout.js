import { Metadata } from 'next';

export const metadata = {
  title: 'Sign In',
};

export default function Layout({ children }) {
  return (
    <div>
      {children}
    </div>
  );
}
