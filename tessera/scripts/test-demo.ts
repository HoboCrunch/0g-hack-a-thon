/**
 * Phase 4 — Demo Test Script
 * Simulates all 5 demo scenes by calling core modules directly.
 * Run: npx tsx scripts/test-demo.ts
 */

import { loadRegistry, getFeeds, getFeedById, loadFeedData } from '../src/core/registry.js';
import { getBalance, canAfford, deductCredits, getUsageLog, getProviderEarnings, getCreditsUsed, getTotalQueries } from '../src/core/ledger.js';
import { queryFeed, QueryFilters } from '../src/core/query-engine.js';

let passed = 0;
let failed = 0;

function assert(condition: boolean, label: string) {
  if (condition) {
    console.error(`  ✓ ${label}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${label}`);
    failed++;
  }
}

// --- Startup ---
console.error('\n=== TESSERA PHASE 4 DEMO TEST ===\n');
const feeds = loadRegistry();
for (const feed of feeds) {
  loadFeedData(feed);
}

// ─────────────────────────────────────────────
// SCENE 1: Discovery
// ─────────────────────────────────────────────
console.error('\n--- Scene 1: Discovery (tessera_list_feeds) ---');

const allFeeds = getFeeds();
assert(allFeeds.length === 3, `3 feeds returned (got ${allFeeds.length})`);

for (const f of allFeeds) {
  assert(f.storage_network === '0G', `Feed "${f.feed_id}" has storage_network: "0G"`);
  assert(typeof f.storage_hash === 'string' && f.storage_hash.startsWith('0x'), `Feed "${f.feed_id}" has valid storage_hash`);
  assert(f.query_cost_credits > 0, `Feed "${f.feed_id}" has cost ${f.query_cost_credits}`);
}

const feedIds = allFeeds.map(f => f.feed_id).sort();
assert(JSON.stringify(feedIds) === JSON.stringify(['defi-risk-signals', 'labor-market-intel', 'smb-benchmarks']),
  `Feed IDs: ${feedIds.join(', ')}`);

// Category filter
const defiFeedsOnly = getFeeds('defi');
assert(defiFeedsOnly.length === 1 && defiFeedsOnly[0].feed_id === 'defi-risk-signals', 'Category filter "defi" returns 1 feed');

assert(getBalance() === 100, `Starting balance: 100 (got ${getBalance()})`);

// ─────────────────────────────────────────────
// SCENE 2: DeFi Query (Alert Pattern)
// ─────────────────────────────────────────────
console.error('\n--- Scene 2: DeFi Query (tessera_query_feed, confidence >= 0.8) ---');

const defiFeed = getFeedById('defi-risk-signals')!;
assert(defiFeed !== undefined, 'Found defi-risk-signals feed');

const defiData = loadFeedData(defiFeed);
const defiFilters: QueryFilters = { confidence_min: 0.8 };
const defiResult = queryFeed(defiData, defiFilters);

assert(defiResult.results.length > 0, `Got ${defiResult.results.length} results with confidence >= 0.8`);
assert(defiResult.results.every((r: any) => r.confidence >= 0.8), 'All results have confidence >= 0.8');
assert(defiResult.totalMatching > 0, `totalMatching: ${defiResult.totalMatching}`);

// Deduct credits
const balanceAfterDefi = deductCredits(
  defiFeed.feed_id, defiFeed.name, defiFeed.query_cost_credits,
  defiFeed.provider.id, defiFeed.provider.name,
  defiFilters, defiResult.results.length
);
assert(balanceAfterDefi === 97, `Balance after DeFi query: 97 (got ${balanceAfterDefi})`);
assert(defiFeed.storage_hash.startsWith('0x'), `storage_hash in response: ${defiFeed.storage_hash}`);
assert(defiFeed.storage_network === '0G', 'storage_network: "0G"');

// ─────────────────────────────────────────────
// SCENE 3: Benchmark Query — THE Moment (Comparative Pattern)
// ─────────────────────────────────────────────
console.error('\n--- Scene 3: Benchmark Query (manufacturing, facilities_maintenance_pct, 25-100) ---');

const smbFeed = getFeedById('smb-benchmarks')!;
assert(smbFeed !== undefined, 'Found smb-benchmarks feed');

const smbData = loadFeedData(smbFeed);
const smbFilters: QueryFilters = {
  industry: 'manufacturing',
  metric: 'facilities_maintenance_pct',
  company_size_tier: '25-100',
};
const smbResult = queryFeed(smbData, smbFilters);

assert(smbResult.results.length >= 1, `Got ${smbResult.results.length} benchmark result(s)`);

