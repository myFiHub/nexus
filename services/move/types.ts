export interface FungableTokenBalance {
  amount: number;
  asset_type: string;
  last_transaction_timestamp: string;
  metadata: {
    icon_uri: string;
    maximum_v2: number;
    project_uri: string;
    supply_aggregator_table_handle_v1: string | null;
    supply_aggregator_table_key_v1: string | null;
    supply_v2: number;
  };
}

export interface OnChainPass {
  outpostAddress: string;
  outpostName: string;
  balance: number;
  currentPrice: number;
}

export interface NFTResponse {
  amount: number;
  image_url: string;
  current_token_data: {
    description: string;
    token_data_id: string;
    token_name: string;
    token_uri: string;
    last_transaction_timestamp: string;
  };
}
