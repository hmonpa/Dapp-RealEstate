// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// import "https://github.com/0xcert/ethereum-erc721/src/contracts/tokens/nf-token-metadata.sol";
// import "https://github.com/0xcert/ethereum-erc721/src/contracts/ownership/ownable.sol";

// import "../node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract Auth {

    uint public usersCounter = 0;
    struct User 
    {
        address addr;                   // Account @
        string name;
        string email;            
        string password;
        string idCard;                  // DNI
        string ipfsImage;               // Image
        bool isLoggedIn;
        uint256 createdAt;
    }

    constructor()
    {
        // Register first user
        signUp(msg.sender, "Hector", "hmonpa@gmail.com", "a", "47667744F", "QmexEk7JfbJ6qj3vHEtVSY7LT3pA6VPevH5DGn5PRzz7Ge");
        signUp(0xBDBC72E47F837a72abD5f715eB8436D648A40Ba4, "Random User", "test@gmail.com", "a", "1234567X", "QmexEk7JfbJ6qj3vHEtVSY7LT3pA6VPevH5DGn5PRzz7Ge");
        signUp(0x75a250d7BA9DF92BAF57856664f0D9c2D24d2db5, "Prueba", "test@gmail.com", "a", "0000000X", "QmexEk7JfbJ6qj3vHEtVSY7LT3pA6VPevH5DGn5PRzz7Ge");
    }

    // ----------------------- MAPPINGS & ARRAYS -----------------------
    
    mapping(address => User) public usersByAddr;
    User[] public users;

    // ----------------------- EVENTS -----------------------
    event newUser(
        address addr,
        string name,
        string email,
        string password,
        string _idCard, 
        string _ipfsImage,
        bool isLoggedIn,
        uint256 createdAt
    );

    event userLogged(
        address addr,
        string name,
        bool isLoggedIn
    );

    event userLogout(
        address addr,
        string name,
        bool isLoggedIn
    );

    // ----------------------- FUNCTIONS -----------------------
    // Register a new user
    function signUp(
        address _address,
        string memory _name,
        string memory _email,
        string memory _password,
        string memory _idCard,
        string memory _ipfsImage
    ) public returns (bool) 
    {
        users.push(User(_address, _name, _email, _password, _idCard, _ipfsImage, false, block.timestamp));
        usersByAddr[_address] = User(_address, _name, _email, _password, _idCard, _ipfsImage,false, block.timestamp);
        
        usersCounter++;

        emit newUser(_address, _name, _email, _password,_idCard, _ipfsImage, false, block.timestamp);
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
            usersByAddr[_address].isLoggedIn   = true;
            emit userLogged(_address, usersByAddr[_address].name, usersByAddr[_address].isLoggedIn);
            
            return true;
        } else {
            return false;
        }
    }

    // --------------- GETTERS ---------------
    // Get complete user from @
    function getUser(address _address) public view returns (address, string memory, string memory, uint256, string memory, string memory)
    {
        return (usersByAddr[_address].addr, usersByAddr[_address].name, usersByAddr[_address].email, usersByAddr[_address].createdAt, usersByAddr[_address].idCard, usersByAddr[_address].ipfsImage);
    }

    // Get @ from index
    function getAddrFromIndex(uint _index) public view returns (address)
    {
        return users[_index].addr;
    }

    // Get name from @
    // TO DELETE
    function getName(address _address) public view returns (string memory)
    {
        for (uint i = 0; i < usersCounter; i++)
        {
            if (_address == users[i].addr) return users[i].name;
        }
        revert('Not found');
    }

    // --------------- CHECK STATUSES OF SESSIONS ---------------
    // Checking login status by index
    function checkIfUserLogged(uint _usersCounter) public view returns (bool)
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

        emit userLogout(_address, usersByAddr[_address].name, usersByAddr[_address].isLoggedIn);
    }

}