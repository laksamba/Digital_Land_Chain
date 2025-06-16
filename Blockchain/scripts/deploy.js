const hre = require("hardhat");

async function main() {
  // Get the contract to deploy
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  // Deploy the landRegistry contract
  const Proposal = await hre.ethers.getContractFactory("LandRegistryBackendHash");
  const proposal = await Proposal.deploy();
  await proposal.waitForDeployment();

  console.log("Proposal contract deployed to:",await proposal.getAddress());
}

// Running the deployment script
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });


 //Deploying contracts with the account: 0xbF47332b3d70C4d15968Efe1f865a66A5c14F5AA
// Proposal contract deployed to: 0x3482740C57292B4b5FDae9D8F0dbfF633951ed9F