/**
 * Activity & Attraction Sub-Agent
 * Provides top attractions, activities, and local experiences for destination.
 */

export const searchActivities = async (destination, userInterests = []) => {
  const timestamp = new Date().toISOString();

  const mockActivities = [
    {
      id: "act-1",
      title: "Amber Fort & Palace Light Show",
      category: "Culture & Sightseeing",
      estimatedCost: 500,
      duration: "3 hours",
      durationMinutes: 180,
      distanceFromCenter: "11 km from city center",
      suggestedTransport: "Intercity Cab / Auto Rickshaw (25 mins)",
      openingHours: "08:00 AM - 05:30 PM, Light show 07:00 PM",
      rating: 4.9,
      description: "Iconic hilltop fort featuring majestic courtyards, Sheesh Mahal (Mirror Palace), and panoramic hill views.",
      metadata: {
        source: "TripAdvisor / Viator Adapter",
        timestamp,
        status: "demo-data",
      },
    },
    {
      id: "act-2",
      title: "City Palace & Jantar Mantar Observatory",
      category: "Heritage",
      estimatedCost: 400,
      duration: "2.5 hours",
      durationMinutes: 150,
      distanceFromCenter: "1.2 km from city center",
      suggestedTransport: "Walking distance from Old Market",
      openingHours: "09:00 AM - 05:00 PM",
      rating: 4.8,
      description: "UNESCO World Heritage astronomical observatory and royal palace museum with historic artifacts.",
      metadata: {
        source: "Viator Adapter",
        timestamp,
        status: "demo-data",
      },
    },
    {
      id: "act-3",
      title: "Hawa Mahal & Rooftop Cafe Experience",
      category: "Photography & Food",
      estimatedCost: 350,
      duration: "2 hours",
      durationMinutes: 120,
      distanceFromCenter: "0.5 km from bazaar",
      suggestedTransport: "Walking / Auto Rickshaw",
      openingHours: "09:00 AM - 04:30 PM",
      rating: 4.7,
      description: "Photograph the Palace of Winds honeycomb facade and enjoy traditional lassi at a nearby rooftop café.",
      metadata: {
        source: "Local Guide Adapter",
        timestamp,
        status: "demo-data",
      },
    },
    {
      id: "act-4",
      title: "Johari Bazaar Traditional Shopping & Street Food Tour",
      category: "Shopping & Local Food",
      estimatedCost: 600,
      duration: "2.5 hours",
      durationMinutes: 150,
      distanceFromCenter: "0.2 km",
      suggestedTransport: "Walking",
      openingHours: "11:00 AM - 09:00 PM",
      rating: 4.6,
      description: "Explore vibrant lanes renowned for gemstone jewelry, block-printed textiles, and famous Pyaz Kachori.",
      metadata: {
        source: "Local Guide Adapter",
        timestamp,
        status: "demo-data",
      },
    },
    {
      id: "act-5",
      title: "Sunset at Nahargarh Fort Overlooking the City",
      category: "Relaxation & Views",
      estimatedCost: 200,
      duration: "2 hours",
      durationMinutes: 120,
      distanceFromCenter: "14 km",
      suggestedTransport: "Cab / Hired Car (30 mins)",
      openingHours: "10:00 AM - 10:00 PM",
      rating: 4.9,
      description: "Breathtaking sunset vista over the entire illuminated pink city skyline.",
      metadata: {
        source: "Viator Adapter",
        timestamp,
        status: "demo-data",
      },
    },
  ];

  return mockActivities;
};
