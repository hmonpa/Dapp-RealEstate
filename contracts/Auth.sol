// SPDX-License-Identifier: MIT
pragma solidity ^0.4.24;

contract Auth {

    uint public usersCounter = 0;
    struct User 
    {
        address addr;                   // Wallet @
        string name;    
        string email;            
        string password;
        // string vatId;                // DNI
        // string ipfsImageCid;         // Image
        bool isLoggedIn;
        uint256 createdAt;
    }

    constructor() public 
    {
        // Register first user
        signUp(msg.sender, "Héctor", "hmonpa@gmail.com", "pass123456");
    }

    // ----------------------- MAPPINGS -----------------------
    mapping(address => User) public usersByAddr;
    // mapping(uint256 => User) public users;
    User[] public users;

    // ----------------------- EVENTS -----------------------
    event newUser(
        address addr,
        string name,
        string email,
        string password,
        bool isLoggedIn,
        uint256 createdAt
    );

    event userLogged(
        address addr,
        string name,
        bool isLoggedIn
    );

    // ----------------------- FUNCTIONS -----------------------
    // Register a new user
    function signUp(
        address _address,
        string _name,
        string _email,
        string _password
    ) public returns (bool) 
    {
        users.push(User(_address, _name, _email, _password, false, block.timestamp));
        usersByAddr[_address] = User(_address, _name, _email, _password, false, block.timestamp);
        
        usersCounter++;

        emit newUser(_address, _name, _email, _password, false, block.timestamp);
        return true;
    }

    // Login a user
    function signIn(address _address, string memory _password) public returns (bool)
    {
        if (keccak256(abi.encodePacked(usersByAddr[_address].password)) 
            == keccak256(abi.encodePacked(_password)) 
            && 
            usersByAddr[_address].addr == _address)
        {
            // users[usersCounter].isLoggedIn      = true;
            usersByAddr[_address].isLoggedIn   = true;
            emit userLogged(_address, usersByAddr[_address].name, usersByAddr[_address].isLoggedIn);
            
            return true;
        } else {
            return false;
        }
    }

    function getUser(address _address) public view returns (address, string, string, uint256)
    {
        return (usersByAddr[_address].addr, usersByAddr[_address].name, usersByAddr[_address].email, usersByAddr[_address].createdAt);
    }

    // Get @ from index
    function getAddrFromIndex(uint _index) public view returns (address)
    {
        return users[_index].addr;
    }

    // Checking login status by index
    function checkIsUserLogged(uint _usersCounter) public view returns (bool)
    {
        return (users[_usersCounter].isLoggedIn);
    }

    // Checking login status by @
    function checkIsUserLoggedByAddr(address _address) public view returns (bool)
    {
        return (usersByAddr[_address].isLoggedIn);
    }

    // Logout user by index
    function logout(uint _usersCounter) public 
    {
        users[_usersCounter].isLoggedIn = false;
    }

    // Logout user by @
    function logoutByAddr(address _address) public 
    {
        usersByAddr[_address].isLoggedIn = false;
    }


}