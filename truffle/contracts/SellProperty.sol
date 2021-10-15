// SPDX-License-Identifier: MIT
pragma solidity ^0.4.24;  

contract SellProperty {
    address public owner;           // Owner = Seller in this case

    struct Buyer {
        uint totalProperties;
    }

    struct Property {
        string idProperty;
        uint price;
        // bool isTokenised;
        // string addr;
        // string city;
        // uint zipCode;
        // string country;
        // string cadastralRef;
    }

    struct tokenisedProperty {
        uint numTokens;
        uint priceToken;                // Price / numTokens
    }

    Property[] public properties;
    mapping(address => Buyer) public buyers;
    mapping(address => Property[]) public buyerProperties;
    mapping(address => uint) public buyerTotalProperties;

    event PropertyPurchased(address indexed buyer, uint price);
    constructor() public{
        owner = msg.sender;         // Who deploys the smart contract
        properties.push(Property('p123', 1 ether));
        properties.push(Property('a753', 2 ether));
    }

    function buyProperty(uint propertyIndex) public payable{
        Property storage property = properties[propertyIndex];
        require(msg.value == property.price);

        Buyer storage buyer = buyers[msg.sender];
        buyer.totalProperties += 1;
        buyerProperties[msg.sender].push(property);
        buyerTotalProperties[msg.sender]++;

        emit PropertyPurchased(msg.sender, property.price);
    }

    function totalProperties() public view returns(uint){
        return properties.length;
    }
}