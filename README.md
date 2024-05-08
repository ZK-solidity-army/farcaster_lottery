# Farcaster Lottery ![lint](https://github.com/ZK-solidity-army/farcaster_lottery/actions/workflows/lint.yaml/badge.svg) ![deploy](https://github.com/ZK-solidity-army/farcaster_lottery/actions/workflows/deploy.yaml/badge.svg)

- https://farcaster-lottery.xyz
- [Docs](https://farcaster-lottery.gitbook.io/docs)

## Quickstart

- [Node (>= v18.17)](https://nodejs.org/en/download/)
- Yarn ([v1](https://classic.yarnpkg.com/en/docs/install/) or [v2+](https://yarnpkg.com/getting-started/install))


### Smartcontract

```
yarn install
yarn deploy
```

Development
```
yarn chain
yarn compile
yarn test
```

### NextJS frontend

```
yarn install
yarn start:dev
```

Development
```
ngrok http 3000
yarn next:frames
```

### Quickstart for newbies
```bash
# clone repo
git clone https://github.com/ZK-solidity-army/farcaster_lottery.git
cd farcaster_lottery

# Smart contract
## install dependencies
cd packages/hardhat
yarn install
## compile smart contract
yarn compile
## deploy smart contract in a local hardhat node
yarn chain
## deploy smart contract in a local hardhat node
yarn deploy

# Frontend  
cd packages/nextjs
## install dependencies
yarn install
## start frontend
yarn start:dev
## open frontend in browser
## open http://localhost:3000

## start nextjs frames farcaster 
## it's need only post localhost:3000 to farcaster

## install ngrok for macos (https://ngrok.com/download)
 brew install ngrok/ngrok/ngrok
## register ngrok account and generate api key, then set it to global config
ngrok config add-authtoken <your-api-key>
## start ngrok
ngrok http 3000

yarn next:frames

```
### How to check list of lotteries by script ?
- [ ] check your .env file for a new environment variables
- [ ] run `yarn list-lotteries` script


# Documentation

- [Farcaster Lottery  ](#farcaster-lottery--)
  - [Quickstart](#quickstart)
    - [Smartcontract](#smartcontract)
    - [NextJS frontend](#nextjs-frontend)
    - [Quickstart for newbies](#quickstart-for-newbies)
    - [How to check list of lotteries by script ?](#how-to-check-list-of-lotteries-by-script-)
- [Documentation](#documentation)
  - [How it works](#how-it-works)
  - [Code Structure](#code-structure)
  - [Current Feature Realization](#current-feature-realization)
  - [How to create a lottery](#how-to-create-a-lottery)
  - [How to participate in a lottery](#how-to-participate-in-a-lottery)
  - [How to initiate a draw](#how-to-initiate-a-draw)
  - [How to withdraw fees (for Lottery Creator and Developer)](#how-to-withdraw-fees-for-lottery-creator-and-developer)
    - [Lottery Creator](#lottery-creator)
    - [Developer](#developer)
  - [How to withdraw prize (for Winner)](#how-to-withdraw-prize-for-winner)

## How it works

1. Anyone can create a new lottery by becoming the Lottery Creator.
2. The Lottery Factory smart contract automatically deploys a new Lottery smart contract based on the creator's input. 
3. Users can participate by purchasing tickets. Each ticket has a default price of 0.001 ETH plus fees.
4. The lottery closes when the specified closing date is reached. 
5. After the closing date, anyone can initiate the draw to randomly select a winner from the ticket owners.
6. The Lottery Creator and Developer can withdraw their fees. The prize pool is transferred to the winner.

## Code Structure

- `packages/hardhat/contracts/`: Contains the Lottery and LotteryDeployer smart contracts.
- `packages/hardhat/test/`: Unit tests for the smart contracts.
- `packages/nextjs/`: The Next.js frontend code for interacting with the lottery.
- `packages/nextjs/contracts/`: Automatically generated TypeScript types for the smart contracts.

## Current Feature Realization

Based on the specification in `Lottery SMC base case scenario_v2.md`:

- [x] Lottery Creator role
  - `packages/hardhat/contracts/Lottery.sol`: `STARTER_ROLE` constant
- [x] Lottery Smart Contract 
  - `packages/hardhat/contracts/Lottery.sol`: `Lottery` contract
- [x] Lottery Factory
  - `packages/hardhat/contracts/LotteryDeployer.sol`: `LotteryDeployer` contract
  - `packages/hardhat/contracts/LotteryDeployer.sol`: `createLottery` function
- [x] User Participant and Winner roles
  - `packages/hardhat/contracts/Lottery.sol`: `WINNER_ROLE` constant  
- [x] Developer fee collection
  - `packages/hardhat/contracts/Lottery.sol`: `DEV_FEE` constant
  - `packages/hardhat/contracts/Lottery.sol`: `developerPool` variable
- [x] Ticket purchase with default price and fees
  - `packages/hardhat/contracts/Lottery.sol`: `TICKET_PRICE` constant
  - `packages/hardhat/contracts/Lottery.sol`: `STATER_FEE` constant
- [x] Storing number of tickets per user
  - `packages/hardhat/contracts/Lottery.sol`: `tickets` mapping
- [x] Lottery closure based on closing date 
  - `packages/hardhat/contracts/Lottery.sol`: `closingDate` variable 
  - `packages/hardhat/contracts/Lottery.sol`: `buyTicket` function check
- [x] Draw to select winner randomly weighted by tickets
  - `packages/hardhat/contracts/Lottery.sol`: `draw` function
- [ ] Lottery Creator fee withdrawal after draw
- [x] Developer fee withdrawal anytime
  - `packages/hardhat/contracts/Lottery.sol`: `withdrawDeveloperFee` function

Some planned enhancements like custom creator fees, deposits, token support, and additional lottery types are not yet implemented in the current version.

## How to create a lottery

1. Navigate to the lottery creation page in the frontend application.
2. Specify the lottery parameters, such as the closing date and any custom settings (if implemented).
3. Confirm the transaction to deploy a new Lottery smart contract via the LotteryDeployer factory contract.
   - Relevant code: `packages/hardhat/contracts/LotteryDeployer.sol`: `createLottery` function
4. Once the transaction is confirmed, the new lottery will be created and ready to accept participants.

## How to participate in a lottery

1. Choose the lottery you wish to participate in from the available lotteries listed in the frontend.
2. Click the "Buy Ticket" button and confirm the transaction to purchase a ticket.
   - Relevant code: `packages/hardhat/contracts/Lottery.sol`: `buyTicket` function
3. The ticket price (default: 0.001 ETH) plus fees will be deducted from your wallet, and you will be registered as a participant in the lottery.
   - Relevant code: `packages/hardhat/contracts/Lottery.sol`: `tickets` mapping

## How to initiate a draw

1. After the lottery's closing date has passed, navigate to the lottery's page in the frontend.
2. Click the "Initiate Draw" button to start the process of selecting a winner.
   - Relevant code: `packages/hardhat/contracts/Lottery.sol`: `draw` function
3. Confirm the transaction, and the smart contract will randomly select a winner from the pool of participants, weighted by the number of tickets each participant holds.

## How to withdraw fees (for Lottery Creator and Developer)

### Lottery Creator
1. Navigate to the lottery management page for the lottery you created.
2. After the draw has been initiated, click the "Withdraw Fees" button.
   - Relevant code: `packages/hardhat/contracts/Lottery.sol`: Lottery Creator fee withdrawal not yet implemented
3. Confirm the transaction to withdraw your fees (default: 5% of ticket sales) to your wallet.

### Developer
1. Navigate to the developer management page.
2. Click the "Withdraw Fees" button to collect your accumulated fees from all lotteries.
   - Relevant code: `packages/hardhat/contracts/Lottery.sol`: `withdrawDeveloperFee` function
3. Confirm the transaction, and your fees (default: 1% of ticket sales) will be transferred to your wallet.

## How to withdraw prize (for Winner)

1. After the draw has been initiated, check the lottery page to see if you have been selected as the winner.
2. If you are the winner, click the "Withdraw Prize" button.
   - Relevant code: Prize withdrawal not yet implemented in the smart contract
3. Confirm the transaction to receive the lottery's prize pool (minus fees) in your wallet.