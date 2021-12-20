// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// import "https://github.com/0xcert/ethereum-erc721/src/contracts/tokens/nf-token-metadata.sol";
// import "https://github.com/0xcert/ethereum-erc721/src/contracts/ownership/ownable.sol";

contract Properties {

    struct Property 
    {
        string id;                     // Ref. catastral              
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

    struct propertyData
    {
        uint256 rooms;
        uint256 area;
        uint256 bathrooms;
    }

    struct propertyForRenting
    {
        string idProperty;
        uint256 rentalEndDate;
    }

    struct tokenizedProperty
    {
        string idProperty;
        uint256 rentalEndDate;
        uint256 tokens;
    }

    struct initialTokens
    {
        string id;
        uint256 tokens;
    }

    struct propertyImages
    {
        string id;
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
        addPropertyData(
            2,                                                  // Num of rooms 
            70,                                                 // Area in m²
            1                                                   // Num of bathrooms
        );

        uploadProperty(
            "19-HM0001-0001-SB",                                // ID
            msg.sender,                                         // Owner
            "Cunit",                                            // City
            "Avinguda Barcelona, 88, Bajo",                     // Physical address
            2000000000000000000,                                // Price in wei (2 ETH)
            0,                                                  // Rent --> 0
            2,                                                  // Tokens
            1672614000,                                         // Rental end date
            'QmYUAQbT6Q4UZh4LdWtSH3sPbXvR2xWP2LqDtkM3JQcUrk'    // CID
        );
    }

    // ----------------------- MAPPINGS & VARIABLES -----------------------
    
    // Mappings
    mapping (uint256 => Property) public properties;
    mapping (uint256 => propertyData) public propertiesData;
    mapping (uint256 => propertyForRenting) public rentalProperties;
    mapping (uint256 => tokenizedProperty) public tokenizedProperties;

    mapping (uint256 => initialTokens) public startedTokens;
    mapping (uint256 => propertyImages) public propertyImg;
    
    // Array
    Property[] public props;
    // propertyData[] public propsData;

    // Counter
    uint public cnt = 0;

    // ----------------------- EVENTS -----------------------
    event PropertyCreated(
        string id,             
        address owner,
        string city,
        string physicalAddr,            
        uint256 price,
        uint sellOrRent,
        uint256 createdAt
    );
    event PropertyForRentingCreated(string idProperty, uint256 rentalEndDate);
    event TokenizedPropertyCreated(string idProperty, uint256 rentalEndDate, uint256 tokens);

    event propertySold (address soldBy, uint256 price, uint256 soldOn);
    event propertyRented (address rentedBy, uint256 price, uint256 rentalEndDate);
    event propertyTokenPurchased (address purchasedBy, string idProperty, uint256 numberOfTokens, uint256 pricePerToken);
    event propertyRemoved (address byOwner, string id);


    // ----------------------- FUNCTIONS -----------------------
    function addPropertyData(uint256 _numRooms, uint256 _area, uint256 _bathrooms) public
    {
        propertyData memory saveData = propertyData(_numRooms, _area, _bathrooms);
        propertiesData[cnt] = saveData;
    }

    // Creates a new property, emit PropertyCreated event
    function uploadProperty(string memory _id, address _owner, string memory _city, string memory _physicalAddr, uint256 _price, uint256 _sellOrRent, uint256 _tokens, uint256 _rentalEndDate, string memory _ipfsImage) public
    {
        uint256 _numRooms   = propertiesData[cnt].rooms;
        uint256 _area       = propertiesData[cnt].area;
        uint256 _bathrooms  = propertiesData[cnt].bathrooms;

        Property memory newProperty = Property(_id, _owner, _city, _physicalAddr, _price, _numRooms, _area, _bathrooms, _sellOrRent, block.timestamp, 0);
        
        // propertyData memory newPropData = propertyData(_numRooms, _area, _bathrooms);
        // New property is added to mapping(s)
        properties[cnt] = newProperty;

        // New property is pushed to props array
        props.push(newProperty);
        // propsData.push(newPropData);

        emit PropertyCreated(_id, _owner, _city, _physicalAddr, _price, _sellOrRent, block.timestamp);

        // Add image to property
        propertyImg[cnt] = propertyImages(_id, _ipfsImage);

        // Rental or tokenized...
        if (_rentalEndDate != 0 && _tokens == 0){
            rentalProperties[cnt] = propertyForRenting(_id, _rentalEndDate);
            emit PropertyForRentingCreated(_id, _rentalEndDate);
        }
        
        if (_tokens != 0){
            tokenizedProperties[cnt] = tokenizedProperty(_id, _rentalEndDate, _tokens);
            startedTokens[cnt] = initialTokens(_id, _tokens);

            emit TokenizedPropertyCreated(_id, _rentalEndDate, _tokens);
        }

        cnt++; 
    }

    // --------------- GETTERS ---------------
    // Returns the number of properties already created
    function getAllProperties() public view returns (uint)
    {
        return cnt;
    }

    // Get a property by their ID
    function getPropertyById(string memory _id) public view returns (uint)
    {
        bytes memory idParams = bytes(_id);
        uint lengthId = idParams.length;
        
        for (uint i = 0; i < cnt; i++) {
            bytes memory currentId = bytes(props[i].id);
            bool found = true;
            
            if (lengthId != currentId.length) 
                continue;

            for (uint j = 0; j < lengthId && found; j++) {
                if(idParams[j] != currentId[j]) found = false;
            }

            if (found)
                return i;
        }
        
        return 999999;
    }

    function getPropertyOwner(string memory _id) public view returns (address)
    {
        uint i = getPropertyById(_id);
        return props[i].owner;
    }

    // Send balance to account
    function sendBalance(address payable _receiver, uint256 _amount) payable external {
        _receiver.transfer(_amount);
    }

    // Buy property
    function buyProperty(address payable _address, string memory _id) public payable
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
    function rentProperty(address _address, string memory _id, uint256 _rentalEndDate) public payable
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
    function buyTokens(address _from, uint256 _numTokens, string memory _id) public payable
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
    function removeProperty(string memory _id) public 
    {
        uint i = getPropertyById(_id);

        require(properties[i].soldOn == 0);

        delete properties[i];
        delete props[i];

        emit propertyRemoved(msg.sender, _id);
    }

    function propertySettled(uint256 _index) public 
    {
        props[_index].soldOn         = block.timestamp;
        properties[_index].soldOn    = block.timestamp;
    }

}