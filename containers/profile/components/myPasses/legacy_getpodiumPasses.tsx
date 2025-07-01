// // Podium Passes: project_uri === 'https://podium.fi/pass/'
// const passResults: OnChainPass[] = indexerBalances
//   .filter(
//     (b: any) =>
//       b.metadata && b.metadata.project_uri === "https://podium.fi/pass/"
//   )
//   .map((b: any) => ({
//     outpostAddress: b.asset_type,
//     outpostName: getAssetLabel(b.asset_type),
//     balance: Number(b.amount),
//     currentPrice: 0, // Price not available from indexer
//   }));
// setOnChainPasses(passResults);
// // For backward compatibility, set the first as moveBalance
// const firstMove = indexerBalances.find((b: any) =>
//   MOVE_COIN_TYPES.includes(b.asset_type)
// );
// setMoveBalance(firstMove ? firstMove.amount : "0");

// const fetchPassDetails = async () => {
//   const details: Record<string, any> = {};
//   for (const pass of onChainPasses) {
//     try {
//       // Find metadata for this pass (if available)
//       const meta = moveBalances.find(
//         (b) => b.type === pass.outpostAddress
//       )?.metadata;
//       const passDetail = await podiumProtocolService.getPassDetails(
//         pass.outpostAddress,
//         pass.balance,
//         meta
//       );
//       details[pass.outpostAddress] = passDetail;
//     } catch (error) {
//       console.error(
//         `Error fetching details for pass ${pass.outpostAddress}:`,
//         error
//       );
//       // Show error toast or handle gracefully
//     }
//   }
//   setPassDetails(details);
// };
