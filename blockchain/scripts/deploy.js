const hre = require("hardhat");

async function main() {
  const Copyright = await hre.ethers.getContractFactory("Copyright");
  const copyright = await Copyright.deploy();
  await copyright.waitForDeployment();

  console.log("Copyright deployed to:", await copyright.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});