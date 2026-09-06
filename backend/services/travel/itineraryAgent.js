/**
 * Itinerary Sub-Agent
 * Constructs realistic, timestamped day-by-day itineraries with travel times between spots.
 */

export const generateItinerary = async (origin, destination, departureDate, returnDate, selectedTransport, selectedStay, activities = []) => {
  let startDate = departureDate ? new Date(departureDate) : new Date();
  let endDate = returnDate ? new Date(returnDate) : new Date(startDate.getTime() + 86400000 * 2);

  const totalDays = Math.max(2, Math.min(7, Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1));

  const arrDepTime = selectedTransport?.arrivalTime || "10:30 AM";
  const hotelName = selectedStay?.name || "Selected Boutique Hotel";

  const itineraryDays = [];

  // DAY 1: Arrival & Historic Center
  itineraryDays.push({
    dayNumber: 1,
    dateTitle: `Day 1 — ${startDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })}: Arrival & Cultural Heritage`,
    schedule: [
      {
        time: arrDepTime.includes("03:") || arrDepTime.includes("04:") ? "09:00 AM" : "10:30 AM",
        activityTitle: `Arrival in ${destination}`,
        category: "Travel",
        estimatedDuration: "45 mins",
        distance: "12 km from station/terminal",
        suggestedTransport: "Pre-paid Auto Rickshaw / Cab",
        estimatedCost: 250,
        description: `Arrive safely in ${destination} via ${selectedTransport?.operator || selectedTransport?.trainName || selectedTransport?.airline || "transport"}. Transfer to your stay.`,
      },
      {
        time: "11:30 AM",
        activityTitle: `Check-in & Refresh at ${hotelName}`,
        category: "Stay",
        estimatedDuration: "1 hour",
        distance: "0 km",
        suggestedTransport: "Walking",
        estimatedCost: 0,
        description: `Smooth check-in, deposit luggage, and relax after the morning journey.`,
      },
      {
        time: "01:00 PM",
        activityTitle: "Traditional Authentic Rajasthani Thali Lunch",
        category: "Food",
        estimatedDuration: "1.5 hours",
        distance: "0.8 km",
        suggestedTransport: "Walking / Short Auto Ride",
        estimatedCost: 450,
        description: "Savor local specialties like Dal Baati Churma and Gatte Ki Sabzi at Laxmi Mishthan Bhandar.",
      },
      {
        time: "03:00 PM",
        activityTitle: activities[1]?.title || "City Palace & Jantar Mantar Observatory",
        category: "Sightseeing",
        estimatedDuration: "2.5 hours",
        distance: "1.2 km from hotel",
        suggestedTransport: "E-Rickshaw",
        openingHours: "09:00 AM - 05:00 PM",
        estimatedCost: activities[1]?.estimatedCost || 400,
        description: activities[1]?.description || "Explore majestic royal courtyards and ancient astronomical marvels.",
      },
      {
        time: "06:00 PM",
        activityTitle: activities[2]?.title || "Hawa Mahal & Rooftop Sunset Tea",
        category: "Sightseeing & Food",
        estimatedDuration: "1.5 hours",
        distance: "0.5 km",
        suggestedTransport: "Walking",
        openingHours: "09:00 AM - 04:30 PM facade view",
        estimatedCost: activities[2]?.estimatedCost || 350,
        description: activities[2]?.description || "Admire the iconic facade illuminated at twilight while sipping traditional chai.",
      },
      {
        time: "08:00 PM",
        activityTitle: "Heritage Courtyard Dinner",
        category: "Food",
        estimatedDuration: "1.5 hours",
        distance: "1.0 km",
        suggestedTransport: "Auto Rickshaw",
        estimatedCost: 650,
        description: "Enjoy a memorable dinner accompanied by live folk sitar performance.",
      },
    ],
  });

  // DAY 2: Forts, Palaces & Panoramic Views
  if (totalDays >= 2) {
    const day2Date = new Date(startDate.getTime() + 86400000);
    itineraryDays.push({
      dayNumber: 2,
      dateTitle: `Day 2 — ${day2Date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}: Forts, Scenic Hills & Shopping`,
      schedule: [
        {
          time: "08:30 AM",
          activityTitle: "Breakfast & Morning Coffee",
          category: "Food",
          estimatedDuration: "1 hour",
          distance: "0 km",
          suggestedTransport: "Hotel Dining",
          estimatedCost: 0,
          description: `Complimentary breakfast at ${hotelName}.`,
        },
        {
          time: "09:45 AM",
          activityTitle: activities[0]?.title || "Amber Fort & Palace Tour",
          category: "Sightseeing",
          estimatedDuration: "3 hours",
          distance: "11 km from city center",
          suggestedTransport: "Local Cab / Hired Auto (25 mins)",
          openingHours: "08:00 AM - 05:30 PM",
          estimatedCost: activities[0]?.estimatedCost || 500,
          description: activities[0]?.description || "Walk through grand archways, Sheesh Mahal mirror walls, and royal gardens.",
        },
        {
          time: "01:15 PM",
          activityTitle: "Hilltop Heritage Restaurant Lunch",
          category: "Food",
          estimatedDuration: "1 hour",
          distance: "2 km from fort",
          suggestedTransport: "Short Cab ride",
          estimatedCost: 550,
          description: "Relish a refreshing meal with views of Maota Lake.",
        },
        {
          time: "03:00 PM",
          activityTitle: activities[3]?.title || "Johari Bazaar Traditional Shopping Tour",
          category: "Shopping",
          estimatedDuration: "2.5 hours",
          distance: "9 km back to town",
          suggestedTransport: "Cab / Auto",
          openingHours: "11:00 AM - 09:00 PM",
          estimatedCost: activities[3]?.estimatedCost || 600,
          description: activities[3]?.description || "Shop for handicraft souvenirs, block print textiles, and artisanal jewelry.",
        },
        {
          time: "06:00 PM",
          activityTitle: activities[4]?.title || "Sunset at Nahargarh Fort Overlooking the City",
          category: "Attraction",
          estimatedDuration: "2 hours",
          distance: "14 km",
          suggestedTransport: "Hired Taxi",
          openingHours: "10:00 AM - 10:00 PM",
          estimatedCost: activities[4]?.estimatedCost || 200,
          description: activities[4]?.description || "Panoramic sunset view over the golden pink horizon.",
        },
        {
          time: "08:30 PM",
          activityTitle: "Celebration Dinner at Rooftop Bar & Grill",
          category: "Food",
          estimatedDuration: "2 hours",
          distance: "5 km",
          suggestedTransport: "Cab",
          estimatedCost: 800,
          description: "Delicious multi-cuisine dinner under the night sky.",
        },
      ],
    });
  }

  // DAY 3: Checkout, Markets & Return Journey
  if (totalDays >= 3) {
    const day3Date = new Date(startDate.getTime() + 86400000 * 2);
    itineraryDays.push({
      dayNumber: 3,
      dateTitle: `Day 3 — ${day3Date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}: Local Artisan Hubs & Return`,
      schedule: [
        {
          time: "09:00 AM",
          activityTitle: "Hotel Checkout & Luggage Drop",
          category: "Stay",
          estimatedDuration: "45 mins",
          distance: "0 km",
          suggestedTransport: "Walking",
          estimatedCost: 0,
          description: "Complete checkout procedures and leave bags securely at the front desk.",
        },
        {
          time: "10:00 AM",
          activityTitle: "Albert Hall Museum & Central Park Walk",
          category: "Culture",
          estimatedDuration: "2 hours",
          distance: "3.5 km",
          suggestedTransport: "Auto Rickshaw",
          openingHours: "09:00 AM - 05:00 PM",
          estimatedCost: 300,
          description: "Admire Indo-Saracenic architecture, Egyptian mummies, and fine art galleries.",
        },
        {
          time: "12:30 PM",
          activityTitle: "Farewell Lunch & Sweets Takeaway",
          category: "Food",
          estimatedDuration: "1.5 hours",
          distance: "1.5 km",
          suggestedTransport: "E-Rickshaw",
          estimatedCost: 450,
          description: "Pick up famous Ghewar and Petha sweets for family and friends back home.",
        },
        {
          time: "02:30 PM",
          activityTitle: `Return Journey to ${origin}`,
          category: "Travel",
          estimatedDuration: "4.5 - 6 hours",
          distance: "Main Terminal",
          suggestedTransport: `${selectedTransport?.mode || "Transport"} (${selectedTransport?.departureTime || "03:30 PM"})`,
          estimatedCost: selectedTransport?.pricePerPerson || 1200,
          description: `Board your return ${selectedTransport?.mode || "transport"} back to ${origin} with memorable trip experiences.`,
        },
      ],
    });
  }

  return {
    destination,
    totalDays,
    itineraryDays,
  };
};
