/**
 * Bus Search Sub-Agent
 * Searches for bus transportation options between origin and destination.
 * Compares prices across RedBus, AbhiBus, MakeMyTrip, and Yatra platforms.
 */

export const searchBuses = async (params) => {
  const { origin, destination, departureDate, travelers = 1, acPreference = "AC", seatPreference = "Any", budget = 20000 } = params;
  const timestamp = new Date().toISOString();

  // Realistic bus options with multi-platform price breakdown (RedBus, AbhiBus, MMT, Yatra)
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
      platformComparisons: [
        { platform: "AbhiBus", price: 1180 * travelers, pricePerPerson: 1180, badge: "Cheapest Deal", isCheapest: true, url: "https://www.abhibus.com", icon: "🅰️" },
        { platform: "RedBus", price: 1250 * travelers, pricePerPerson: 1250, badge: "Most Popular", url: "https://www.redbus.in", icon: "🔴" },
        { platform: "MakeMyTrip", price: 1290 * travelers, pricePerPerson: 1290, badge: "₹100 Cashback", url: "https://www.makemytrip.com/bus-tickets", icon: "🟡" },
        { platform: "Yatra", price: 1270 * travelers, pricePerPerson: 1270, badge: "Instant Confirmation", url: "https://www.yatra.com/buses", icon: "🔴" },
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
      platformComparisons: [
        { platform: "RedBus", price: 950 * travelers, pricePerPerson: 950, badge: "Cheapest Deal", isCheapest: true, url: "https://www.redbus.in", icon: "🔴" },
        { platform: "AbhiBus", price: 980 * travelers, pricePerPerson: 980, badge: "Free Snacks Voucher", url: "https://www.abhibus.com", icon: "🅰️" },
        { platform: "MakeMyTrip", price: 1010 * travelers, pricePerPerson: 1010, badge: "Trip Guarantee", url: "https://www.makemytrip.com/bus-tickets", icon: "🟡" },
        { platform: "Paytm Travel", price: 970 * travelers, pricePerPerson: 970, badge: "Instant Refund", url: "https://paytm.com/bus-tickets", icon: "💙" },
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
      platformComparisons: [
        { platform: "AbhiBus", price: 1399 * travelers, pricePerPerson: 1399, badge: "Cheapest Deal", isCheapest: true, url: "https://www.abhibus.com", icon: "🅰️" },
        { platform: "IntrCity Direct", price: 1450 * travelers, pricePerPerson: 1450, badge: "Official Lounge Access", url: "https://www.intrcity.com", icon: "🚌" },
        { platform: "RedBus", price: 1480 * travelers, pricePerPerson: 1480, badge: "Top Rated", url: "https://www.redbus.in", icon: "🔴" },
        { platform: "MakeMyTrip", price: 1495 * travelers, pricePerPerson: 1495, badge: "MMT Assured", url: "https://www.makemytrip.com/bus-tickets", icon: "🟡" },
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
      platformComparisons: [
        { platform: "State RTC Portal", price: 650 * travelers, pricePerPerson: 650, badge: "Official Govt Fare", isCheapest: true, url: "https://www.redbus.in", icon: "🏛️" },
        { platform: "AbhiBus", price: 665 * travelers, pricePerPerson: 665, badge: "Easy e-Ticket", url: "https://www.abhibus.com", icon: "🅰️" },
        { platform: "RedBus", price: 670 * travelers, pricePerPerson: 670, badge: "Fast Booking", url: "https://www.redbus.in", icon: "🔴" },
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
