import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ChatWidget from '@/components/ui/ChatWidget';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

const yearsOfExperience = new Date().getFullYear() - 2019;

export const metadata: Metadata = {
  title: 'Biruk Adera',
  description:
    `Senior Software Engineer with ${yearsOfExperience}+ years of experience building high-performance, scalable applications. Specializing in Node.js, TypeScript, and backend architecture.`,
  keywords: [
    'software engineer',
    'backend developer',
    'Node.js',
    'TypeScript',
    'Express.js',
    'Nest.js',
    'MongoDB',
    'API development',
  ],
  authors: [{ name: 'Biruk Adera' }],
  openGraph: {
    title: 'Biruk Adera',
    description:
      'Senior Backend Developer building high-performance, scalable applications',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} min-h-screen bg-white dark:bg-gray-950`}
      >
        <Providers>
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <ChatWidget />
        </Providers>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
