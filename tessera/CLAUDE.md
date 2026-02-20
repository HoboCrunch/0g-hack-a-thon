# CLAUDE.md — Tessera Build Instructions

You are building "Tessera", an MCP server for a hackathon. Under 2 hours total. Read this file completely, then read ALL files in `docs/` before writing any code.

## Project Overview
Tessera = intelligence access protocol. AI agents discover, pay for, and query licensed data feeds through MCP tool calls. Feed data is stored on **0G decentralized storage** (required — this is a 0G hackathon). Credits simulate payment. Everything callable via MCP tools from any LLM.

3 feeds, 3 query patterns:
- **DeFi Risk Signals** — alert pattern (severity, confidence)
- **SMB Industry Benchmarks** — comparative pattern (industry/metric/size → percentiles)
- **Labor Market Intelligence** — trend pattern (role/region/direction)

## Reference Docs (READ BEFORE CODING)
- `docs/PROJECT_BRIEF.md` — Concept, demo script, pitch framing
- `docs/ARCHITECTURE.md` — File structure, MCP tool schemas, exact output shapes, types, 0G integration code
- `docs/SAMPLE_DATA.md` — Complete JSON for all data files (copy exactly)

## Git Workflow
Repo: https://github.com/HoboCrunch/0g-hack-a-thon
Commit and push after each completed phase:
```bash
git add -A && git commit -m "Phase N: description" && git push origin main
```

---

## 0G STORAGE IS PHASE 1 — NOT OPTIONAL

This is a 0G hackathon. The 0G integration must be real and working before anything else.

### 0G Testnet Config (Galileo)
```
RPC_URL=https://evmrpc-testnet.0g.ai
INDEXER_RPC=https://indexer-storage-testnet-turbo.0g.ai
```
Private key is in `.env` file. Load with `dotenv/config`.

### The 0G Flow
1. Feed JSON files get uploaded to 0G Storage via `scripts/publish-feeds.ts`
2. Each upload returns a content-addressed **root hash**
3. Root hashes go into `data/registry.json` as `storage_hash` fields
4. MCP server shows these hashes in every tool response (`storage_hash`, `storage_network: "0G"`)
5. On startup, server can download feeds from 0G using root hashes (with local file fallback)

### Upload Pattern
```typescript
import { ZgFile, Indexer } from '@0glabs/0g-ts-sdk';
import { ethers } from 'ethers';

const RPC_URL = 'https://evmrpc-testnet.0g.ai';
const INDEXER_RPC = 'https://indexer-storage-testnet-turbo.0g.ai';

const provider = new ethers.JsonRpcProvider(RPC_URL);
const signer = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);
const indexer = new Indexer(INDEXER_RPC);

async function uploadFeed(filePath: string): Promise<string> {
  const file = await ZgFile.fromFilePath(filePath);
  const [tree, treeErr] = await file.merkleTree();
  if (treeErr) throw new Error(`Merkle tree error: ${treeErr}`);
  const rootHash = tree!.rootHash();
  const [tx, uploadErr] = await indexer.upload(file, RPC_URL, signer);
  if (uploadErr) throw new Error(`Upload error: ${uploadErr}`);
  await file.close();
  console.error(`Uploaded ${filePath} → ${rootHash}`);
  return rootHash;
}
```

### Download Pattern
```typescript
import { Indexer } from '@0glabs/0g-ts-sdk';
const indexer = new Indexer('https://indexer-storage-testnet-turbo.0g.ai');

async function downloadFeed(rootHash: string, outputPath: string): Promise<void> {
  const err = await indexer.download(rootHash, outputPath, true);
  if (err) throw new Error(`Download error: ${err}`);
}
```

---

## BUILD ORDER (Follow Exactly)

### Phase 1: Data + 0G Storage Upload (25 min)
1. Create ALL 3 feed JSON files in `data/feeds/` — copy exactly from `docs/SAMPLE_DATA.md`
2. Create `data/registry.json` — copy from `docs/SAMPLE_DATA.md` (has `storage_hash: "pending_0g_upload"` placeholders)
3. Create `src/storage/0g-client.ts` with upload and download functions
4. Create `scripts/publish-feeds.ts` — uploads all 3 feeds to 0G, prints root hashes
5. Run: `PRIVATE_KEY=$(grep PRIVATE_KEY .env | cut -d= -f2) npx tsx scripts/publish-feeds.ts`
6. Update `data/registry.json` with the real root hashes from step 5
7. **Commit**: `git add -A && git commit -m "Phase 1: Feed data created and uploaded to 0G Storage" && git push origin main`

