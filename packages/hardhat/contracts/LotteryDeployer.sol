// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { Lottery } from "./Lottery.sol";

/// @title Deploys the Lottery contract
/// @author @ZK-solidity-army
/// @notice You can use this contract to deploy the custom Lottery
contract LotteryDeployer is Ownable {
  mapping(address => address[]) public lotteries;
  mapping(address => uint256) public lotteryCount;

  /// @notice Constructor function
  /// @dev Initializes the contract setting the deployer as the owner
  constructor() Ownable(msg.sender) {}

  /// @notice Creates a new Lottery contract
  /// @dev Deploys a new Lottery contract and stores the address in the lotteries mapping
  function createLottery(string memory _lotteryName, uint256 _ticketPrice, uint256 _creatorFee, uint256 _deposit, uint256 _duration) external payable {
    Lottery lottery = new Lottery(_lotteryName, _ticketPrice, _creatorFee, _deposit, _duration);
    lotteries[msg.sender].push(address(lottery));
    lotteryCount[msg.sender]++;
  }
}
