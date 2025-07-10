import { toast } from "app/lib/toast";
import axios from "axios";

// GraphQL Indexer URL for Movement Network
const MOVEMENT_INDEXER_URL =
  "https://indexer.mainnet.movementnetwork.xyz/v1/graphql";

// Podium Protocol constants
const PODIUM_PROTOCOL_NAME = "PodiumProtocol";
const PODIUM_PROTOCOL_ADDRESS = process.env.NEXT_PUBLIC_PODIUM_PROTOCOL_ADDRESS;

// Interface for mint event data (from fungible_asset_activities)
export interface MintEvent {
  transaction_version: string;
  owner_address: string;
  amount: string;
  asset_type: string;
  type: string;
}

// Interface for transaction details (from transactions table)
export interface TransactionDetails {
  version: string;
  hash: string;
  timestamp: string;
  payload?: any;
}

// Interface for the first mint result
export interface FirstMintInfo {
  transactionVersion: string;
  transactionHash: string;
  ownerAddress: string;
  amount: string;
  assetType: string;
  timestamp: string;
}

/**
 * Get transaction details by version
 */
async function getTransactionByVersion(
  transactionVersion: string
): Promise<TransactionDetails | null> {
  try {
    const query = `
      query GetTransaction($version: String!) {
        transactions(
          where: {version: {_eq: $version}}
          limit: 1
        ) {
          version
          hash
          timestamp
        }
      }
    `;

    const response = await axios.post(
      MOVEMENT_INDEXER_URL,
      {
        query,
        variables: { version: transactionVersion },
      },
      { headers: { "Content-Type": "application/json" } }
    );

    const transactions = response.data.data.transactions;
    if (transactions && transactions.length > 0) {
      return transactions[0];
    }

    return null;
  } catch (error) {
    console.error("Error getting transaction details:", error);
    return null;
  }
}

/**
 * Get the first mint event for a given asset type
 * This uses multiple approaches to find the first mint efficiently
 */
export async function getFirstMintOfToken(
  assetType: string
): Promise<FirstMintInfo | null> {
  try {
    // Fallback to fungible_asset_activities
    const fungibleQuery = `
      query GetFirstMintFungible($assetType: String!) {
        fungible_asset_activities(
          where: {
            asset_type: {_eq: $assetType}
            type: {_eq: "0x1::fungible_asset::Deposit"}
          }
          order_by: {transaction_version: asc}
          limit: 100
        ) {
          transaction_version
          owner_address
          amount
          asset_type
          type
        }
      }
    `;

    const response = await axios.post(
      MOVEMENT_INDEXER_URL,
      {
        query: fungibleQuery,
        variables: { assetType },
      },
      { headers: { "Content-Type": "application/json" } }
    );
    const activities = response.data.data.fungible_asset_activities;

    if (!activities || activities.length === 0) {
      console.log(`No mint events found for asset type: ${assetType}`);
      return null;
    }

    const firstMint = activities[0];

    // Get transaction details (hash and timestamp) from transactions table
    const transactionDetails = await getTransactionByVersion(
      firstMint.transaction_version
    );

    return {
      transactionVersion: firstMint.transaction_version,
      transactionHash: transactionDetails?.hash || "",
      ownerAddress: firstMint.owner_address,
      amount: firstMint.amount,
      assetType: firstMint.asset_type,
      timestamp: transactionDetails?.timestamp || "",
    };
  } catch (error) {
    console.error("Error getting first mint of token:", error);
    toast.error("Failed to get first mint information");
    return null;
  }
}

/**
 * Helper function to construct the Podium pass asset type
 * Returns the standard format: 0x1::coin::CoinStore<{PODIUM_PROTOCOL_ADDRESS}::PodiumProtocol::PodiumPass>
 */
export function getPodiumPassAssetType(): string {
  if (!PODIUM_PROTOCOL_ADDRESS) {
    throw new Error("PODIUM_PROTOCOL_ADDRESS environment variable is not set");
  }
  return `0x1::coin::CoinStore<${PODIUM_PROTOCOL_ADDRESS}::${PODIUM_PROTOCOL_NAME}::PodiumPass>`;
}

/**
 * Get all mint events for a given asset type (ordered by transaction version)
 * Useful for debugging or getting multiple mints
 */
