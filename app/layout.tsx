<<<<<<< HEAD
import type { Metadata } from 'next';
import './globals.css';
import TranslationProvider from '@/components/TranslationProvider';

export const metadata: Metadata = {
  title: 'Crisis Link TIOT',
  description: 'UNDP Create account page',
=======
import 'maplibre-gl/dist/maplibre-gl.css';
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Crisis Impact Reporter",
  description: "UNDP Community Crisis Reporting Tool",
>>>>>>> 746b756cf8a4c0c9c8c827df3912a5ab3f470a61
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
