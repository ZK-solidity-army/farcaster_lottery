import { NextRequest, NextResponse } from "next/server";
import { encodeFunctionData } from "viem";
import { getContract } from "~~/src/utils/getContract";

export const POST = (req: NextRequest) => {
  // TODO: validate chainId and address
  const chainId = parseInt(req.nextUrl.searchParams.get("chainId") || "1", 10);
  const address = req.nextUrl.searchParams.get("address");
  const contract = getContract("Lottery", chainId);

  return NextResponse.json({
    chainId: `eip155:${chainId}`,
    method: "eth_sendTransaction",
    value: 10 ** 18,
    params: {
      abi: contract.abi,
      to: address,
      data: encodeFunctionData({ abi: contract.abi, functionName: "bet" }),
    },
  });
};
