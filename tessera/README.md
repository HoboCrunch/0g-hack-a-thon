# Tessera — Intelligence Access Protocol for AI Agents

> **Tessera**: the individual tiles of a mosaic. Each intelligence feed is a tile. The agent assembles the picture.

**Tessera is programmable intelligence infrastructure** — built on [0G decentralized storage](https://0g.ai) — that lets AI agents discover, pay for, and query licensed data feeds through MCP tool calls, with humans always able to audit and co-pilot.

---

## The Problem

AI agents can browse, code, and transact — but there's **no native way for them to access premium intelligence**. APIs require human developers to hardcode integrations. Scraping is fragile. RAG is internal-only.

There's no agent-native data marketplace.

## The Solution

Tessera is the missing infrastructure layer. Data providers publish structured intelligence feeds to **0G Storage** — content-addressed, tamper-proof, provider-owned. Agents discover, query, and pay for access through MCP tool calls from any LLM.

**The interface isn't a dashboard. It's a tool call inside the agent's reasoning loop.**

```
Data Provider → publishes feed JSON → 0G Storage (content-addressed root hash)
                                           ↓
                             Tessera Registry (indexes feeds + hashes)
                                           ↓
          Agent calls MCP tool → Tessera loads data → filters → returns results
                                           ↓
                      Credits deducted → Provider earnings tracked → Usage logged
```

**0G is the storage layer. Tessera is the access layer. MCP is the interface layer.**

---

## Three Feeds, Three Patterns — One Protocol

| Feed | Pattern | Agent Asks | Data Shape |
|------|---------|-----------|------------|
| **DeFi Risk Signals** | Alert | "What happened?" | Events with severity + confidence scores |
| **SMB Industry Benchmarks** | Comparative | "How do I compare?" | Percentile distributions by industry segment |
| **Labor Market Intelligence** | Trend | "What's shifting?" | Directional changes with magnitude |

Three completely different intelligence patterns. One protocol. One tool call.

---

## The Demo Moment

An agent asks:

> *"I'm advising a manufacturing client with 40 employees. They spend about 8% of revenue on facilities maintenance. Is that high?"*

Tessera queries `smb-benchmarks` → manufacturing / facilities_maintenance_pct / 25-100 employees:

```json
{
  "query_metadata": {
    "feed_id": "smb-benchmarks",
    "query_cost": 4,
    "credits_remaining": 93,
    "storage_hash": "0xbb745d3ac8aec2a1d4dda8c46e3e16ab8a124798a30db00a73c72af2510aea32",
    "storage_network": "0G"
  },
  "results": [
    {
      "industry": "manufacturing",
      "metric": "facilities_maintenance_pct",
      "company_size_tier": "25-100",
      "p25": 3.1,
      "p50": 5.2,
      "p75": 7.8,
      "p90": 10.4,
      "unit": "percent_of_revenue"
    }
  ]
}
```

**Result**: At 8%, the client is above the 75th percentile (~82nd percentile). The median for their size and industry is 5.2%.

Not crypto speculation. Real business intelligence. One MCP tool call. Data verified on 0G.

---

## 0G Decentralized Storage Integration

All feed data is stored on the **0G Galileo testnet** — content-addressed and tamper-proof. Every query response includes the storage hash so agents (and humans) can verify data provenance.

| Feed | 0G Root Hash |
|------|-------------|
| DeFi Risk Signals | `0xee0d7f949b3cd8152567c338c368a6376c96d47b5dbca39b7ff2002eaea0b031` |
| SMB Benchmarks | `0xbb745d3ac8aec2a1d4dda8c46e3e16ab8a124798a30db00a73c72af2510aea32` |
| Labor Market Intel | `0x5791b5f0e6393d37b4619ba0dac23694ef676c651889403cfd4832f68a0acdf7` |

**Why 0G?**
- **Content-addressed**: Any tampering breaks the hash — immutable proof of data integrity
- **Provider-owned**: Feeds live on decentralized storage, not a middleman's database
- **Verifiable**: Every response carries the storage hash for independent verification

### Upload Flow
```
Feed JSON → ZgFile → Merkle Tree → Root Hash → indexer.upload() → 0G Galileo Testnet
```

The upload script (`scripts/publish-feeds.ts`) handles the full flow using `@0gfoundation/0g-ts-sdk`. Root hashes are stored in `data/registry.json` and included in every MCP tool response.

---

## MCP Tools

### `tessera_list_feeds`
Discover available intelligence feeds. Optional category filter.
```
→ Returns: feed names, categories, pricing, 0G storage info, record counts
```

### `tessera_get_feed_metadata`
Get detailed metadata for a specific feed including schema, pricing, and sample queries.
```
→ Returns: full schema, 0G storage hash, provider info, sample queries
```

### `tessera_query_feed`
Query a feed with filters. Deducts credits. Returns results with 0G storage provenance.
```
→ Filters: severity, confidence_min, industry, metric, role_category, region, tags, since, limit...
→ Returns: filtered results, query cost, remaining credits, storage hash, explain string
```

### `tessera_check_usage`
Full audit trail: credit balance, usage history, provider earnings.
```
→ Returns: credits remaining, credits used, per-query log, per-provider earnings
```

---

## Credit System

| Feed | Cost per Query |
|------|---------------|
| DeFi Risk Signals | 3 credits |
| SMB Benchmarks | 4 credits |
| Labor Market Intel | 3 credits |

Agents start with **100 credits**. Every query deducts from the balance. Provider earnings are tracked per-query. Full usage log with timestamps, filters applied, results returned, and balance after each transaction.

**Demo flow**: 100 → 97 (DeFi) → 93 (SMB) → 90 (Labor) = 10 credits spent, 3 providers paid.

---

## Quick Start

```bash
# Clone and install
git clone https://github.com/HoboCrunch/0g-hack-a-thon.git
cd 0g-hack-a-thon/tessera
npm install

# Start the MCP server
npx tsx src/index.ts

# Or use npm start
npm start

# Run the demo test suite (46 assertions)
npm test
```

### Connect to Claude / Cursor

Add to your MCP configuration:

```json
{
  "mcpServers": {
    "tessera": {
      "command": "npx",
      "args": ["tsx", "/path/to/tessera/src/index.ts"],
      "cwd": "/path/to/tessera"
    }
  }
}
```

Then ask your agent:
1. *"What intelligence feeds are available on Tessera?"*
2. *"Are there any high-confidence DeFi risk signals?"*
3. *"I'm advising a manufacturing client with 40 employees, 8% facilities spend. Is that high?"*
4. *"Is it a good time to hire backend engineers?"*
5. *"Show me my usage and remaining credits."*

---

## Architecture

```
tessera/
├── src/
│   ├── index.ts                 # MCP server — all 4 tools registered inline
│   ├── types.ts                 # TypeScript interfaces
│   ├── core/
│   │   ├── registry.ts          # Feed registry (loads registry.json, caches data)
│   │   ├── ledger.ts            # Credit system (100 starting, deduction, audit)
│   │   └── query-engine.ts      # ONE generic filter function for all 3 feed shapes
│   └── storage/
│       └── 0g-client.ts         # 0G SDK upload/download (Galileo testnet)
├── data/
│   ├── feeds/                   # 3 feed JSON files (36 total records)
│   └── registry.json            # Feed catalog with 0G storage hashes
├── scripts/
│   ├── publish-feeds.ts         # Upload feeds to 0G Storage
│   └── test-demo.ts             # Phase 4 demo test (46 assertions)
└── docs/
    ├── PROJECT_BRIEF.md         # Pitch narrative + demo script
    ├── ARCHITECTURE.md          # Technical spec + tool schemas
    └── SAMPLE_DATA.md           # Complete feed data reference
```

### Key Design Decisions
- **One query function, all feeds**: Generic property matching handles alert, comparative, and trend patterns without separate implementations
- **MCP stdio transport**: Works with any MCP-compatible LLM client (Claude, Cursor, etc.)
- **In-memory state**: Credits and usage log reset on restart — designed for demo, not persistence
- **0G first**: Data uploaded to 0G before anything else was built (Phase 1 requirement)

---

## Tech Stack

- **TypeScript** with ES modules, run via `tsx` (no compile step)
- **[@modelcontextprotocol/sdk](https://npmjs.com/package/@modelcontextprotocol/sdk)** — MCP server with stdio transport
- **[@0gfoundation/0g-ts-sdk](https://npmjs.com/package/@0gfoundation/0g-ts-sdk)** — 0G Storage upload/download
- **[ethers](https://npmjs.com/package/ethers)** v6 — Wallet signing for 0G transactions
- **[zod](https://npmjs.com/package/zod)** — Input validation for MCP tool schemas

---

## Build Status

| Phase | Description | Status |
|-------|------------|--------|
| Phase 1 | Data + 0G Storage Upload | ✅ Complete — 3 feeds uploaded, real hashes |
| Phase 2 | Core Logic (registry, ledger, query engine) | ✅ Complete |
| Phase 3 | MCP Server + All 4 Tools | ✅ Complete |
| Phase 4 | Demo Testing (46/46 assertions) | ✅ Complete |

See [HISTORY.md](HISTORY.md) for detailed build log including the 0G SDK migration from `@0glabs` to `@0gfoundation` (contract ABI fix on Galileo testnet).

---

## Why Tessera Matters

Today, if an AI agent needs market data, industry benchmarks, or risk signals, a human developer must find an API, write an integration, handle auth, and maintain it. The agent has no role in discovery.

Tessera flips this: **the agent discovers feeds, decides what to query, pays with credits, and audits its own spending**. Data providers earn per query. Humans review the audit trail. Everything is verifiable on 0G.

*Pay-per-intelligence, not pay-per-API-call.*

---

**Built for the 0G Hackathon, February 2025**
