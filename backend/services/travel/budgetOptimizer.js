/**
 * Budget Optimization Sub-Agent
 * Breaks down total budget, detects over-budget conditions, and generates 1-click savings alternatives.
 */

export const optimizeBudget = (totalBudget, selectedTransport, selectedStay, travelers = 1, nights = 2) => {
  const safeBudget = Number(totalBudget) > 0 ? Number(totalBudget) : 20000;

  // Standard recommended breakdown ratios
  const transportAlloc = Math.round(safeBudget * 0.28);
  const stayAlloc = Math.round(safeBudget * 0.32);
  const foodAlloc = Math.round(safeBudget * 0.18);
  const localTransportAlloc = Math.round(safeBudget * 0.08);
  const activitiesAlloc = Math.round(safeBudget * 0.08);
  const bufferAlloc = Math.round(safeBudget * 0.06);

  // Actual selected costs
  const actualTransportCost = selectedTransport ? selectedTransport.totalPrice : transportAlloc;
  const actualStayCost = selectedStay ? selectedStay.totalPrice : stayAlloc;
  const estimatedFoodCost = Math.round(1200 * travelers * nights);
  const estimatedLocalTransportCost = Math.round(500 * travelers * nights);
  const estimatedActivitiesCost = Math.round(800 * travelers);
  const estimatedBufferCost = Math.round(safeBudget * 0.05);

  const currentTotalCost = actualTransportCost + actualStayCost + estimatedFoodCost + estimatedLocalTransportCost + estimatedActivitiesCost + estimatedBufferCost;

  const isOverBudget = currentTotalCost > safeBudget;
  const overAmount = isOverBudget ? currentTotalCost - safeBudget : 0;
  const remainingBudget = isOverBudget ? 0 : safeBudget - currentTotalCost;

  // Generate 1-click cost-saving alternatives if over budget or near budget cap
  const alternatives = [];

  if (selectedTransport && selectedTransport.mode === "Flight") {
    alternatives.push({
      id: "alt-bus",
      type: "transport",
      title: "Switch from Flight to Premium AC Sleeper Bus",
      description: "Take an overnight Zingbus or IntrCity AC Sleeper",
      savingsAmount: Math.max(0, actualTransportCost - (1250 * travelers)),
      actionLabel: "Apply Bus Alternative",
      replacementMode: "Bus",
    });
  } else if (selectedTransport && selectedTransport.mode === "Cab") {
    alternatives.push({
      id: "alt-train",
      type: "transport",
      title: "Switch from Private Cab to Vande Bharat Express",
      description: "Fast 4.5h train journey with meals included",
      savingsAmount: Math.max(0, actualTransportCost - (1395 * travelers)),
      actionLabel: "Apply Train Alternative",
      replacementMode: "Train",
    });
  }

  if (selectedStay && selectedStay.pricePerNight > 2500) {
    alternatives.push({
      id: "alt-homestay",
      type: "stay",
      title: "Choose Heritage Homestay instead of Premium Hotel",
      description: "Authentic local stays with home-cooked meals",
      savingsAmount: Math.max(0, (selectedStay.pricePerNight - 1800) * nights),
      actionLabel: "Apply Homestay Alternative",
      targetCategory: "Homestays",
    });
  }

  alternatives.push({
    id: "alt-food-local",
    type: "activities",
    title: "Opt for Local Food Tour & Combo Pass",
    description: "Save on individual ticket entry fees and fine dining",
    savingsAmount: Math.round(500 * travelers),
    actionLabel: "Apply Local Pass Savings",
  });

  return {
    totalBudget: safeBudget,
    currentTotalCost,
    isOverBudget,
    overAmount,
    remainingBudget,
    allocatedBreakdown: [
      { category: "Transportation", allocated: transportAlloc, actual: actualTransportCost, icon: "🚌" },
      { category: "Stay & Accommodation", allocated: stayAlloc, actual: actualStayCost, icon: "🏨" },
      { category: "Food & Dining", allocated: foodAlloc, actual: estimatedFoodCost, icon: "🍽️" },
      { category: "Local Transport", allocated: localTransportAlloc, actual: estimatedLocalTransportCost, icon: "🛺" },
      { category: "Sightseeing & Activities", allocated: activitiesAlloc, actual: estimatedActivitiesCost, icon: "🎟️" },
      { category: "Emergency Buffer", allocated: bufferAlloc, actual: estimatedBufferCost, icon: "🛡️" },
    ],
    savingsAlternatives: alternatives,
  };
};
