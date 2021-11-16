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

    constructor() public 
    {
        signUp("Héctor", "hmonpa@gmail.com", "pass12345");
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
        require(users[usersCounter].addr != msg.sender);
        address _address = msg.sender;
        users[usersCounter] = User(_address, _name, _email, _password, false);
        usersCounter++;
        emit newUser(_address, _name, _email, _password, false);
        return true;
    }

    function signIn(address _address, string memory _password) public returns (bool)
    {
        if (
            keccak256(abi.encodePacked(users[usersCounter].password)) 
            == keccak256(abi.encodePacked(_password)) 
            && 
            users[usersCounter].addr 
            == _address
        )
        {
            users[usersCounter].isLoggedIn = true;
            return users[usersCounter].isLoggedIn;
        } else {
            return false;
        }
    }

    function checkIsUserLogged(uint _usersCounter) public view returns (bool, string memory)
    {
        return (users[_usersCounter].isLoggedIn, users[_usersCounter].name);
    }

    function logout(uint _usersCounter) public 
    {
        users[_usersCounter].isLoggedIn = false;
    }
}