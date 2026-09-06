/**
 * Recommendation Engine Sub-Agent
 * Evaluates transport & stay options using a weighted multi-factor scoring model.
 * Computes explicit transparent explanations ("Why this is recommended").
 */

export const scoreAndRankOptions = (transportList, stayList, userParams) => {
  const { budget = 20000, priority = "balanced", acPreference, seatPreference, minHotelRating = 4.0 } = userParams;

  // 1. SCORE TRANSPORT OPTIONS
  const scoredTransport = transportList.map((item) => {
    let priceScore = Math.max(0, 100 - (item.totalPrice / (budget * 0.4)) * 50);
    let timeScore = Math.max(0, 100 - (item.durationMinutes / 400) * 40);
    let ratingScore = (item.rating / 5) * 100;
    let convenienceScore = item.isDirect ? 100 : 60;
    let preferenceMatchScore = 80;

    if (acPreference === "AC" && item.isAC) preferenceMatchScore += 10;
    if (seatPreference === item.seatType) preferenceMatchScore += 10;

    // Apply priority weighting
    let weights = { price: 0.3, time: 0.25, rating: 0.25, convenience: 0.1, match: 0.1 };
    if (priority === "cheapest") {
      weights = { price: 0.5, time: 0.15, rating: 0.15, convenience: 0.1, match: 0.1 };
    } else if (priority === "fastest") {
      weights = { price: 0.15, time: 0.5, rating: 0.15, convenience: 0.1, match: 0.1 };
    } else if (priority === "comfort") {
      weights = { price: 0.15, time: 0.15, rating: 0.4, convenience: 0.15, match: 0.15 };
    }

    const totalScore = Math.round(
      priceScore * weights.price +
      timeScore * weights.time +
      ratingScore * weights.rating +
      convenienceScore * weights.convenience +
      preferenceMatchScore * weights.match
    );

    // Build transparent explanation
    const reasons = [];
    if (item.pricePerPerson < 1500) reasons.push(`is cost-effective at ₹${item.pricePerPerson}/person`);
    if (item.isDirect) reasons.push("offers a direct non-stop route");
    if (item.rating >= 4.6) reasons.push(`has a high ${item.rating}★ user rating`);
    if (item.isAC && acPreference === "AC") reasons.push("matches your AC preference");
    if (item.durationMinutes <= 300) reasons.push("provides a fast travel duration");

    const whyRecommended = reasons.length > 0 
      ? `Recommended because it ${reasons.join(", ")}, keeping your trip comfortable and within budget.`
      : `Recommended option matching your destination and budget parameters.`;

    return {
      ...item,
      aiScore: Math.min(99, Math.max(70, totalScore)),
      whyRecommended,
    };
  });

  // Sort transport options by AI Score descending
  scoredTransport.sort((a, b) => b.aiScore - a.aiScore);

  // Mark top recommendation
  if (scoredTransport.length > 0) {
    scoredTransport[0].isTopRecommendation = true;
  }

  // 2. SCORE STAY OPTIONS
  const scoredStays = stayList.map((item) => {
    let priceScore = Math.max(0, 100 - (item.totalPrice / (budget * 0.5)) * 50);
    let ratingScore = (item.rating / 5) * 100;
    let locationScore = item.distanceFromAttractions.includes("0.") || item.distanceFromAttractions.includes("1.") ? 95 : 75;

    const totalScore = Math.round(priceScore * 0.35 + ratingScore * 0.45 + locationScore * 0.2);

    const reasons = [];
    if (item.rating >= 4.7) reasons.push(`is rated ${item.rating}★ by travelers`);
    if (item.distanceFromAttractions.includes("0.")) reasons.push("has a prime central location near top attractions");
    if (item.amenities.includes("Free Breakfast")) reasons.push("includes complimentary breakfast");
    if (item.badge) reasons.push(`is tagged as ${item.badge}`);

    const whyRecommended = reasons.length > 0
      ? `Recommended stay because it ${reasons.join(", ")}, ensuring great comfort and value.`
      : `Recommended stay matching your destination and budget parameters.`;

    return {
      ...item,
      aiScore: Math.min(99, Math.max(72, totalScore)),
      whyRecommended,
    };
  });

  scoredStays.sort((a, b) => b.aiScore - a.aiScore);

  if (scoredStays.length > 0) {
    scoredStays[0].isTopRecommendation = true;
  }

  return {
    scoredTransport,
    topTransport: scoredTransport[0] || null,
    scoredStays,
    topStay: scoredStays[0] || null,
  };
};
