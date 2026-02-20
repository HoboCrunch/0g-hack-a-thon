import { ZgFile, Indexer } from '@0glabs/0g-ts-sdk';
import { ethers } from 'ethers';

const RPC_URL = 'https://evmrpc-testnet.0g.ai';
const INDEXER_RPC = 'https://indexer-storage-testnet-turbo.0g.ai';

export function createIndexer(): Indexer {
  return new Indexer(INDEXER_RPC);
}

export function createSigner(privateKey: string): ethers.Wallet {
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
  if (!rootHash) throw new Error('Failed to compute root hash');

  const [tx, uploadErr] = await indexer.upload(file, RPC_URL, signer);
  if (uploadErr) throw new Error(`Upload error: ${uploadErr}`);

  await file.close();
  console.error(`[0G] Uploaded ${filePath} → ${rootHash}`);
  return rootHash;
}

export async function downloadFeed(rootHash: string, outputPath: string): Promise<void> {
  const indexer = createIndexer();
  const err = await indexer.download(rootHash, outputPath, true);
  if (err) throw new Error(`Download error: ${err}`);
  console.error(`[0G] Downloaded ${rootHash} → ${outputPath}`);
}
