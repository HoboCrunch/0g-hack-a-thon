# Tessera — Build History

## Phase 1: Data + 0G Storage Upload — COMPLETE

### What was built
- Created 3 feed JSON files in `data/feeds/`:
  - `defi-risk-signals.json` — 11 DeFi alert records (TVL anomalies, contract risks, liquidity migrations)
  - `smb-benchmarks.json` — 14 SMB benchmark records (6 industries, 5 metrics, percentile data)
  - `labor-market-intel.json` — 11 labor market trend records (hiring velocity, salary shifts, skills demand)
- Created `data/registry.json` — feed catalog with provider info, schemas, sample queries, and 0G storage hashes
- Created `src/storage/0g-client.ts` — upload/download functions using 0G SDK
- Created `scripts/publish-feeds.ts` — one-time upload script for all 3 feeds

### 0G Storage uploads
All 3 feeds were successfully uploaded to 0G decentralized storage on the Galileo testnet:

| Feed | Root Hash |
|------|-----------|
| defi-risk-signals | `0xee0d7f949b3cd8152567c338c368a6376c96d47b5dbca39b7ff2002eaea0b031` |
| smb-benchmarks | `0xbb745d3ac8aec2a1d4dda8c46e3e16ab8a124798a30db00a73c72af2510aea32` |
| labor-market-intel | `0x5791b5f0e6393d37b4619ba0dac23694ef676c651889403cfd4832f68a0acdf7` |

### Issue resolved
The original `@0glabs/0g-ts-sdk` v0.3.3 had an outdated contract ABI that didn't match the current Galileo testnet flow contract. The `submit()` function selector (`0xef3e12dc`) was rejected by the on-chain contract which now expects `0xbc8c11f8`. Migrated to `@0gfoundation/0g-ts-sdk` v1.0.1 which has the correct ABI, and all uploads succeeded.

---

## Phase 2: Core Logic — COMPLETE

### What was built
- `src/types.ts` — TypeScript interfaces: `FeedRegistryEntry`, `CreditLedger`, `UsageLogEntry`
- `src/core/registry.ts` — Feed registry manager: loads `registry.json`, caches feed data in memory, provides `getFeeds()`, `getFeedById()`, `loadFeedData()`
- `src/core/ledger.ts` — In-memory credit system: 100 starting credits, deduction tracking, usage log, provider earnings
- `src/core/query-engine.ts` — ONE generic filter function for all 3 feed shapes:
  - String filters (severity, industry, metric, etc.) — case-insensitive exact match
  - `confidence_min` — >= comparison
  - `since` — timestamp >= comparison
  - `tags` — array intersection (OR match)
  - Sort by confidence descending, limit results (default 10)

---

## Phase 3: MCP Server + Tools — COMPLETE

### What was built
- `src/index.ts` — MCP server with all 4 tools registered inline:
  1. `tessera_list_feeds` — Discover available feeds (optional category filter)
  2. `tessera_get_feed_metadata` — Detailed feed info with schema, 0G hash, sample queries
  3. `tessera_query_feed` — Query a feed with filters, deducts credits, returns results with 0G provenance
  4. `tessera_check_usage` — Credit balance, usage log, provider earnings audit trail

### Server verified
- Starts cleanly, loads 3 feeds (36 total records), logs all 0G hashes
- All responses return JSON via `{ content: [{ type: "text", text: JSON.stringify(...) }] }`
- Error responses (feed_not_found, insufficient_credits) are JSON, never thrown exceptions
- All logging via `console.error` (stdout reserved for MCP transport)

---

## Phase 4: Connect + Demo Test — COMPLETE

### What was done
- Added MCP config (`.mcp.json`) for Claude Code / Cursor integration
- Created `scripts/test-demo.ts` — automated test script for all 5 demo scenes
- Ran all 5 demo scenes end-to-end: **46 tests passed, 0 failed**

### Demo scene results

**Scene 1: Discovery** — `tessera_list_feeds` returned 3 feeds, all with `storage_network: "0G"` and valid `storage_hash` values. Category filter works correctly.

**Scene 2: DeFi Query** — `tessera_query_feed` with `confidence_min: 0.8` returned 5 high-confidence signals. Credits: 100 → 97. `storage_hash` present in response.

**Scene 3: Benchmark Query (THE Moment)** — Manufacturing client, 40 employees, 8% facilities spend. Query returned p50=5.2%, p75=7.8%, p90=10.4%. 8% is above the 75th percentile (~82nd percentile). Credits: 97 → 93.

**Scene 4: Labor Market** — Engineering role query returned 4 trend signals with `trend_direction` and `magnitude_pct`. Credits: 93 → 90.

**Scene 5: Audit Trail** — `tessera_check_usage` confirmed: 3 queries, 10 credits used, 90 remaining. All 3 providers earned correctly. Full usage log with timestamps, filters, and balance tracking.

### Verification checklist
- [x] `storage_hash` appears in every query response
- [x] `storage_network: "0G"` appears in every query response
- [x] Credit math: 100 → 97 → 93 → 90 after 3 queries (costs: 3 + 4 + 3 = 10)
- [x] Provider earnings tracked correctly (3 providers, 3 queries)
- [x] Error handling: unknown feed returns `undefined`, insufficient credits returns JSON error

---

## Git History

```
e01b5ba Phase 1 complete: 0G uploads successful, registry updated with real hashes
6284f1c Phase 3: MCP server with all 4 tools
328bd29 Phase 2: Core logic — registry, ledger, query engine
03bdd46 Phase 1: Feed data created and uploaded to 0G Storage
5c83d5e Project scaffold: Tessera intelligence access protocol
```

All commits pushed to `origin/main`.

---

## Project Structure (current)

```
tessera/
├── data/
│   ├── feeds/
│   │   ├── defi-risk-signals.json    (11 records)
│   │   ├── smb-benchmarks.json       (14 records)
│   │   └── labor-market-intel.json   (11 records)
│   └── registry.json                 (3 feeds, real 0G hashes)
├── scripts/
│   ├── publish-feeds.ts              (0G upload script)
│   └── test-demo.ts                  (Phase 4 demo test — 46 assertions)
├── src/
│   ├── core/
│   │   ├── registry.ts               (feed registry manager)
│   │   ├── ledger.ts                 (credit system)
│   │   └── query-engine.ts           (generic filter engine)
│   ├── storage/
│   │   └── 0g-client.ts              (0G upload/download)
│   ├── types.ts                      (TypeScript interfaces)
│   └── index.ts                      (MCP server, all 4 tools)
├── docs/                             (reference documentation)
├── package.json
├── tsconfig.json
└── .env                              (private key — not committed)
```
