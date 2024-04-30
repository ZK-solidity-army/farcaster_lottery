import { NextResponse } from "next/server";
import { encodeFunctionData } from "viem";
import { CHAIN } from "~~/config";
import { getContract } from "~~/src/utils/getContract";

export const POST = () => {
  const contract = getContract("LotteryDeployer");

  return NextResponse.json({
    chainId: `eip155:${CHAIN.id}`,
    method: "eth_sendTransaction",
    params: {
      abi: contract.abi,
      to: contract.address,
      data: encodeFunctionData({ abi: contract.abi, functionName: "createLottery" }),
    },
  });
};
