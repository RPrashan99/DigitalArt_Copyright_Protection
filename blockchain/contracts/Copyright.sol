// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.0;

contract Copyright {
    
    struct Art {
        address owner;
        string ipfsHash;
    }

    mapping(bytes32 => Art) private artRegistry;

    function registerArt(bytes32 _artHash, string memory _ipfsHash) public {
        require(artRegistry[_artHash].owner == address(0), "Art already registered");
        artRegistry[_artHash] = Art(msg.sender, _ipfsHash);
    }

    function verifyArt(bytes32 _artHash) public view returns (address) {
        Art memory art = artRegistry[_artHash];
        require(art.owner != address(0), "Art not registered");
        return art.owner;
    }
}