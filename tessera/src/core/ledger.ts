import { CreditLedger, UsageLogEntry } from '../types.js';

const STARTING_BALANCE = 100;

const ledger: CreditLedger = {
  agent_id: 'agent-demo-001',
  starting_balance: STARTING_BALANCE,
  current_balance: STARTING_BALANCE,
  usage_log: [],
  provider_earnings: {},
};

export function getBalance(): number {
  return ledger.current_balance;
}

export function canAfford(cost: number): boolean {
  return ledger.current_balance >= cost;
}

export function deductCredits(
  feedId: string,
  feedName: string,
  cost: number,
  providerId: string,
  providerName: string,
  filters: Record<string, any>,
  resultsReturned: number
): number {
  ledger.current_balance -= cost;

  const entry: UsageLogEntry = {
    timestamp: new Date().toISOString(),
    feed_id: feedId,
    feed_name: feedName,
    cost,
    filters,
    results_returned: resultsReturned,
    balance_after: ledger.current_balance,
  };
  ledger.usage_log.push(entry);

  if (!ledger.provider_earnings[providerId]) {
    ledger.provider_earnings[providerId] = { total_earned: 0, queries_served: 0 };
  }
  ledger.provider_earnings[providerId].total_earned += cost;
  ledger.provider_earnings[providerId].queries_served += 1;

  console.error(`[TESSERA] Query: ${feedId} | Cost: ${cost} | Balance: ${ledger.current_balance}`);
  console.error(`[TESSERA] Provider "${providerName}" earned ${cost} credits`);

  return ledger.current_balance;
}

export function getUsageLog(): UsageLogEntry[] {
  return ledger.usage_log;
}

export function getProviderEarnings(): Record<string, { total_earned: number; queries_served: number }> {
  return ledger.provider_earnings;
}

export function getLedger(): CreditLedger {
  return ledger;
}

export function getCreditsUsed(): number {
  return ledger.starting_balance - ledger.current_balance;
}

export function getTotalQueries(): number {
  return ledger.usage_log.length;
}
