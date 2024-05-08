"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import Countdown from "react-countdown";
import { formatEther, keccak256, toHex } from "viem";
import { useAccount, useReadContracts } from "wagmi";
import { BoltIcon, ClipboardIcon } from "@heroicons/react/24/outline";
import { NEXT_PUBLIC_BASE_URL } from "~~/config";
import { useTargetNetwork } from "~~/src/hooks/scaffold-eth/useTargetNetwork";
import { getContract } from "~~/src/utils/getContract";
import { getBlockExplorerAddressLink } from "~~/src/utils/scaffold-eth";

export default function LotteryPage({
  params: { chainId, lotteryAddress },
}: {
  params: { chainId: string; lotteryAddress: `0x${string}` };
}) {
  const _chainId = parseInt(chainId, 10);
  const { targetNetwork } = useTargetNetwork();
  const account = useAccount();

  const lotteryContractData = {
    chainId: _chainId,
    address: lotteryAddress,
    abi: getContract("Lottery", _chainId).abi,
    watch: true,
  };
  const { data, isFetched } = useReadContracts({
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
        functionName: "ticketPrice",
      },
      {
        ...lotteryContractData,
        functionName: "developerFee",
      },
      {
        ...lotteryContractData,
        functionName: "creatorFee",
      },
      {
        ...lotteryContractData,
        functionName: "lotteryName",
      },
      {
        ...lotteryContractData,
        functionName: "betsOpen",
      },
      {
        ...lotteryContractData,
        functionName: "betsClosingTime",
      },
      {
        ...lotteryContractData,
        functionName: "hasRole",
        args: [keccak256(toHex("CREATOR_ROLE")), account.address as `0x${string}`],
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
  const creatorFee = (data && data[4] && (data[4].result as bigint)) || 0n;
  const totalFee = formatEther(devFee + creatorFee);
  const title = (data && data[5] && data[5].result) || "Unknown";
  const betsOpen = (data && data[6] && data[6].result) || true;
  const betsClosingTime = data && data[7] && data[7].result;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const isCreator = (data && data[8] && data[8].result) || false;

  const introText = "Hi! Try my new lottery 🎲";

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
          <span>Title</span>
          <span className="flex-1 relative">
            <span className="absolute border-b-[0.125rem] border-dotted border-base-content w-full left-0 bottom-1"></span>
          </span>
          <span>{title}</span>
        </div>
        <div className="flex justify-between my-2">
          <span>Ticket price</span>
          <span className="flex-1 relative">
            <span className="absolute border-b-[0.125rem] border-dotted border-base-content w-full left-0 bottom-1"></span>
          </span>
          <span>
            {ticketPrice} {targetNetwork.nativeCurrency.symbol}
          </span>
        </div>
        <div className="flex justify-between my-2">
          <span>Fee</span>
          <span className="flex-1 relative">
            <span className="absolute border-b-[0.125rem] border-dotted border-base-content w-full left-0 bottom-1"></span>
          </span>
          <span>
            {totalFee} {targetNetwork.nativeCurrency.symbol}
          </span>
        </div>
        <div className="flex justify-between my-2">
          <span>Prize pool</span>
          <span className="flex-1 relative">
            <span className="absolute border-b-[0.125rem] border-dotted border-base-content w-full left-0 bottom-1"></span>
          </span>
          <span>
            {prizePool} {targetNetwork.nativeCurrency.symbol}
          </span>
        </div>
      </div>
      <div className="flex gap-2 mt-5 flex-col md:flex-row">
        <CopyButton textToCopy={url} />
        <Link className="btn btn-primary mt-5" href={warpcastLink} target="_blank">
          Cast to Warpcast <BoltIcon className="w-4 h-4" />
        </Link>
      </div>
      {isFetched && (
        <>
          {betsOpen ? (
            betsClosingTime && betsClosingTime > Math.ceil(new Date().valueOf() / 1000) ? (
              <div className="my-16">
                <h2 className="mb-2">Lottery closes in</h2>
                <div>
                  <Countdown date={new Date(Number(betsClosingTime) * 1000)} renderer={CountdownRenderer} />
                </div>
              </div>
            ) : (
              <div className="my-16">
                <button className="btn btn-secondary mt-5" onClick={() => console.log("Bets are closed")}>
                  Close the lottery
                </button>
              </div>
            )
          ) : null}

          {!betsOpen && isCreator ? (
            <div className="my-16">
              <button className="btn btn-secondary mt-5" onClick={() => console.log("Creator actions")}>
                Claim your fees
              </button>
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}

function CountdownRenderer({
  days,
  hours,
  minutes,
  seconds,
  completed,
}: {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  completed: boolean;
}) {
  if (completed) {
    return <span>00:00:00</span>;
  }

  return (
    <span>
      {days ? (
        <span className="mx-1">
          <span className="text-6xl">{days}</span>
          <span className="text-sm">d</span>
        </span>
      ) : null}
      {days || hours ? (
        <span className="mx-1">
          <span className="text-6xl">{hours.toString().padStart(2, "0")}</span>
          <span className="text-sm">h</span>
        </span>
      ) : null}
      {days || hours || minutes ? (
        <span className="mx-1">
          <span className="text-6xl">{minutes.toString().padStart(2, "0")}</span>
          <span className="text-sm">m</span>
        </span>
      ) : null}
      <span className="mx-1">
        <span className="text-6xl">{seconds.toString().padStart(2, "0")}</span>
        <span className="text-sm">s</span>
      </span>
    </span>
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
