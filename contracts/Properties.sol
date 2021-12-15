// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// import "https://github.com/0xcert/ethereum-erc721/src/contracts/tokens/nf-token-metadata.sol";
// import "https://github.com/0xcert/ethereum-erc721/src/contracts/ownership/ownable.sol";

contract Properties {

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
        // Dates
        uint256 createdAt;
        uint256 soldOn;
    }

    struct propertyForRenting
    {
        uint256 idProperty;
        uint256 rentalEndDate;
    }

    struct tokenizedProperty
    {
        uint256 idProperty;
        uint256 rentalEndDate;
        uint256 tokens;
    }

    struct initialTokens
    {
        uint256 id;
        uint256 tokens;
    }

    struct propertyImages
    {
        uint256 id;
        string ipfsImage;
    }

    
    constructor()
    {
        // Example for sell
        // uploadProperty(
        //     msg.sender,                         // Owner
        //     "Sant Boi de Llobregat",            // City
        //     "C/ Mossèn Antoni Solanes, 105",    // Physical address
        //     5000,                               // Price in EUR
        //     3,                                  // Num of rooms 
        //     80,                                 // Area in m²
        //     1,                                  // Num of bathrooms
        //     1,                                  // Sell --> 1 / Rent --> 0
        //     0,                                  // Tokens
        //     0                                   // Rental end date
        // );

        // Example for rent with tokens
        uploadProperty(
            msg.sender,                                         // Owner
            "Cunit",                                            // City
            "Avinguda Barcelona, 88, Bajo",                     // Physical address
            10000,                                              // Price in EUR
            2,                                                  // Num of rooms 
            60,                                                 // Area in m²
            1,                                                  // Num of bathrooms
            0,                                                  // Rent --> 0
            2,                                                  // Tokens
            1672614000,                                         // Rental end date
            'QmYUAQbT6Q4UZh4LdWtSH3sPbXvR2xWP2LqDtkM3JQcUrk'    // CID
        );
    }

    // ----------------------- MAPPINGS & VARIABLES -----------------------
    
    // Mappings
    mapping (uint256 => Property) public properties;
    mapping (uint256 => propertyForRenting) public rentalProperties;
    mapping (uint256 => tokenizedProperty) public tokenizedProperties;

    mapping (uint256 => initialTokens) public startedTokens;
    mapping (uint256 => propertyImages) public propertyImg;
    
    // Array
    Property[] public props;

    // Counter
    uint public propertyCounter = 0;

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
    event PropertyForRentingCreated(uint256 idProperty, uint256 rentalEndDate);
    event TokenizedPropertyCreated(uint256 idProperty, uint256 rentalEndDate, uint256 tokens);

    event propertySold (address soldBy, uint256 price, uint256 soldOn);
    event propertyRented (address rentedBy, uint256 price, uint256 rentalEndDate);
    event propertyTokenPurchased (address purchasedBy, uint256 idProperty, uint256 numberOfTokens, uint256 pricePerToken);
    event propertyRemoved (address byOwner, uint256 id);


    // ----------------------- FUNCTIONS -----------------------
    
    // Returns a generate random number 
    function getRandomId() private view returns (uint)
    { 
        return uint(keccak256(abi.encodePacked(block.difficulty, block.timestamp, msg.sender)))%uint(77);
    }

    // Converts EUR to Wei (10^18 ETH)
    function eurToWei(uint256 _price) public pure returns (uint)
    {
        return _price*243739092347530; 
    }

    // Creates a new property, emit PropertyCreated event
    function uploadProperty(address _owner, string memory _city, string memory _physicalAddr, uint256 _price, uint256 _numRooms, uint256 _area, uint256 _bathrooms, uint256 _sellOrRent, uint256 _tokens, uint256 _rentalEndDate, string memory _ipfsImage) public
    {
        Property memory newProperty = Property(getRandomId(), _owner, _city, _physicalAddr, eurToWei(_price), _numRooms, _area, _bathrooms, _sellOrRent, block.timestamp, 0);
        
        // New property is added to mapping(s)
        properties[propertyCounter] = newProperty;
        // New property is pushed to props array
        props.push(newProperty);

        emit PropertyCreated(getRandomId(), _owner, _city, _physicalAddr, eurToWei(_price), _sellOrRent, block.timestamp);

        uint256 idProperty = properties[propertyCounter].id;
        // Add image to property
        propertyImg[idProperty] = propertyImages(idProperty, _ipfsImage);

        // Rental or tokenized...
        if (_rentalEndDate != 0 && _tokens == 0){
            rentalProperties[propertyCounter] = propertyForRenting(idProperty, _rentalEndDate);
            emit PropertyForRentingCreated(idProperty, _rentalEndDate);
        }
        
        if (_tokens != 0){
            tokenizedProperties[propertyCounter] = tokenizedProperty(idProperty, _rentalEndDate, _tokens);
            startedTokens[propertyCounter] = initialTokens(idProperty, _tokens);
            emit TokenizedPropertyCreated(idProperty, _rentalEndDate, _tokens);
        }

        propertyCounter++;
        
    }

    // --------------- GETTERS ---------------
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

    function getPropertyOwner(uint _id) public view returns (address)
    {
        for (uint i = 0; i < propertyCounter; i++)
        {
            if (_id == props[i].id) return props[i].owner;
        }
        revert('Not found');
    }

    // Send balance to account
    function sendBalance(address payable _receiver, uint256 _amount) payable external {
        _receiver.transfer(_amount);
    }

    // Buy property
    function buyProperty(address payable _address, uint256 _id) public payable
    {
        uint index = this.getPropertyById(_id);
        require(msg.value == props[index].price);
        
        // Send the value in Eth to the original owner
        address addr = props[index].owner;
        this.sendBalance(payable(addr), msg.value);

        // Changes the value of the boolean 
        this.propertySettled(index);

        // Emit an event
        emit propertySold(_address, props[index].price, props[index].soldOn);
        
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
        this.sendBalance(payable(addr), msg.value);

        // Changes the value of the boolean 
        this.propertySettled(index);
        
        // Emit an event
        emit propertyRented(_address, props[index].price, _rentalEndDate);
    }

    // Buy token (or tokens) of a property
    function buyTokens(address _from, uint256 _numTokens, uint256 _id) public payable
    {
        uint index = getPropertyById(_id);
        address addr = props[index].owner;
        this.sendBalance(payable(addr), msg.value); // Msg value is price / numTokens
        
        emit propertyTokenPurchased(_from, _id, _numTokens, (props[index].price/_numTokens));
        
        // Updating current number of tokens
        uint256 currentTokens = tokenizedProperties[index].tokens;
        currentTokens -= _numTokens;
        tokenizedProperties[index].tokens = currentTokens;

        if(tokenizedProperties[index].tokens == 0) this.propertySettled(index);
    }   

    // Remove property by their ID 
    function removeProperty(uint256 _id) public 
    {
        bool deleted = false;
        for (uint i = 0; i < propertyCounter && !deleted; i++)
        {
            if (_id == properties[i].id){
                require(properties[i].soldOn == 0);

                delete properties[i];
                delete props[i];
                deleted = true;
            }
        }

        emit propertyRemoved(msg.sender, _id);
    }

    function propertySettled(uint256 _index) public 
    {
        props[_index].soldOn         = block.timestamp;
        properties[_index].soldOn    = block.timestamp;
    }

}