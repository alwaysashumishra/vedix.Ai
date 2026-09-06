/**
 * Flight Search Sub-Agent
 * Searches for flight transportation options between origin and destination.
 */

export const searchFlights = async (params) => {
  const { origin, destination, departureDate, travelers = 1, directOnly = false } = params;
  const timestamp = new Date().toISOString();

  const mockFlights = [
    {
      id: "flight-1",
      mode: "Flight",
      airline: "IndiGo 6E-2415",
      flightNumber: "6E-2415",
      departureTime: "07:15",
      arrivalTime: "08:15",
      departureDate,
      duration: "1h 00m",
      durationMinutes: 60,
      pricePerPerson: 3200,
      totalPrice: 3200 * travelers,
      rating: 4.6,
      reviewsCount: 5400,
      seatsAvailable: 9,
      isAC: true,
      seatType: "Economy",
      isDirect: true,
      transfers: 0,
      baggage: "15 kg Cabin + 7 kg Hand",
      cancellationPolicy: "Refundable with ₹1500 fee up to 2h before flight",
      departureAirport: `${origin} International Airport (DEL)`,
      arrivalAirport: `${destination} Airport (JAI)`,
      amenities: ["In-flight Snacks (Paid)", "Extra Legroom Seat Available"],
      metadata: {
        source: "Amadeus / Skyscanner API Adapter",
        timestamp,
        status: "demo-data",
      },
    },
    {
      id: "flight-2",
      mode: "Flight",
      airline: "Air India AI-472",
      flightNumber: "AI-472",
      departureTime: "14:30",
      arrivalTime: "15:35",
      departureDate,
      duration: "1h 05m",
      durationMinutes: 65,
      pricePerPerson: 3850,
      totalPrice: 3850 * travelers,
      rating: 4.5,
      reviewsCount: 3200,
      seatsAvailable: 12,
      isAC: true,
      seatType: "Economy",
      isDirect: true,
      transfers: 0,
      baggage: "20 kg Cabin + 7 kg Hand",
      cancellationPolicy: "Refundable with ₹1200 fee up to 4h before flight",
      departureAirport: `${origin} Airport Terminal 3`,
      arrivalAirport: `${destination} Airport Terminal 1`,
      amenities: ["Free Meal Included", "In-Flight Entertainment"],
      metadata: {
        source: "Skyscanner API Adapter",
        timestamp,
        status: "demo-data",
      },
    },
    {
      id: "flight-3",
      mode: "Flight",
      airline: "Akasa Air QP-1120",
      flightNumber: "QP-1120",
      departureTime: "19:40",
      arrivalTime: "20:45",
      departureDate,
      duration: "1h 05m",
      durationMinutes: 65,
      pricePerPerson: 2950,
      totalPrice: 2950 * travelers,
      rating: 4.7,
      reviewsCount: 1890,
      seatsAvailable: 6,
      isAC: true,
      seatType: "Economy",
      isDirect: true,
      transfers: 0,
      baggage: "15 kg Cabin + 7 kg Hand",
      cancellationPolicy: "Free date change up to 24h before flight",
      departureAirport: `${origin} Airport Terminal 2`,
      arrivalAirport: `${destination} Airport Terminal 1`,
      amenities: ["USB Ports", "Cafe Akasa Meal Options"],
      metadata: {
        source: "Akasa Direct Adapter",
        timestamp,
        status: "demo-data",
      },
    },
  ];

  if (directOnly) {
    return mockFlights.filter((f) => f.isDirect);
  }
  return mockFlights;
};
