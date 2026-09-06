/**
 * Travel Media & Image Assets Database
 * High-quality curated Unsplash imagery for destinations, transport modes, and attractions.
 */

export const DESTINATION_MEDIA = {
  jaipur: {
    name: "Jaipur, Rajasthan",
    tagline: "The Royal Pink City — Palaces, Forts & Heritage",
    heroImage: "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=1200&auto=format&fit=crop",
    weather: "28°C Sunny",
    bestTime: "Oct – Mar",
    photos: [
      "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1603262110263-fb0112e7cc33?w=600&auto=format&fit=crop",
    ],
  },
  goa: {
    name: "Goa",
    tagline: "Sun, Sand, Beaches & Vibrant Nightlife",
    heroImage: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1200&auto=format&fit=crop",
    weather: "30°C Tropical",
    bestTime: "Nov – Feb",
    photos: [
      "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&auto=format&fit=crop",
    ],
  },
  manali: {
    name: "Manali, Himachal Pradesh",
    tagline: "Snowy Peaks, Valleys & Adventure Sports",
    heroImage: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=1200&auto=format&fit=crop",
    weather: "15°C Cool",
    bestTime: "Sep – Jun",
    photos: [
      "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=600&auto=format&fit=crop",
    ],
  },
  kerala: {
    name: "Kerala",
    tagline: "God's Own Country — Backwaters, Tea Gardens & Coastline",
    heroImage: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1200&auto=format&fit=crop",
    weather: "27°C Pleasant",
    bestTime: "Sep – Mar",
    photos: [
      "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600&auto=format&fit=crop",
    ],
  },
  default: {
    name: "Incredible Travel Destination",
    tagline: "Explore handpicked places, culture & experiences",
    heroImage: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&auto=format&fit=crop",
    weather: "26°C Clear",
    bestTime: "Year round",
    photos: [
      "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&auto=format&fit=crop",
    ],
  },
};

export const TRANSPORT_MODE_MEDIA = {
  Bus: {
    icon: "🚌",
    image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=500&auto=format&fit=crop",
    badgeColor: "#8b5cf6",
  },
  Flight: {
    icon: "✈️",
    image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=500&auto=format&fit=crop",
    badgeColor: "#0284c7",
  },
  Train: {
    icon: "🚆",
    image: "https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=500&auto=format&fit=crop",
    badgeColor: "#10b981",
  },
  Cab: {
    icon: "🚖",
    image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=500&auto=format&fit=crop",
    badgeColor: "#f59e0b",
  },
  "Car Rental": {
    icon: "🚗",
    image: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=500&auto=format&fit=crop",
    badgeColor: "#ec4899",
  },
};

export const QUICK_DESTINATIONS = [
  {
    city: "Jaipur",
    origin: "Ghaziabad",
    tagline: "Palaces & Heritage",
    image: "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=500&auto=format&fit=crop",
    budget: "₹20,000",
    days: "3 Days",
    query: "I want to go from Ghaziabad to Jaipur for 3 people, budget ₹20,000. AC Bus & heritage stay.",
  },
  {
    city: "Goa",
    origin: "Mumbai",
    tagline: "Beaches & Sunset Shacks",
    image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=500&auto=format&fit=crop",
    budget: "₹35,000",
    days: "4 Days",
    query: "Trip from Mumbai to Goa for 2 people, budget ₹35,000. Flight, beach resort and scooter rental.",
  },
  {
    city: "Manali",
    origin: "Delhi",
    tagline: "Mountains & Snow Valleys",
    image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=500&auto=format&fit=crop",
    budget: "₹25,000",
    days: "4 Days",
    query: "Road trip from Delhi to Manali for 2 travelers, budget ₹25,000. Volvo Sleeper bus and valley view hotel.",
  },
  {
    city: "Kerala",
    origin: "Bangalore",
    tagline: "Backwaters & Tea Gardens",
    image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=500&auto=format&fit=crop",
    budget: "₹40,000",
    days: "5 Days",
    query: "Travel from Bangalore to Kerala backwaters for 3 adults, budget ₹40,000. Houseboat and resort.",
  },
];
