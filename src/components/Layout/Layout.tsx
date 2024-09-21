'use client';
import { PropsWithChildren, useEffect, useState } from 'react';
import { AuthenticatedRoutesWrapper } from '@multiversx/sdk-dapp/wrappers/AuthenticatedRoutesWrapper/AuthenticatedRoutesWrapper';
import { RouteNamesEnum } from '@/localConstants';
import { routes } from '@/routes';
import { Footer } from './Footer';
import { Header } from './Header';
import '@/styles/layout.css';




export const Layout = ({ children }: PropsWithChildren) => {
  return (
    <div className='flex min-h-screen flex-col bg-gradient-to-b from-black via-gray-900 to-blue-950 relative overflow-hidden'>
      <Header />
      <main className='flex flex-grow items-stretch justify-center p-6 relative z-10'>
        <AuthenticatedRoutesWrapper
          routes={routes}
          unlockRoute={`${RouteNamesEnum.unlock}`}
        >
          {children}
        </AuthenticatedRoutesWrapper>
      </main>
      <Footer />
    </div>
  );
};