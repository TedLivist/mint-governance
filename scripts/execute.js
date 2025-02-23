const { parseEther, keccak256, toUtf8Bytes } = require("ethers");

async function main() {

  const governor = await hre.ethers.getContractAt("MyGovernor", "0x11d302b29d2a6de62ebd5614d93a770292db85aa")
  const deployer = governor.runner.address
  
  const token = await hre.ethers.getContractAt("MyToken", "0x21332e19d962E8C73e6e8337a316740C93ec992F")

  const execute = await governor.execute(
    [token.target],
    [0],
    [token.interface.encodeFunctionData("mint", [deployer, parseEther("25000")])],
    keccak256(toUtf8Bytes("Give the deployer more tokens!!"))
  );

  const executionReceipt = await execute.wait()
  console.log(executionReceipt)

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});