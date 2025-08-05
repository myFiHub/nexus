// import { NightlyConnectAptosAdapter } from "@nightlylabs/wallet-selector-aptos";
// import { logoUrl } from "app/lib/constants";

// let _adapter: NightlyConnectAptosAdapter | undefined;
// const MOVEMENT_NETWORK = "Movement";
// const getAdapter = async (persisted = true) => {
//   if (_adapter) return _adapter;
//   _adapter = await NightlyConnectAptosAdapter.build(
//     {
//       appMetadata: {
//         name: "Podium",
//         description: "Podium",
//         icon: logoUrl,
//       },
//       // specify different network than Aptos for deeplink support
//       network: MOVEMENT_NETWORK,
//     },
//     {},
//     undefined,
//     {
//       networkDataOverride: {
//         name: "Movement",
//         icon: "https://registry.nightly.app/networks/movement.svg",
//       },
//     }
//   );
//   return _adapter;
// };

export const connectToNightly = async () => {
  console.log("connectToNightly");
  //   const adapter = await getAdapter();
  //   await adapter.connect();
};
