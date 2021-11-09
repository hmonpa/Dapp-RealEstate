// SPDX-License-Identifier: MIT
pragma solidity ^0.4.24;  

import "@chainlink/contracts/src/v0.4/interfaces/AggregatorV3Interface.sol";

contract PriceConverter {
    AggregatorV3Interface internal eth_usd_price_feed;

    /**
    * Aggregator: ETH/USD 
    * Address: 0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419
    */
    constructor() public{
        eth_usd_price_feed = AggregatorV3Interface(0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419);
    }

    function getEthUsd() public view returns (int) {
        ( 
            uint80 roundID,
            int price,
            uint startedAt,
            uint timestamp,
            uint answeredInRound
        ) = eth_usd_price_feed.latestRoundData();

        return price;
    }

    
}