export async function getAllMintEvents(
  assetType: string,
  limit: number = 100
): Promise<MintEvent[]> {
  try {
    const query = `
      query GetAllMintEvents($assetType: String!, $limit: Int!) {
        fungible_asset_activities(
          where: {
            asset_type: {_eq: $assetType}
            type: {_eq: "0x1::fungible_asset::Deposit"}
          }
          order_by: {transaction_version: asc}
          limit: $limit
        ) {
          transaction_version
          owner_address
          amount
          asset_type
          type
        }
      }
    `;

    const response = await axios.post(
      MOVEMENT_INDEXER_URL,
      {
        query,
        variables: { assetType, limit },
      },
      { headers: { "Content-Type": "application/json" } }
    );

    return response.data.data.fungible_asset_activities || [];
  } catch (error) {
    console.error("Error getting all mint events:", error);
    toast.error("Failed to get mint events");
    return [];
  }
}

/**
 * Alternative approach: Get first mint using events table
 * This might be more efficient for some tokens
 */
export async function getFirstMintUsingEvents(
  assetType: string
): Promise<FirstMintInfo | null> {
  try {
    const query = `
      query GetFirstMintEvents($assetType: String!) {
        events(
          where: {
            type: {_eq: "0x1::fungible_asset::Deposit"}
            data: {_contains: $assetType}
          }
          order_by: {transaction_version: asc}
          limit: 1
        ) {
          transaction_version
          transaction_hash
          data
          timestamp
        }
      }
    `;

    const response = await axios.post(
      MOVEMENT_INDEXER_URL,
      {
        query,
        variables: { assetType },
      },
      { headers: { "Content-Type": "application/json" } }
    );

    const events = response.data.data.events;
    if (!events || events.length === 0) {
      return null;
    }

    const firstEvent = events[0];
    // Parse the event data to extract mint information
    // This would need to be customized based on the actual event structure
    return {
      transactionVersion: firstEvent.transaction_version,
      transactionHash: firstEvent.transaction_hash,
      ownerAddress: "", // Would need to parse from event data
      amount: "", // Would need to parse from event data
      assetType: assetType,
      timestamp: firstEvent.timestamp,
    };
  } catch (error) {
    console.error("Error getting first mint using events:", error);
    return null;
  }
}

/**
 * Get the first mint info for a Podium pass asset type
 * This function takes the asset type returned by getPodiumPassAssetType and finds its first mint
 */
export async function getFirstMintOfPodiumPass(
  assetType: string
): Promise<FirstMintInfo | null> {
  if (!assetType) {
    console.error("Asset type is required");
    return null;
  }

  console.log(`Getting first mint for Podium pass asset type: ${assetType}`);
  return await getFirstMintOfToken(assetType);
}

/**
 * Complete workflow: Get user's Podium pass asset type and then get its first mint
 * This combines both steps in one function
 */
export async function getPodiumPassFirstMint(
  ownerAddress: string
): Promise<FirstMintInfo | null> {
  try {
    // Step 1: Get the Podium pass asset type using your existing function
    const assetTypeQuery = `
      query GetPodiumPassAssetType($ownerAddress: String!) {
        current_fungible_asset_balances(
          where: {
            owner_address: {_eq: $ownerAddress},
            amount: {_gt: 0}
          }
        ) {
          asset_type
          amount
          metadata {
            project_uri
          }
        }
      }
    `;

    const assetTypeResponse = await axios.post(
      MOVEMENT_INDEXER_URL,
      {
        query: assetTypeQuery,
        variables: { ownerAddress },
      },
      { headers: { "Content-Type": "application/json" } }
    );

    const balances =
      assetTypeResponse.data.data.current_fungible_asset_balances;

    // Look for Podium pass assets
    for (const balance of balances) {
      // Check if this is a Podium pass by looking at the asset type
      // Podium passes should have the format: 0x1::coin::CoinStore<{PODIUM_PROTOCOL_ADDRESS}::PodiumProtocol::PodiumPass>

      if (
        balance.asset_type.includes(
          `${PODIUM_PROTOCOL_ADDRESS}::${PODIUM_PROTOCOL_NAME}::PodiumPass`
        )
      ) {
        console.log(
          `Found Podium pass asset type~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ ${balance.asset_type}`
        );
      }
      if (
        balance.asset_type.includes(
          `${PODIUM_PROTOCOL_ADDRESS}::${PODIUM_PROTOCOL_NAME}::PodiumPass`
        ) ||
        balance.metadata?.project_uri?.toLowerCase() ===
          "https://podium.fi/pass/"
      ) {
        console.log(`Found Podium pass asset type: ${balance.asset_type}`);

        // Step 2: Get the first mint of this asset type
        return await getFirstMintOfToken(balance.asset_type);
      }
    }

    console.log(`No Podium pass found for address: ${ownerAddress}`);
    return null;
  } catch (error) {
    console.error("Error getting Podium pass first mint:", error);
    toast.error("Failed to get Podium pass first mint");
    return null;
  }
}
