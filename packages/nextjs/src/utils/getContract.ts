import { CHAIN } from "~~/config";
import deployedContracts from "~~/contracts/deployedContracts";

export const getContract = (contractName: string) => {
  if (!(CHAIN.id in deployedContracts)) {
    throw new Error(`Chain ${CHAIN.id} not supported`);
  }
  const chainId = CHAIN.id;
  const deployedContractsInChain = deployedContracts[chainId as keyof typeof deployedContracts];
  if (!(contractName in deployedContractsInChain)) {
    throw new Error(`Contract ${contractName} not deployed on chain ${CHAIN.id}`);
  }
  return deployedContractsInChain[contractName as keyof typeof deployedContractsInChain];
};
