"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { formatEther } from "viem";
import { useReadContracts } from "wagmi";
import { BoltIcon, ClipboardIcon } from "@heroicons/react/24/outline";
import { NEXT_PUBLIC_BASE_URL } from "~~/config";
import { getContract } from "~~/src/utils/getContract";
import { getBlockExplorerAddressLink, getTargetNetworks } from "~~/src/utils/scaffold-eth";

export default function LotteryPage({
  params: { chainId, lotteryAddress },
}: {
  params: { chainId: string; lotteryAddress: `0x${string}` };
}) {
  const _chainId = parseInt(chainId, 10);
  const targetNetworks = getTargetNetworks();
  const targetNetwork = targetNetworks.find(network => network.id === _chainId);

  const lotteryContractData = {
    chainId: _chainId,
    address: lotteryAddress,
    abi: getContract("Lottery", _chainId).abi,
    watch: true,
  };
  const { data } = useReadContracts({
    contracts: [
      {
        ...lotteryContractData,
        functionName: "owner",
      },
      {
        ...lotteryContractData,
        functionName: "prizePool",
      },
      {
        ...lotteryContractData,
        functionName: "TICKET_PRICE",
      },
      {
        ...lotteryContractData,
        functionName: "DEV_FEE",
      },
      {
        ...lotteryContractData,
        functionName: "STATER_FEE",
      },
    ],
  });

  if (!targetNetwork) {
    return (
      <div className="flex items-center flex-col flex-grow pt-10 text-center">
        <h1 className="text-4xl text-error">Invalid chain id</h1>
      </div>
    );
  }

  const prizePool = formatEther((data && data[1] && (data[1].result as bigint)) || 0n);
  const ticketPrice = formatEther((data && data[2] && (data[2].result as bigint)) || 0n);
  const devFee = (data && data[3] && (data[3].result as bigint)) || 0n;
  const starterFee = (data && data[4] && (data[4].result as bigint)) || 0n;
  const totalFee = formatEther(devFee + starterFee);

  const introText = "Hi! Try my new lottery. 🎲";

  const url = `${NEXT_PUBLIC_BASE_URL}/frames/lottery?chainId=${chainId}&address=${lotteryAddress}`;
  const warpcastLink = `https://warpcast.com/~/compose?text=${encodeURIComponent(
    introText,
  )}&embeds[]=${encodeURIComponent(url)}`;

  return (
    <div className="flex items-center flex-col flex-grow pt-10 text-center">
      <h1>
        <span className="text-2xl">Farcaster Lottery </span>
        <Link
          target="_blank"
          href={getBlockExplorerAddressLink(targetNetwork, lotteryAddress)}
          className="whitespace-nowrap my-5"
        >
          <span className="align-middle hover:underline">{truncate(lotteryAddress.toUpperCase(), 20)}</span>
        </Link>
      </h1>
      <div className="md:w-[24rem] w-[20rem] my-10">
        <div className="flex justify-between my-2">
          <span>Ticket price</span>
          <span className="flex-1 relative">
            <span className="absolute border-b-[0.125rem] border-dotted border-base-content w-full left-0 bottom-1"></span>
          </span>
          <span>{ticketPrice} Eth</span>
        </div>
        <div className="flex justify-between my-2">
          <span>Fee</span>
          <span className="flex-1 relative">
            <span className="absolute border-b-[0.125rem] border-dotted border-base-content w-full left-0 bottom-1"></span>
          </span>
          <span>{totalFee} Eth</span>
        </div>
        <div className="flex justify-between my-2">
          <span>Prize pool</span>
          <span className="flex-1 relative">
            <span className="absolute border-b-[0.125rem] border-dotted border-base-content w-full left-0 bottom-1"></span>
          </span>
          <span>{prizePool} Eth</span>
        </div>
      </div>
      <div className="flex gap-2 mt-5 flex-col md:flex-row">
        <CopyButton textToCopy={url} />
        <Link className="btn btn-primary mt-5" href={warpcastLink} target="_blank">
          Cast to Warpcast <BoltIcon className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

function CopyButton({ textToCopy }: { textToCopy: string }) {
  const [isCopied, setIsCopied] = useState(false);

  const onClick = useCallback(() => {
    navigator.clipboard.writeText(textToCopy);
    setIsCopied(true);
  }, [setIsCopied, textToCopy]);

  return (
    <button className="btn btn-primary mt-5" onClick={onClick}>
      Copy Warpcast frame
      {isCopied ? " ✓" : <ClipboardIcon className="w-4 h-4" />}
    </button>
  );
}

const truncate = (str: string, n: number) => {
  return str.length > n ? str.substr(0, n - 1) + "..." : str;
};
