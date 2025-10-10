// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import {Script, console} from "forge-std/Script.sol";
import {Fund} from "../src/Fund.sol";
import {HelperConfig} from "./HelperConfig.s.sol";

contract DeployFundMe is Script {
    function run() external returns (Fund) {
        HelperConfig helperConfig = new HelperConfig();
        address ethUsdPriceFeed = helperConfig.activeNetworkConfig();
        // console.log(ethUsdPriceFeed);
        vm.startBroadcast();
        Fund fund = new Fund(ethUsdPriceFeed);
        console.log("Eth USD Price Feed Address", ethUsdPriceFeed);

        vm.stopBroadcast();

        return fund;
    }
}
