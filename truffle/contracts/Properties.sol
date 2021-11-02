// SPDX-License-Identifier: MIT
pragma solidity ^0.4.24;  

contract Properties {
    
    uint public propertyCounter = 0;

    // Clave - Valor
    mapping (uint256 => Property) public properties;

    constructor() public{
        uploadProperty("Viladecans", 150000);
    }

    struct Property {
        uint256 id;
        string city;
        uint256 price;
        bool isSelled;
        uint256 createdAt;
    }


    // CRUD

    // Se crea una nueva propiedad
    function uploadProperty(string _city, uint256 _price) public{
        properties[propertyCounter] = Property(propertyCounter, _city, _price, false, block.timestamp);
        propertyCounter++;
    }

    // // Se ejecuta al vender la propiedad (isSelled = 1)
    // function updateProperty(){

    // }

    // Se ejecuta al vender una propiedad (isSelled = 1)
    function removeProperty(uint _id) public{
        Property memory _property = properties[_id];
        _property.isSelled = true;

        properties[_id] = _property;
    }

}