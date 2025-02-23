require('dotenv').config()
const { ethers } = require("hardhat");
require("ethers")


async function main() {

  const [deployer] = await ethers.getSigners();

  const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_URL)
  
  const transactionCount = await provider.getTransactionCount(deployer)

  // gets the address of the token before it is deployed
  const futureAddress = ethers.getCreateAddress({
    from: deployer.address,
    nonce: transactionCount + 1
  });

  console.log(futureAddress)

  const MyGovernor = await ethers.getContractFactory("MyGovernor");
  const governor = await MyGovernor.deploy(futureAddress);
  await governor.waitForDeployment()
  const governorAddress = await governor.getAddress()

  const MyToken = await ethers.getContractFactory("MyToken");
  const token = await MyToken.deploy(governorAddress);
  await token.waitForDeployment()
  const tokenAddress = await token.getAddress()

  console.log(
    `Governor deployed to ${governorAddress}\n`,
    `Token deployed to ${tokenAddress}`
  );

  await token.delegate(deployer.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
