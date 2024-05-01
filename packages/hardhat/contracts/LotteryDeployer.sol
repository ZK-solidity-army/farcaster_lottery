// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { Lottery } from "./Lottery.sol";

/// @title Deploys the Lottery contract
/// @author @ZK-solidity-army
/// @notice You can use this contract to deploy the custom Lottery
contract LotteryDeployer is Ownable {
  mapping(address => mapping (uint256 => address)) public lotteries;
  mapping(address => uint256) public lotteryCount;

  /// @notice Constructor function
  /// @dev Initializes the contract setting the deployer as the owner
  constructor() Ownable(msg.sender) {}

  /// @notice Creates a new Lottery contract
  /// @dev Deploys a new Lottery contract and stores the address in the lotteries mapping
  function createLottery(uint256 duration) external {

    require(duration <= 14 days);

    Lottery lottery = new Lottery(block.timestamp + duration);
    uint256 index = lotteryCount[msg.sender];
    lotteries[msg.sender][index] = address(lottery);
    lotteryCount[msg.sender]++;
  }

  function createLottery() external {
    //if no duration is provided when creating a lottery, it defaults to 14 days
    Lottery lottery = new Lottery(block.timestamp + 14 days);
    uint256 index = lotteryCount[msg.sender];
    lotteries[msg.sender][index] = address(lottery);
    lotteryCount[msg.sender]++;
  }
}
