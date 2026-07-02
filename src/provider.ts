import { AgentClient, EventType, DeliverableType } from "@croo-network/sdk";
import * as dotenv from "dotenv";
import { isAddress, fetchTokenData, fetchWalletActivity, fetchTokenHolders } from "./fetcher";
import { researchSubject } from "./researcher";
import { hashResult } from "./hasher";

dotenv.config();

// ── Environment ──────────────────────────────────────────────────────────────

const CROO_API_URL = process.env.CROO_API_URL || "https://api.croo.network";
const CROO_WS_URL = process.env.CROO_WS_URL || "wss://api.croo.network/ws";
const CROO_SDK_KEY = process.env.CROO_SDK_KEY || "";

if (!CROO_SDK_KEY) {
  throw new Error("CROO_SDK_KEY is required — set it in .env");
}

// ── Provider ─────────────────────────────────────────────────────────────────

export async function startProvider(): Promise<void> {
  const client = new AgentClient(
    { baseURL: CROO_API_URL, wsURL: CROO_WS_URL },
    CROO_SDK_KEY,
  );

  const stream = await client.connectWebSocket();

  console.log("🔭 AlphaProbe provider is live — listening for research orders…");

  // ── Step 1: Auto-accept incoming negotiations ──────────────────────────

  stream.on(EventType.NegotiationCreated, async (event) => {
    const negotiationId = event.negotiation_id!;
    console.log(`📩 Negotiation received: ${negotiationId}`);

    try {
      const result = await client.acceptNegotiation(negotiationId);
      console.log(`✅ Accepted → Order created: ${result.order.orderId}`);
    } catch (err) {
      console.error(`❌ Failed to accept negotiation ${negotiationId}:`, err);
    }
  });

  // ── Step 2: Process & deliver after payment ────────────────────────────

  stream.on(EventType.OrderPaid, async (event) => {
    const orderId = event.order_id!;
    console.log(`💰 Payment confirmed for order: ${orderId}`);

    try {
      // Retrieve the negotiation to read the requester's input
      const order = await client.getOrder(orderId);
      const negotiation = await client.getNegotiation(order.negotiationId);
      const input = (negotiation.requirements || "").trim();

      if (!input) {
        throw new Error("No input provided — expected a token address, wallet address, or project name");
      }

      console.log(`🔍 Researching: ${input}`);

      // Gather on-chain data based on input type
      let onchainData: any = {};

      if (isAddress(input)) {
        console.log(`   → Fetching on-chain data for ${input}`);
        const [tokenData, walletActivity, holderCount] = await Promise.all([
          fetchTokenData(input),
          fetchWalletActivity(input),
          fetchTokenHolders(input),
        ]);

        onchainData = {
          tokenData,
          walletActivity,
          holderCount,
        };
      } else {
        console.log(`   → Project name detected — relying on web search`);
      }

      // Run the AI research
      console.log(`🤖 Running AI research with web search…`);
      const report = await researchSubject(input, onchainData);

      // Prepare the deliverable
      const reportJson = JSON.stringify(report, null, 2);
      const proofHash = hashResult(reportJson);

      console.log(`📊 Research complete — Verdict: ${report.verdict}`);
      console.log(`🔐 Delivery proof hash: ${proofHash}`);

      // Deliver result back through CAP
      await client.deliverOrder(orderId, {
        deliverableType: DeliverableType.Text,
        deliverableText: reportJson,
        deliverableSchema: proofHash,
      });

      console.log(`📦 Order ${orderId} delivered successfully\n`);
    } catch (err) {
      console.error(`❌ Error processing order ${orderId}:`, err);

      // Deliver an error report so the order doesn't hang
      try {
        const errorReport = JSON.stringify({
          subject: "unknown",
          verdict: "Unverified",
          summary: `Research failed: ${(err as Error).message}`,
          tokenMetrics: {},
          onchainActivity: { activityLevel: "Unknown" },
          recentNews: [],
          riskFactors: [{ factor: "Research could not be completed", severity: "High" }],
          sources: [],
          generatedAt: new Date().toISOString(),
          error: true,
        });

        await client.deliverOrder(orderId, {
          deliverableType: DeliverableType.Text,
          deliverableText: errorReport,
          deliverableSchema: hashResult(errorReport),
        });

        console.log(`⚠️  Error report delivered for order ${orderId}\n`);
      } catch (deliveryErr) {
        console.error(`🚨 Failed to deliver error report for ${orderId}:`, deliveryErr);
      }
    }
  });

  // ── Lifecycle logging ──────────────────────────────────────────────────

  stream.on(EventType.OrderCompleted, (event) => {
    console.log(`🎉 Order ${event.order_id} completed and verified on-chain`);
  });

  stream.on(EventType.OrderExpired, (event) => {
    console.log(`⏰ Order ${event.order_id} expired (SLA breach)`);
  });

  stream.on(EventType.NegotiationRejected, (event) => {
    console.log(`🚫 Negotiation ${event.negotiation_id} rejected: ${event.reason || "no reason"}`);
  });
}
