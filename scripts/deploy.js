const hre = require("hardhat");
const fs = require('fs');

async function main() {
  const NewsFeed = await hre.ethers.getContractFactory("NewsFeed");
  const nftMarketplace = await NewsFeed.deploy();
  await nftMarketplace.deployed();
  console.log("nftMarketplace deployed to:", nftMarketplace.address);

  const SimpleBank = await hre.ethers.getContractFactory("SimpleBank");
  const bank = await SimpleBank.deploy();
  await bank.deployed();
  console.log("bank deployed to:", bank.address);

  fs.writeFileSync('./config.js', `
  export const marketplaceAddress = "${nftMarketplace.address}"
  export const BankAddress = "${bank.address}"
  `)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
