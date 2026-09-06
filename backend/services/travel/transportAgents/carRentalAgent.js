/**
 * Car Rental Sub-Agent
 * Searches self-drive car rental options.
 */

export const searchCarRentals = async (params) => {
  const { origin, destination, departureDate, travelers = 1 } = params;
  const timestamp = new Date().toISOString();

  const mockRentals = [
    {
      id: "rental-1",
      mode: "Car Rental",
      provider: "Zoomcar Self-Drive",
      vehicle: "Hyundai Creta / Brezza",
      vehicleType: "Compact SUV (Self-Drive)",
      passengerCapacity: 5,
      departureTime: "Pickup anytime after 06:00 AM",
      arrivalTime: "Self-Driven Duration",
      departureDate,
      duration: "Flexible (Daily Rate)",
      durationMinutes: 300,
      pricePerPerson: Math.round(2400 / Math.max(1, travelers)),
      totalPrice: 2400,
      rating: 4.6,
      reviewsCount: 1120,
      seatsAvailable: 5,
      isAC: true,
      seatType: "Self Drive SUV",
      isDirect: true,
      transfers: 0,
      fuelPolicy: "Free 150 km fuel included per day",
      deposit: "₹2,500 refundable security deposit",
      mileage: "Unlimited km option available",
      cancellationPolicy: "Free cancellation 24h before trip start",
      pickupPoint: `Zoomcar Hub in ${origin}`,
      dropPoint: `Return at Hub or ${destination} Drop point`,
      amenities: ["Self Drive Privacy", "Fastag Enabled", "GPS Navigation", "Keyless Entry"],
      metadata: {
        source: "Zoomcar Partner API Adapter",
        timestamp,
        status: "demo-data",
      },
    },
    {
      id: "rental-2",
      mode: "Car Rental",
      provider: "Revv Self Drive",
      vehicle: "Swift Dzire Automatic",
      vehicleType: "Sedan (Self-Drive)",
      passengerCapacity: 5,
      departureTime: "Doorstep delivery available",
      arrivalTime: "Self-Driven Duration",
      departureDate,
      duration: "Flexible (Daily Rate)",
      durationMinutes: 300,
      pricePerPerson: Math.round(1800 / Math.max(1, travelers)),
      totalPrice: 1800,
      rating: 4.4,
      reviewsCount: 650,
      seatsAvailable: 5,
      isAC: true,
      seatType: "Self Drive Sedan",
      isDirect: true,
      transfers: 0,
      fuelPolicy: "Excludes fuel (Return with same fuel level)",
      deposit: "₹1,500 refundable security deposit",
      mileage: "300 km included",
      cancellationPolicy: "100% refund up to 12h before trip",
      pickupPoint: `Home Delivery in ${origin}`,
      dropPoint: `Pickup from destination or return hub`,
      amenities: ["Automatic Transmission", "AC", "Bluetooth Audio"],
      metadata: {
        source: "Revv Direct Adapter",
        timestamp,
        status: "demo-data",
      },
    },
  ];

  return mockRentals;
};
