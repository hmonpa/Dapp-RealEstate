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
    // mapping (address => Property) public propertiesByAddr;
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

    event isPropertySelled (address addr, bool isSelled, uint256 price);

    // ----------------------- FUNCTIONS -----------------------
    // Returns a generate random number 
    function getRandomId() private view returns (uint)
    { 
        return uint(keccak256(abi.encodePacked(block.difficulty, block.timestamp, msg.sender)))%uint(now);
    }

    function eurToWei(uint256 _price) public pure returns (uint)
    {
        return _price*243739092347530; 
    }

    // Creates a new property, emit PropertyCreated event
    function uploadProperty(address _address, string _city, uint256 _price) public
    {
        // propertiesByAddr[_address] = Property(getRandomId(), _address, _city, _price, false, block.timestamp);
        properties[propertyCounter] = Property(getRandomId(), _address, _city, eurToWei(_price), false, block.timestamp);
        props.push(Property(getRandomId(), _address, _city, eurToWei(_price), false, block.timestamp));
        propertyCounter++;
        emit PropertyCreated(getRandomId(), _address, _city,eurToWei(_price), false, block.timestamp);
    }

    function getAllProperties() public view returns (uint)
    {
        return propertyCounter;
    }

    
    function getPropertyById(uint256 _id) public view returns (uint)
    {
        for (uint i = 0; i < propertyCounter; i++)
        {
            if (_id == props[i].id) return i;
        }
        if (i == propertyCounter) return 0;
    }

    // Get property from owner @
    // function getPropertyByAddr(address _address) public view returns (uint256, address, bool)
    // {
    //    return (propertiesByAddr[_address].id, propertiesByAddr[_address].owner, propertiesByAddr[_address].isSelled);
    // }

    function buyProperty(address _address, uint256 _id) public payable
    {
        uint index = this.getPropertyById(_id);
        require(msg.value == props[index].price);
        
        address addr = props[index].owner;

        // Changes the value of the boolean 
        props[index].isSelled = true;
        properties[index].isSelled = true;

        // Changes the owner
        props[index].owner = _address;
        properties[index].owner = _address;

        // Emit an event
        emit isPropertySelled(addr, props[index].isSelled, props[index].price);

        // PENDING 1: Pass the value in Eth
        // require(msg.value == 3 ether);

        // PENDING 2: Change the owner after sell the property
        // It maybe can be filter the properties by ID

        // propertiesByAddr[_address].owner = _address;
        // PENDING 3: Replace the property from the mapping properties...
        // for show a correct status in the platform

        // PENDING 4: Emit an event
    }

}