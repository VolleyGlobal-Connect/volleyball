// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;
import {AggregatorV3Interface} from "lib/chainlink-brownie-contracts/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";
// 0x694AA1769357215DE4FAC081bf1f309aDC325306
import {PriceConverter} from "./PriceConverter.sol";

error Fund__MinimumAmtShouldBeGreaterThenZero();
error Fund__NotOwner();
error Fund__TransactionFailed();

contract Fund {
    using PriceConverter for uint256;

    AggregatorV3Interface private s_priceFeed;
    uint256 private constant MINIMUM_USD = 1e18;
    address private immutable i_owner;
    uint256 private s_fund_raised;
    mapping(address => uint256) private s_addressToAmountFunded;
    address[] private s_funders;

    constructor(address priceFeed) {
        i_owner = msg.sender;
        s_priceFeed = AggregatorV3Interface(priceFeed);
    }

    modifier minimumAmount() {
        require(
            msg.value.getConversion(s_priceFeed) >= MINIMUM_USD,
            Fund__MinimumAmtShouldBeGreaterThenZero()
        );
        _;
    }
    modifier onlyOwner() {
        require(msg.sender == i_owner, Fund__NotOwner());
        _;
    }

    function fund() public payable minimumAmount {
        s_funders.push(msg.sender);
        s_addressToAmountFunded[msg.sender] += msg.value;
        s_fund_raised += msg.value;
    }

    function withdraw() public onlyOwner {
        uint256 funderLength = s_funders.length;
        for (uint256 i = 0; i < funderLength; i++) {
            address funder = s_funders[i];
            s_addressToAmountFunded[funder] = 0;
        }
        s_funders = new address[](0);
        uint256 amount = address(this).balance;
        s_fund_raised = 0;
        (bool callSuccess, ) = payable(msg.sender).call{value: amount}("");
        require(callSuccess, Fund__TransactionFailed());
    }

    function getVersion() public view returns (uint256) {
        return s_priceFeed.version();
    }

    receive() external payable {
        fund();
    }

    fallback() external payable {
        fund();
    }

    /**
     *  View/Pure functions (Getters)
     */
    function getAddressToAmountFunded(
        address fundingAddress
    ) external view returns (uint256) {
        return s_addressToAmountFunded[fundingAddress];
    }

    function getFunder(uint256 index) external view returns (address) {
        return s_funders[index];
    }

    function getOwner() external view returns (address) {
        return i_owner;
    }

    function getFundRaised() external view returns (uint256) {
        return s_fund_raised;
    }

    function getPriceFeed() external view returns (AggregatorV3Interface) {
        return s_priceFeed;
    }
}
