import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import verify from "../utils/verify";
import { networkConfig, developmentChains } from "../helper-hardhat-config";
import dotenv from "dotenv";

dotenv.config();

const EtherAPI = process.env.API_KEY;
const feedIt: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts, network } = hre;
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;

  let ethToUsdAddress: string;
  if (chainId == 31337) {
    const ethUsdAggregator = await deployments.get("MockV3Aggregator");
    ethToUsdAddress = ethUsdAggregator.address;
  } else {
    ethToUsdAddress = networkConfig[network.name].ethUsdPriceFeed!;
  }
  log("-----------------------------------");
  log("Deploying FundMe and waiting for confirmation...");
  const fundMe = await deploy("FundMe", {
    from: deployer,
    args: [ethToUsdAddress],
    log: true,
    waitConfirmations: networkConfig[network.name].blockConfirmations || 0,
  });
  log(`FundMe deployed at ${fundMe.address}`);

  if (!developmentChains.includes(network.name) && EtherAPI) {
    await verify(fundMe.address, [ethToUsdAddress]);
  }
};

export default feedIt;
feedIt.tags = ["all", "feed"];
