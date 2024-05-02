import { NextRequest, NextResponse } from "next/server";
import { createPublicClient, encodeFunctionData, http } from "viem";
import { RPC_URL } from "~~/config";
import { getContract } from "~~/src/utils/getContract";
import { getTargetNetworks } from "~~/src/utils/scaffold-eth";

export const POST = async (req: NextRequest) => {
  // TODO: validate chainId and address
  const chainId = parseInt(req.nextUrl.searchParams.get("chainId") || "1", 10);
  const address = req.nextUrl.searchParams.get("address");
  const contract = getContract("Lottery", chainId);

  const targetNetworks = getTargetNetworks();
  const targetNetwork = targetNetworks.find(network => network.id === chainId);
  if (!targetNetwork) {
    // TODO: make a fallback
    throw new Error("Invalid chain id");
  }

  const publicClient = createPublicClient({
    chain: targetNetwork,
    transport: http(RPC_URL),
  });
  const totalPrice = await publicClient.readContract({
    address: contract.address,
    abi: contract.abi,
    functionName: "totalPrice",
  });

  return NextResponse.json({
    chainId: `eip155:${chainId}`,
    method: "eth_sendTransaction",
    params: {
      abi: contract.abi,
      to: address,
      data: encodeFunctionData({ abi: contract.abi, functionName: "bet" }),
      value: totalPrice.toString(),
    },
  });
};
