const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Token contract", function () {

    let Copyright, copyright, owner, addr1;

    beforeEach(async function () { 
        [owner, addr1] = await ethers.getSigners(); 
        Copyright = await ethers.getContractFactory("Copyright"); 
        copyright = await Copyright.deploy(); 
        await copyright.waitForDeployment(); 
    });
    
    it("Should register new art successfully", async function () {
        const artHash = ethers.keccak256(ethers.toUtf8Bytes("ArtPiece1"));
        const ipfsHash = "QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco";

        await copyright.registerArt(artHash, ipfsHash);

        const ownerAddress = await copyright.verifyArt(artHash);
        expect(ownerAddress).to.equal(owner.address);
    });

    it ('Should fail to register art that already regsistered', async function () {
        const artHash = ethers.keccak256(ethers.toUtf8Bytes("ArtPiece1"));
        const ipfsHash = "QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco";

        await copyright.registerArt(artHash, ipfsHash);

        await expect(
            copyright.registerArt(artHash, ipfsHash)
        ).to.be.revertedWith("Art already registered");
    });

    it("Should fail to verify unregistered art", async function () {
        const artHash = ethers.keccak256(ethers.toUtf8Bytes("UnregisteredArt"));

        await expect(
            copyright.verifyArt(artHash)
        ).to.be.revertedWith("Art not registered");
    });

    it("Should prevent two different users from registering same art", async function () {
        const artHash = ethers.keccak256(ethers.toUtf8Bytes("ArtPiece1"));
        const ipfsHash = "QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco";

        await copyright.registerArt(artHash, ipfsHash);

        await expect(
            copyright.connect(addr1).registerArt(artHash, ipfsHash)
        ).to.be.revertedWith("Art already registered");
    });

    it("Should transfer ownership of art", async function () {
        const artHash = ethers.keccak256(ethers.toUtf8Bytes("ArtPiece1"));
        const ipfsHash = "QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco";

        await copyright.registerArt(artHash, ipfsHash);
        await copyright.transferOwner(artHash, addr1.address);

        const newOwnerAddress = await copyright.verifyArt(artHash);
        expect(newOwnerAddress).to.equal(addr1.address);
    })

    it("Should fail to transfer ownership of art by non-owner", async function () {
        const artHash = ethers.keccak256(ethers.toUtf8Bytes("ArtPiece1"));
        const ipfsHash = "QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco";

        await copyright.registerArt(artHash, ipfsHash);
        await expect(
            copyright.connect(addr1).transferOwner(artHash, addr1.address)
        ).to.be.revertedWith("Only owner can transfer");
    });

    it("Should fail to transfer ownership of art that no registered", async function () {
        const artHash = ethers.keccak256(ethers.toUtf8Bytes("ArtPiece1"));

        await expect(
            copyright.transferOwner(artHash, addr1.address)
        ).to.be.revertedWith("Art not registered");
    })

    it("Should get all art owned by an address", async function () {
        const artHash1 = ethers.keccak256(ethers.toUtf8Bytes("ArtPiece1"));
        const artHash2 = ethers.keccak256(ethers.toUtf8Bytes("ArtPiece2"));
        const ipfsHash = "QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco";
        const ipfsHash2 = "QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6ucf";

        await copyright.registerArt(artHash1, ipfsHash);
        await copyright.registerArt(artHash2, ipfsHash2);

        const ownedArt = await copyright.getArtByOwner();
        expect(ownedArt.length).to.equal(2);
        expect(ownedArt[0]).to.equal(ipfsHash);
        expect(ownedArt[1]).to.equal(ipfsHash2);

    });

    it("Should transfered art not be in owner arts", async function () {
        const artHash1 = ethers.keccak256(ethers.toUtf8Bytes("ArtPiece1"));
        const artHash2 = ethers.keccak256(ethers.toUtf8Bytes("ArtPiece2"));
        const ipfsHash = "QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco";
        const ipfsHash2 = "QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6ucf";

        await copyright.registerArt(artHash1, ipfsHash);
        await copyright.registerArt(artHash2, ipfsHash2);

        const ownedArt = await copyright.getArtByOwner();
        expect(ownedArt.length).to.equal(2);
        expect(ownedArt[0]).to.equal(ipfsHash);
        expect(ownedArt[1]).to.equal(ipfsHash2);

        await copyright.transferOwner(artHash1, addr1.address);

        const newOwnedArt = await copyright.getArtByOwner();
        expect(newOwnedArt.length).to.equal(1);
        expect(newOwnedArt[0]).to.equal(ipfsHash2);

    });
});