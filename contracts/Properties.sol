// SPDX-License-Identifier: MIT
pragma solidity ^0.4.24;  

contract Properties {

    uint public propertyCounter = 0;
    struct Property 
    {
        uint256 id;
        address owner;
        string city;
        uint256 price;
        bool isSelled;
        uint256 createdAt;
    }
    constructor() public
    {
        // owner = msg.sender;                      // who creates the current transaction
        uploadProperty(msg.sender, "Viladecans", 150000);
    }

    // ----------------------- MAPPINGS -----------------------
    mapping (uint256 => Property) public properties;

    // ----------------------- EVENTS -----------------------
    event PropertyCreated(
        uint256 id,                     // ID
        address owner,
        // string prAddress,            // City address
        string city,
        uint256 price,
        bool isSelled,                  // Vendida?
        // bool sellOrRent,             // Sell? Rent?
        // uint256 area,                // Area in m²
        // uint256 rooms,               // Num of rooms
        // uint256 bathrooms,           // Num of bathrooms
        uint256 createdAt
    );

    event isPropertySelled (uint256 index, bool isSelled);

    // ----------------------- FUNCTIONS -----------------------
    // Returns a generate random number 
    function getRandomId() private view returns (uint)
    { 
        return uint(keccak256(abi.encodePacked(block.difficulty, block.timestamp, msg.sender)))%20000;
    }

    // Creates a new property, emit PropertyCreated event
    function uploadProperty(address _address, string _city, uint256 _price) public payable
    {
        properties[propertyCounter] = Property(getRandomId(), _address, _city, _price, false, block.timestamp);
        propertyCounter++;
        emit PropertyCreated(getRandomId(), _address, _city, _price, false, block.timestamp);
    }

    // Return the @ from index
    function getPropertyFromIndex(uint _index) public view returns (address)
    {
        if (_index <= propertyCounter) return properties[_index].owner;
        else return 0x0;
    }

    // Returns an array with the indexs, from @
    function getPropertiesFromOwner(address _address) public view returns (uint[])
    {
        uint[] storage propertiesMatch;
        for (uint i = 0; i < propertyCounter; i++)
        {
            if (_address == properties[i].owner) propertiesMatch.push(i);
        }

        return propertiesMatch;
    }

    // Marks the property as sold
    function removeProperty(uint _index) public{
        properties[_index].isSelled = true;
        emit isPropertySelled(_index, properties[_index].isSelled);
    }
}