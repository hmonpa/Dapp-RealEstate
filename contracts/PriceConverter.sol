// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../node_modules/@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

/**
 * THIS EXAMPLE USES UN-AUDITED CODE.
 * Network: Kovan
 * Base: ETH/USD
 * Base Address: 0x9326BFA02ADD2366b30bacB125260Af641031331
 * Quote: EUR/USD
 * Quote Address: 0x0c15Ab9A0DB086e062194c273CC79f41597Bbf13
 * Decimals: 8
 */

contract PriceConverter {
    AggregatorV3Interface internal eth_usd_price_feed;
    AggregatorV3Interface internal eur_usd_price_feed;
    constructor() {
        eth_usd_price_feed = AggregatorV3Interface(0x9326BFA02ADD2366b30bacB125260Af641031331);
        eur_usd_price_feed = AggregatorV3Interface(0x0c15Ab9A0DB086e062194c273CC79f41597Bbf13);
    }

    function getBalance() public view returns (uint) {
        return address(this).balance;
    }


    function getEthUsd() public view returns (int) {
        (
            uint80 roundID, 
            int price,
            uint startedAt,
            uint timeStamp,
            uint80 answeredInRound
        ) = eth_usd_price_feed.latestRoundData();

        return price;
    }

    function getEurUsd() public view returns (int) {
        (
            uint80 roundID, 
            int price,
            uint startedAt,
            uint timeStamp,
            uint80 answeredInRound
        ) = eur_usd_price_feed.latestRoundData();

        return price;
    }

    function getEthEur(uint _amountInEur) public view returns (uint) {

        uint newInput = _amountInEur * 10 ** 8;

        uint EthUsd = uint(getEthUsd());
        uint EurUsd = uint(getEurUsd());

        return newInput * EurUsd / EthUsd;

    }
    // function getDerivedPrice(address _base, address _quote, uint8 _decimals)
    //     public
    //     view
    //     returns (int256)
    // {
    //     require(_decimals > uint8(0) && _decimals <= uint8(18), "Invalid _decimals");
    //     int256 decimals = int256(10 ** uint256(_decimals));
    //     ( , int256 basePrice, , , ) = AggregatorV3Interface(_base).latestRoundData();
    //     uint8 baseDecimals = AggregatorV3Interface(_base).decimals();
    //     basePrice = scalePrice(basePrice, baseDecimals, _decimals);

    //     ( , int256 quotePrice, , , ) = AggregatorV3Interface(_quote).latestRoundData();
    //     uint8 quoteDecimals = AggregatorV3Interface(_quote).decimals();
    //     quotePrice = scalePrice(quotePrice, quoteDecimals, _decimals);

    //     return basePrice * decimals / quotePrice;
    // }

    // function scalePrice(int256 _price, uint8 _priceDecimals, uint8 _decimals)
    //     internal
    //     pure
    //     returns (int256)
    // {
    //     if (_priceDecimals < _decimals) {
    //         return _price * int256(10 ** uint256(_decimals - _priceDecimals));
    //     } else if (_priceDecimals > _decimals) {
    //         return _price / int256(10 ** uint256(_priceDecimals - _decimals));
    //     }
    //     return _price;
    // }
}