async function main() {
  const governor = await hre.ethers.getContractAt("MyGovernor", "0x11d302b29d2a6de62ebd5614d93a770292db85aa")

  // vote on the proposal
  const proposalId = 46543598159398528729813543565880199374653492480273371489885520881279096770335n

  const vote = await governor.castVote(proposalId, 1)
  console.log(vote)
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});