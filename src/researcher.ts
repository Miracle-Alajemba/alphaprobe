import Anthropic from "@anthropic-ai/sdk";
import * as dotenv from "dotenv";
dotenv.config();

// ── Types ────────────────────────────────────────────────────────────────────

export interface ResearchReport {
  subject: string;
  verdict: "Bullish" | "Bearish" | "Neutral" | "Unverified";
  summary: string;
  tokenMetrics: {
    price?: string;
    marketCap?: string;
    volume24h?: string;
    priceChange24h?: string;
  };
  onchainActivity: {
    recentTransactions?: number;
    holderCount?: string;
    activityLevel: "High" | "Medium" | "Low" | "Unknown";
  };
  recentNews: {
    title: string;
    summary: string;
    source: string;
  }[];
  riskFactors: {
    factor: string;
    severity: "High" | "Medium" | "Low";
  }[];
  sources: string[];
  generatedAt: string;
}

// ── Prompts ──────────────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `You are an expert crypto research analyst who produces objective, data-driven research reports. You combine on-chain data analysis with real-time market intelligence to deliver actionable insights.

Your job is to thoroughly research the given subject — whether it's a token, wallet, or project — using web search to gather the latest news, sentiment, price action, and fundamentals.

You MUST respond with **only** valid JSON — no markdown fences, no commentary, no extra text. The JSON schema is:

{
  "subject": "<the token/project/wallet being researched>",
  "verdict": "<Bullish | Bearish | Neutral | Unverified>",
  "summary": "<comprehensive paragraph summarising findings>",
  "tokenMetrics": {
    "price": "<current price or null>",
    "marketCap": "<market cap or null>",
    "volume24h": "<24h trading volume or null>",
    "priceChange24h": "<24h price change % or null>"
  },
  "onchainActivity": {
    "recentTransactions": <number of recent txs or null>,
    "holderCount": "<holder count or null>",
    "activityLevel": "<High | Medium | Low | Unknown>"
  },
  "recentNews": [
    {
      "title": "<headline>",
      "summary": "<brief summary>",
      "source": "<source name or URL>"
    }
  ],
  "riskFactors": [
    {
      "factor": "<risk description>",
      "severity": "<High | Medium | Low>"
    }
  ],
  "sources": ["<list of URLs or sources used>"],
  "generatedAt": "<ISO 8601 timestamp>"
}

Guidelines:
- Use web search to find the latest information about the subject
- Cross-reference multiple sources for accuracy
- Be objective — present both bullish and bearish arguments
- If data is unavailable or the subject is unverifiable, use verdict "Unverified"
- Always include at least one risk factor
- Set generatedAt to the current UTC timestamp

IMPORTANT: You MUST return ONLY a raw JSON object as your final response. Do NOT write any introduction, explanation, or commentary before or after the JSON. Do NOT use markdown code fences. Your response must start with { and end with } and nothing else.`;

function buildUserPrompt(subject: string, onchainData: any): string {
  const dataSection = onchainData && Object.keys(onchainData).length > 0
    ? `\n\nON-CHAIN DATA:\n${JSON.stringify(onchainData, null, 2)}`
    : "\n\nNo on-chain data available.";

  return `Research this crypto subject: ${subject}${dataSection}

YOU MUST RESPOND WITH ONLY A RAW JSON OBJECT.
DO NOT write anything before the opening {
DO NOT write anything after the closing }
DO NOT use markdown code fences
DO NOT say "I'll conduct" or any other introduction
START your response with { and END with }

Return the JSON matching this exact schema:
{
  "subject": "${subject}",
  "verdict": "Bullish or Bearish or Neutral or Unverified",
  "summary": "...",
  "tokenMetrics": { "price": "...", "marketCap": "...", "volume24h": "...", "priceChange24h": "..." },
  "onchainActivity": { "recentTransactions": 0, "holderCount": "...", "activityLevel": "High or Medium or Low or Unknown" },
  "recentNews": [{ "title": "...", "summary": "...", "source": "..." }],
  "riskFactors": [{ "factor": "...", "severity": "High or Medium or Low" }],
  "sources": ["..."],
  "generatedAt": "${new Date().toISOString()}"
}`;
}

// ── Researcher ───────────────────────────────────────────────────────────────

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function researchSubject(
  subject: string,
  onchainData: any
): Promise<ResearchReport> {
  try {
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 3000,
      tools: [
        {
          type: "web_search_20250305",
          name: "web_search",
        },
      ],
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: buildUserPrompt(subject, onchainData),
        },
      ],
    });

    // Extract all text blocks (web search produces multiple content blocks)
    const textBlocks = message.content
      .filter((block) => block.type === "text")
      .map((block) => (block as { type: "text"; text: string }).text);

    if (textBlocks.length === 0) {
      throw new Error("No text content in Claude response");
    }

    const raw = textBlocks.join("").trim();

    // Extract JSON substring to throw away conversational thoughts
    const startIdx = raw.indexOf("{");
    const endIdx = raw.lastIndexOf("}");
    if (startIdx === -1 || endIdx === -1 || endIdx < startIdx) {
      throw new Error(`Could not find a valid JSON block. Raw response: ${raw}`);
    }
    const cleaned = raw.substring(startIdx, endIdx + 1);

    // Parse and return the structured report
    const report: ResearchReport = JSON.parse(cleaned);
    return report;
  } catch (err) {
    throw new Error(
      `Failed to research subject "${subject}": ${(err as Error).message}`
    );
  }
}