if (smbResult.results.length > 0) {
  const benchmark = smbResult.results[0];
  assert(benchmark.p50 === 5.2, `Median (p50) is 5.2% (got ${benchmark.p50})`);
  assert(benchmark.p75 !== undefined, `p75 exists: ${benchmark.p75}`);
  assert(benchmark.p90 !== undefined, `p90 exists: ${benchmark.p90}`);
  // 8% spend → check if it's above p75 (which would make it 82nd percentile range)
  console.error(`  ℹ Client spends 8%, p50=${benchmark.p50}, p75=${benchmark.p75}, p90=${benchmark.p90}`);
  console.error(`  ℹ 8% is above p75 (${benchmark.p75}%) → approximately 82nd percentile`);
}

const balanceAfterSmb = deductCredits(
  smbFeed.feed_id, smbFeed.name, smbFeed.query_cost_credits,
  smbFeed.provider.id, smbFeed.provider.name,
  smbFilters, smbResult.results.length
);
assert(balanceAfterSmb === 93, `Balance after SMB query: 93 (got ${balanceAfterSmb})`);

// ─────────────────────────────────────────────
// SCENE 4: Labor Market (Trend Pattern)
// ─────────────────────────────────────────────
console.error('\n--- Scene 4: Labor Market (role_category: engineering) ---');

const laborFeed = getFeedById('labor-market-intel')!;
assert(laborFeed !== undefined, 'Found labor-market-intel feed');

const laborData = loadFeedData(laborFeed);
const laborFilters: QueryFilters = { role_category: 'engineering' };
const laborResult = queryFeed(laborData, laborFilters);

assert(laborResult.results.length > 0, `Got ${laborResult.results.length} labor market result(s)`);
if (laborResult.results.length > 0) {
  const sample = laborResult.results[0];
  assert(sample.trend_direction !== undefined, `trend_direction: ${sample.trend_direction}`);
  assert(sample.magnitude_pct !== undefined, `magnitude_pct: ${sample.magnitude_pct}`);
}

const balanceAfterLabor = deductCredits(
  laborFeed.feed_id, laborFeed.name, laborFeed.query_cost_credits,
  laborFeed.provider.id, laborFeed.provider.name,
  laborFilters, laborResult.results.length
);
assert(balanceAfterLabor === 90, `Balance after Labor query: 90 (got ${balanceAfterLabor})`);

// ─────────────────────────────────────────────
// SCENE 5: Audit Trail
// ─────────────────────────────────────────────
console.error('\n--- Scene 5: Audit Trail (tessera_check_usage) ---');

assert(getBalance() === 90, `Final balance: 90 (got ${getBalance()})`);
assert(getCreditsUsed() === 10, `Credits used: 10 (got ${getCreditsUsed()})`);
assert(getTotalQueries() === 3, `Total queries: 3 (got ${getTotalQueries()})`);

const usageLog = getUsageLog();
assert(usageLog.length === 3, `Usage log has 3 entries (got ${usageLog.length})`);

assert(usageLog[0].feed_id === 'defi-risk-signals', `Log[0]: defi-risk-signals`);
assert(usageLog[0].cost === 3, `Log[0] cost: 3`);
assert(usageLog[0].balance_after === 97, `Log[0] balance_after: 97`);

assert(usageLog[1].feed_id === 'smb-benchmarks', `Log[1]: smb-benchmarks`);
assert(usageLog[1].cost === 4, `Log[1] cost: 4`);
assert(usageLog[1].balance_after === 93, `Log[1] balance_after: 93`);

assert(usageLog[2].feed_id === 'labor-market-intel', `Log[2]: labor-market-intel`);
assert(usageLog[2].cost === 3, `Log[2] cost: 3`);
assert(usageLog[2].balance_after === 90, `Log[2] balance_after: 90`);

const earnings = getProviderEarnings();
const providerIds = Object.keys(earnings);
assert(providerIds.length === 3, `3 providers earned (got ${providerIds.length})`);

for (const [pid, e] of Object.entries(earnings)) {
  console.error(`  ℹ Provider "${pid}": earned ${e.total_earned} credits, ${e.queries_served} query(s)`);
}

// ─────────────────────────────────────────────
// Error handling checks
// ─────────────────────────────────────────────
console.error('\n--- Error Handling ---');

const badFeed = getFeedById('nonexistent-feed');
assert(badFeed === undefined, 'getFeedById returns undefined for unknown feed');

// ─────────────────────────────────────────────
// Summary
// ─────────────────────────────────────────────
console.error(`\n=== RESULTS: ${passed} passed, ${failed} failed ===`);
if (failed === 0) {
  console.error('ALL TESTS PASSED — Phase 4 demo verified!\n');
} else {
  console.error(`${failed} test(s) FAILED — review output above.\n`);
  process.exit(1);
}
