import { ethers, getNamedAccounts, deployments } from "hardhat";

async function main() {
  const { deployer } = await getNamedAccounts();
  console.log(deployer);

  const fundMe = await ethers.getContractAt("FundMe", deployer);
  console.log(`the contract address is ${fundMe}`);
  console.log("Make Fund....");

  const transaction = await fundMe.fund({
    value: ethers.parseEther("0.5"),
  });
  await transaction.wait();
  console.log("funded!!!");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
