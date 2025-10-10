// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.30;

import {AggregatorV3Interface} from
    "lib/chainlink-brownie-contracts/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";

library PriceConverter {
    function getPrice(AggregatorV3Interface dataFeed) internal view returns (uint256) {
        (, int256 answer,,,) = dataFeed.latestRoundData();
        return uint256(answer * 1e10);
    }

    function getConversion(uint256 ethAmount, AggregatorV3Interface dataFeed) internal view returns (uint256) {
        uint256 ethPrice = getPrice(dataFeed);
        uint256 ethAmountInUSD = (ethPrice * ethAmount) / 1e18;
        return ethAmountInUSD;
    }
}
