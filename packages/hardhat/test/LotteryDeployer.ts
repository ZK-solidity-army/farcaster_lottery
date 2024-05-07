import { expect } from "chai";
import { ethers } from "hardhat";
import { LotteryDeployer } from "../typechain-types";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { HOUR, DEFAULT_TICKET_PRICE, DEFAULT_CREATOR_FEE } from "./constants";

describe("LotteryDeployer", function () {
  let contract: LotteryDeployer;
  let owner: HardhatEthersSigner;
  let account2: HardhatEthersSigner;
  let account3: HardhatEthersSigner;
  before(async () => {
    [owner, account2, account3] = await ethers.getSigners();
    const contractFactory = await ethers.getContractFactory("LotteryDeployer");
    contract = (await contractFactory.deploy({ from: owner.address })) as LotteryDeployer;
    await contract.waitForDeployment();
  });

  describe("Deployment", function () {
    it("should have the right owner", async function () {
      expect(await contract.owner()).to.equal(owner.address);
    });

    describe("Create lotteries", async function () {
      let lottery1Address: string;
      let lottery2Address: string;
      before(async () => {
        await contract
          .connect(account2)
          .createLottery("Lottery Of Account 2", DEFAULT_TICKET_PRICE, DEFAULT_CREATOR_FEE, 0, 4 * HOUR);
        await contract
          .connect(account2)
          .createLottery("Lottery Of Account 2 #2", DEFAULT_TICKET_PRICE, DEFAULT_CREATOR_FEE, 0, 0);
        lottery1Address = await contract.lotteries(account2.address, 0);
        lottery2Address = await contract.lotteries(account2.address, 1);
      });

      it("should list all lotteries", async function () {
        expect(await contract.lotteryCount(account2.address)).to.equal(2);
        expect(await contract.lotteries(account2.address, 0)).to.equal(lottery1Address);
        expect(await contract.lotteries(account2.address, 1)).to.equal(lottery2Address);
        await expect(contract.lotteries(account2.address, 2)).to.be.reverted;
      });

      it("should list no lotteries for other accounts", async function () {
        expect(await contract.lotteryCount(account3.address)).to.equal(0);
        await expect(contract.lotteries(account3.address, 0)).to.be.reverted;

        expect(await contract.lotteryCount(owner.address)).to.equal(0);
        await expect(contract.lotteries(owner.address, 0)).to.be.reverted;
      });

      it("should not allow to create lottery with starter fee hight than 25% ticket price", async function () {
        await expect(
          contract
            .connect(account2)
            .createLottery(
              "Lottery Of Account 2 #3",
              DEFAULT_TICKET_PRICE,
              DEFAULT_TICKET_PRICE / 4n + 1n,
              0,
              4 * HOUR,
            ),
        ).to.be.revertedWith("Creator fee too high, max 25% of ticket price");
      });

      it("should not allow to create lottery with transfered funds lower than deposit", async function () {
        await expect(
          contract
            .connect(account2)
            .createLottery("Lottery Of Account 2 #3", DEFAULT_TICKET_PRICE, DEFAULT_CREATOR_FEE, 100, 4 * HOUR, {
              value: 99,
            }),
        ).to.be.revertedWith("Invalid deposit amount");
      });

      // disabled for speed
      xit("should support 1k lotteries", async function () {
        for (let i = 0; i < 1000; i++) {
          await contract
            .connect(account3)
            .createLottery(`Lottery Of Account 3 #${i}`, DEFAULT_TICKET_PRICE, DEFAULT_CREATOR_FEE, 0, 4 * HOUR);
        }
        expect(await contract.lotteryCount(account3.address)).to.equal(1000);
        expect(await contract.lotteries(account3.address, 512)).to.ok;
      });
    });
  });
});
