import { ethers } from "ethers";
import  LotteryDeployer  from "../artifacts/contracts/LotteryDeployer.sol/LotteryDeployer.json";

async function main() {
  const alchemyApiKey = "<put your alchemy api key here>";
  const provider = new ethers.JsonRpcProvider(`https://base-sepolia.g.alchemy.com/v2/${alchemyApiKey}`);
  const contractAddress = "0x8c653c4280839DEBA35844D561532e0EebC48024";
  const myAddress = "0xDFd7dfc0B94a51d893b2a1cDeD86F8466325C9c5";

  const contract = new ethers.Contract(contractAddress, LotteryDeployer.abi, provider);

  const lotteryCount = await contract.lotteryCount(myAddress);
  console.log(`Total lotteries created by ${myAddress}: ${lotteryCount}`);

  for (let i = 0; i < lotteryCount; i++) {
    const lotteryAddress = await contract.lotteries(myAddress, i);
    console.log(`Lottery ${i}: ${lotteryAddress}`);
  }
}

main().catch(console.error);