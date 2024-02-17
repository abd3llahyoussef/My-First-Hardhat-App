import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const DEC = "18";
const initialPrice = 2000000000000000000000;

const deployIt: DeployFunction = async function (
  hre: HardhatRuntimeEnvironment
) {
  const { deployments, getNamedAccounts, network } = hre;
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;

  if (chainId == 31337) {
    log("local Network detected! Deploying mocks...");
    await deploy("MockV3Aggregator", {
      contract: "MockV3Aggregator",
      from: deployer,
      log: true,
      args: [DEC, initialPrice],
    });
    log("Mocks Deployed!!");
    log("----------------------------------");
    log("you are deploying to your local Network");
  }
};

export default deployIt;
deployIt.tags = ["all", "mocks"];
