/**
 * Requirement Analyzer Sub-Agent
 * Extracts structured travel parameters from natural language user input or explicit form input.
 */

export const analyzeRequirements = async (promptText, explicitForm = {}) => {
  const defaultParams = {
    origin: explicitForm.origin || "",
    destination: explicitForm.destination || "",
    departureDate: explicitForm.departureDate || "",
    returnDate: explicitForm.returnDate || "",
    travelers: Number(explicitForm.travelers) || 1,
    adults: Number(explicitForm.adults) || 1,
    children: Number(explicitForm.children) || 0,
    travelType: explicitForm.travelType || "One-way",
    budget: Number(explicitForm.budget) || 20000,
    preferredTransport: explicitForm.preferredTransport || ["Bus", "Flight", "Train", "Cab", "Car Rental"],
    preferredDepartureTime: explicitForm.preferredDepartureTime || "Anytime",
    maxDurationHours: Number(explicitForm.maxDurationHours) || 24,
    seatPreference: explicitForm.seatPreference || "Any",
    acPreference: explicitForm.acPreference || "AC",
    directOnly: explicitForm.directOnly ?? false,
    hotelPreference: explicitForm.hotelPreference || "Hotel",
    minHotelRating: Number(explicitForm.minHotelRating) || 4.0,
    roomsCount: Number(explicitForm.roomsCount) || 1,
    foodPreference: explicitForm.foodPreference || "Vegetarian / Non-Veg options",
    activities: explicitForm.activities || ["Sightseeing", "Local Food", "Culture", "Relaxation"],
    accessibility: explicitForm.accessibility || "None",
    otherPreferences: explicitForm.otherPreferences || "",
    naturalLanguageSummary: promptText || "Custom search query",
    confidenceScore: 0.95,
  };

  if (!promptText || typeof promptText !== "string" || promptText.trim().length === 0) {
    return normalizeDates(defaultParams);
  }

  const text = promptText.trim();
  const textLower = text.toLowerCase();

  // Helper to sanitize & title-case location names
  const cleanLocation = (locStr) => {
    if (!locStr) return "";
    let clean = locStr
      .replace(/^(?:i\s+want\s+to\s+go|i\s+want\s+to\s+travel|i\s+need\s+to\s+go|go\s+to|go|travel\s+to|travel|from|trip\s+to|planning\s+to\s+go|visit)\s+/i, "")
      .replace(/\s+(?:by|on|for|with|my|budget|only|at|in|seat|seats|bus|flight|train|cab|car|\.|,|$).*/i, "")
      .trim();

    if (!clean) return "";
    return clean
      .split(/\s+/)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(" ");
  };

  // Extract Origin & Destination using multi-pattern matching
  let extractedOrigin = defaultParams.origin;
  let extractedDestination = defaultParams.destination;

  // Pattern 1: "from X to Y" or "X to Y" (e.g., "pari chowk to kanpur", "from delhi to jaipur")
  const fromToMatch = text.match(/(?:from\s+)?([A-Za-z0-9\s]+?)\s+to\s+([A-Za-z0-9\s]+?)(?=\s+(?:by|on|for|with|my|budget|only|at|in|seat|seats|bus|flight|train|cab|car|\.|,|$))/i);
  
  // Pattern 2: "to Y from X"
  const toFromMatch = text.match(/to\s+([A-Za-z0-9\s]+?)\s+from\s+([A-Za-z0-9\s]+?)(?=\s+(?:by|on|for|with|my|budget|only|at|in|seat|seats|bus|flight|train|cab|car|\.|,|$))/i);

  if (toFromMatch) {
    extractedDestination = cleanLocation(toFromMatch[1]);
    extractedOrigin = cleanLocation(toFromMatch[2]);
  } else if (fromToMatch) {
    extractedOrigin = cleanLocation(fromToMatch[1]);
    extractedDestination = cleanLocation(fromToMatch[2]);
  }

  // Pattern 3: Fallback "go to Y" or "visit Y" if destination still empty
  if (!extractedDestination) {
    const goMatch = text.match(/(?:go to|visit|trip to|heading to|travel to)\s+([A-Za-z0-9\s]+?)(?=\s+(?:by|on|for|with|my|budget|only|at|in|\.|,|$))/i);
    if (goMatch) {
      extractedDestination = cleanLocation(goMatch[1]);
    }
  }

  // Assign fallback defaults only if still completely empty
  const origin = extractedOrigin || "Delhi NCR";
  const destination = extractedDestination || "Kanpur";

  // Extract Budget (e.g. "budget 500", "my budget 500", "500 rs", "₹500", "under 500", "500 inr")
  let budget = defaultParams.budget;
  const budgetMatch = 
    text.match(/(?:my\s+)?budget\s*(?:is|of|becomes|=|:)?\s*(?:₹|rs\.?|inr)?\s*(\d[\d,]*)(?:k)?/i) ||
    text.match(/(?:under|below|within|max|approx|around)?\s*(?:₹|rs\.?|inr)\s*(\d[\d,]*)(?:k)?/i) ||
    text.match(/(\d[\d,]*)\s*(?:rs|rupees|inr|k|budget)/i);

  if (budgetMatch) {
    let rawVal = budgetMatch[1].replace(/,/g, "");
    let parsed = parseFloat(rawVal);
    if (budgetMatch[0].toLowerCase().endsWith("k")) {
      parsed *= 1000;
    }
    if (!isNaN(parsed) && parsed > 0) {
      budget = parsed;
    }
  }

  // Extract Travelers & Seats
  let travelers = defaultParams.travelers;
  const travelersMatch = text.match(/(\d+)\s*(?:people|travelers|passengers|persons|members|seats?|adults?|tickets?)/i);
  if (travelersMatch) {
    const count = parseInt(travelersMatch[1], 10);
    if (count > 0) travelers = count;
  } else if (/only\s+one\s+seat|single\s+seat|one\s+seat|1\s+seat|one\s+person|1\s+traveler/i.test(text)) {
    travelers = 1;
  } else if (/two\s+seats|2\s+seats|two\s+people|2\s+people/i.test(text)) {
    travelers = 2;
  }

  // Extract Departure Date
  let departureDate = defaultParams.departureDate;
  const dateMatch =
    text.match(/(?:at|on|for)?\s*(\d{1,2})\s*(?:st|nd|rd|th)?\s*(september|sept|october|oct|november|nov|december|dec|january|jan|february|feb|march|mar|april|apr|may|june|jun|july|jul|august|aug)/i) ||
    text.match(/(?:september|sept|october|oct|november|nov|december|dec|january|jan|february|feb|march|mar|april|apr|may|june|jun|july|jul|august|aug)\s*(\d{1,2})/i) ||
    text.match(/\d{4}-\d{2}-\d{2}/);

  if (dateMatch) {
    let day, monthStr;
    if (dateMatch[1] && isNaN(dateMatch[1])) {
      monthStr = dateMatch[1];
      day = dateMatch[2];
    } else if (dateMatch[1] && !isNaN(dateMatch[1])) {
      day = dateMatch[1];
      monthStr = dateMatch[2];
    }

    if (day && monthStr) {
      const year = new Date().getFullYear();
      const parsedDate = new Date(`${day} ${monthStr} ${year}`);
      if (!isNaN(parsedDate.getTime())) {
        departureDate = parsedDate.toISOString().split("T")[0];
      }
    }
  }

  // Extract Preferred Departure Time
  let preferredDepartureTime = defaultParams.preferredDepartureTime;
  if (/night|overnight|late\s+night|pm/i.test(text)) {
    preferredDepartureTime = "Night (9 PM - 6 AM)";
  } else if (/morning|early\s+morning|am/i.test(text)) {
    preferredDepartureTime = "Morning (6 AM - 12 PM)";
  } else if (/afternoon/i.test(text)) {
    preferredDepartureTime = "Afternoon (12 PM - 5 PM)";
  } else if (/evening/i.test(text)) {
    preferredDepartureTime = "Evening (5 PM - 9 PM)";
  }

  // Preferred Transport Mode
  let preferredTransport = [];
  if (textLower.includes("bus")) preferredTransport.push("Bus");
  if (textLower.includes("flight") || textLower.includes("plane") || textLower.includes("air")) preferredTransport.push("Flight");
  if (textLower.includes("train") || textLower.includes("rail")) preferredTransport.push("Train");
  if (textLower.includes("cab") || textLower.includes("taxi")) preferredTransport.push("Cab");
  if (textLower.includes("rental") || textLower.includes("self drive") || textLower.includes("car")) preferredTransport.push("Car Rental");

  if (preferredTransport.length === 0) {
    preferredTransport = ["Bus", "Flight", "Train", "Cab", "Car Rental"];
  }

  // AC vs Non-AC
  let acPreference = defaultParams.acPreference;
  if (/non-ac|non\s+ac|nonac/i.test(text)) {
    acPreference = "Non-AC";
  } else if (/ac|a\/c|air\s+conditioned/i.test(text)) {
    acPreference = "AC";
  }

  // Seat Type
  let seatPreference = defaultParams.seatPreference;
  if (/sleeper|berth/i.test(text)) {
    seatPreference = "Sleeper";
  } else if (/seater|sitting/i.test(text)) {
    seatPreference = "Seater";
  }

  // Direct trip
  let directOnly = defaultParams.directOnly;
  if (/direct|no\s+transfers|non-stop/i.test(text)) {
    directOnly = true;
  }

  const result = {
    origin,
    destination,
    departureDate: departureDate || "",
    returnDate: defaultParams.returnDate || "",
    travelers,
    adults: travelers,
    children: 0,
    travelType: defaultParams.travelType,
    budget,
    preferredTransport,
    preferredDepartureTime,
    maxDurationHours: defaultParams.maxDurationHours,
    seatPreference,
    acPreference,
    directOnly,
    hotelPreference: defaultParams.hotelPreference,
    minHotelRating: defaultParams.minHotelRating,
    roomsCount: Math.ceil(travelers / 2),
    foodPreference: defaultParams.foodPreference,
    activities: defaultParams.activities,
    accessibility: defaultParams.accessibility,
    otherPreferences: explicitForm.otherPreferences || "",
    naturalLanguageSummary: text,
    priority: budget <= 1000 ? "cheapest" : "balanced",
    confidenceScore: 0.98,
  };

  return normalizeDates(result);
};

function normalizeDates(params) {
  let dep = params.departureDate ? new Date(params.departureDate) : new Date();
  if (isNaN(dep.getTime())) dep = new Date(Date.now() + 86400000 * 5);

  let ret = params.returnDate ? new Date(params.returnDate) : new Date(dep.getTime() + 86400000 * 3);
  if (isNaN(ret.getTime()) || ret <= dep) {
    ret = new Date(dep.getTime() + 86400000 * 3);
  }

  return {
    ...params,
    departureDate: dep.toISOString().split("T")[0],
    returnDate: ret.toISOString().split("T")[0],
  };
}
