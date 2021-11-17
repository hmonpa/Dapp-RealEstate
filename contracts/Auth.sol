// SPDX-License-Identifier: MIT
pragma solidity ^0.4.24;

contract Auth {

    uint public usersCounter = 0;

    struct User 
    {
        address addr;               // Wallet @
        string name;    
        string email;            
        string password;
        // string vatId;               // DNI
        // string ipfsImageCid;        // Image
        bool isLoggedIn;
    }

    mapping(uint256 => User) public users;
    mapping(address => User) public usersByAddr;

    constructor() public 
    {
        signUp("Héctor", "hmonpa@gmail.com", "pass123456");
    }

    event newUser(
        address addr,
        string name,
        string email,
        string password,
        bool isLoggedIn
    );

    function signUp(
        string _name,
        string _email,
        string _password
    ) public returns (bool) 
    {
        // require(users[usersCounter].addr != msg.sender);
        address _address = msg.sender;

        users[usersCounter] = User(_address, _name, _email, _password, false);
        usersByAddr[_address] = User(_address, _name, _email, _password, false);
        
        usersCounter++;
        emit newUser(_address, _name, _email, _password, false);
        return true;
    }

    function signIn(address _address, string memory _password) public returns (bool)
    {
        if (
            keccak256(abi.encodePacked(usersByAddr[_address].password)) 
            == keccak256(abi.encodePacked(_password)) 
            && 
            usersByAddr[_address].addr 
            == _address
        )
        {
            users[usersCounter].isLoggedIn = true;
            usersByAddr[_address].isLoggedIn = true;
            return true;
        } else {
            return false;
        }
    }

    function findByAddr(address _address) public view returns (uint)
    {
        for (uint i = 0; i < usersCounter; i++)
        {
            if (_address == users[usersCounter].addr) return i;
        }
    }

    function checkIsUserLogged(uint _usersCounter) public view returns (bool)
    {
        return (users[_usersCounter].isLoggedIn);
    }

    function checkIsUserLoggedByAddr(address _address) public view returns (bool)
    {
        return (usersByAddr[_address].isLoggedIn);
    }

    function logout(uint _usersCounter) public 
    {
        users[_usersCounter].isLoggedIn = false;
    }

    function logoutByAddr(address _address) public 
    {
        usersByAddr[_address].isLoggedIn = false;
    }
}