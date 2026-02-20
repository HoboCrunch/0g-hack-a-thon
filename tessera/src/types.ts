export interface FeedRegistryEntry {
  feed_id: string;
  name: string;
  description: string;
  category: string;
  query_pattern: 'alert' | 'comparative' | 'trend';
  provider: { name: string; id: string; reputation_score: number };
  query_cost_credits: number;
  data_file: string;
  storage_hash: string;
  storage_network: string;
  last_updated: string;
  update_frequency: string;
  schema: { fields: Array<{ name: string; type: string; description: string }> };
  sample_queries: string[];
}

export interface CreditLedger {
  agent_id: string;
  starting_balance: number;
  current_balance: number;
  usage_log: UsageLogEntry[];
  provider_earnings: Record<string, { total_earned: number; queries_served: number }>;
}

export interface UsageLogEntry {
  timestamp: string;
  feed_id: string;
  feed_name: string;
  cost: number;
  filters: Record<string, any>;
  results_returned: number;
  balance_after: number;
}
