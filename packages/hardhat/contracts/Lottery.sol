// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";

/// @title Lottery contract
/// @author @ZK-solidity-army
/// @notice You can use this contract to deploy the custom Lottery
/// @dev This contract implements a relatively weak randomness source, since there is no cliff period between the randao reveal and the actual usage in this contract
contract Lottery is AccessControl {

    bytes32 public constant CREATOR_ROLE = keccak256("CREATOR_ROLE");
    bytes32 public constant WINNER_ROLE = keccak256("WINNER_ROLE");
    bytes32 public constant DEVELOPER_ROLE = keccak256("DEVELOPER_ROLE");
    address public constant DEVELOPER_ADDRESS = 0xD0C1c389A5879da74B035614835A0D98c4c0DD5c;

    uint256 public constant developerFee = 10 ** 15;
    uint256 public ticketPrice;
    uint256 public creatorFee = 0;
    uint256 public totalPrice;

    /// @notice Amount available to withdraw to the lottery creator
    uint256 public creatorPool;

    /// @notice Amount available to withdraw to the developer of the lottery
    uint256 public developerPool;

    /// @notice Amount in the prize pool potentially available to the winner(s)
    uint256 public prizePool;

    /// @notice Flag indicating whether the lottery is open for bets or not
    bool public betsOpen = true;

    /// @notice Timestamp of the lottery closing time
    uint256 public betsClosingTime;

    string lotteryName;

    /// @dev List of bet slots
    address[] public _slots;

    event PrizeWithdraw(
        address indexed to,
        uint value
    );

    constructor(string memory _lotteryName, uint256 _ticketPrice, uint256 _creatorFee, uint256 _deposit, uint256 _duration) payable {
        require(_creatorFee < _ticketPrice / 4, "Creator fee too high, max 25% of ticket price");
        require(_duration < 14 days, "Lottery cannot be open for longer than 14 days");
        require(_deposit == msg.value, "Invalid deposit amount");

        if (_duration == 0) {
            betsClosingTime = block.timestamp + 14 days;
        } else {
            betsClosingTime = block.timestamp + _duration;
        }

        creatorFee = _creatorFee;
        lotteryName = _lotteryName;
        ticketPrice = _ticketPrice;
        totalPrice = _ticketPrice + developerFee + _creatorFee;
        prizePool = _deposit;

        _grantRole(CREATOR_ROLE, msg.sender);
        _grantRole(DEVELOPER_ROLE, DEVELOPER_ADDRESS);
    }

    /// @notice checks if the lottery is at open state and the current block timestamp is lower than the lottery closing date
    modifier whenBetsOpen() {
        require(
            betsOpen && block.timestamp < betsClosingTime,
            "Lottery is closed"
        );
        _;
    }

    /// @notice checks if the lottery is at closed state and the current block timestamp is higher than the lottery closing date
    modifier whenBetsClosed() {
        require(
            !betsOpen && block.timestamp > betsClosingTime,
            "Lottery is still running."
        );
        _;
    }

    /// @notice Allows a user to bet on the lottery
    function bet() public payable whenBetsOpen {
        require(msg.value == totalPrice, "Invalid bet amount");

        developerPool += developerFee;
        creatorPool += creatorFee;
        prizePool += ticketPrice;
        _slots.push(msg.sender);
    }

    /// @notice Returns a random number calculated from the previous block randao
    /// @dev This only works after The Merge
    function getRandomNumber() public view returns (uint256 randomNumber) {
        randomNumber = block.prevrandao;
    }

    /// @notice Closes the lottery and calculates the prize, if any
    /// @dev Anyone can call this function at any time after the closing time
    function closeLottery() external {
        require(block.timestamp >= betsClosingTime, "Too soon to close");
        require(betsOpen, "Already closed");
        if (_slots.length > 0) {
            uint256 winnerIndex = getRandomNumber() % _slots.length;
            address winner = _slots[winnerIndex];
            _grantRole(WINNER_ROLE, winner);
        }
        betsOpen = false;
    }

    /// @notice Allows the winner to withdraw the prize pool
    function withdrawPrizePool() public whenBetsClosed onlyRole(WINNER_ROLE) {
        payable(msg.sender).transfer(prizePool);
        emit PrizeWithdraw(msg.sender, prizePool);
        prizePool = 0;
    }

    /// @notice Allows the lottery creator to withdraw the creator pool
    function withdrawStarterFees() public whenBetsClosed onlyRole(CREATOR_ROLE) {
        payable(msg.sender).transfer(creatorPool);
        creatorPool = 0;
    }

    /// @notice Allows the lottery creator to withdraw the creator pool
    function withdrawDeveloperFees() public whenBetsClosed onlyRole(DEVELOPER_ROLE) {
        payable(msg.sender).transfer(developerPool);
        developerPool = 0;
    }
}
