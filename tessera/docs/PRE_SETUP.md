# Tessera — Pre-Hackathon Setup (Do This BEFORE the Timer Starts)

These steps take 10-15 minutes but will burn precious build time if done during the hackathon.

## 1. Get a Wallet + Private Key
- Create a new throwaway wallet (MetaMask or any EVM wallet)
- Export the private key — you'll need it for 0G Storage uploads
- **Never use a wallet with real funds for hackathon testing**

## 2. Get 0G Testnet Tokens
- Go to https://faucet.0g.ai
- Connect your X account, enter wallet address, complete captcha
- You'll receive 0.1 OG — sufficient for uploading 3 small JSON files
- Daily limit is 0.1 OG per wallet, so do this the day before if possible

## 3. Configure Wallet for Galileo Testnet (Optional)
If you want to verify transactions in a block explorer:
- Network: 0G Galileo Testnet
- Chain ID: 16601
- RPC: https://evmrpc-testnet.0g.ai
- Explorer: https://chainscan-galileo.0g.ai
- Storage Explorer: https://storagescan-galileo.0g.ai

## 4. Install Global Tools
```bash
npm install -g tsx typescript
```

## 5. Verify Node.js Version
Need Node.js 18+ for the 0G SDK:
```bash
node --version  # Should be v18 or higher
```

## 6. Create .env Template
Have this ready to paste into the project:
```
PRIVATE_KEY=0x_your_private_key_here
```

## 7. Test 0G Connection (Optional but Recommended)
Quick test to verify SDK works and tokens are available:
```bash
mkdir 0g-test && cd 0g-test && npm init -y
npm install @0glabs/0g-ts-sdk ethers
```

Create test.ts:
```typescript
import { ethers } from 'ethers';
const provider = new ethers.JsonRpcProvider('https://evmrpc-testnet.0g.ai');
const wallet = new ethers.Wallet('YOUR_PRIVATE_KEY', provider);
const balance = await provider.getBalance(wallet.address);
console.log(`Wallet: ${wallet.address}`);
console.log(`Balance: ${ethers.formatEther(balance)} OG`);
```

Run: `npx tsx test.ts` — should show your wallet address and balance.

## During the Hackathon
When the timer starts:
1. Create tessera project directory
2. Copy .env with your private key
3. Follow BUILD_PLAN Phase 1 immediately
4. Upload feeds to 0G FIRST, then build MCP server
