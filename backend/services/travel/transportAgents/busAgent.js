/**
 * Bus Search Sub-Agent
 * Searches for bus transportation options between origin and destination.
 * Compares prices across RedBus, AbhiBus, MakeMyTrip, and Yatra platforms.
 */

export const searchBuses = async (params) => {
  const { origin, destination, departureDate, travelers = 1, acPreference = "AC", seatPreference = "Any", budget = 20000 } = params;
  const timestamp = new Date().toISOString();

  const isLowBudget = budget <= 1000;

  // Realistic bus options dynamically scaled to origin, destination, and budget
  const mockBuses = [
    {
      id: "bus-1",
      mode: "Bus",
      operator: "UPSRTC Janrath AC Express",
      busType: "AC Seater (2+2)",
      departureTime: "22:15",
      arrivalTime: "04:15 (+1 day)",
      departureDate,
      duration: "6h 00m",
      durationMinutes: 360,
      pricePerPerson: isLowBudget ? Math.min(budget, 480) : 850,
      totalPrice: (isLowBudget ? Math.min(budget, 480) : 850) * travelers,
      rating: 4.6,
      reviewsCount: 1840,
      seatsAvailable: 24,
      isAC: true,
      seatType: "Seater",
      isDirect: true,
      transfers: 0,
      cancellationPolicy: "Free cancellation up to 6 hours before departure",
      pickupPoint: `${origin} (Main Bus Stand / Express Stop)`,
      dropPoint: `${destination} (Central Bus Terminal)`,
      amenities: ["AC", "Charging Port", "Water Bottle", "Live Tracking"],
      platformComparisons: [
        { platform: "AbhiBus", price: (isLowBudget ? 450 : 820) * travelers, pricePerPerson: isLowBudget ? 450 : 820, badge: "Cheapest Deal", isCheapest: true, url: "https://www.abhibus.com", icon: "🅰️" },
        { platform: "RedBus", price: (isLowBudget ? 480 : 850) * travelers, pricePerPerson: isLowBudget ? 480 : 850, badge: "Most Popular", url: "https://www.redbus.in", icon: "🔴" },
        { platform: "MakeMyTrip", price: (isLowBudget ? 495 : 880) * travelers, pricePerPerson: isLowBudget ? 495 : 880, badge: "₹50 Cashback", url: "https://www.makemytrip.com/bus-tickets", icon: "🟡" },
        { platform: "State RTC Portal", price: (isLowBudget ? 480 : 850) * travelers, pricePerPerson: isLowBudget ? 480 : 850, badge: "Official Govt Fare", url: "https://www.redbus.in", icon: "🏛️" },
      ],
      metadata: {
        source: "RedBus & AbhiBus Multi-OTA Sync Adapter",
        timestamp,
        status: "demo-data",
      },
    },
    {
      id: "bus-2",
      mode: "Bus",
      operator: "Zingbus Premium AC",
      busType: "Volvo A/C Seater (2+2)",
      departureTime: "21:30",
      arrivalTime: "03:45 (+1 day)",
      departureDate,
      duration: "6h 15m",
      durationMinutes: 375,
      pricePerPerson: isLowBudget ? 495 : 980,
      totalPrice: (isLowBudget ? 495 : 980) * travelers,
      rating: 4.7,
      reviewsCount: 1420,
      seatsAvailable: 14,
      isAC: true,
      seatType: "Seater",
      isDirect: true,
      transfers: 0,
      cancellationPolicy: "Free cancellation up to 6 hours before departure",
      pickupPoint: `${origin} (Expressway Gate)`,
      dropPoint: `${destination} (Bypass Circle)`,
      amenities: ["WiFi", "Charging Port", "Water Bottle", "Reclining Seats"],
      platformComparisons: [
        { platform: "RedBus", price: (isLowBudget ? 490 : 950) * travelers, pricePerPerson: isLowBudget ? 490 : 950, badge: "Cheapest Deal", isCheapest: true, url: "https://www.redbus.in", icon: "🔴" },
        { platform: "AbhiBus", price: (isLowBudget ? 495 : 980) * travelers, pricePerPerson: isLowBudget ? 495 : 980, badge: "Snacks Voucher", url: "https://www.abhibus.com", icon: "🅰️" },
        { platform: "MakeMyTrip", price: (isLowBudget ? 520 : 1010) * travelers, pricePerPerson: isLowBudget ? 520 : 1010, badge: "Trip Guarantee", url: "https://www.makemytrip.com/bus-tickets", icon: "🟡" },
      ],
      metadata: {
        source: "RedBus Partner API Adapter",
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
      pricePerPerson: isLowBudget ? 750 : 1450,
      totalPrice: (isLowBudget ? 750 : 1450) * travelers,
      rating: 4.8,
      reviewsCount: 2310,
      seatsAvailable: 8,
      isAC: true,
      seatType: "Sleeper",
      isDirect: true,
      transfers: 0,
      cancellationPolicy: "Free cancellation up to 12 hours before departure",
      pickupPoint: `${origin} (Metro Junction)`,
      dropPoint: `${destination} (Railway Station Plaza)`,
      amenities: ["Smart Washroom", "WiFi", "SOS Button", "Blanket"],
      platformComparisons: [
        { platform: "AbhiBus", price: (isLowBudget ? 720 : 1399) * travelers, pricePerPerson: isLowBudget ? 720 : 1399, badge: "Cheapest Deal", isCheapest: true, url: "https://www.abhibus.com", icon: "🅰️" },
        { platform: "IntrCity Direct", price: (isLowBudget ? 750 : 1450) * travelers, pricePerPerson: isLowBudget ? 750 : 1450, badge: "Official Lounge Access", url: "https://www.intrcity.com", icon: "🚌" },
        { platform: "RedBus", price: (isLowBudget ? 770 : 1480) * travelers, pricePerPerson: isLowBudget ? 770 : 1480, badge: "Top Rated", url: "https://www.redbus.in", icon: "🔴" },
      ],
      metadata: {
        source: "IntrCity Direct Sync",
        timestamp,
        status: "demo-data",
      },
    },
    {
      id: "bus-4",
      mode: "Bus",
      operator: "State Express Non-AC",
      busType: "Ordinary Seater (3+2)",
      departureTime: "18:00",
      arrivalTime: "01:00 (+1 day)",
      departureDate,
      duration: "7h 00m",
      durationMinutes: 420,
      pricePerPerson: isLowBudget ? 320 : 450,
      totalPrice: (isLowBudget ? 320 : 450) * travelers,
      rating: 4.0,
      reviewsCount: 450,
      seatsAvailable: 30,
      isAC: false,
      seatType: "Seater",
      isDirect: true,
      transfers: 0,
      cancellationPolicy: "Non-refundable",
      pickupPoint: `${origin} (Government Bus Stand)`,
      dropPoint: `${destination} (Central Stand)`,
      amenities: ["Luggage Rack"],
      platformComparisons: [
        { platform: "State RTC Portal", price: (isLowBudget ? 320 : 450) * travelers, pricePerPerson: isLowBudget ? 320 : 450, badge: "Official Govt Fare", isCheapest: true, url: "https://www.redbus.in", icon: "🏛️" },
        { platform: "AbhiBus", price: (isLowBudget ? 335 : 465) * travelers, pricePerPerson: isLowBudget ? 335 : 465, badge: "Easy e-Ticket", url: "https://www.abhibus.com", icon: "🅰️" },
      ],
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
