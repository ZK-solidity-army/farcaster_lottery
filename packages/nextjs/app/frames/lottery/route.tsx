import { Button } from "frames.js/next";
import { createPublicClient, formatEther, http } from "viem";
import { frames } from "~~/app/frames/frames";
import { BASE_URL, RPC_URL } from "~~/config";
import { getContract } from "~~/src/utils/getContract";
import { getTargetNetworks } from "~~/src/utils/scaffold-eth";

const handler = frames(async ({ searchParams: { chainId, address } }) => {
  const url = BASE_URL + "/img/welcome.jpg";

  const targetNetworks = getTargetNetworks();
  const targetNetwork = targetNetworks.find(network => network.id === parseInt(chainId, 10));
  console.log("chainId", chainId, "address", address);
  if (!targetNetwork) {
    // TODO: make a fallback
    console.log(chainId, targetNetworks);
    throw new Error("Invalid chain id");
  }
  const client = createPublicClient({
    chain: targetNetwork,
    transport: http(targetNetwork.rpcUrls?.default?.http?.[0] || RPC_URL),
  });

  const contract = getContract("Lottery", targetNetwork.id);

  const [totalPrize, prizePool] = await Promise.all([
    client.readContract({
      address: address,
      abi: contract.abi,
      functionName: "totalPrice",
    }),
    client.readContract({
      address: address,
      abi: contract.abi,
      functionName: "prizePool",
    }),
  ]);
  console.log("totalPrice", totalPrize, "prizePool", prizePool);

  return {
    image: (
      <div tw="w-full h-full justify-center items-center flex flex-col bg-gradient-to-r from-teal-400 to-yellow-200">
        <div>Participate in Lottery</div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={url}
          alt="lottery"
          tw="my-4"
          style={{
            borderRadius: 128,
          }}
          width="256"
          height="256"
        />
        <div tw="flex justify-around text-2xl gap-2">
          <span>Ticket price:</span>
          <span>
            {formatEther(totalPrize)} {targetNetwork.nativeCurrency.symbol}
          </span>
        </div>
        <div tw="flex justify-around text-2xl gap-2">
          <span>Prize pool:</span>
          <span>
            {formatEther(prizePool)} {targetNetwork.nativeCurrency.symbol}
          </span>
        </div>
      </div>
    ),
    buttons: [
      <Button key={0} action="post" target={{ query: { chainId: chainId, address: address }, pathname: "/lottery" }}>
        Refresh
      </Button>,
      <Button key={0} action="link" target={`${BASE_URL}/lotteries/${chainId}/${address}`}>
        Smart Contract
      </Button>,
      <Button
        key={1}
        action="tx"
        target={{ query: { chainId: chainId, address: address }, pathname: "/lottery/bet/txdata" }}
        post_url={{ query: { chainId: chainId, address: address }, pathname: "/lottery/bet" }}
      >
        Buy Ticket
      </Button>,
    ],
  };
});

export const GET = handler;
export const POST = handler;
