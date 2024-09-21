import { contractAddress2 } from '@/config/config.mainnet';
import json from '@/contracts/nft-minter.abi.json';
import { AbiRegistry, Address, SmartContract } from './sdkDappCore';

const abi = AbiRegistry.create(json);

export const minterSc = new SmartContract({
  address: new Address(contractAddress2),
  abi
});
