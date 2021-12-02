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
        bool isSold;
        uint256 sellOrRent;
        uint256 createdAt;
        uint256 soldAt;
    }
    constructor() public
    {
        uploadProperty(msg.sender, "Viladecans", 5000, 1);
    }

    // ----------------------- MAPPINGS -----------------------
    mapping (uint256 => Property) public properties;
    Property[] public props;

    // ----------------------- EVENTS -----------------------
    event PropertyCreated(
        uint256 id,                     
        address owner,
        // string prAddress,            
        string city,
        uint256 price,
        bool isSold,                    
        uint sellOrRent,                // 1 = SELL / 0 = RENT     
        // uint256 area,                // Area in m²
        // uint256 rooms,               // Num of rooms
        // uint256 bathrooms,           // Num of bathrooms
        // uint256 soldAt,
        uint256 createdAt,
        uint256 soldAt
    );

    event isPropertySold (address addr, bool isSold, uint256 price);

    // ----------------------- FUNCTIONS -----------------------
    
    // Returns a generate random number 
    function getRandomId() private view returns (uint)
    { 
        return uint(keccak256(abi.encodePacked(block.difficulty, block.timestamp, msg.sender)))%uint(now);
    }

    // Converts EUR to Wei (10^18 ETH)
    function eurToWei(uint256 _price) public pure returns (uint)
    {
        return _price*243739092347530; 
    }

    // Creates a new property, emit PropertyCreated event
    function uploadProperty(address _address, string _city, uint256 _price, uint256 _sellOrRent) public
    {
        properties[propertyCounter] = Property(getRandomId(), _address, _city, eurToWei(_price), false, _sellOrRent, block.timestamp, 0);
        props.push(Property(getRandomId(), _address, _city, eurToWei(_price), false, _sellOrRent, block.timestamp, 0));
        propertyCounter++;
        emit PropertyCreated(getRandomId(), _address, _city,eurToWei(_price), false,  _sellOrRent, block.timestamp, 0);
    }

    // Returns the number of properties already created
    function getAllProperties() public view returns (uint)
    {
        return propertyCounter;
    }

    // Get a property by their ID
    function getPropertyById(uint256 _id) public view returns (uint)
    {
        for (uint i = 0; i < propertyCounter; i++)
        {
            if (_id == props[i].id) return i;
        }
        revert('Not found');
    }

    // Send balance to account
    function sendBalance(address _receiver, uint256 _amount) payable external {
        _receiver.transfer(_amount);
    }

    // Buy property
    function buyProperty(address _address, uint256 _id) public payable
    {
        uint index = this.getPropertyById(_id);
        require(msg.value == props[index].price);
        
        // Send the value in Eth to the original owner
        address addr = props[index].owner;
        this.sendBalance(addr, msg.value);

        // Changes the value of the boolean 
        props[index].isSold = true;
        properties[index].isSold = true;

        // Emit an event
        emit isPropertySold(addr, props[index].isSold, props[index].price);
        
        // Changes the owner after sell the property and
        // replace the property status from mapping and array
        props[index].owner = _address;
        properties[index].owner = _address;
    }
}