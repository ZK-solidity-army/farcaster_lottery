import { expect } from "chai";
import { ethers } from "hardhat";
import { AddressZero } from "@ethersproject/constants";
import { LotteryDeployer } from "../typechain-types";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

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
    it("Should have the right owner", async function () {
      expect(await contract.owner()).to.equal(owner.address);
    });

    describe("Create lotteries", async function () {
      let lottery1Address: string;
      let lottery2Address: string;
      before(async () => {
        await contract.connect(account2).createLottery();
        await contract.connect(account2).createLottery();
        lottery1Address = await contract.lotteries(account2.address, 0);
        lottery2Address = await contract.lotteries(account2.address, 1);
      });

      it("Should list all lotteries", async function () {
        expect(await contract.lotteryCount(account2.address)).to.equal(2);
        expect(await contract.lotteries(account2.address, 0)).to.equal(lottery1Address);
        expect(await contract.lotteries(account2.address, 1)).to.equal(lottery2Address);
        expect(await contract.lotteries(account2.address, 2)).to.equal(AddressZero);
      });

      it("Should list no lotteries for other accounts", async function () {
        expect(await contract.lotteryCount(account3.address)).to.equal(0);
        expect(await contract.lotteries(account3.address, 0)).to.equal(AddressZero);

        expect(await contract.lotteryCount(owner.address)).to.equal(0);
        expect(await contract.lotteries(owner.address, 0)).to.equal(AddressZero);
      });

      // disabled for speed
      xit("Should support 1k lotteries", async function () {
        for (let i = 0; i < 1000; i++) {
          await contract.connect(account3).createLottery();
        }
        expect(await contract.lotteryCount(account3.address)).to.equal(1000);
        expect(await contract.lotteries(account3.address, 512)).not.to.equal(AddressZero);
      });
    });
  });
});
