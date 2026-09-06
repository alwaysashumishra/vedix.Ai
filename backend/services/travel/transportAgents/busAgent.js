/**
 * Bus Search Sub-Agent
 * Searches for bus transportation options between origin and destination.
 */

export const searchBuses = async (params) => {
  const { origin, destination, departureDate, travelers = 1, acPreference = "AC", seatPreference = "Any", budget = 20000 } = params;
  const timestamp = new Date().toISOString();

  // Realistic mock data generated based on origin and destination
  const mockBuses = [
    {
      id: "bus-1",
      mode: "Bus",
      operator: "Zingbus Premium",
      busType: "Volvo Multi-Axle A/C Sleeper (2+1)",
      departureTime: "21:30",
      arrivalTime: "03:45 (+1 day)",
      departureDate,
      duration: "6h 15m",
      durationMinutes: 375,
      pricePerPerson: 1250,
      totalPrice: 1250 * travelers,
      rating: 4.7,
      reviewsCount: 1420,
      seatsAvailable: 14,
      isAC: true,
      seatType: "Sleeper",
      isDirect: true,
      transfers: 0,
      cancellationPolicy: "Free cancellation up to 6 hours before departure",
      pickupPoint: `${origin} ISBT / Major Hub`,
      dropPoint: `${destination} Bus Stand / Main Plaza`,
      amenities: ["WiFi", "Charging Port", "Water Bottle", "Blanket", "Live Tracking"],
      metadata: {
        source: "RedBus Partner API Adapter",
        timestamp,
        status: "demo-data",
      },
    },
    {
      id: "bus-2",
      mode: "Bus",
      operator: "VRL Travels Express",
      busType: "Scania A/C Seater (2+2)",
      departureTime: "22:00",
      arrivalTime: "04:30 (+1 day)",
      departureDate,
      duration: "6h 30m",
      durationMinutes: 390,
      pricePerPerson: 980,
      totalPrice: 980 * travelers,
      rating: 4.4,
      reviewsCount: 890,
      seatsAvailable: 22,
      isAC: true,
      seatType: "Seater",
      isDirect: true,
      transfers: 0,
      cancellationPolicy: "50% refund up to 12 hours before departure",
      pickupPoint: `${origin} Main Expressway Junction`,
      dropPoint: `${destination} City Center Bypass`,
      amenities: ["Charging Port", "Water Bottle", "Reclining Seats"],
      metadata: {
        source: "Zingbus Partner API Adapter",
        timestamp,
        status: "demo-data",
      },
    },
    {
      id: "bus-3",
      mode: "Bus",
      operator: "IntrCity SmartBus",
      busType: "AC Sleeper Comfort Box",
      departureTime: "20:45",
      arrivalTime: "03:15 (+1 day)",
      departureDate,
      duration: "6h 30m",
      durationMinutes: 390,
      pricePerPerson: 1450,
      totalPrice: 1450 * travelers,
      rating: 4.8,
      reviewsCount: 2310,
      seatsAvailable: 8,
      isAC: true,
      seatType: "Sleeper",
      isDirect: true,
      transfers: 0,
      cancellationPolicy: "Free cancellation up to 12 hours before departure",
      pickupPoint: `${origin} Metro Station Gate 2`,
      dropPoint: `${destination} Railway Station Circle`,
      amenities: ["Smart Washroom", "WiFi", "SOS Button", "Blanket"],
      metadata: {
        source: "IntrCity API Adapter",
        timestamp,
        status: "demo-data",
      },
    },
    {
      id: "bus-4",
      mode: "Bus",
      operator: "State Transport Express",
      busType: "Non-AC Express Seater",
      departureTime: "18:00",
      arrivalTime: "01:00 (+1 day)",
      departureDate,
      duration: "7h 00m",
      durationMinutes: 420,
      pricePerPerson: 650,
      totalPrice: 650 * travelers,
      rating: 3.9,
      reviewsCount: 450,
      seatsAvailable: 30,
      isAC: false,
      seatType: "Seater",
      isDirect: true,
      transfers: 0,
      cancellationPolicy: "Non-refundable",
      pickupPoint: `${origin} Government Bus Depot`,
      dropPoint: `${destination} Central Bus Stand`,
      amenities: ["Luggage Space"],
      metadata: {
        source: "State RTC Adapter",
        timestamp,
        status: "demo-data",
      },
    },
  ];

  // Filter based on user AC preference if explicit
  let filtered = mockBuses;
  if (acPreference === "AC") {
    filtered = filtered.filter((b) => b.isAC);
  } else if (acPreference === "Non-AC") {
    filtered = filtered.filter((b) => !b.isAC);
  }

  if (seatPreference === "Sleeper") {
    filtered = filtered.filter((b) => b.seatType === "Sleeper");
  } else if (seatPreference === "Seater") {
    filtered = filtered.filter((b) => b.seatType === "Seater");
  }

  return filtered.length > 0 ? filtered : mockBuses;
};
