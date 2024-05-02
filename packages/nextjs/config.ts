import * as chains from "wagmi/chains";
import deployedContracts from "~~/contracts/deployedContracts";

export const CHAIN_NAME = process.env.CHAIN_NAME || "hardhat";
export const CHAIN = chains[CHAIN_NAME as keyof typeof chains];
export const SUPPORTED_CHAINS = Object.keys(deployedContracts);

export const BASE_URL = process.env.BASE_URL || "http://localhost:3000";
export const RPC_URL = process.env.RPC_URL;

export const LIGHT_THEME = "bumblebee";
export const DARK_THEME = "sunset";

export const NEXT_PUBLIC_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://farcaster-lottery.xyz";
