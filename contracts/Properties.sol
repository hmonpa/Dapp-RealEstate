// SPDX-License-Identifier: MIT
pragma solidity ^0.4.24;  

contract Properties {
    
    // address public owner;
    // uint ipfsHash;
    uint public propertyCounter = 0;

    // Clave - Valor
    mapping (uint256 => Property) public properties;

    // function set(uint x) public
    // {
    //     ipfsHash = x;
    // }

    // function get() public view returns(uint)
    // {
    //     return ipfsHash;
    // }

    constructor() public
    {
        // owner = msg.sender;
        uploadProperty("Viladecans", 150000);
    }

    event PropertyCreated(
        uint256 id,                     // ID (Pending auto)
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

    struct Property 
    {
        uint256 id;
        string city;
        uint256 price;
        bool isSelled;
        uint256 createdAt;
    }

    // CRUD
    // Se crea una nueva propiedad
    function uploadProperty(string _city, uint256 _price) public
    {
        propertyCounter++;
        properties[propertyCounter] = Property(propertyCounter, _city, _price, false, block.timestamp);
        emit PropertyCreated(propertyCounter, _city, _price, false, block.timestamp);
    }

    // // Se ejecuta al vender la propiedad (isSelled = 1)
    // function updateProperty(){

    // }

    // Se ejecuta al vender una propiedad (isSelled = 1)
    function removeProperty(uint _id) public{
        Property memory _property = properties[_id];
        _property.isSelled = !_property.isSelled;

        properties[_id] = _property;
        emit isPropertySelled(_id, _property.isSelled);
    }

}