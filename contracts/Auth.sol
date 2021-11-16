// SPDX-License-Identifier: MIT
pragma solidity ^0.4.24;

contract Auth {

    uint public usersCounter = 0;

    struct User 
    {
        address addr;               // Wallet @
        string name;                
        string password;
        // string vatId;               // DNI
        // string ipfsImageCid;        // Image
        bool isLoggedIn;
    }

    mapping(address => User) public users;

    constructor() public 
    {
        signUp(msg.sender, "Héctor", "pass12345");
        usersCounter++;
    }

    event newUser(
        address addr,
        string name,
        string password,
        bool isLoggedIn
    );

    function signUp(
        address _address,
        string memory _name,
        string memory _password
    ) public returns (bool) 
    {
        require(users[_address].addr != msg.sender);

        usersCounter++;
        users[_address] = User(_address, _name, _password, false);
        emit newUser(_address, _name, _password, false);
        return true;
    }

    function signIn(address _address, string memory _password) public returns (bool)
    {
        if (keccak256(abi.encodePacked(users[_address].password)) 
        == keccak256(abi.encodePacked(_password)))
        {
            users[_address].isLoggedIn = true;
            return users[_address].isLoggedIn;
        } else {
            return false;
        }
    }

    function checkIsUserLogged(address _address) public view returns (bool, string memory)
    {
        return (users[_address].isLoggedIn, users[_address].name);
    }

    function logout(address _address) public 
    {
        users[_address].isLoggedIn = false;
    }
}