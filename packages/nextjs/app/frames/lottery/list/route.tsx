import { getAddressForFid } from "frames.js";
import { Button } from "frames.js/next";
import { createPublicClient, http } from "viem";
import { frames } from "~~/app/frames/frames";
import { CHAIN, RPC_URL } from "~~/config";
import { getContract } from "~~/src/utils/getContract";

export const POST = frames(async ctx => {
  console.log(ctx.message);
  if (!ctx.message?.requesterFid) {
    // TODO: make a fallback
    throw new Error("No requesterFid");
  }
  const address = await getAddressForFid({
    fid: ctx.message?.requesterFid,
    options: { fallbackToCustodyAddress: true },
  });
  console.log("address", address);
  const client = createPublicClient({
    chain: CHAIN,
    transport: http(RPC_URL),
  });

  const contract = getContract("LotteryDeployer", CHAIN.id);
  const lotteryCount = await client.readContract({
    address: contract.address,
    abi: contract.abi,
    functionName: "lotteryCount",
    args: [address],
  });

  return {
    image: <div tw="flex">You created a lottery: {lotteryCount}</div>,
    buttons: [
      <Button key={0} action="post" target="/">
        &laquo; Back
      </Button>,
    ],
  };
});
