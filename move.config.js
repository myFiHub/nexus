module.exports = {
  defaultNetwork: "devnet",
  networks: {
    mainnet: {
      nodeUrl: "https://fullnode.mainnet.aptoslabs.com",
      faucet: {
        url: "https://faucet.mainnet.aptoslabs.com",
        address: "0x1",
      },
    },
    testnet: {
      nodeUrl: "https://fullnode.testnet.aptoslabs.com",
      faucet: {
        url: "https://faucet.testnet.aptoslabs.com",
        address: "0x1",
      },
    },
    devnet: {
      nodeUrl: "https://fullnode.devnet.aptoslabs.com",
      faucet: {
        url: "https://faucet.devnet.aptoslabs.com",
        address: "0x1",
      },
    },
  },
  modules: {
    nexus: {
      name: "nexus",
      address: "_", // This will be replaced with your account address after deployment
    },
  },
}; 