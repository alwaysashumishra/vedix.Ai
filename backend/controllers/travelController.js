/**
 * Travel Controller
 * Handles backend HTTP endpoints for the AI Travel Agent feature.
 */

import { planTrip } from "../services/travel/travelManager.js";
import { analyzeRequirements } from "../services/travel/requirementAnalyzer.js";

// POST /api/travel/plan
export const generateTravelPlan = async (req, res) => {
  try {
    const { promptText, explicitForm, activeFilters, selectedTransportId, selectedStayId } = req.body;
    const plan = await planTrip({
      promptText,
      explicitForm,
      activeFilters,
      selectedTransportId,
      selectedStayId,
    });
    return res.status(200).json(plan);
  } catch (error) {
    console.error("Error generating travel plan:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to generate travel plan",
      error: error.message,
    });
  }
};

// POST /api/travel/analyze-requirements
export const parseRequirementsOnly = async (req, res) => {
  try {
    const { promptText, explicitForm } = req.body;
    const parsed = await analyzeRequirements(promptText, explicitForm);
    return res.status(200).json({
      success: true,
      parameters: parsed,
    });
  } catch (error) {
    console.error("Error parsing requirements:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to parse requirements",
      error: error.message,
    });
  }
};

// POST /api/travel/what-if
export const handleWhatIfScenario = async (req, res) => {
  try {
    const { scenarioType, scenarioValue, currentParams, promptText } = req.body;

    const modifiedParams = { ...currentParams };

    let explanation = "";

    if (scenarioType === "budget" || (promptText && promptText.toLowerCase().includes("budget"))) {
      const budgetMatch = (promptText || "").match(/(?:₹|rs\.?|budget\s*becomes|budget\s*of)?\s*(\d[\d,]*)(?:k)?/i);
      let newBudget = Number(scenarioValue);
      if (budgetMatch && budgetMatch[1]) {
        let val = parseFloat(budgetMatch[1].replace(/,/g, ""));
        if ((promptText || "").toLowerCase().includes(budgetMatch[0].toLowerCase() + "k")) val *= 1000;
        if (val > 0) newBudget = val;
      }
      if (!newBudget || newBudget <= 0) newBudget = 25000;

      modifiedParams.budget = newBudget;
      explanation = `Recalculated travel plan with updated budget of ₹${newBudget.toLocaleString()}. Transport and stay options re-optimized.`;
    } else if (scenarioType === "travelers" || (promptText && promptText.toLowerCase().includes("people"))) {
      const countMatch = (promptText || "").match(/(\d+)\s*(?:people|travelers)/i);
      const count = countMatch ? parseInt(countMatch[1], 10) : Number(scenarioValue) || 5;
      modifiedParams.travelers = count;
      modifiedParams.adults = count;
      modifiedParams.roomsCount = Math.ceil(count / 2);
      explanation = `Recalculated transportation seats, ${modifiedParams.roomsCount} hotel room(s), dining budget, and activity costs for ${count} travelers.`;
    } else if (scenarioType === "arrivalTime" || (promptText && promptText.toLowerCase().includes("reach before"))) {
      modifiedParams.preferredDepartureTime = "Morning / Reach before 10 AM";
      explanation = "Filtered early morning flights, express trains, and overnight sleeper buses arriving before 10 AM.";
    } else if (scenarioType === "comfort" || (promptText && promptText.toLowerCase().includes("comfort"))) {
      modifiedParams.priority = "comfort";
      explanation = "Adjusted scoring weights to prioritize 4.5+ star luxury stays, Vande Bharat trains, and premium flights over lowest price.";
    } else {
      explanation = `Processed scenario: "${promptText || scenarioType}". Re-evaluating travel plan...`;
    }

    const updatedPlan = await planTrip({
      promptText: promptText || `Scenario update: ${scenarioType}`,
      explicitForm: modifiedParams,
    });

    return res.status(200).json({
      ...updatedPlan,
      scenarioExplanation: explanation,
    });
  } catch (error) {
    console.error("Error processing what-if scenario:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to process scenario",
      error: error.message,
    });
  }
};
