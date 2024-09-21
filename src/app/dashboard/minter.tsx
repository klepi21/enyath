"use client"; // Add this line at the top

import { useEffect, useState } from 'react';
import { useGetNetworkConfig } from '@/hooks';
import {
  ContractFunction,
  ResultsParser,
  ProxyNetworkProvider,
  minterSc,
} from '@/utils';
import { throttle } from 'lodash';

// Define the type based on the expected JSON structure
type MinterInfo = {
  total_token: string;
  total_token_minted: string;
  token_price: string;
  is_paused: boolean;
  payment_token: { token_type: string };
  token_type: string;
  limit_per_address_total: number; // Ensure this is included
};

const resultsParser = new ResultsParser();

export const useGetMinterInformation = () => {
  const { network } = useGetNetworkConfig();
  const [minterInfo, setMinterInfo] = useState<MinterInfo | null>(null); // Set initial state type

  const proxy = new ProxyNetworkProvider(network.apiAddress);

  const getMinterInformation = async () => {
    try {
      const query = minterSc.createQuery({
        func: new ContractFunction('getMinterInformation')
      });

      const queryResponse = await proxy.queryContract(query);
      const endpointDefinition = minterSc.getEndpoint('getMinterInformation');

      const { firstValue: minterInfoData } = resultsParser.parseQueryResponse(
        queryResponse,
        endpointDefinition
      );

      console.log('Minter Info Data:', minterInfoData); // Log the raw data for debugging
      setMinterInfo(minterInfoData?.valueOf() || null); // Ensure it can be null
    } catch (err) {
      console.error('Unable to call getMinterInformation', err);
    }
  };

  const throttledGetMinterInformation = throttle(getMinterInformation, 2000); // 2 seconds throttle

  useEffect(() => {
    if (!minterInfo) { // Check if minterInfo is null
      throttledGetMinterInformation();
    }
  }, [minterInfo]); // Use minterInfo as a dependency

  return minterInfo; // Return the fetched minterInfo
};
