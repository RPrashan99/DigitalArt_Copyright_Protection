const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

const CopyrightModule = buildModule("CopyrightModule", (m) => {
  const copyright = m.contract("Copyright");

  return { copyright };
});

module.exports = CopyrightModule;