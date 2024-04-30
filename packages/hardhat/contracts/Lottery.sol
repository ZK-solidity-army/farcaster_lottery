// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";

/// @title Lottery contract
/// @author @ZK-solidity-army
/// @notice You can use this contract to deploy the custom Lottery
contract Lottery is Ownable {

  /// @notice Constructor function
  constructor() Ownable(msg.sender) {}
}
