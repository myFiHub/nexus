export async function getUserTokenBalances(address: string) {
  const endpoint = INDEXER_CONFIG.GRAPHQL_URL;
  const query = gql`
    query GetUserTokenBalances($address: String!) {
      current_fungible_asset_balances(
        where: { owner_address: { _eq: $address }, amount: { _gt: 0 } }
      ) {
        asset_type
        amount
        last_transaction_timestamp
        metadata {
          icon_uri
          maximum_v2
          project_uri
          supply_aggregator_table_handle_v1
          supply_aggregator_table_key_v1
          supply_v2
        }
      }
    }
  `;
  try {
    const data = await request(endpoint, query, { address });
    console.debug("[movementIndexerService] getUserTokenBalances:", data);
    return data.current_fungible_asset_balances;
  } catch (error) {
    console.error("[movementIndexerService] GraphQL error:", error);
    throw error;
  }
}

// Podium Passes: project_uri === 'https://podium.fi/pass/'
const passResults: OnChainPass[] = indexerBalances
  .filter(
    (b: any) =>
      b.metadata && b.metadata.project_uri === "https://podium.fi/pass/"
  )
  .map((b: any) => ({
    outpostAddress: b.asset_type,
    outpostName: getAssetLabel(b.asset_type),
    balance: Number(b.amount),
    currentPrice: 0, // Price not available from indexer
  }));
setOnChainPasses(passResults);
// For backward compatibility, set the first as moveBalance
const firstMove = indexerBalances.find((b: any) =>
  MOVE_COIN_TYPES.includes(b.asset_type)
);
setMoveBalance(firstMove ? firstMove.amount : "0");

const fetchPassDetails = async () => {
  const details: Record<string, any> = {};
  for (const pass of onChainPasses) {
    try {
      // Find metadata for this pass (if available)
      const meta = moveBalances.find(
        (b) => b.type === pass.outpostAddress
      )?.metadata;
      const passDetail = await podiumProtocolService.getPassDetails(
        pass.outpostAddress,
        pass.balance,
        meta
      );
      details[pass.outpostAddress] = passDetail;
    } catch (error) {
      console.error(
        `Error fetching details for pass ${pass.outpostAddress}:`,
        error
      );
      // Show error toast or handle gracefully
    }
  }
  setPassDetails(details);
};
