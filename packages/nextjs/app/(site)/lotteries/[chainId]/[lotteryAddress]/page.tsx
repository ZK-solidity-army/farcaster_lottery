"use client";

import { ReactNode, useCallback, useState } from "react";
import Link from "next/link";
import { useReadContracts } from "wagmi";
import { BASE_URL } from "~~/config";
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
    ],
  });

  if (!targetNetwork) {
    return (
      <div className="flex items-center flex-col flex-grow pt-10 text-center">
        <h1 className="text-4xl text-error">Invalid chain id</h1>
      </div>
    );
  }

  const owner = data && data[0] && (data[0].result as string);
  const prizePool = data && data[1] && (data[1].result as bigint);

  return (
    <div className="flex items-center flex-col flex-grow pt-10 text-center">
      <h1 className="text-lg">Lottery</h1>
      <div>Owner: {owner}</div>
      <div>Prize pool: {prizePool && prizePool.toString()}</div>
      <CopyBlock textToCopy={`${BASE_URL}/frames/lottery?chainId=${chainId}&address=${lotteryAddress}`}>
        <Link
          target="_blank"
          href={getBlockExplorerAddressLink(targetNetwork, lotteryAddress)}
          className="whitespace-nowrap"
        >
          <span className="align-middle">{truncate(lotteryAddress, 30)}</span>
        </Link>
      </CopyBlock>
    </div>
  );
}

function CopyBlock({ children, textToCopy }: { children: ReactNode; textToCopy: string }) {
  const [isCopied, setIsCopied] = useState(false);

  const onClick = useCallback(() => {
    navigator.clipboard.writeText(textToCopy);
    setIsCopied(true);
  }, [setIsCopied, textToCopy]);

  return (
    <div>
      <div>{children}</div>
      <button className="btn btn-primary mt-5" onClick={onClick}>
        Copy
        {isCopied && " ✓"}
      </button>
    </div>
  );
}

const truncate = (str: string, n: number) => {
  return str.length > n ? str.substr(0, n - 1) + "..." : str;
};
