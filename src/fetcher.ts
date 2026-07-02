import axios from "axios";
import * as dotenv from "dotenv";
dotenv.config();

const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || "";
const COINGECKO_API_URL = process.env.COINGECKO_API_URL || "https://api.coingecko.com/api/v3";

// ── Address helpers ──────────────────────────────────────────────────────────

export function isAddress(input: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(input);
}

export function isWalletAddress(input: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(input);
}

// ── CoinGecko ────────────────────────────────────────────────────────────────

export async function fetchTokenData(address: string): Promise<any> {
  try {
    const response = await axios.get(
      `${COINGECKO_API_URL}/coins/ethereum/contract/${address}`
    );
    return response.data;
  } catch (error: any) {
    console.error(`Failed to fetch token data for ${address}:`, error.message);
    return null;
  }
}

// ── Etherscan ────────────────────────────────────────────────────────────────

export async function fetchWalletActivity(address: string): Promise<any[]> {
  try {
    const response = await axios.get(`https://api.etherscan.io/api`, {
      params: {
        module: "account",
        action: "txlist",
        address,
        startblock: 0,
        endblock: 99999999,
        page: 1,
        offset: 10,
        sort: "desc",
        apikey: ETHERSCAN_API_KEY,
      },
    });
    return response.data.result || [];
  } catch (error: any) {
    console.error(`Failed to fetch wallet activity for ${address}:`, error.message);
    return [];
  }
}

export async function fetchTokenHolders(address: string): Promise<any> {
  try {
    const response = await axios.get(`https://api.etherscan.io/api`, {
      params: {
        module: "token",
        action: "tokenholdercount",
        contractaddress: address,
        apikey: ETHERSCAN_API_KEY,
      },
    });
    return response.data.result;
  } catch (error: any) {
    console.error(`Failed to fetch token holders for ${address}:`, error.message);
    return null;
  }
}
