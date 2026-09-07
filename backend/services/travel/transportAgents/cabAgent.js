/**
 * Cab Search Sub-Agent
 * Searches intercity cab and taxi options.
 * Compares prices across MakeMyTrip Cabs, Uber Intercity, Ola Outstation, and Gozo Cabs.
 */

export const searchCabs = async (params) => {
  const { origin, destination, departureDate, travelers = 1 } = params;
  const timestamp = new Date().toISOString();

  const mockCabs = [
    {
      id: "cab-1",
      mode: "Cab",
      provider: "MakeMyTrip Outstation Cabs",
      vehicleType: "Sedan (Dzire / Etios)",
      passengerCapacity: 4,
      departureTime: "Flexible Pick-up (On Demand)",
      arrivalTime: "Direct (approx 5h 00m)",
      departureDate,
      duration: "5h 00m",
      durationMinutes: 300,
      pricePerPerson: Math.round(3800 / Math.max(1, travelers)),
      totalPrice: 3800,
      rating: 4.8,
      reviewsCount: 1650,
      seatsAvailable: 4,
      isAC: true,
      seatType: "Private Taxi",
      isDirect: true,
      transfers: 0,
      cancellationPolicy: "Free cancellation up to 6 hours before pickup",
      pickupPoint: `Doorstep Pick-up from ${origin}`,
      dropPoint: `Doorstep Drop at ${destination} Hotel`,
      amenities: ["Doorstep Pickup & Drop", "Toll & State Taxes Included", "Experienced Driver", "Clean & Sanitized Car"],
      platformComparisons: [
        { platform: "MakeMyTrip Cabs", price: 3800, pricePerPerson: Math.round(3800 / Math.max(1, travelers)), badge: "Cheapest Rate", isCheapest: true, url: "https://www.makemytrip.com/cabs", icon: "🟡" },
        { platform: "Ola Outstation", price: 3950, pricePerPerson: Math.round(3950 / Math.max(1, travelers)), badge: "Verified Driver", url: "https://www.olacabs.com", icon: "🟢" },
        { platform: "Uber Intercity", price: 4100, pricePerPerson: Math.round(4100 / Math.max(1, travelers)), badge: "Instant Booking", url: "https://www.uber.com", icon: "⬛" },
        { platform: "Gozo Cabs", price: 3890, pricePerPerson: Math.round(3890 / Math.max(1, travelers)), badge: "Fixed Rate", url: "https://www.gozocabs.com", icon: "🚕" },
      ],
      metadata: {
        source: "MakeMyTrip Outstation Cabs API Adapter",
        timestamp,
        status: "demo-data",
      },
    },
    {
      id: "cab-2",
      mode: "Cab",
      provider: "Gozo Cabs Premium SUV",
      vehicleType: "SUV (Ertiga / Innova)",
      passengerCapacity: 6,
      departureTime: "Flexible Pick-up (On Demand)",
      arrivalTime: "Direct (approx 4h 45m)",
      departureDate,
      duration: "4h 45m",
      durationMinutes: 285,
      pricePerPerson: Math.round(5200 / Math.max(1, travelers)),
      totalPrice: 5200,
      rating: 4.7,
      reviewsCount: 920,
      seatsAvailable: 6,
      isAC: true,
      seatType: "SUV Taxi",
      isDirect: true,
      transfers: 0,
      cancellationPolicy: "Free cancellation up to 4 hours before pickup",
      pickupPoint: `Doorstep Pick-up from ${origin}`,
      dropPoint: `Doorstep Drop at ${destination} Hotel`,
      amenities: ["Carrier Luggage Space", "AC", "Tolls Included", "Music System"],
      platformComparisons: [
        { platform: "Gozo Cabs", price: 5100, pricePerPerson: Math.round(5100 / Math.max(1, travelers)), badge: "Cheapest Rate", isCheapest: true, url: "https://www.gozocabs.com", icon: "🚕" },
        { platform: "MakeMyTrip Cabs", price: 5200, pricePerPerson: Math.round(5200 / Math.max(1, travelers)), badge: "Tolls Included", url: "https://www.makemytrip.com/cabs", icon: "🟡" },
        { platform: "Ola Outstation", price: 5400, pricePerPerson: Math.round(5400 / Math.max(1, travelers)), badge: "Luxury SUV", url: "https://www.olacabs.com", icon: "🟢" },
      ],
      metadata: {
        source: "Gozo Cabs API Adapter",
        timestamp,
        status: "demo-data",
      },
    },
  ];

  return mockCabs;
};
