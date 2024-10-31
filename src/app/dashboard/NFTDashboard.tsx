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
import { bech32 } from 'bech32'; // Ensure correct import

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

      const txData = `claimTokens@${hexToken}@`; // Prepare transaction data

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

  const [amountOfTokens, setAmountOfTokens] = useState<number>(1); // New state for amount of tokens

  const handleGiveaway = async () => {
    if (inputAddress) {
      // Convert the input address to Hex
      const hexAddress = Address.fromBech32(inputAddress) // Convert inputAddress to Hex
      console.log(hexAddress.hex());

      const hexAmount = amountOfTokens.toString(16).padStart(2, '0'); // Convert amountOfTokens to Hex
      const hexArguments = `giveaway@${hexAddress.hex()}@${hexAmount}`; // Include hexAmount in the arguments

      const giveawayTransaction = newTransaction({
        value: 0, // Assuming no value is sent for the giveaway
        data: hexArguments,
        receiver: 'erd1qqqqqqqqqqqqqpgqd82usd8f4wcu0z70qs0jskpm2wtgeamz9s2q4s7yja', // Replace with your contract address
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

  // New state for searchOwner
  const [searchOwner, setSearchOwner] = useState<string>(''); // Add state for searchOwner
  const [searchResult, setSearchResult] = useState<string | null>(null); // State for search result
  const [ownerFoundMessage, setOwnerFoundMessage] = useState<string>(''); // State for owner found message

  // New function to handle search
  const handleSearchOwner = async () => {
    const url = 'https://api.multiversx.com/vm-values/query';
    const owner = searchOwner;
    const requestData = {
      scAddress: "erd1qqqqqqqqqqqqqpgqfken0exk7jpr85dx6f8ym3jgcagesfcqkqys0xnquf",
      funcName: "getPoolUsersWithStake",
      args: ["16"]
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
      });
      const data = await response.json();
      
      // Access returnData correctly
      const returnData = data?.data?.data?.returnData;

      // Convert Base64 strings to hexadecimal
      const base64ToHex = (base64: string) => {
        const binaryString = atob(base64);
        let hexString = '';
        for (let i = 0; i < binaryString.length; i++) {
          const hex = binaryString.charCodeAt(i).toString(16);
          hexString += hex.padStart(2, '0'); // Ensure two digits for each byte
        }
        return hexString;
      };

      const hexStrings = Array.isArray(returnData) ? returnData.map(base64ToHex) : [];
      console.log(hexStrings);

      // Convert specific hex strings to Bech32
      const bech32Strings = hexStrings
        .filter((_, index) => index % 2 === 0) // Select 0-based indices 0, 2, 4, ... (1, 3, 5, ... in 1-based)
        .map(hex => {
          const bytes = hex.match(/.{1,2}/g)?.map(byte => parseInt(byte, 16)) || [];
          const words = bech32.toWords(new Uint8Array(bytes)); // Convert bytes to 5-bit words
          return bech32.encode('erd', words); // Change prefix to 'erd'
        });

      const hexIndex = hexStrings.findIndex(hex => hex.toLowerCase() === owner.toLowerCase()); // Search in hexStrings
      if (hexIndex > 0) { // Ensure there is a previous position
          const previousBech32 = bech32Strings[hexIndex - 1]; // Get the Bech32 string at the previous position
          setSearchResult(`Staker: ${previousBech32}`); // Update search result state
      } else {
          setSearchResult('No previous Bech32 string available.'); // Update state if no previous element
      }

      // Update the owner found message
      setOwnerFoundMessage(`ok`); // Update state with found message

    } catch (error) {
      console.error('Error:', error);
    }
  };

  // New state for MD Snapshots
  const [mdSnapshots, setMdSnapshots] = useState<{ sender: string; identifier: string; }[]>([]); // State for MD Snapshots

  // Fetch MD Snapshots data
  useEffect(() => {
    const fetchMdSnapshots = async () => {
      try {
        const response = await fetch("https://api.multiversx.com/accounts/erd1qqqqqqqqqqqqqpgq5re66vt0dlee8v83dtyh6k54qqpjs3ketxfq9tcd29/transfers?size=500&token=VRSENYATH2-6b632c");
        const data = await response.json();
        const snapshots = data.map((tx: any) => {
          const sender = tx.sender;
          const identifier = tx.action.arguments.transfers[0]?.identifier || '';
          return { sender, identifier };
        });
        setMdSnapshots(snapshots);
      } catch (error) {
        console.error("Error fetching MD Snapshots:", error);
      }
    };

    fetchMdSnapshots();
  }, []);

  return (
    <Card className="w-full max-w-[95%] mx-auto bg-gradient-to-br from-slate-900 to-blue-900 text-white border-0 shadow-2xl shadow-blue-500/20 overflow-hidden">
      <CardContent className="p-6">
        <Tabs defaultValue="account" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-transparent rounded-full p-2"> {/* Updated grid-cols to 4 */}
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
              <>
                <TabsTrigger 
                  value="admin"
                  className="data-[state=active]:bg-blue-600 data-[state=active]:text-white flex items-center"
                >
                  <FaCog className="mr-2" /> Admin Panel
                </TabsTrigger>
                <TabsTrigger 
                  value="mdSnapshot"
                  className="data-[state=active]:bg-blue-600 data-[state=active]:text-white flex items-center"
                >
                  MD Snapshot
                </TabsTrigger>
              </>
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
                    <TableCell className="text-gray-300">
                      <div className="flex items-center">
                        <span>{`${mint.sender.slice(0, 5)}...${mint.sender.slice(-5)}`}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(mint.sender)}
                        >
                          <FaCopy />
                        </Button>
                      </div>
                    </TableCell>
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
            <>
              <TabsContent value="admin" className="space-y-4 mt-4">
                <div className="flex items-center space-x-2">
                  <Input 
                    type="text" 
                    placeholder="Enter address" 
                    className="bg-slate-700 text-white border-slate-600" 
                    value={inputAddress} // Bind input value to state
                    onChange={(e) => setInputAddress(e.target.value)} // Update state on change
                  />
                  <Input 
                    type="number" // New input for amount of tokens
                    placeholder="Amount of Tokens" 
                    className="bg-slate-700 text-white border-slate-600" 
                    value={amountOfTokens} // Bind input value to state
                    onChange={(e) => setAmountOfTokens(Number(e.target.value))} // Update state on change
                  />
                  <Button 
                    className="bg-blue-600 hover:bg-blue-700 text-white" 
                    onClick={handleGiveaway} // Call handleGiveaway on button click
                  >
                    Giveaway
                  </Button>
                </div>

                <div className="flex items-center space-x-2 mt-4">
                  <Input 
                    type="text" 
                    placeholder="Search Owner" 
                    className="bg-slate-700 text-white border-slate-600" 
                    value={searchOwner} // New state for searchOwner
                    onChange={(e) => setSearchOwner(e.target.value)} // Update state on change
                  />
                  <Button 
                    className="bg-blue-600 hover:bg-blue-700 text-white" 
                    onClick={handleSearchOwner} // Call handleSearchOwner on button click
                  >
                    Search
                  </Button>
                </div>

                {searchResult && ( // Conditionally render the search result
                  <div className="mt-4 text-white">
                    {searchResult}
                  </div>
                )}

                {ownerFoundMessage && ( // Conditionally render the owner found message
                  <div className="mt-4 text-white">
                    {ownerFoundMessage}
                  </div>
                )}

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

              {/* New MD Snapshot Tab Content */}
              <TabsContent value="mdSnapshot" className="mt-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-white">Sender</TableHead>
                      <TableHead className="text-white">Identifier</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mdSnapshots.map((snapshot, index) => (
                      <TableRow key={index}>
                        <TableCell className="text-gray-300 flex items-center">
                          <span>{`${snapshot.sender.slice(0, 5)}...${snapshot.sender.slice(-5)}`}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(snapshot.sender)}
                          >
                            <FaCopy />
                          </Button>
                        </TableCell>
                        <TableCell className="text-gray-300">{snapshot.identifier}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>
            </>
          )}
        </Tabs>
      </CardContent>
    </Card>
  )
}