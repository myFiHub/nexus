import { ScaffoldConfig } from "@scaffold-move/nextjs";

const scaffoldConfig: ScaffoldConfig = {
  targetNetwork: "mainnet",
  walletConnectProjectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || "",
  walletConnectRelayServer: process.env.NEXT_PUBLIC_WALLET_CONNECT_RELAY_SERVER || "",
  walletConnectMetadata: {
    name: "Nexus",
    description: "Nexus dApp",
    url: "https://nexus.com",
    icons: ["https://nexus.com/icon.png"],
  },
  autoConnect: true,
}; 