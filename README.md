# 🔭 AlphaProbe

### **AI-Powered Crypto Research Agent on CROO CAP**

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Built on CROO CAP](https://img.shields.io/badge/Built%20on-CROO%20CAP-blue.svg)](https://croo.network)
[![Powered by Claude AI](https://img.shields.io/badge/Powered%20by-Claude-blueviolet.svg)](https://anthropic.com)
[![Network: Base](https://img.shields.io/badge/Network-Base-blue.svg)](https://base.org)

---

## 🧠 What is AlphaProbe? (Explain Like I'm 5)

Imagine you hear about a new cryptocurrency and want to know: *Is it legit? Is it going up or down? Should I be worried?*

Normally you'd spend hours digging through Twitter, Reddit, CoinGecko, Etherscan, and news sites trying to piece together the full picture.

**AlphaProbe does all of that in under 30 seconds for 0.05 USDC (five cents).**

You give it a token address, wallet address, or just a project name like "Uniswap" — and it returns a full research report with live market data, on-chain activity, recent news, risk factors, and a clear **Bullish / Bearish / Neutral** verdict backed by sources.

---

## ⚡ Quick Start: How to Get a Research Report

You don't need any technical skills. Just use the CROO Agent Store:

1. **Go to the Agent Store:** Open the **[CROO Agent Store](https://agent.croo.network)**.
2. **Find AlphaProbe:** Search for the **Crypto Research Report** service.
3. **Submit Your Query:**
   - Paste a token contract address (like `0x...`), OR
   - Paste a wallet address, OR
   - Type a project name (e.g. `"Uniswap"`, `"Ethereum"`, `"Solana"`)
4. **Pay & Run:** Approve the **0.05 USDC** payment.
5. **Get Your Report:** Within **30 seconds**, your detailed research report is delivered to your dashboard!

---

## 🚀 Key Features

* **🌐 Live Web Search:** Claude AI actively searches the web for the latest news, sentiment, and market data — not just static database lookups.
* **📊 Token Metrics:** Current price, market cap, 24h volume, and price change pulled from live sources.
* **🔗 On-Chain Intelligence:** Real transaction history, holder counts, and activity levels fetched from Etherscan.
* **📰 News Aggregation:** Surfaces the most recent headlines and developments about the subject from multiple sources.
* **⚠️ Risk Assessment:** Identifies specific risk factors with severity ratings (High / Medium / Low).
* **🎯 Clear Verdict:** Every report concludes with a definitive **Bullish / Bearish / Neutral / Unverified** verdict.
* **🔐 Cryptographic Proof:** Every report is SHA-256 hashed for verifiable, tamper-proof delivery on-chain.

---

## 📋 Example Report Output

Here is a preview of the structured report you receive:

```json
{
  "subject": "Uniswap",
  "verdict": "Bullish",
  "summary": "Uniswap continues to dominate DEX market share with strong on-chain activity and recent governance proposals driving positive sentiment. The UNI token shows healthy holder growth and increasing trading volume.",
  "tokenMetrics": {
    "price": "$7.42",
    "marketCap": "$4.5B",
    "volume24h": "$180M",
    "priceChange24h": "+3.2%"
  },
  "onchainActivity": {
    "recentTransactions": 50,
    "holderCount": "385,000+",
    "activityLevel": "High"
  },
  "recentNews": [
    {
      "title": "Uniswap v4 Hooks Launch Draws 1000+ Developer Integrations",
      "summary": "The new hooks system has attracted significant developer interest with over 1000 custom integrations in the first month.",
      "source": "The Block"
    }
  ],
  "riskFactors": [
    {
      "factor": "Regulatory uncertainty around DeFi tokens in the US",
      "severity": "Medium"
    },
    {
      "factor": "High competition from emerging DEX aggregators",
      "severity": "Low"
    }
  ],
  "sources": [
    "https://www.theblock.co/...",
    "https://www.coingecko.com/...",
    "https://etherscan.io/..."
  ],
  "generatedAt": "2026-07-02T09:00:00.000Z"
}
```

---

## ⚙️ How It Works Under the Hood

```
   [ User / Client ]
           │
           │  1. Submit query & Pay 0.05 USDC
           ▼
   [ CROO CAP Protocol ]
           │
           │  2. Routes order to AlphaProbe Agent
           ▼
    [ AlphaProbe Agent ]
           │
           ├───► 3a. If address: Fetch token data from CoinGecko
           │         Fetch tx history from Etherscan
           │         Fetch holder count from Etherscan
           │
           ├───► 3b. If project name: Skip to AI research
           │
           ├───► 4. Claude AI + Web Search analyzes all data
           │        Searches live web for news, sentiment, metrics
           │
           ├───► 5. Generates SHA-256 cryptographic proof
           ▼
   [ Delivery on Base ] ◄── 6. Delivers JSON report & proof hash
```

---

## 🛠️ Developer Guide (Self-Hosting & Running the Agent)

If you want to run your own AlphaProbe agent node on the CROO network:

### 1. Prerequisites
- **Node.js** (v18 or higher)
- **Base Network Wallet** with some gas fee funds
- **Anthropic API Key** (for Claude AI with web search)
- **Etherscan API Key** (for on-chain data fetching)
- **CROO Developer SDK Key**

### 2. Installation
Clone the repository and install dependencies:
```bash
git clone https://github.com/Miracle-Alajemba/alphaprobe.git
cd alphaprobe
npm install
```

### 3. Environment Setup
Create a `.env` file in the root directory:
```env
CROO_API_URL=https://api.croo.network
CROO_WS_URL=wss://api.croo.network/ws
CROO_SDK_KEY=your_croo_sdk_key
ANTHROPIC_API_KEY=your_anthropic_api_key
ETHERSCAN_API_KEY=your_etherscan_api_key
```

### 4. Running the Agent
Start the agent in development mode:
```bash
npm start
```
Or build and run in production mode:
```bash
npm run build
npm run start:prod
```

For detailed step-by-step instructions on deploying the wallet, setting up services, and acquiring keys, read the **[SETUP.md](SETUP.md)** guide.

---

## 📂 Project Structure

| File | Description |
|------|-------------|
| **src/index.ts** | Entry point — startup banner, graceful shutdown handling |
| **src/provider.ts** | CROO WebSocket provider — listens for orders, auto-accepts, routes to researcher |
| **src/researcher.ts** | Claude AI integration with live web search for deep crypto research |
| **src/fetcher.ts** | On-chain data fetching from CoinGecko and Etherscan |
| **src/hasher.ts** | SHA-256 cryptographic proof hash generation |

---

## 🤖 Agent-to-Agent (A2A) Composability

AlphaProbe is designed to be called programmatically by other AI agents. A portfolio manager agent, a trading bot, or a DAO governance agent can hire AlphaProbe autonomously to get research reports before making investment decisions — all without human intervention.

Use the `@croo-network/sdk` to initiate research requests programmatically.

---

## 🤝 CROO CAP Protocol Details

AlphaProbe is a **Provider Agent** operating under the Compute Agent Protocol (CAP).

| Parameter | Value |
|-----------|-------|
| **Service** | Crypto Research Report |
| **Service Price** | `0.05 USDC` |
| **SLA (Max Delivery Time)** | `15 minutes` (Actual: under 30 seconds) |
| **Payment Token** | USDC on Base (`0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`) |
| **Deliverable Type** | Text (JSON formatted) + Cryptographic Proof Hash |
| **Input Types** | Token address, wallet address, or project name |
| **AI Model** | Claude with Web Search |

---

## 🌐 Supported Input Types

| Input | Example | What Happens |
|-------|---------|-------------|
| Token address | `0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984` | Fetches on-chain data + web research |
| Wallet address | `0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045` | Fetches tx history + web research |
| Project name | `"Uniswap"` or `"Solana"` | Pure web search research |

---

## ❓ FAQ

### 1. How is this different from just Googling a token?
AlphaProbe combines **live on-chain data** (real transactions, holder counts) with **AI-powered web research** (news, sentiment) into a single structured report with a clear verdict. It cross-references multiple sources and presents risk factors you might miss manually.

### 2. Can it research any crypto project?
Yes — you can submit any token address on Ethereum, any wallet address, or any project name. If on-chain data isn't available, AlphaProbe falls back to pure web search research.

### 3. Is the data real-time?
The on-chain data and web search results are fetched live at the moment of your request. Reports reflect the latest available information.

### 4. What does "Unverified" verdict mean?
If AlphaProbe cannot find enough reliable data to form a conclusion, it returns "Unverified" instead of guessing — honesty over hype.

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
