import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Crisis Link TIOT',
  description: 'UNDP Create account page',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
