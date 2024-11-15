'use client';
import { Button } from '@/components/Button';
import { MxLink } from '@/components/MxLink';
import { environment } from '@/config/config.mainnet';
import { logout } from '@/helpers';
import { useGetIsLoggedIn } from '@/hooks';
import { RouteNamesEnum } from '@/localConstants';
import mvxLogo from '../../../../public/assets/img/multiversx-logo.svg';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { getWindowLocation } from '@/utils/sdkDappUtils';
import { usePathname } from 'next/navigation';

export const Header = () => {
  const router = useRouter();
  const isLoggedIn = useGetIsLoggedIn();
  const pathname = usePathname();

  const isUnlockRoute = Boolean(pathname === RouteNamesEnum.unlock);

  const ConnectButton = isUnlockRoute ? null : (
    <MxLink to={RouteNamesEnum.unlock}>Connect</MxLink>
  );

  const onRedirect = () => {
    router.replace(RouteNamesEnum.unlock);
  };

  const handleLogout = () => {
    const { href } = getWindowLocation();
    sessionStorage.clear();
    logout(href, onRedirect, false);
  };

  return (
    <header className='flex flex-row align-center justify-between pl-6 pr-6 pt-6'>
      <MxLink
        to={isLoggedIn ? RouteNamesEnum.dashboard : RouteNamesEnum.home}
        className='flex items-center justify-between'
      >
        <Image 
          src='https://versus-projects.com/assets/images/home-hero-9.webp' // Updated image URL
          alt='MultiversX Community Art' 
          layout='fixed' // Use 'fixed' to set specific dimensions
          width={69} // Calculated width for 70px height
          height={70} // Set height to 70px
          className='h-auto' // Adjusts the height responsively
        />
      </MxLink>

      <nav className='h-full w-full text-sm sm:relative sm:left-auto sm:top-auto sm:flex sm:w-auto sm:flex-row sm:justify-end sm:bg-transparent'>
        <div className='flex justify-end container mx-auto items-center gap-2'>
          <div className='flex gap-1 items-center'>
            <div className='w-2 h-2 rounded-full bg-green-500' />
            <p className='text-gray-600'>{environment}</p>
          </div>

          {isLoggedIn ? (
            <Button
              onClick={handleLogout}
              className='inline-block rounded-lg px-3 py-2 text-center hover:no-underline my-0 text-gray-600 hover:bg-slate-100 mx-0'
            >
              Close
            </Button>
          ) : (
            ConnectButton
          )}
        </div>
      </nav>
    </header>
  );
};
