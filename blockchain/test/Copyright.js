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

});