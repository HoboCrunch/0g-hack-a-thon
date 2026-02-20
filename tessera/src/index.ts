import 'dotenv/config';
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

import { loadRegistry, getFeeds, getFeedById, loadFeedData } from './core/registry.js';
import { getBalance, canAfford, deductCredits, getUsageLog, getProviderEarnings, getCreditsUsed, getTotalQueries } from './core/ledger.js';
import { queryFeed, QueryFilters } from './core/query-engine.js';

// --- Startup: load registry and pre-cache all feed data ---
const feeds = loadRegistry();
for (const feed of feeds) {
  try {
    loadFeedData(feed);
  } catch (err) {
    console.error(`[TESSERA] WARNING: Could not load data for feed "${feed.feed_id}": ${err}`);
  }
}

const server = new McpServer({ name: "tessera", version: "0.1.0" });

// === TOOL 1: tessera_list_feeds ===
server.tool(
  "tessera_list_feeds",
  "Discover available intelligence feeds on the Tessera protocol. Returns feed names, categories, pricing, and 0G storage network info.",
  {
    category: z.string().optional().describe("Filter by category (e.g., 'defi', 'business-operations', 'workforce')")
  },
  async (args) => {
    const feedList = getFeeds(args.category);
    const result = {
      feeds: feedList.map(f => ({
        feed_id: f.feed_id,
        name: f.name,
        category: f.category,
        query_pattern: f.query_pattern,
        provider: `${f.provider.name} (${f.provider.id})`,
        query_cost_credits: f.query_cost_credits,
        description: f.description,
        last_updated: f.last_updated,
        storage_network: f.storage_network,
        record_count: loadFeedData(f).length,
      })),
      total_feeds: feedList.length,
    };
    return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] };
  }
);

// === TOOL 2: tessera_get_feed_metadata ===
server.tool(
  "tessera_get_feed_metadata",
  "Get detailed metadata for a specific feed including schema, pricing, 0G storage hash, and sample queries.",
  {
    feed_id: z.string().describe("The feed ID to get metadata for (e.g., 'defi-risk-signals')")
  },
  async (args) => {
    const feed = getFeedById(args.feed_id);
    if (!feed) {
      const error = { error: "feed_not_found", message: `No feed with ID '${args.feed_id}' in the registry.` };
      return { content: [{ type: "text" as const, text: JSON.stringify(error, null, 2) }] };
    }

    const result = {
      feed_id: feed.feed_id,
      name: feed.name,
      description: feed.description,
      category: feed.category,
      query_pattern: feed.query_pattern,
      storage_hash: feed.storage_hash,
      storage_network: feed.storage_network,
      provider: feed.provider,
      query_cost_credits: feed.query_cost_credits,
      last_updated: feed.last_updated,
      update_frequency: feed.update_frequency,
      record_count: loadFeedData(feed).length,
      schema: feed.schema,
      sample_queries: feed.sample_queries,
    };
    return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] };
  }
);

// === TOOL 3: tessera_query_feed ===
server.tool(
  "tessera_query_feed",
  "Query an intelligence feed with filters. Deducts credits from your balance. Returns structured results with 0G storage provenance.",
  {
    feed_id: z.string().describe("The feed ID to query"),
    filters: z.object({
      severity: z.string().optional().describe("Filter by severity: low, medium, high, critical"),
      confidence_min: z.number().optional().describe("Minimum confidence score (0.0-1.0)"),
      tags: z.array(z.string()).optional().describe("Filter by tags (OR match — returns records matching ANY tag)"),
      limit: z.number().optional().describe("Max results to return (default 10)"),
      since: z.string().optional().describe("ISO 8601 timestamp — only results after this time"),
      industry: z.string().optional().describe("Filter by industry (for smb-benchmarks)"),
      metric: z.string().optional().describe("Filter by metric key (for smb-benchmarks)"),
      company_size_tier: z.string().optional().describe("Filter by size tier: 1-25, 25-100, 100-500"),
      role_category: z.string().optional().describe("Filter by role category (for labor-market-intel)"),
      region: z.string().optional().describe("Filter by region (for labor-market-intel)"),
      trend_direction: z.string().optional().describe("Filter: increasing, decreasing, stable"),
      signal_type: z.string().optional().describe("Filter by signal type (for defi-risk-signals)"),
      protocol: z.string().optional().describe("Filter by protocol name (for defi-risk-signals)"),
      chain: z.string().optional().describe("Filter by blockchain (for defi-risk-signals)"),
      trend_type: z.string().optional().describe("Filter by trend type (for labor-market-intel)"),
    }).optional().describe("Query filters (all optional)")
  },
  async (args) => {
    const feed = getFeedById(args.feed_id);
    if (!feed) {
      const error = { error: "feed_not_found", message: `No feed with ID '${args.feed_id}' in the registry.` };
      return { content: [{ type: "text" as const, text: JSON.stringify(error, null, 2) }] };
    }

    const cost = feed.query_cost_credits;
    const balance = getBalance();

    if (!canAfford(cost)) {
      const error = {
        error: "insufficient_credits",
        message: `Query costs ${cost} credits but you only have ${balance} remaining.`,
        query_cost: cost,
        credits_remaining: balance,
      };
      return { content: [{ type: "text" as const, text: JSON.stringify(error, null, 2) }] };
    }

    const data = loadFeedData(feed);
    const filters: QueryFilters = args.filters ?? {};
    const { results, explain, totalMatching } = queryFeed(data, filters);

    const newBalance = deductCredits(
      feed.feed_id,
      feed.name,
      cost,
      feed.provider.id,
      feed.provider.name,
      filters,
      results.length
    );

    const result = {
      query_metadata: {
        feed_id: feed.feed_id,
        feed_name: feed.name,
        query_cost: cost,
        credits_remaining: newBalance,
        timestamp: new Date().toISOString(),
        storage_hash: feed.storage_hash,
        storage_network: feed.storage_network,
        filters_applied: filters,
        results_returned: results.length,
        total_matching: totalMatching,
      },
      results,
      explain,
    };
    return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] };
  }
);

// === TOOL 4: tessera_check_usage ===
server.tool(
  "tessera_check_usage",
  "Check your credit balance, usage history, and provider earnings. Full audit trail of all queries.",
  {
    include_log: z.boolean().optional().describe("Include detailed usage log (default true)")
  },
  async (args) => {
    const includeLog = args.include_log !== false;

    const result: Record<string, any> = {
      account: {
        agent_id: 'agent-demo-001',
        credits_remaining: getBalance(),
        credits_used: getCreditsUsed(),
        total_queries: getTotalQueries(),
      },
      provider_earnings: getProviderEarnings(),
    };

    if (includeLog) {
      result.usage_log = getUsageLog();
    }

    return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] };
  }
);

// --- Start MCP server ---
const transport = new StdioServerTransport();
await server.connect(transport);
console.error("[TESSERA] Server started");
