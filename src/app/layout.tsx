'use client';

import React, { useEffect } from 'react';
import { Poppins as FontPoppins } from 'next/font/google';
import { usePathname } from 'next/navigation';

import './globals.css';
import { cn } from '@/lib/utils';
import ReduxProvider from '@/lib/ReduxProvider';
import { Toaster } from '@/components/ui/sonner';
import Init from './init';

const poppins = FontPoppins({
  weight: ['200', '300', '400', '500', '600'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-poppins',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  return (
    <ReduxProvider>
      <html lang={'en'}>
        <head />
        <body
          className={cn(
            `min-h-[calc(100vh-80px)] bg-background  font-poppins antialiased ${poppins?.variable} `,
            poppins.className,
          )}
        >
          <Init>{children}</Init>
          <Toaster position='top-center' />
        </body>
      </html>
    </ReduxProvider>
  );
}
