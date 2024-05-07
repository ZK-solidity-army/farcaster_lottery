import { expect } from "chai";
import { ethers } from "hardhat";
import { Lottery, LotteryDeployer } from "../typechain-types";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { DEFAULT_TICKET_PRICE, DEFAULT_CREATOR_FEE, DEFAULT_TOTAL_PRICE, HOUR } from "./constants";
import { time } from "@nomicfoundation/hardhat-network-helpers";

// TODO: pass as a parameter
const DEVELOPER_ADDRESS = "0xD0C1c389A5879da74B035614835A0D98c4c0DD5c";

describe("Lottery", () => {
  let lotteryDeployer: LotteryDeployer;
  let lottery: Lottery;
  let owner: HardhatEthersSigner;

  before(async () => {
    [owner] = await ethers.getSigners();
    const contractFactory = await ethers.getContractFactory("LotteryDeployer");
    lotteryDeployer = (await contractFactory.deploy({ from: owner.address })) as LotteryDeployer;
    await lotteryDeployer.waitForDeployment();

    await lotteryDeployer.createLottery(
      "Lottery Of Account 2 #2",
      DEFAULT_TICKET_PRICE,
      DEFAULT_CREATOR_FEE,
      0,
      4 * HOUR,
    );
    lottery = await ethers.getContractAt("Lottery", await lotteryDeployer.lotteries(owner.address, 0));
  });

  it("should have the correct developer address", async () => {
    expect(await lottery.DEVELOPER_ADDRESS()).to.equal(DEVELOPER_ADDRESS);
  });

  it("should not allow betting not equal totalPrice", async () => {
    await expect(lottery.bet({ value: DEFAULT_TOTAL_PRICE - 10n })).to.be.revertedWith("Invalid bet amount");
  });

  it("should allow to bet", async () => {
    expect(lottery.bet({ value: DEFAULT_TOTAL_PRICE })).to.ok;
  });

  describe("Close lottery", () => {
    it("should not allow to close lottery before time passes", async () => {
      await time.increase(HOUR);
      await expect(lottery.closeLottery()).to.revertedWith("Too soon to close");
    });

    it("should allow to close lottery after time passes", async () => {
      await time.increase(4 * HOUR + 1);
      expect(await lottery.closeLottery()).to.ok;
    });

    it("doesn't allow to close already closed lottery", async () => {
      await expect(lottery.closeLottery()).to.revertedWith("Already closed");
    });
  });
});
