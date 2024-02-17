// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "./priceConvert.sol";

error FundMe_NotOwner();

contract FundMe {
    using priceConvert for uint256;
    uint256 public constant Min_USD = 50*10**18;
    address private immutable i_owner;
    address [] public sender;
    AggregatorV3Interface public priceFeed;

    mapping (address => uint256) private addressToAmount;
    
    constructor(address s_priceFeed) {
        i_owner = msg.sender;
        priceFeed = AggregatorV3Interface(s_priceFeed);
    }

    modifier onlyOwner{
        if(msg.sender != i_owner){
            revert FundMe_NotOwner();
        }
        _;
    }

    receive() external payable{
        fund();
    }
    fallback() external payable{
        fund();
    }

    function fund () public payable{
        require (msg.value.getConversionRate() >= Min_USD,"Didn't send enough");
        sender.push(msg.sender);
        addressToAmount[msg.sender] = msg.value;
    }

    function withdraw () public onlyOwner{
        for(uint256 funding =0;funding<sender.length;funding++){
            address funder = sender[funding];
            addressToAmount[funder] =0;
        }

        sender = new address [](0);
        //Transfer
        //payable(msg.sender).transfer(address(this).balance);
        //Send
        //bool agree = payable(msg.sender).send(address(this).balance);
        //require(agree,"Didn't Send it Correctly");
        //Call
        (bool trans,) = payable(msg.sender).call{value:address(this).balance}("");
        require(trans,"Call Failed") ;
    }

    function cheaperWithdraw() public payable onlyOwner {
        (bool trans,) = payable(msg.sender).call{value:address(this).balance}("");
        require(trans,"Call Failed") ;

        for (uint256 index = 0; index< sender.length ; index++){
            address funder = sender[index];
            addressToAmount[funder] =0;
        }
                sender = new address [](0);
    }
}