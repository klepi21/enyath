/* eslint-disable react/no-unescaped-entities */
"use client"

import { useState, useEffect } from 'react'
import Image from "next/image"
import { useGetMinterInformation } from './minter'
import {
  deleteTransactionToast,
  removeAllSignedTransactions,
  removeAllTransactionsToSign
} from '@multiversx/sdk-dapp/services/transactions/clearTransactions';
import { contractAddress, contractAddress2 } from '@/config/config.mainnet';
import { signAndSendTransactions } from '@/helpers/signAndSendTransactions';
import {
  useGetAccountInfo,
  useGetNetworkConfig
} from '@/hooks/sdkDappHooks';
import { newTransaction } from '@/helpers/sdkDappHelpers';
import { Address } from '@multiversx/sdk-core';
import { GAS_PRICE, VERSION } from '@/localConstants';
import { Card, CardContent } from "@/styles/ui/card"
import { Button } from "@/styles/ui/button"
import { Input } from "@/styles/ui/input"
import { FaTwitter, FaTelegram, FaDiscord, FaSitemap } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import LinearProgress from '@mui/material/LinearProgress';
import NFTDashboard from './NFTDashboard';
import BigNumber from 'bignumber.js'; // Ensure you have BigNumber imported

export default function Component() {
  const [quantity, setQuantity] = useState(1)
  const [isHovered, setIsHovered] = useState(false)
  const minterInfo = useGetMinterInformation()
  const { address, account } = useGetAccountInfo();
  const nonce = account.nonce;

  const { network } = useGetNetworkConfig();

  const totalSupply = minterInfo ? parseInt(minterInfo.total_token) : 0;
  const mintedSoFar = minterInfo ? parseInt(minterInfo.total_token_minted) : 0;
  const limitPerAddressTotal = minterInfo ? minterInfo.limit_per_address_total : 0;
  const pricePerNFT = minterInfo ? Number(minterInfo.token_price) / 1e18 : 0; // Ensure token_price is a number
  const totalPrice = quantity * pricePerNFT;

  const truncateToTwoDecimals = (num: number) => Math.floor(num * 100) / 100;

  const formattedPricePerNFT = truncateToTwoDecimals(pricePerNFT).toFixed(2);
  const formattedTotalPrice = truncateToTwoDecimals(totalPrice).toFixed(2);

  const isPaused = minterInfo ? minterInfo.is_paused : true

  const progressValue = totalSupply > 0 ? (mintedSoFar / totalSupply) * 100 : 0;


  const handleMint = async () => {
    if (minterInfo) {
      const amountOfTokens = Math.max(0, quantity);

      // Convert token price to BigInt in wei
      const pricePerNFT = Number(minterInfo.token_price); // Convert to BigInt in wei
      console.log(pricePerNFT.toString()); // Log pricePerNFT

      const valueToSend = pricePerNFT * amountOfTokens; // Ensure amountOfTokens is BigInt
      
      console.log('valueToSend', valueToSend.toString());
       // Log valueToSend

      const hexArguments = `mint@${amountOfTokens.toString(16).padStart(2, '0')}`;

      const mintTransaction = newTransaction({
        value: valueToSend ,
        data: hexArguments,
        receiver: contractAddress2,
        gasLimit: 60000000,
        gasPrice: GAS_PRICE,
        chainID: network.chainId,
        nonce: nonce,
        sender: new Address(address),
        version: VERSION,
        arguments: []
      });

      console.log(mintTransaction);

      try {
        const sessionId = await signAndSendTransactions({
          transactions: [mintTransaction],
          callbackRoute: '',
          transactionsDisplayInfo: {
            processingMessage: 'Minting tokens...',
            errorMessage: 'Minting failed',
            successMessage: 'Minting successful'
          }
        });

        console.log('Minting successful, session ID:', sessionId);
      } catch (error) {
        console.error('Minting failed:', error);
      }
    }
  };

  return (
    <div className="space-y-6">
    <div className="text-center text-2xl font-bold text-blue-300 bg-gradient-to-r from-blue-500 to-purple-600 p-4 rounded-lg shadow-lg">
      Mint Enyath and get Enyath A.I. as 🎁
    </div>
    <Card className="w-full max-w-6xl bg-gradient-to-br from-slate-900 to-blue-900 text-white border-0 shadow-2xl shadow-blue-500/20 overflow-hidden">
      <CardContent className="p-0">
        <div className="flex flex-col lg:flex-row">
          <motion.div 
            className="w-full lg:w-1/2 relative aspect-square lg:aspect-auto"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Image 
              src="https://i.ibb.co/yyTs9wJ/IMAGE-2024-09-22-16-48-16.jpg"
              alt="Cyber Sentinel NFT" 
              layout="fill"
              objectFit="cover"
              className="rounded-t-lg lg:rounded-l-lg lg:rounded-tr-none"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent opacity-70"></div>
            <motion.div 
              className="absolute bottom-0 left-0 right-0 p-6 space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <h3 className="text-3xl font-bold text-blue-300">Versus Enyath</h3>
              <p className="text-sm text-gray-300 leading-relaxed line-clamp-3 hover:line-clamp-none transition-all duration-300">
                Meet Enyath contains everything you need just to cope with. There are 555 NFT-s which represent the greater Good then the First Series is to be added and our story will continue.
                The moment the Good and Evil meet, you will see in the third collection. The first series ends in those 112 NFT-s which bring different scenarios; a bit controversial maybe, but hey!
                Your mind may imaginary travel everywhere in this World! This is fiction but it can turn into Reality due to our effort and imagination!
              </p>
            </motion.div>
          </motion.div>
          <motion.div 
            className="w-full lg:w-1/2 p-6 space-y-6 flex flex-col justify-between"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div>
              <h2 className="text-3xl font-bold text-center lg:text-left text-blue-300 mb-6">
                {minterInfo ? minterInfo.token_type : 'Loading...'}
              </h2>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span>Minted</span>
                  <span>{mintedSoFar} / {totalSupply}</span>
                </div>
                <LinearProgress variant="determinate" value={progressValue} className="w-full bg-slate-700" />
              </div>
              
              <div className="flex justify-between items-center mt-6">
                <span className="text-lg">Price per NFT</span>
                <span className="text-lg font-semibold text-blue-300">
                  {formattedPricePerNFT} {minterInfo ? minterInfo.payment_token.token_type : 'Loading...'}
                </span>
              </div>
              
              <div className="flex items-center space-x-2 mt-4">
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="border-blue-400 text-blue-300 hover:bg-blue-700/50"
                >
                  -
                </Button>
                <Input 
                  type="number" 
                  value={quantity} 
                  onChange={(e) => {
                    const value = Math.max(1, Math.min(limitPerAddressTotal, parseInt(e.target.value) || 1));
                    setQuantity(value);
                  }}
                  min={1} 
                  max={limitPerAddressTotal} 
                  className="w-20 text-center bg-slate-700/50 border border-blue-400 text-blue-300"
                />
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => setQuantity(Math.min(limitPerAddressTotal, quantity + 1))}
                  className="border-blue-400 text-blue-300 hover:bg-blue-700/50"
                >
                  +
                </Button>
              </div>
            </div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                className="w-full py-6 font-bold bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white transition-all duration-300 text-lg rounded-xl shadow-lg"
                disabled={isPaused}
                onClick={handleMint}
              >
                Mint {quantity} for {formattedTotalPrice} {minterInfo ? minterInfo.payment_token.token_type : 'Loading...'}
              </Button>
            </motion.div>

            <div className="grid grid-cols-2 gap-4 mt-6">

              <Button variant="outline" className="w-full text-blue-300 border-blue-400 hover:bg-blue-700/50 transition-all duration-300">Explorer</Button>
              <Button variant="outline" className="w-full text-blue-300 border-blue-400 hover:bg-blue-700/50 transition-all duration-300">Community</Button>
            </div>

            <div className="flex justify-center space-x-6 mt-6">
              <motion.a 
                href="https://twitter.com/VersusProjects" 
                className="text-blue-300 hover:text-blue-100 transition-colors" 
                target="_blank" 
                rel="noopener noreferrer"
                whileHover={{ scale: 1.2, rotate: 360 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
              >
                <FaTwitter size={30} />
              </motion.a>
              <motion.a 
                href="https://t.me/vs_projects_annncmnt" 
                className="text-blue-300 hover:text-blue-100 transition-colors" 
                target="_blank" 
                rel="noopener noreferrer"
                whileHover={{ scale: 1.2, rotate: 360 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
              >
                <FaTelegram size={30} />
              </motion.a>
              <motion.a 
                href="https://t.me/OwlCityX/42509" 
                className="text-blue-300 hover:text-blue-100 transition-colors" 
                target="_blank" 
                rel="noopener noreferrer"
                whileHover={{ scale: 1.2, rotate: 360 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
              >
                <FaSitemap size={30} />
              </motion.a>
            </div>
          </motion.div>
        </div>
      </CardContent>
    </Card>
    <div className="text-center text-lg font-semibold text-gray-900 mt-6"> {/* Changed text color to gray-900 */}
      <div className="bg-gradient-to-r from-green-500 to-blue-500 p-4 rounded-lg shadow-lg mb-2">
        <a href="https://marketplace.artcpaclub.com/staking/nft/33" target="_blank" rel="noopener noreferrer" className="text-gray-900">
          🔸Single staking pool (99 $REWARD daily, limited 222 slots)
        </a>
      </div>
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4 rounded-lg shadow-lg">
        <a href="https://marketplace.artcpaclub.com/staking/nft/22" target="_blank" rel="noopener noreferrer" className="text-gray-900">
          🔸Dual staking pool, paired with Kra'ad (55 $CPA daily, limited to 222 - 111 pairs)
        </a>
      </div>
    </div>
    <NFTDashboard />
    </div>
  )
}