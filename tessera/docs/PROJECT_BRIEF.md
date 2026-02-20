# Tessera — Intelligence Access Protocol for Autonomous Agents

## One-liner
Tessera is programmable intelligence infrastructure — built on 0G decentralized storage — that lets AI agents discover, pay for, and query licensed data feeds through MCP, with humans always able to audit and co-pilot.

*Tessera: the individual tiles of a mosaic. Each intelligence feed is a tile. The agent assembles the picture.*

---

## The Story

AI agents can browse, code, and transact — but there's no native way for them to access premium intelligence. APIs require human devs to hardcode integrations. Scraping is fragile. RAG is internal-only.

Tessera is the missing infrastructure layer. Data providers publish structured intelligence feeds to **0G Storage** — content-addressed, tamper-proof, provider-owned. Agents discover, query, and pay for access through MCP tool calls from any LLM.

**The interface isn't a dashboard. It's a tool call inside the agent's reasoning loop.**

---

## Architecture (How 0G Fits)

```
Data Provider → publishes feed JSON → 0G Storage (content-addressed root hash)
                                          ↓
                            Tessera Registry (indexes feeds + hashes)
                                          ↓
         Agent calls MCP tool → Tessera loads data from 0G → filters → returns results
                                          ↓
                     Credits deducted → Provider earnings tracked → Usage logged
```

0G Storage is the data layer. Tessera is the access and metering layer. MCP is the interface layer.

---

## Three Feeds, Three Patterns

| Feed | Pattern | Agent Asks | Data Shape |
|------|---------|-----------|------------|
| DeFi Risk Signals | Alert | "What happened?" | Events with severity + confidence |
| SMB Industry Benchmarks | Comparative | "How do I compare?" | Percentile distributions by segment |
| Labor Market Intel | Trend | "What's shifting?" | Directional changes with magnitude |

---

## Demo Script

### Scene 1: Discovery
**Say**: "What intelligence feeds are available on Tessera?"
**Agent calls**: `tessera_list_feeds` → 3 feeds with names, categories, pricing, 0G storage network
**Shows**: Agent can programmatically discover available intelligence

### Scene 2: DeFi Query (Alert Pattern)
**Say**: "Are there any high-confidence DeFi risk signals in the last 24 hours?"
**Agent calls**: `tessera_query_feed` with confidence ≥ 0.8
**Shows**: Structured signals returned, credits deducted (100 → 97), 0G storage hash in response

### Scene 3: Benchmark Query — THE Moment (Comparative Pattern)
**Say**: "I'm advising a manufacturing client with 40 employees. They spend about 8% of revenue on facilities maintenance. Is that high?"
**Agent calls**: `tessera_query_feed` with industry + metric + size tier filters
**Shows**: "82nd percentile — median is 5.2%." Not crypto. Real business intelligence. Different query shape entirely.

### Scene 4: Labor Market (Trend Pattern)
**Say**: "Is it a good time to hire backend engineers?"
**Agent calls**: `tessera_query_feed` with role_category + tags
**Shows**: Trend data with directional signals. Third distinct pattern proves general-purpose protocol.

### Scene 5: Audit Trail
**Say**: "Show me my usage and remaining credits"
**Agent calls**: `tessera_check_usage` → full log
**Shows**: Every query, every credit, every provider. Full transparency.

---

## Key Phrases
- "Every data feed is a tile. The agent assembles the mosaic."
- "Feed data lives on 0G — content-addressed, tamper-proof, provider-owned"
- "Three feeds, three completely different intelligence patterns — one protocol"
- "Pay-per-intelligence, not pay-per-API-call"
- "The primary interface is the agent's tool call, not a human dashboard"
- "0G is the storage layer. Tessera is the access layer. MCP is the interface layer."
- "Every query is logged. Humans audit, agents execute."
