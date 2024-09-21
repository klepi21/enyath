"use client"; // Add this line at the top

import { AuthRedirectWrapper } from '@/wrappers';
import { ClientHooks } from '@/components/ClientHooks';

import Minter from './minterui';

export default function Dashboard() {


  return (
    <>
      <ClientHooks />
      <AuthRedirectWrapper>
        <div className='flex flex-col gap-6 max-w-3xl w-full'>
          <div>
            <Minter/>
          </div>
        </div>
      </AuthRedirectWrapper>
    </>
  );
}
