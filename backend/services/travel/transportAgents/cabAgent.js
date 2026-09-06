/**
 * Cab Search Sub-Agent
 * Searches intercity cab and taxi options.
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
      metadata: {
        source: "Gozo Cabs API Adapter",
        timestamp,
        status: "demo-data",
      },
    },
  ];

  return mockCabs;
};
