import * as chains from "wagmi/chains";
import deployedContracts from "~~/contracts/deployedContracts";

export const CHAIN_NAME = process.env.CHAIN_NAME || "hardhat";
export const CHAIN = chains[CHAIN_NAME as keyof typeof chains];
export const SUPPORTED_CHAINS = Object.keys(deployedContracts);

if (!CHAIN) {
  throw new Error(`Unknown chain: ${CHAIN_NAME}`);
}
if (!SUPPORTED_CHAINS.includes(`${CHAIN.id}`)) {
  throw new Error(`Chain ${CHAIN_NAME} not supported`);
}

export const BASE_URL = process.env.BASE_URL || "http://localhost:3000";
export const RPC_URL = process.env.RPC_URL;
if (!RPC_URL) {
  throw new Error("RPC_URL is required");
}
