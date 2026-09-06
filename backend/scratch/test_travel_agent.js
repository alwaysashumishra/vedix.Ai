import { planTrip } from "../services/travel/travelManager.js";
import { analyzeRequirements } from "../services/travel/requirementAnalyzer.js";

async function runTest() {
  console.log("=== Testing AI Travel Agent Multi-Agent Engine ===");

  const promptText = "I want to go from Ghaziabad to Jaipur on September 20 for 3 people. My total budget is ₹20,000. I prefer AC bus and want a good hotel near the main attractions.";

  console.log("\n--- Step 1: Testing Requirement Analyzer ---");
  const parsed = await analyzeRequirements(promptText);
  console.log("Extracted Parameters:", JSON.stringify(parsed, null, 2));

  console.log("\n--- Step 2: Testing Full Travel Plan Orchestrator ---");
  const plan = await planTrip({ promptText });

  console.log("Success:", plan.success);
  console.log("Agent Logs:", plan.agentLogs.map((l) => `${l.step} -> ${l.detail}`));
  console.log("\nTotal Transport Options Found:", plan.transportOptions.length);
  console.log("Top Transport Recommendation:", plan.selectedTransport?.operator || plan.selectedTransport?.trainName || plan.selectedTransport?.airline);
  console.log("Why Recommended:", plan.selectedTransport?.whyRecommended);

  console.log("\nTotal Stay Options Found:", plan.stayOptions.length);
  console.log("Top Stay Recommendation:", plan.selectedStay?.name);

  console.log("\nBudget Analysis:");
  console.log("Total Budget:", plan.budgetAnalysis.totalBudget);
  console.log("Current Total Cost:", plan.budgetAnalysis.currentTotalCost);
  console.log("Is Over Budget:", plan.budgetAnalysis.isOverBudget);

  console.log("\nItinerary Days Generated:", plan.itinerary.totalDays);
  console.log("Day 1 Schedule Items:", plan.itinerary.itineraryDays[0]?.schedule.length);

  console.log("\n=== Test Completed Successfully ✅ ===");
}

runTest().catch((err) => {
  console.error("Test Error:", err);
});
