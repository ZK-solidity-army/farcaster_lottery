import Link from "next/link";
import { useWaitForTransactionReceipt } from "wagmi";
import { ArrowPathIcon, CheckIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { useTargetNetwork } from "~~/src/hooks/scaffold-eth/useTargetNetwork";
import { getBlockExplorerTxLink } from "~~/src/utils/scaffold-eth";

export default function Transaction({ txHash, size }: { txHash: `0x${string}`; size?: number }) {
  const { targetNetwork } = useTargetNetwork();
  const { isError, isSuccess } = useWaitForTransactionReceipt({
    chainId: targetNetwork.id,
    hash: txHash,
  });

  return (
    <Link target="_blank" href={getBlockExplorerTxLink(targetNetwork.id, txHash)} className="whitespace-nowrap">
      <span className="pb-1">
        <StatusIcon isSuccess={isSuccess} isError={isError} />
      </span>
      <span className="align-middle">{truncate(txHash, size || 30)}</span>
    </Link>
  );
}

const StatusIcon = ({ isSuccess, isError }: { isSuccess: boolean; isError: boolean }) => {
  if (isError) {
    return <ExclamationTriangleIcon className="w-5 h-5 inline-block" />;
  }

  if (isSuccess) {
    return <CheckIcon className="w-5 h-5 inline-block" />;
  }

  return <ArrowPathIcon className="w-5 h-5 inline-block" />;
};

const truncate = (str: string, n: number) => {
  return str.length > n ? str.substr(0, n - 1) + "..." : str;
};
