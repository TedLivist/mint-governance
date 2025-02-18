const { parseEther } = require("ethers");
const { ethers } = require("hardhat");

async function main() {

  const governor = await hre.ethers.getContractAt("MyGovernor", "0x11d302b29d2a6de62ebd5614d93a770292db85aa")
  const deployer = governor.runner.address
  
  const token = await hre.ethers.getContractAt("MyToken", "0x21332e19d962E8C73e6e8337a316740C93ec992F")

  // propose vote
  // The proposal is to mint token and send to self(deployer)
  // grab the proposalId so you can vote on it
  const propose = await governor.propose(
    [token.target],
    [0],
    [token.interface.encodeFunctionData("mint", [deployer, parseEther("25000")])],
    "Give the deployer more tokens!!"
  )
  
  const receipt = await propose.wait()
  const proposalCreatedEvent = governor.interface.parseLog(receipt.logs[0])
  const proposalId = proposalCreatedEvent.args.proposalId
  console.log(proposalId)
  
  // You can simply forget all these
  // and simply check the startBlock and endBlock parameters
  // from the transaction log of the proposal
  // to know when voting starts and that is more accurate
  
  // // wait for proposal tx to be mined
  // // and wait for delay of more 30 minutes (124 blocks)
  // // as set by the contract
  // const DELAY_BLOCKS = 124;
  // const targetBlock = (await ethers.provider.getBlockNumber()) + DELAY_BLOCKS;
  // console.log(`Current block: ${await ethers.provider.getBlockNumber()}, waiting for block ${targetBlock}...`);

  // while ((await ethers.provider.getBlockNumber()) < targetBlock) {
  //   console.log(`Waiting... Current block: ${await ethers.provider.getBlockNumber()}`);
  //   await new Promise((resolve) => setTimeout(resolve, 10000)); // Wait 5 seconds before checking again
  // }
  // console.log(`Reached target block ${targetBlock}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});