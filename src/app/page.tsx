'use client';
import { AuthRedirectWrapper, PageWrapper } from '@/wrappers';
import { Transaction } from './transaction';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from "next/image";
import { motion, useAnimation } from 'framer-motion';
import { FaTwitter, FaTelegram, FaDiscord } from 'react-icons/fa';

export default function Home({
  searchParams
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const router = useRouter();
  const controls = useAnimation();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = [
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-u7HEzxMry2ocSUgeB8fhX0q1Q2fVDO.png",
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-u7HEzxMry2ocSUgeB8fhX0q1Q2fVDO.png",
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-u7HEzxMry2ocSUgeB8fhX0q1Q2fVDO.png"
  ];

  useEffect(() => {
    if (searchParams && Object.keys(searchParams).length > 0) {
      router.replace('/');
    }
  }, [router, searchParams]);

  useEffect(() => {
    const sequence = async () => {
      await controls.start({ opacity: 0, transition: { duration: 0.5 } });
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
      await controls.start({ opacity: 1, transition: { duration: 0.5 } });
    };

    const interval = setInterval(sequence, 5000);
    return () => clearInterval(interval);
  }, [controls, images.length]);

  return (
    <AuthRedirectWrapper requireAuth={false}>
      <PageWrapper>
        <div className='flex flex-col-reverse sm:flex-row items-center h-full w-full bg-transparent text-white'>
          <div className='flex items-start sm:items-center h-full sm:w-1/2 sm:bg-center p-6'>
            <div className='flex flex-col gap-6 max-w-[70sch] text-center sm:text-left'>
              <motion.h1 
                className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight"
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                Discover the World of <span className="text-blue-400">Versus Enyath</span>
              </motion.h1>
              <motion.p 
                className="text-lg sm:text-xl text-gray-300"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Immerse yourself in a collection of 555 unique NFTs representing the greater Good in our digital realm.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="flex flex-col sm:flex-row gap-4 items-center sm:items-start"
              >
                <a 
                  href="/dashboard" 
                  className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-full text-lg transition-colors duration-300"
                >
                  Mint Now
                </a>
                
              </motion.div>
              <motion.div 
                className="flex space-x-6 justify-center sm:justify-start"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <a href="https://twitter.com/VersusProjects" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-300 transition-colors">
                  <FaTwitter size={24} />
                </a>
                <a href="https://t.me/vs_projects_annncmnt" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-300 transition-colors">
                  <FaTelegram size={24} />
                </a>
                <a href="https://versus-projects.com/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-300 transition-colors">
                  <FaDiscord size={24} />
                </a>
              </motion.div>
            </div>
          </div>
          <motion.div 
            className="h-4/6 sm:w-1/2 flex items-center justify-center p-6"
            animate={controls}
          >
            <div className="relative w-full aspect-square max-w-md">
              <Image 
                src={images[currentImageIndex]}
                alt="Versus Enyath NFT Preview" 
                layout="fill"
                objectFit="cover"
                className="rounded-lg shadow-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-50 rounded-lg"></div>
            </div>
          </motion.div>
        </div>
      </PageWrapper>
    </AuthRedirectWrapper>
  );
}