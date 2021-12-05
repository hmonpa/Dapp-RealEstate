// SPDX-License-Identifier: MIT
pragma solidity ^0.4.24;

contract Properties {

    uint public propertyCounter = 0;
    struct Property 
    {
        uint256 id;                     // Catastro?               
        address owner;
        string city;
        string physicalAddr;            
        uint256 price;
        uint256 rooms;
        uint256 area;
        uint256 bathrooms;
        uint sellOrRent;   

        // Rental attributes
        uint256 tokens;
        uint256 rentalEndDate;           // ! If sellOrRent == 0
        
        // Dates
        uint256 createdAt;
        uint256 soldOn;              
    }
    
    constructor() public
    {
        uploadProperty(
            msg.sender,                         // Owner
            "Sant Boi de Llobregat",            // City
            "C/ Mossèn Antoni Solanes, 105",    // Physical address
            5000,                               // Price in EUR
            3,                                  // Num of rooms 
            80,                                 // Area in m²
            1,                                  // Num of bathrooms
            1,                                  // Sell --> 1
            0,                                  // Tokens
            0                                   // Rental end date
        );
    }

    // ----------------------- MAPPINGS -----------------------
    mapping (uint256 => Property) public properties;
    Property[] public props;

    // ----------------------- EVENTS -----------------------
    event PropertyCreated(
        uint256 id,             
        address owner,
        string city,
        string physicalAddr,            
        uint256 price,
        uint sellOrRent,
        uint256 createdAt
    );

    event isPropertySold (address addr, uint256 price, uint256 soldOn);
    event isPropertyRent (address addr, uint256 price, uint256 rentalEndDate);
    event propertyTokenPurchased (address from, uint256 idProperty, uint256 numberOfTokens, uint256 pricePerToken);

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
    function uploadProperty(address _owner, string _city, string _physicalAddr, uint256 _price, uint256 _numRooms, uint256 _area, uint256 _numBathrooms, uint256 _sellOrRent, uint256 _tokens, uint256 _rentalEndDate) public
    {
        Property memory newProperty = Property(getRandomId(), _owner, _city, _physicalAddr, eurToWei(_price), _numRooms, _area, _numBathrooms, _sellOrRent,  _tokens, _rentalEndDate, block.timestamp, 0);
        properties[propertyCounter] = newProperty;
        props.push(newProperty);
        propertyCounter++;
        emit PropertyCreated(getRandomId(), _owner, _city, _physicalAddr, eurToWei(_price), _sellOrRent, block.timestamp);
    }

    // Update number of tokens
    // function updateTokens(uint256 _id, uint256 _num) public
    // {
    //     uint index = getPropertyById(_id);
    //     uint256 currentTokens = props[index].tokens;
    //     currentTokens = currentTokens - _num;
    //     props[index].tokens = currentTokens;
    // }

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
        this.propertySettled(index);

        // Emit an event
        emit isPropertySold(_address, props[index].price, props[index].soldOn);
        
        // Changes the owner after sell the property and
        // replace the property status from mapping and array
        props[index].owner = _address;
        properties[index].owner = _address;
    }

    // Rent property
    function rentProperty(address _address, uint256 _id, uint256 _rentalEndDate) public payable
    {
        uint index = this.getPropertyById(_id);
        require(msg.value == props[index].price);

        // Send the value in Eth to the original owner
        address addr = props[index].owner;
        this.sendBalance(addr, msg.value);

        // Changes the value of the boolean 
        this.propertySettled(index);
        
        // Emit an event
        emit isPropertyRent(_address, props[index].price, _rentalEndDate);
    }

    // Buy token (or tokens) of a property
    function buyTokens(address _from, uint256 _numTokens, uint256 _id) public payable
    {
        uint index = getPropertyById(_id);
        uint256 currentTokens = props[index].tokens;
        this.sendBalance(props[index].owner, msg.value); // Msg value is price / numTokens
        currentTokens = currentTokens - _numTokens;
        props[index].tokens = currentTokens;

        if(currentTokens == 0) this.propertySettled(index);

        emit propertyTokenPurchased(_from, _id, _numTokens, (props[index].price/_numTokens));
    }   

    function propertySettled(uint256 _index) public 
    {
        props[_index].soldOn         = block.timestamp;
        properties[_index].soldOn    = block.timestamp;
    }

}