### Phase 2: Core Logic (15 min)
1. Create `src/types.ts` — copy interfaces from `docs/ARCHITECTURE.md`
2. Create `src/core/registry.ts` — load registry.json, get feeds, get feed by ID, load feed data
3. Create `src/core/ledger.ts` — credit balance (starts 100), deduct, usage log, provider earnings
4. Create `src/core/query-engine.ts` — ONE generic filter function for all 3 feed shapes
5. **Commit**: `git add -A && git commit -m "Phase 2: Core logic — registry, ledger, query engine" && git push origin main`

### Phase 3: MCP Server + Tools (25 min)
1. Create `src/index.ts` — MCP server with ALL 4 tools registered inline
2. On startup: load registry, log feed count and 0G hashes
3. Tools: `tessera_list_feeds`, `tessera_get_feed_metadata`, `tessera_query_feed`, `tessera_check_usage`
4. Test: server starts without errors
5. **Commit**: `git add -A && git commit -m "Phase 3: MCP server with all 4 tools" && git push origin main`

### Phase 4: Connect + Demo Test (15 min)
1. Add to Cursor MCP config and restart
2. Run all 5 demo scenes from `docs/PROJECT_BRIEF.md`
3. Verify 0G `storage_hash` appears in responses
4. Verify credit math works across full demo
5. **Commit**: `git add -A && git commit -m "Phase 4: Demo tested and working" && git push origin main`

### Buffer: 20 min

---

## TECHNICAL RULES (Non-Negotiable)

- TypeScript, run with `tsx` (no compile step needed)
- `@modelcontextprotocol/sdk` with stdio transport
- `@0glabs/0g-ts-sdk` for 0G Storage (real uploads, not simulated)
- `zod` for MCP input schemas
- `dotenv` to load .env
- In-memory state only
- **NEVER use console.log** — stdout is MCP transport. Use `console.error` for ALL logging.
- All tool responses: `{ content: [{ type: "text", text: JSON.stringify(result, null, 2) }] }`
- Error responses are JSON too, never thrown exceptions

## MCP Server Skeleton
```typescript
import 'dotenv/config';
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const server = new McpServer({ name: "tessera", version: "0.1.0" });

server.tool("tessera_list_feeds", "Discover available intelligence feeds", {
  category: z.string().optional().describe("Filter by category")
}, async (args) => {
  // ... implementation
  return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
});

// ... register other tools ...

const transport = new StdioServerTransport();
await server.connect(transport);
console.error("[TESSERA] Server started");
```

## Query Engine — ONE Function, All Feeds
Generic property matching. Do NOT write 3 separate query functions:
- String filter keys → case-insensitive exact match on same-named record property
- `confidence_min` → `record.confidence >= value`
- `since` → `record.timestamp >= value`  
- `tags` → array intersection (match if ANY tag matches)
- `limit` → cap results (default 10)
- Sort by confidence desc if field exists
- Return `{ results, explain, totalMatching }`

## File Path Resolution
```typescript
import { fileURLToPath } from 'url';
import path from 'path';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.resolve(__dirname, '../data'); // adjust depth as needed
```

## Console Logging Style
```typescript
console.error(`[TESSERA] Query: ${feedId} | Cost: ${cost} | Balance: ${newBalance}`);
console.error(`[TESSERA] Provider "${providerName}" earned ${cost} credits`);
console.error(`[TESSERA] Loaded ${feeds.length} feeds from registry`);
```

---

## DO NOT BUILD
- Web UI or HTTP server of any kind
- Separate files per MCP tool (keep ALL tools in index.ts)
- Database or persistent storage
- Real auth or wallet connection flows
- Anything not visible in the 5 demo scenes

## IF RUNNING BEHIND
Priority order (cut from the bottom):
1. ✅ 0G upload MUST work (non-negotiable)
2. ✅ tessera_query_feed MUST work (core demo)
3. ✅ tessera_list_feeds MUST work (discovery)
4. ✅ tessera_check_usage SHOULD work (audit trail)
5. ⚠️ tessera_get_feed_metadata is nice-to-have
6. ⚠️ 0G download on startup is nice-to-have (local files are fine)
