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
        uploadProperty("Viladecans", 150000);
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

    event isPropertySelled (uint256 id, bool isSelled);

    // ----------------------- FUNCTIONS -----------------------
    // Generates random number 
    function getRandomId() private view returns (uint)
    { 
        return uint(keccak256(abi.encodePacked(block.difficulty, block.timestamp, msg.sender)))%20000;
    }

    // Creates a new property
    function uploadProperty(string _city, uint256 _price) public payable
    {
        properties[propertyCounter] = Property(getRandomId(), msg.sender, _city, _price, false, block.timestamp);
        emit PropertyCreated(getRandomId(), msg.sender, _city, _price, false, block.timestamp);
        propertyCounter++;
    }

    // Get index from @
    function getPropertyFromIndex(uint _index) public view returns (address)
    {
        if (_index <= propertyCounter) return properties[_index].owner;
        else return 0x0;
    }

    // Get @ from index
    function getPropertiesFromOwner(address _address) public view returns (uint[])
    {
        uint[] propertiesMatch;
        for (uint i = 0; i < propertyCounter; i++)
        {
            if (_address == properties[i].owner) propertiesMatch.push(i);
        }
    }

    // Marks the property as sold
    function removeProperty(uint _i) public{
        Property memory _property = properties[_i];
        _property.isSelled = true;

        properties[_i] = _property;
        emit isPropertySelled(_i, _property.isSelled);
    }
}