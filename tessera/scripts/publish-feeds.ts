import 'dotenv/config';
import path from 'path';
import { fileURLToPath } from 'url';
import { uploadFeed } from '../src/storage/0g-client.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.resolve(__dirname, '../data/feeds');

const FEEDS = [
  'defi-risk-signals.json',
  'smb-benchmarks.json',
  'labor-market-intel.json',
];

async function main() {
  const privateKey = process.env.PRIVATE_KEY;
  if (!privateKey || privateKey === '0xYOUR_PRIVATE_KEY_HERE') {
    console.error('[PUBLISH] ERROR: Set a real PRIVATE_KEY in .env');
    process.exit(1);
  }

  console.error('[PUBLISH] Starting feed uploads to 0G Storage...');
  console.error(`[PUBLISH] Data directory: ${DATA_DIR}`);

  const results: Record<string, string> = {};

  for (const feedFile of FEEDS) {
    const filePath = path.join(DATA_DIR, feedFile);
    console.error(`\n[PUBLISH] Uploading ${feedFile}...`);
    try {
      const rootHash = await uploadFeed(filePath, privateKey);
      results[feedFile] = rootHash;
      console.error(`[PUBLISH] ✓ ${feedFile} → ${rootHash}`);
    } catch (err) {
      console.error(`[PUBLISH] ✗ FAILED ${feedFile}: ${err}`);
    }
  }

  console.error('\n[PUBLISH] === RESULTS ===');
  for (const [file, hash] of Object.entries(results)) {
    console.error(`  ${file}: ${hash}`);
  }
  console.error('\n[PUBLISH] Update data/registry.json with these hashes.');
  console.error('[PUBLISH] Done.');
}

main();
