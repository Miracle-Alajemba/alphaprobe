import * as dotenv from "dotenv";
dotenv.config();

import { startProvider } from "./provider";

// ── Startup Banner ───────────────────────────────────────────────────────────

console.log(`
=======================================
  AlphaProbe — Crypto Research Agent
  Powered by CROO CAP + Claude AI
  Listening for research orders...
=======================================
`);

// ── Graceful Shutdown ────────────────────────────────────────────────────────

function shutdown(): void {
  console.log("\n🛑 AlphaProbe shutting down...");
  process.exit(0);
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

// ── Start ────────────────────────────────────────────────────────────────────

(async () => {
  try {
    await startProvider();
  } catch (err) {
    console.error("🚨 AlphaProbe crashed:", err);
    process.exit(1);
  }
})();
