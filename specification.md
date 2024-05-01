## Roles  
- a new lottery can be started by anyone, the person becomes the **lottery starter**. The lottery starter gets a part of each ticket sale. Let's say the base case is 5% (in the future, the percentage could be modified by the lottery starter).
- the lottery has "**the developer**" the wallet or wallets that can withdraw the developer's part of the fees. I propose that the developer's fee should be hardcoded for now at 1%. 
- **user** can buy lottery tickets. Only 1 ticket can be bought at once. The default price is 0.001 (base)Eth + the fees (5% to the lottery starter and 1% to the developer) = 0.0016 Eth
- **ticket holder** can buy more tickets. the number of tickets they purchased is stored in the contract
- **lottery winner** is a ticket owner chosen at random to collect the prize pool.

## Fields 
- lottery closing date (set when a lottery is created)
- lottery prize pool (incremented when a ticket is purchased)
- ticket owners array (address) where an address can appear multiple times according to the number of tickets purchased
- the winner (set by the draw)

## Features 
- when the closing date is reached, the lottery stops accepting bets. Anyone can initiate the draw after the closing date is reached
- The lottery starter can withdraw their fees only after the draw (it should stimulate the lottery starter to initiate the draw and pay the gas fees instead of some ticket owner)
- the draw selects the winner at random among ticket holders array by random index (because addresses may appear several times,  the probability corresponding to the number of tickets purchased is achieved)
- the developer can withdraw their fees any time
