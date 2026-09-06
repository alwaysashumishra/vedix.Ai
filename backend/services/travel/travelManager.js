/**
 * Travel Manager Agent (Orchestrator)
 * Coordinates sub-agents (Requirement, Transport, Accommodation, Activity, Budget, Itinerary, Recommendation)
 * and generates the complete AI Travel Plan response.
 */

import { analyzeRequirements } from "./requirementAnalyzer.js";
import { searchBuses } from "./transportAgents/busAgent.js";
import { searchFlights } from "./transportAgents/flightAgent.js";
import { searchTrains } from "./transportAgents/trainAgent.js";
import { searchCabs } from "./transportAgents/cabAgent.js";
import { searchCarRentals } from "./transportAgents/carRentalAgent.js";
import { searchStays } from "./accommodationAgent.js";
import { searchActivities } from "./activityAgent.js";
import { optimizeBudget } from "./budgetOptimizer.js";
import { generateItinerary } from "./itineraryAgent.js";
import { scoreAndRankOptions } from "./recommendationEngine.js";

export const planTrip = async ({ promptText, explicitForm, activeFilters, selectedTransportId, selectedStayId }) => {
  const agentLogs = [];
  const logStep = (step, detail) => {
    agentLogs.push({ step, detail, timestamp: new Date().toISOString() });
  };

  // STEP 1: Analyze user requirements
  logStep("Understanding requirements", "Parsing origin, destination, dates, budget & travel preferences...");
  const userParams = await analyzeRequirements(promptText, explicitForm);

  // Apply dynamic active filters if provided
  if (activeFilters) {
    if (activeFilters.maxPrice) userParams.maxPrice = Number(activeFilters.maxPrice);
    if (activeFilters.departureTime) userParams.preferredDepartureTime = activeFilters.departureTime;
    if (activeFilters.acOnly) userParams.acPreference = "AC";
    if (activeFilters.directOnly) userParams.directOnly = true;
    if (activeFilters.seatPreference) userParams.seatPreference = activeFilters.seatPreference;
    if (activeFilters.minHotelRating) userParams.minHotelRating = Number(activeFilters.minHotelRating);
    if (activeFilters.budget) userParams.budget = Number(activeFilters.budget);
  }

  // STEP 2: Execute Transport Sub-Agents concurrently
  logStep("Searching transport", `Searching buses, flights, trains, cabs, and car rentals for ${userParams.origin} → ${userParams.destination}...`);
  const [buses, flights, trains, cabs, carRentals] = await Promise.all([
    searchBuses(userParams),
    searchFlights(userParams),
    searchTrains(userParams),
    searchCabs(userParams),
    searchCarRentals(userParams),
  ]);

  const allTransportOptions = [...buses, ...flights, ...trains, ...cabs, ...carRentals];

  // STEP 3: Execute Accommodation Sub-Agent
  logStep("Searching stays", `Searching hotels, hostels, homestays, apartments, resorts in ${userParams.destination}...`);
  const stayOptions = await searchStays(userParams);

  // STEP 4: Execute Activity Sub-Agent
  logStep("Finding attractions", `Fetching curated activities & spots in ${userParams.destination}...`);
  const activityOptions = await searchActivities(userParams.destination, userParams.activities);

  // STEP 5: Execute Recommendation Engine
  logStep("Comparing options", "Evaluating multi-factor scores (Price, Duration, Rating, Convenience, Preference Match)...");
  const { scoredTransport, topTransport, scoredStays, topStay } = scoreAndRankOptions(allTransportOptions, stayOptions, userParams);

  // Determine user-selected or auto-recommended transport & stay
  let activeTransport = topTransport;
  if (selectedTransportId) {
    const found = scoredTransport.find((t) => t.id === selectedTransportId);
    if (found) activeTransport = found;
  }

  let activeStay = topStay;
  if (selectedStayId) {
    const found = scoredStays.find((s) => s.id === selectedStayId);
    if (found) activeStay = found;
  }

  // STEP 6: Execute Budget Optimization Agent
  logStep("Optimizing budget", `Allocating total trip budget (₹${userParams.budget.toLocaleString()}) and checking thresholds...`);
  const budgetAnalysis = optimizeBudget(
    userParams.budget,
    activeTransport,
    activeStay,
    userParams.travelers,
    activeStay?.nights || 2
  );

  // STEP 7: Execute Itinerary Agent
  logStep("Building itinerary", "Creating day-by-day timestamped schedule with travel times between locations...");
  const itinerary = await generateItinerary(
    userParams.origin,
    userParams.destination,
    userParams.departureDate,
    userParams.returnDate,
    activeTransport,
    activeStay,
    activityOptions
  );

  logStep("Finalizing travel plan", "Package complete and ready for user review.");

  return {
    success: true,
    userParams,
    agentLogs,
    transportOptions: scoredTransport,
    selectedTransport: activeTransport,
    stayOptions: scoredStays,
    selectedStay: activeStay,
    activityOptions,
    budgetAnalysis,
    itinerary,
    tripSummary: {
      origin: userParams.origin,
      destination: userParams.destination,
      departureDate: userParams.departureDate,
      returnDate: userParams.returnDate,
      travelers: userParams.travelers,
      totalBudget: userParams.budget,
      estimatedTotalCost: budgetAnalysis.currentTotalCost,
      status: "Ready for User Review",
      dataIntegrity: {
        source: "Multi-Agent Provider Cluster",
        timestamp: new Date().toISOString(),
        status: "demo-data",
      },
    },
  };
};
