import { ethers } from "ethers";
import LotteryDeployer from "../artifacts/contracts/LotteryDeployer.sol/LotteryDeployer.json";

async function main() {
  const alchemyApiKey = process.env.ALCHEMY_API_KEY;
  const contractAddress = process.env.CONTRACT_ADDRESS;
  const myAddress = process.env.MY_ADDRESS;

  if (!alchemyApiKey || !contractAddress || !myAddress) {
    console.error("Error: Missing required environment variables. Please provide ALCHEMY_API_KEY, CONTRACT_ADDRESS, and MY_ADDRESS.");
    return;
  }

  const provider = new ethers.JsonRpcProvider(`https://base-sepolia.g.alchemy.com/v2/${alchemyApiKey}`);
  const contract = new ethers.Contract(contractAddress, LotteryDeployer.abi, provider);

  const lotteryCount = await contract.lotteryCount(myAddress);
  console.log(`Total lotteries created by ${myAddress}: ${lotteryCount}`);

  for (let i = 0; i < lotteryCount; i++) {
    const lotteryAddress = await contract.lotteries(myAddress, i);
    console.log(`Lottery ${i}: ${lotteryAddress}`);
  }
}

main().catch(console.error);