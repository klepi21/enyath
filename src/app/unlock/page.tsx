'use client';
import React from 'react';
import { RouteNamesEnum } from '@/localConstants';
import type {
  ExtensionLoginButtonPropsType,
  WebWalletLoginButtonPropsType,
  OperaWalletLoginButtonPropsType,
  LedgerLoginButtonPropsType,
  WalletConnectLoginButtonPropsType
} from '@multiversx/sdk-dapp/UI';
import {
  ExtensionLoginButton,
  LedgerLoginButton,
  WalletConnectLoginButton,
  WebWalletLoginButton as WebWalletUrlLoginButton,
  OperaWalletLoginButton,
  CrossWindowLoginButton,
} from '@/components';
import { nativeAuth } from '@/config/config.mainnet';
import { AuthRedirectWrapper } from '@/wrappers';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

type CommonPropsType =
  | OperaWalletLoginButtonPropsType
  | ExtensionLoginButtonPropsType
  | WebWalletLoginButtonPropsType
  | LedgerLoginButtonPropsType
  | WalletConnectLoginButtonPropsType;

const USE_WEB_WALLET_CROSS_WINDOW = true;

const WebWalletLoginButton = USE_WEB_WALLET_CROSS_WINDOW
  ? CrossWindowLoginButton
  : WebWalletUrlLoginButton;

export default function Unlock() {
  const router = useRouter();
  const commonProps: CommonPropsType = {
    callbackRoute: RouteNamesEnum.dashboard,
    nativeAuth,
    onLoginRedirect: () => {
      router.push(RouteNamesEnum.dashboard);
    }
  };

  return (
    <AuthRedirectWrapper requireAuth={false}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className='flex flex-col p-8 items-center justify-center gap-6 rounded-xl bg-gray-transparent backdrop-blur-md shadow-xl max-w-md w-full'
          data-testid='unlockPage'
        >
          <div className='flex flex-col items-center gap-2'>
            <motion.h2 
              className='text-3xl font-bold text-blue-300'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              Login
            </motion.h2>
            <motion.p 
              className='text-center text-gray-400'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              Choose a login method
            </motion.p>
          </div>

          <motion.div 
            className='flex flex-col w-full gap-3'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <WalletConnectLoginButton
              loginButtonText='xPortal App'
              {...commonProps}
              className='bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full transition-colors duration-300 w-full'
            />
            <LedgerLoginButton 
              loginButtonText='Ledger' 
              {...commonProps}
              className='bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full transition-colors duration-300 w-full'
            />
            <ExtensionLoginButton
              loginButtonText='DeFi Wallet'
              {...commonProps}
              className='bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full transition-colors duration-300 w-full'
            />
            <OperaWalletLoginButton
              loginButtonText='Opera Crypto Wallet - Beta'
              {...commonProps}
              className='bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full transition-colors duration-300 w-full'
            />
            <WebWalletLoginButton
              loginButtonText='Web Wallet'
              data-testid='webWalletLoginBtn'
              {...commonProps}
              className='bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full transition-colors duration-300 w-full'
            />
          </motion.div>
        </motion.div>
    </AuthRedirectWrapper>
  );
}