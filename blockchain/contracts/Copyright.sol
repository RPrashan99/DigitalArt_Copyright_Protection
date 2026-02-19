// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.0;

contract Copyright {
    
    struct Art {
        address owner;
        string ipfsHash;
    }

    mapping(bytes32 => Art) private artRegistry;
    mapping(address => string[]) private ownerToArt;

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
        ownerToArt[msg.sender].push(_ipfsHash);
    }

    function verifyArt(bytes32 _artHash) public view returns (address) {
        Art memory art = artRegistry[_artHash];
        require(art.owner != address(0), "Art not registered");
        return art.owner;
    }

    function transferOwner(bytes32 _artHash, address _newOwner) public {
        Art storage art = artRegistry[_artHash];
        string memory ipfsHash = art.ipfsHash;
        require(art.owner != address(0), "Art not registered");
        require(art.owner == msg.sender, "Only owner can transfer");
        require(_newOwner != address(0), "New owner cannot be zero address");

        address previousOwner = art.owner;
        art.owner = _newOwner;

        _removeArt(ipfsHash, previousOwner);
        ownerToArt[_newOwner].push(ipfsHash);
        
        emit OwnershipTransferred(_artHash, previousOwner, _newOwner, block.timestamp);
    }

    function getArtByOwner() public view returns (string[] memory) {
        return ownerToArt[msg.sender];
    }

    function _removeArt(string memory _ipfsHash, address _owner) internal {
        
        for(uint i = 0; i < ownerToArt[_owner].length; i++) {
            if(keccak256(bytes(ownerToArt[_owner][i])) == keccak256(bytes(_ipfsHash))) {
                ownerToArt[_owner][i] = ownerToArt[_owner][ownerToArt[_owner].length - 1];
                ownerToArt[_owner].pop();
                break;
            }
        }
    }
}