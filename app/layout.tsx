import type { Metadata } from 'next';
import './globals.css';
import TranslationProvider from '@/components/TranslationProvider';

export const metadata: Metadata = {
  title: 'Crisis Link TIOT',
  description: 'UNDP Create account page',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <TranslationProvider>{children}</TranslationProvider>
      </body>
    </html>
  );
}
