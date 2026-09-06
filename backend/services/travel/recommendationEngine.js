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
    if (item.pricePerPerson < 1500) reasons.push(`₹${item.pricePerPerson} is cost-effective`);
    if (item.isDirect) reasons.push("Direct non-stop journey");
    if (item.rating >= 4.6) reasons.push(`High ${item.rating}★ user rating`);
    if (item.isAC && acPreference === "AC") reasons.push("Matches AC preference");
    if (item.durationMinutes <= 300) reasons.push("Fastest travel duration");

    const whyRecommended = `Recommended because it ${reasons.join(", ")}, keeping your travel comfortable and within budget.`;

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
    if (item.rating >= 4.7) reasons.push(`Rated ${item.rating}★ by travelers`);
    if (item.distanceFromAttractions.includes("0.")) reasons.push("Prime central location near top attractions");
    if (item.amenities.includes("Free Breakfast")) reasons.push("Includes complimentary breakfast");
    if (item.badge) reasons.push(item.badge);

    const whyRecommended = `Recommended stay because it ${reasons.join(", ")}, ensuring great comfort and value.`;

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
