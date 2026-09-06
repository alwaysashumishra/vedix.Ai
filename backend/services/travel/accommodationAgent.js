/**
 * Accommodation Sub-Agent
 * Searches stay options across Hotels, Hostels, Homestays, Apartments, Resorts.
 */

export const searchStays = async (params) => {
  const { destination, departureDate, returnDate, travelers = 1, roomsCount = 1, minHotelRating = 4.0, budget = 20000 } = params;
  const timestamp = new Date().toISOString();

  // Calculate number of nights
  let nights = 2;
  if (departureDate && returnDate) {
    const d1 = new Date(departureDate);
    const d2 = new Date(returnDate);
    const diff = Math.ceil((d2 - d1) / (1000 * 60 * 60 * 24));
    if (diff > 0 && diff <= 30) nights = diff;
  }

  const mockStays = [
    {
      id: "stay-1",
      name: "The Royal Heritage Boutique Hotel",
      category: "Hotels",
      rating: 4.8,
      reviewsCount: 1450,
      pricePerNight: 2800,
      totalPrice: 2800 * nights * roomsCount,
      nights,
      roomsCount,
      location: `City Center, Near Main City Palace, ${destination}`,
      distanceFromAttractions: "0.8 km from Main Palace & Bazaar",
      amenities: ["Free Breakfast", "Swimming Pool", "High-speed Wi-Fi", "Free Parking", "Airport Shuttle", "Rooftop Restaurant"],
      cancellationPolicy: "Free Cancellation up to 24 hours before check-in",
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&auto=format&fit=crop",
      badge: "🏆 Best Overall",
      metadata: {
        source: "Booking.com / Agoda Partner Adapter",
        timestamp,
        status: "demo-data",
      },
    },
    {
      id: "stay-2",
      name: "Zostel Backpacker Hub & Lounge",
      category: "Hostels",
      rating: 4.6,
      reviewsCount: 2200,
      pricePerNight: 850,
      totalPrice: 850 * nights * roomsCount,
      nights,
      roomsCount,
      location: `Old Heritage Quarter, ${destination}`,
      distanceFromAttractions: "0.3 km from Hawa Mahal & Old Bazaar",
      amenities: ["Free High-speed Wi-Fi", "Community Lounge", "Game Room", "Cafe", "Lockers"],
      cancellationPolicy: "Free Cancellation up to 48 hours before check-in",
      image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600&auto=format&fit=crop",
      badge: "💰 Cheapest",
      metadata: {
        source: "Hostelworld Partner Adapter",
        timestamp,
        status: "demo-data",
      },
    },
    {
      id: "stay-3",
      name: "Palace View Luxury Resort & Spa",
      category: "Resorts",
      rating: 4.9,
      reviewsCount: 980,
      pricePerNight: 5500,
      totalPrice: 5500 * nights * roomsCount,
      nights,
      roomsCount,
      location: `Fort Hill Road, Scenic Heights, ${destination}`,
      distanceFromAttractions: "2.5 km from Main Fort",
      amenities: ["Infinity Pool", "Spa & Wellness", "Gourmet Dining", "Buffet Breakfast", "Valet Parking", "Mountain View"],
      cancellationPolicy: "Non-refundable (Special Rate)",
      image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600&auto=format&fit=crop",
      badge: "⭐ Best Rated",
      metadata: {
        source: "MakeMyTrip Hotels Adapter",
        timestamp,
        status: "demo-data",
      },
    },
    {
      id: "stay-4",
      name: "Traditional Haveli Homestay",
      category: "Homestays",
      rating: 4.7,
      reviewsCount: 760,
      pricePerNight: 1950,
      totalPrice: 1950 * nights * roomsCount,
      nights,
      roomsCount,
      location: `Historical Lane 4, ${destination}`,
      distanceFromAttractions: "0.5 km from City Center & Markets",
      amenities: ["Home-cooked Rajasthani Meals", "Free Wi-Fi", "Courtyard Garden", "Cultural Music Evenings"],
      cancellationPolicy: "Free Cancellation up to 24 hours before check-in",
      image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600&auto=format&fit=crop",
      badge: "📍 Best Location",
      metadata: {
        source: "Airbnb Partner Adapter",
        timestamp,
        status: "demo-data",
      },
    },
    {
      id: "stay-5",
      name: "Urban Comfort Serviced Apartments",
      category: "Apartments",
      rating: 4.5,
      reviewsCount: 520,
      pricePerNight: 2400,
      totalPrice: 2400 * nights * roomsCount,
      nights,
      roomsCount,
      location: `Commercial Hub Sector 9, ${destination}`,
      distanceFromAttractions: "3.0 km from Railway Station",
      amenities: ["Private Kitchenette", "Washing Machine", "Free Wi-Fi", "Gym Access"],
      cancellationPolicy: "Free Cancellation up to 12 hours before check-in",
      image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&auto=format&fit=crop",
      badge: "💎 Best Value",
      metadata: {
        source: "MakeMyTrip Stays Adapter",
        timestamp,
        status: "demo-data",
      },
    },
  ];

  // Filter based on minimum rating
  const filtered = mockStays.filter((s) => s.rating >= minHotelRating);
  return filtered.length > 0 ? filtered : mockStays;
};
