// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.0;

contract Copyright {
    
    struct Art {
        address owner;
        string ipfsHash;
    }

    mapping(bytes32 => Art) private artRegistry;

    // Track transfers
    event OwnershipTransferred(
        bytes32 indexed artHash,
        address indexed previousOwner,
        address indexed newOwner,
        uint256 timestamp
    );

    function registerArt(bytes32 _artHash, string memory _ipfsHash) public {
        require(artRegistry[_artHash].owner == address(0), "Art already registered");
        artRegistry[_artHash] = Art(msg.sender, _ipfsHash);
    }

    function verifyArt(bytes32 _artHash) public view returns (address) {
        Art memory art = artRegistry[_artHash];
        require(art.owner != address(0), "Art not registered");
        return art.owner;
    }

    function transferOwner(bytes32 _artHash, address _newOwner) public {
        Art storage art = artRegistry[_artHash];
        require(art.owner != address(0), "Art not registered");
        require(art.owner == msg.sender, "Only owner can transfer");
        require(_newOwner != address(0), "New owner cannot be zero address");

        address previousOwner = art.owner;
        art.owner = _newOwner;
        
        emit OwnershipTransferred(_artHash, previousOwner, _newOwner, block.timestamp);
    }
}