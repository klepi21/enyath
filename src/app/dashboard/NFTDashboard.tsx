"use client"

import { useState, useEffect } from 'react'
import { useGetAccountInfo } from '@/hooks/sdkDappHooks';
import { Card, CardContent } from "@/styles/ui/card"
import { Button } from "@/styles/ui/button"
import { Input } from "@/styles/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/styles/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/styles/ui/table"
import { FaCopy, FaExternalLinkAlt, FaHistory , FaCog , FaUser } from 'react-icons/fa'; // Added FaHistory
import { contractAddress, contractAddress2 } from '@/config/config.mainnet';
import { signAndSendTransactions } from '@/helpers/signAndSendTransactions';
import {
  useGetNetworkConfig
} from '@/hooks/sdkDappHooks';
import { newTransaction } from '@/helpers/sdkDappHelpers';
import { Address } from '@multiversx/sdk-core';
import { GAS_PRICE, VERSION } from '@/localConstants';

export default function NFTDashboard() {
  const [activeTab, setActiveTab] = useState("account")
  const [lastMints, setLastMints] = useState<{ sender: string; value: string; timestamp: number; txHash: string; }[]>([]); // Define the type for lastMints
  const { address, account } = useGetAccountInfo();
  const nonce = account.nonce;

  const { network } = useGetNetworkConfig();

  const [inputAddress, setInputAddress] = useState<string>(''); // Add state for input address

  const copyToClipboard = (text: string) => { // Specify the type for 'text'
    navigator.clipboard.writeText(text).then(() => {
      alert("Address copied to clipboard!");
    });
  };

  const formatDate = (timestamp: number) => { // Specify the type for 'timestamp'
    return new Date(timestamp * 1000).toLocaleString();
  };

  const [selectedToken, setSelectedToken] = useState<string>('EGLD'); // State for selected token

  const handleClaim = async () => {
    if (selectedToken) {
      // Convert the selected token to Hex
      const hexToken = Buffer.from(selectedToken, 'utf8').toString('hex'); // Convert selectedToken to Hex

      const txData = `claimTokens@${hexToken}`; // Prepare transaction data

      const claimTransaction = newTransaction({
        value: 0, // Assuming no value is sent for the claim
        data: txData,
        receiver: contractAddress2, // Replace with your contract address
        gasLimit: 60000000,
        gasPrice: GAS_PRICE,
        chainID: network.chainId,
        nonce: nonce,
        sender: new Address(address),
        version: VERSION,
        arguments: []
      });

      console.log(claimTransaction);

      try {
        const sessionId = await signAndSendTransactions({
          transactions: [claimTransaction],
          callbackRoute: '',
          transactionsDisplayInfo: {
            processingMessage: 'Processing claim...',
            errorMessage: 'Claim failed',
            successMessage: 'Claim successful'
          }
        });

        console.log('Claim successful, session ID:', sessionId);
      } catch (error) {
        console.error('Claim failed:', error);
      }
    } else {
      alert("Please select a token to claim.");
    }
  };

  useEffect(() => {
    fetch("https://api.multiversx.com/accounts/erd1qqqqqqqqqqqqqpgqtw8tupguhxrjpde37n8dduvqf0npjfxc9s2qe5utzt/transactions?status=success&function=mint")
      .then(response => response.json())
      .then(data => setLastMints(data))
      .catch(error => console.error("Error fetching last mints:", error));
  }, []);

  const isAdmin = address === "erd1ktu3qy5ehe42sk6z7ygfvwna6wull2suq49qj8urx9nd6dw79s2qn5qqea" || address === "erd1s5ufsgtmzwtp6wrlwtmaqzs24t0p9evmp58p33xmukxwetl8u76sa2p9rvz" || address ==="erd1mn990t3m969l7h6ghv6stdm45e8xpg49n7a0slnrw7kq90f2vtksh0pdrz";

  const handleGiveaway = async () => {
    const amountOfTokens = 1; // Set the desired amount of tokens for the giveaway

    if (inputAddress) {
      // Convert the input address to Hex
      const hexAddress = Buffer.from(inputAddress, 'utf8').toString('hex'); // Convert inputAddress to Hex

      const hexArguments = `giveaway@${hexAddress}@${amountOfTokens.toString(16).padStart(2, '0')}`;

      const giveawayTransaction = newTransaction({
        value: 0, // Assuming no value is sent for the giveaway
        data: hexArguments,
        receiver: contractAddress2, // Replace with your contract address
        gasLimit: 60000000,
        gasPrice: GAS_PRICE,
        chainID: network.chainId,
        nonce: nonce,
        sender: new Address(address),
        version: VERSION,
        arguments: []
      });

      console.log(giveawayTransaction);

      try {
        const sessionId = await signAndSendTransactions({
          transactions: [giveawayTransaction],
          callbackRoute: '',
          transactionsDisplayInfo: {
            processingMessage: 'Processing giveaway...',
            errorMessage: 'Giveaway failed',
            successMessage: 'Giveaway successful'
          }
        });

        console.log('Giveaway successful, session ID:', sessionId);
      } catch (error) {
        console.error('Giveaway failed:', error);
      }
    } else {
      alert("Please enter a valid ERD address.");
    }
  };

  return (
    <Card className="w-full max-w-[95%] mx-auto bg-gradient-to-br from-slate-900 to-blue-900 text-white border-0 shadow-2xl shadow-blue-500/20 overflow-hidden">
      <CardContent className="p-6">
        <Tabs defaultValue="account" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-transparent rounded-full p-2">
            <TabsTrigger 
              value="account"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white flex items-center"
            >
              <FaUser className="mr-2" /> My Account
            </TabsTrigger>
            <TabsTrigger 
              value="lastMints"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white flex items-center"
            >
              <FaHistory className="mr-2" /> Last Mints
            </TabsTrigger>
            {isAdmin && (
              <TabsTrigger 
                value="admin"
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white flex items-center"
              >
                <FaCog className="mr-2" /> Admin Panel
              </TabsTrigger>
            )}
          </TabsList>
          <TabsContent value="account" className="space-y-4 mt-4">
            <div className="flex items-center justify-between">
              <span>Your address:</span>
              <div className="flex items-center">
                <span className="mr-2">{`${address.slice(0, 5)}...${address.slice(-5)}`}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(address)}
                >
                  <FaCopy />
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span>EGLD Balance:</span>
              <span>{(Number(account.balance) / 1e18).toFixed(3)}</span>
            </div>
            <Button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => window.open(`https://explorer.multiversx.com/accounts/${address}`, '_blank')}
            >
              Explorer <FaExternalLinkAlt className="ml-2" />
            </Button>
          </TabsContent>
          <TabsContent value="lastMints" className="mt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-white">Minter</TableHead>
                  <TableHead className="text-white">Mint Number</TableHead>
                  <TableHead className="text-white">Mint Date</TableHead>
                  <TableHead className="text-white">Link</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lastMints.map((mint, index) => (
                  <TableRow key={index}>
                    <TableCell className="text-gray-300">{`${mint.sender.slice(0, 5)}...${mint.sender.slice(-5)}`}</TableCell>
                    <TableCell className="text-gray-300">{Math.floor(Number(mint.value) / 555000000000000000)}</TableCell>
                    <TableCell className="text-gray-300">{formatDate(mint.timestamp)}</TableCell>
                    <TableCell>
                      <a
                        href={`https://explorer.multiversx.com/transactions/${mint.txHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300"
                      >
                        <FaExternalLinkAlt />
                      </a>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>
          {isAdmin && (
            <TabsContent value="admin" className="space-y-4 mt-4">
              <div className="flex items-center space-x-2">
                <Input 
                  type="text" 
                  placeholder="Enter address" 
                  className="bg-slate-700 text-white border-slate-600" 
                  value={inputAddress} // Bind input value to state
                  onChange={(e) => setInputAddress(e.target.value)} // Update state on change
                />
                <Button 
                  className="bg-blue-600 hover:bg-blue-700 text-white" 
                  onClick={handleGiveaway} // Call handleGiveaway on button click
                >
                  Giveaway
                </Button>
              </div>

              <div className="flex flex-col space-y-2 mt-4"> {/* Container for radio buttons */}
                <label>
                  <input 
                    type="radio" 
                    value="EGLD" 
                    checked={selectedToken === 'EGLD'} 
                    onChange={() => setSelectedToken('EGLD')} 
                  />
                  EGLD
                </label>
                <label>
                  <input 
                    type="radio" 
                    value="LXOXNO-0eb983" 
                    checked={selectedToken === 'LXOXNO-0eb983'} 
                    onChange={() => setSelectedToken('LXOXNO-0eb983')} 
                  />
                  LXOXNO-0eb983
                </label>
              </div>

              <Button 
                className="bg-blue-600 hover:bg-blue-700 text-white mt-2" 
                onClick={handleClaim} // Call handleClaim on button click
              >
                Claim
              </Button>
            </TabsContent>
          )}
        </Tabs>
      </CardContent>
    </Card>
  )
}