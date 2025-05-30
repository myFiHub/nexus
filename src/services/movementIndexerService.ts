import { request, gql } from 'graphql-request';
import { INDEXER_CONFIG } from '../config/config';

/**
 * Fetch all fungible token balances for a user address using the Movement Indexer.
 * @param address The user's Aptos/Movement address
 * @returns Array of { asset_type, amount, last_transaction_timestamp, metadata }
 */
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
    console.debug('[movementIndexerService] getUserTokenBalances:', data);
    return data.current_fungible_asset_balances;
  } catch (error) {
    console.error('[movementIndexerService] GraphQL error:', error);
    throw error;
  }
} 