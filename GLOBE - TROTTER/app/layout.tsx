import './globals.css';
import type { Metadata } from 'next';
import { Inter, Fraunces } from 'next/font/google';
import { AuthProvider } from '@/context/AuthContext';
import { TripSyncProvider } from '@/context/TripSyncContext';
import { Toaster } from '@/components/ui/sonner';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const fraunces = Fraunces({ subsets: ['latin'], variable: '--font-serif', display: 'swap' });

export const metadata: Metadata = {
  title: 'GlobeTrotter — Plan trips together',
  description: 'A personalized multi-city travel planning workspace with shared expenses and smart budgeting.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${fraunces.variable}`}>
      <head>
        <link rel="stylesheet" href="/output.css" />
      </head>
      <body className={`${inter.className} font-sans antialiased`}>
        <AuthProvider>
          <TripSyncProvider>
            {children}
            <Toaster />
          </TripSyncProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
