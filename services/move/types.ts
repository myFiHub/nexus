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
