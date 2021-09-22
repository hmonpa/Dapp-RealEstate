// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.7;                     // Compiler version
import "./ERC20.sol";                       
/// @title real estate transaction          // natspec comments (Solidity estandar comments)
/// @author hmonpa

contract transaction{                       // Contract name

    address buyer;
    address seller;                         // Variables declaration
    ERC20Basic token;

    constructor() public{
        buyer = msg.sender;                 // Variables initialization
        token = new ERC20Basic(1000);
    }
}