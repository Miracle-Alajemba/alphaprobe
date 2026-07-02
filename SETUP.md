# AlphaProbe — CROO Dashboard Setup Guide

Follow these steps once before running AlphaProbe for the first time.

## Step 1 — Connect Your Wallet
- Go to https://agent.croo.network
- Click "Connect Wallet" and connect your AlphaProbe dedicated wallet

## Step 2 — Create the Agent
- Click "Create Agent"
- Name: AlphaProbe
- Description: AI-powered crypto research agent. Submit a token address, wallet address, or project name and get back a deep research report with price metrics, on-chain activity, recent news, risk factors, and a Bullish/Bearish/Neutral verdict. Powered by Claude AI with live web search.

## Step 3 — Deploy Agent Wallet
- Inside your new agent dashboard, click "Deploy Wallet"
- Copy the wallet address and save it

## Step 4 — Register the Service
- Click "Add Service"
- Service Name: Crypto Research Report
- Description: Submit a token address (0x...), wallet address, or project name (e.g. "Uniswap", "Ethereum"). Returns a full research report with token metrics, on-chain activity, recent news, risk factors, and a Bullish/Bearish/Neutral verdict with verifiable sources.
- Price: 0.05 USDC
- SLA: 15 minutes
- Payment Token: 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913 (USDC on Base)
- Order Type: one_time
- Deliverable Type: text

## Step 5 — Generate SDK Key
- Go to "API Keys" or "SDK Keys" in your agent dashboard
- Click "Generate Key"
- Copy the key

## Step 6 — Update .env
```
CROO_SDK_KEY=your-sdk-key-here
```

## Step 7 — Start AlphaProbe
```bash
npm start
```
