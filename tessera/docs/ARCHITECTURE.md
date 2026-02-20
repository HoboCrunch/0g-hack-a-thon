# Tessera — Architecture & MCP Tool Specification

## Stack
- **Runtime**: Node.js (TypeScript), run with `tsx`
- **MCP SDK**: `@modelcontextprotocol/sdk` — stdio transport
- **0G Storage**: `@0glabs/0g-ts-sdk` v0.3.3 + `ethers` — feed data stored on 0G
- **Validation**: `zod` for MCP input schemas
- **State**: In-memory (resets on server restart)

## File Structure

```
tessera/
├── package.json
├── tsconfig.json
├── .env                      # PRIVATE_KEY for 0G Storage
├── .gitignore
├── src/
│   ├── index.ts              # MCP server — registers all 4 tools, starts stdio
│   ├── core/
│   │   ├── registry.ts       # Feed registry manager (loads registry.json)
│   │   ├── ledger.ts         # Credit system & usage log (in-memory)
│   │   └── query-engine.ts   # Generic filter engine for all feed shapes
│   ├── storage/
│   │   └── 0g-client.ts      # 0G Storage upload/download functions
│   └── types.ts              # Shared TypeScript types
├── data/
│   ├── feeds/
│   │   ├── defi-risk-signals.json
│   │   ├── smb-benchmarks.json
│   │   └── labor-market-intel.json
│   └── registry.json         # Feed catalog with 0G storage hashes
└── scripts/
    └── publish-feeds.ts      # Upload feeds to 0G Storage (run once)
```

---

## Data Flow

```
[Data Provider creates feed JSON]
        ↓
[publish-feeds.ts uploads to 0G Storage]
        ↓
[0G returns content-addressed root hash per file]
        ↓
[Root hashes stored in registry.json]
        ↓
[MCP server starts → loads registry → can download feeds from 0G]
        ↓
[Agent calls tessera_query_feed → server filters data → returns results with storage_hash]
```

---

## 0G Storage Integration

### Testnet Config
```
RPC_URL=https://evmrpc-testnet.0g.ai
INDEXER_RPC=https://indexer-storage-testnet-turbo.0g.ai
Faucet: https://faucet.0g.ai
Flow contract: 0x22E03a6A89B950F1c82ec5e74F8eCa321a105296
```

### src/storage/0g-client.ts
```typescript
import { ZgFile, Indexer } from '@0glabs/0g-ts-sdk';
import { ethers } from 'ethers';

const RPC_URL = 'https://evmrpc-testnet.0g.ai';
const INDEXER_RPC = 'https://indexer-storage-testnet-turbo.0g.ai';

export function createIndexer() {
  return new Indexer(INDEXER_RPC);
}

export function createSigner(privateKey: string) {
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  return new ethers.Wallet(privateKey, provider);
}

export async function uploadFeed(filePath: string, privateKey: string): Promise<string> {
  const signer = createSigner(privateKey);
  const indexer = createIndexer();
  const file = await ZgFile.fromFilePath(filePath);

  const [tree, treeErr] = await file.merkleTree();
  if (treeErr) throw new Error(`Merkle tree error: ${treeErr}`);
  const rootHash = tree!.rootHash();

  const [tx, uploadErr] = await indexer.upload(file, RPC_URL, signer);
  if (uploadErr) throw new Error(`Upload error: ${uploadErr}`);

  await file.close();
  return rootHash;
}

export async function downloadFeed(rootHash: string, outputPath: string): Promise<void> {
  const indexer = createIndexer();
  const err = await indexer.download(rootHash, outputPath, true);
  if (err) throw new Error(`Download error: ${err}`);
}
```

### Startup Behavior
When the MCP server starts:
1. Load registry.json
2. For each feed, check if the local data file exists
3. If missing, attempt download from 0G using `storage_hash`
4. If 0G download fails, log warning and continue (graceful degradation)
5. Load all feed data into memory

---

## MCP Tools

All tools prefixed `tessera_`.

### 1. `tessera_list_feeds`
Discover available intelligence feeds.

**Input**: `{ category?: string }`

**Output**:
```json
{
  "feeds": [
    {
      "feed_id": "defi-risk-signals",
      "name": "DeFi Protocol Risk Signals",
      "category": "defi",
      "query_pattern": "alert",
      "provider": "Sentinel Risk Labs (0x7a3b...9f2e)",
      "query_cost_credits": 3,
      "description": "Real-time risk signals across major DeFi protocols...",
      "last_updated": "2025-02-19T14:30:00Z",
      "storage_network": "0G",
      "record_count": 11
    }
  ],
  "total_feeds": 3
}
```

### 2. `tessera_get_feed_metadata`
Detailed feed info — schema, pricing, 0G storage hash, sample queries.

**Input**: `{ feed_id: string }` (required)

**Output** includes:
```json
{
  "feed_id": "smb-benchmarks",
  "name": "SMB Industry Benchmarks",
  "storage_hash": "0xabc123...",
  "storage_network": "0G",
  "provider": { "name": "BenchmarkIQ Analytics", "id": "benchmarkiq-analytics", "reputation_score": 96 },
  "query_cost_credits": 4,
  "schema": { "fields": [...] },
  "sample_queries": [...]
}
```

### 3. `tessera_query_feed`
Query a feed with filters. Deducts credits. Returns structured results with 0G provenance.

**Input**: `{ feed_id: string, filters?: { severity?, confidence_min?, tags?, limit?, since?, industry?, metric?, company_size_tier?, role_category?, region?, trend_direction? } }`

**Output (success)**:
```json
{
  "query_metadata": {
    "feed_id": "smb-benchmarks",
    "feed_name": "SMB Industry Benchmarks",
    "query_cost": 4,
    "credits_remaining": 93,
    "timestamp": "2025-02-20T10:20:00Z",
    "storage_hash": "0xabc123...",
    "storage_network": "0G",
    "filters_applied": { "industry": "manufacturing", "metric": "facilities_maintenance_pct", "company_size_tier": "25-100" },
    "results_returned": 1,
    "total_matching": 1
  },
  "results": [...],
  "explain": "Matched 1 benchmark record for manufacturing / facilities_maintenance_pct / 25-100 employee tier."
}
```

**Output (error)**:
```json
{ "error": "insufficient_credits", "message": "...", "query_cost": 4, "credits_remaining": 2 }
{ "error": "feed_not_found", "message": "No feed with ID 'xyz' in the registry." }
```

### 4. `tessera_check_usage`
Credit balance + audit log + provider earnings.

**Input**: `{ include_log?: boolean }`

**Output**:
```json
{
  "account": { "agent_id": "agent-demo-001", "credits_remaining": 89, "credits_used": 11, "total_queries": 3 },
  "provider_earnings": { "sentinel-risk-labs": { "total_earned": 3, "queries_served": 1 } },
  "usage_log": [...]
}
```

---

## Data Types (src/types.ts)

```typescript
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
```

## Query Engine

One generic function handles all three feed shapes:
1. String filter keys → case-insensitive exact match on same-named property
2. `confidence_min` → `>=` comparison
3. `since` → timestamp `>=` comparison
4. `tags` → array intersection (OR match)
5. `limit` → cap results (default 10)
6. Sort by confidence descending if field exists
7. Return `{ results, explain, totalMatching }`

## MCP Config (Cursor / Claude Desktop)
```json
{
  "mcpServers": {
    "tessera": {
      "command": "npx",
      "args": ["tsx", "/absolute/path/to/tessera/src/index.ts"]
    }
  }
}
```
