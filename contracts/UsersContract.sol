// SPDX-License-Identifier: GPL-3.0         // License header
pragma solidity ^0.4.24;  

contract UsersContract {
    struct User {
        string name;
        string surname;
    }

    mapping(address => User) private users; 
    mapping(address => bool) private joinedUsers;
    address[] totalUsers;

    event onUserJoined(address, string);                    

    function join(string memory name, string memory surname) public {
        require(!userJoined(msg.sender));                                               // Sólo se puede registrar un usuario que no se haya unido anteriormente
        User storage user = users[msg.sender];
        user.name = name;
        user.surname = surname;
        joinedUsers[msg.sender] = true;
        totalUsers.push(msg.sender);

        emit onUserJoined(msg.sender, string(abi.encodePacked(name, " ", surname)));  // Real time event
    }

    // Devuelve un usuario
    function getUser(address addr) public view returns(string memory, string memory){
        require(userJoined(msg.sender));
        User memory user = users[addr];

        return (user.name, user.surname);
    }

    // Indica si un usuario está registrado o no
    function userJoined(address addr) private view returns(bool){
        return joinedUsers[addr];
    }

    // Devuelve el número de usuarios registrados
    function getTotalUsers() public view returns(uint){
        return totalUsers.length;
    }
}