import deployedContracts from "~~/contracts/deployedContracts";
import { ChainWithAttributes } from "~~/src/utils/scaffold-eth";

export const getContract = (contractName: string, targetNetwork: ChainWithAttributes) => {
  const chainId = targetNetwork.id;
  if (!(chainId in deployedContracts)) {
    throw new Error(`Chain ${chainId} not supported`);
  }
  const deployedContractsInChain = deployedContracts[chainId as keyof typeof deployedContracts];
  if (!(contractName in deployedContractsInChain)) {
    throw new Error(`Contract ${contractName} not deployed on chain ${chainId}`);
  }
  return deployedContractsInChain[contractName as keyof typeof deployedContractsInChain];
};
