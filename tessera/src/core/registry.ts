import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { FeedRegistryEntry } from '../types.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.resolve(__dirname, '../../data');

let registry: FeedRegistryEntry[] = [];
const feedDataCache: Record<string, any[]> = {};

export function loadRegistry(): FeedRegistryEntry[] {
  const registryPath = path.join(DATA_DIR, 'registry.json');
  const raw = fs.readFileSync(registryPath, 'utf-8');
  registry = JSON.parse(raw) as FeedRegistryEntry[];
  console.error(`[TESSERA] Loaded ${registry.length} feeds from registry`);

  for (const feed of registry) {
    console.error(`[TESSERA] Feed "${feed.feed_id}" → 0G hash: ${feed.storage_hash}`);
  }

  return registry;
}

export function getFeeds(category?: string): FeedRegistryEntry[] {
  if (!category) return registry;
  return registry.filter(f => f.category.toLowerCase() === category.toLowerCase());
}

export function getFeedById(feedId: string): FeedRegistryEntry | undefined {
  return registry.find(f => f.feed_id === feedId);
}

export function loadFeedData(feed: FeedRegistryEntry): any[] {
  if (feedDataCache[feed.feed_id]) {
    return feedDataCache[feed.feed_id];
  }

  const dataPath = path.join(DATA_DIR, feed.data_file);
  const raw = fs.readFileSync(dataPath, 'utf-8');
  const data = JSON.parse(raw) as any[];
  feedDataCache[feed.feed_id] = data;
  console.error(`[TESSERA] Loaded ${data.length} records for feed "${feed.feed_id}"`);
  return data;
}

export function getRegistry(): FeedRegistryEntry[] {
  return registry;
}
