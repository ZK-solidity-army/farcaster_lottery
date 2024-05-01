import { useEffect, useState } from 'react';
import { ethers } from 'ethers';

interface Lottery {
  address: string;
}

export const useLotteries = (address: string) => {
  const [lotteries, setLotteries] = useState<Lottery[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchLotteries = async () => {
      const provider = new ethers.providers.JsonRpcProvider('https://base-sepolia.g.alchemy.com/v2/demo');
      const contract = new ethers.Contract('0xContractAddress', ['function lotteryCount(address) view returns (uint)', 'function lotteries(address, uint) view returns (address)'], provider);
      setLoading(true);
      const count = await contract.lotteryCount(address);
      const fetchedLotteries: Lottery[] = [];
      for (let i = 0; i < count; i++) {
        const lotteryAddress = await contract.lotteries(address, i);
        fetchedLotteries.push({ address: lotteryAddress });
      }
      setLotteries(fetchedLotteries);
      setLoading(false);
    };

    if (address) {
      fetchLotteries();
    }
  }, [address]);

  return { lotteries, loading };
};