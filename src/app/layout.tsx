import '../styles/globals.css';
import { Suspense } from 'react';
import type { ReactNode } from 'react';
import { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Layout } from '@/components/Layout';
import App from './index';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Versus Enyath',
  description:
    'A basic implementation of MultiversX dApp providing the basics for MultiversX authentication and TX signing.',
  icons: {
    icon: '/favicon.ico'
  }
};

export const viewport = 'width=device-width, initial-scale=1'; // Correct placement

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang='en' className={inter.className}>
      <body>
        <App>
          <Suspense>
            <Layout>{children}</Layout>
          </Suspense>
        </App>
      </body>
    </html>
  );
}
