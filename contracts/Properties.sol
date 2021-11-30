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
        uploadProperty(msg.sender, "Viladecans", 150000);
    }

    // ----------------------- MAPPINGS -----------------------
    mapping (uint256 => Property) public properties;
    mapping (address => Property) public propertiesByAddr;
    Property[] public props;

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
        // uint256 selledAt,
        uint256 createdAt
    );

    event isPropertySelled (uint256 index, bool isSelled);

    // ----------------------- FUNCTIONS -----------------------
    // Returns a generate random number 
    function getRandomId() private view returns (uint)
    { 
        return uint(keccak256(abi.encodePacked(block.difficulty, block.timestamp, msg.sender)))%uint(now);
    }

    // Creates a new property, emit PropertyCreated event
    function uploadProperty(address _address, string _city, uint256 _price) public
    {
        propertiesByAddr[_address] = Property(getRandomId(), _address, _city, _price, false, block.timestamp);
        properties[propertyCounter] = Property(getRandomId(), _address, _city, _price, false, block.timestamp);
        props.push(Property(getRandomId(), _address, _city, _price, false, block.timestamp));
        propertyCounter++;
        emit PropertyCreated(getRandomId(), _address, _city, _price, false, block.timestamp);
    }

    function getAllProperties() public view returns (uint)
    {
        return propertyCounter;
    }

    // Get property from owner @
    function getProperty(address _address) public view returns (uint256, address, bool)
    {
       return (propertiesByAddr[_address].id, propertiesByAddr[_address].owner, propertiesByAddr[_address].isSelled);
    }

    function buyProperty(address _address) public payable 
    {
        // PENDING 1: Pass the value in Eth
        // require(msg.value == 3 ether);

        // PENDING 2: Change the owner after sell the property
        // It maybe can be filter the properties by ID

        // propertiesByAddr[_address].owner = _address; 
        propertiesByAddr[_address].isSelled = true;

        // PENDING 3: Replace the property from the mapping properties...
        // for show a correct status in the platform

        // PENDING 4: Emit an event
    }

}