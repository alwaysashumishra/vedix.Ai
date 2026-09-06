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
    travelType: explicitForm.travelType || "Round trip", // "One-way" or "Round trip"
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

  // Basic NLP Regex / Rule-Based Extractor
  let origin = defaultParams.origin;
  let destination = defaultParams.destination;

  // "from X to Y" pattern
  const fromToMatch = text.match(/from\s+([A-Za-z\s]+?)\s+to\s+([A-Za-z\s]+?)(?=\s+on|\s+for|\s+with|\s+my|\s+budget|\s+by|\s*\.|\s*\,|$)/i);
  if (fromToMatch) {
    origin = fromToMatch[1].trim();
    destination = fromToMatch[2].trim();
  }

  // "to Y from X" pattern
  if (!origin || !destination) {
    const toFromMatch = text.match(/to\s+([A-Za-z\s]+?)\s+from\s+([A-Za-z\s]+?)(?=\s+on|\s+for|\s+with|\s+my|\s+budget|\s+by|\s*\.|\s*\,|$)/i);
    if (toFromMatch) {
      destination = toFromMatch[1].trim();
      origin = toFromMatch[2].trim();
    }
  }

  // Fallback destination extraction if prompt mentions "go to X"
  if (!destination) {
    const goMatch = text.match(/(?:go to|visit|trip to)\s+([A-Za-z\s]+?)(?=\s+on|\s+for|\s+with|\s+my|\s+budget|\s*\.|\s*\,|$)/i);
    if (goMatch) {
      destination = goMatch[1].trim();
    }
  }

  // Budget extraction (e.g. ₹20,000, Rs 20000, 20k, budget is 20000)
  let budget = defaultParams.budget;
  const budgetMatch = text.match(/(?:₹|rs\.?|inr|budget\s*of|budget\s*is|total\s*budget\s*of)\s*(\d[\d,]*)(?:k)?/i) || text.match(/(\d+)\s*k/i);
  if (budgetMatch) {
    let rawVal = budgetMatch[1].replace(/,/g, "");
    let parsed = parseFloat(rawVal);
    if (text.toLowerCase().includes(budgetMatch[0].toLowerCase() + "k") || budgetMatch[0].toLowerCase().endsWith("k")) {
      parsed *= 1000;
    }
    if (!isNaN(parsed) && parsed > 0) {
      budget = parsed;
    }
  }

  // Travelers extraction (e.g. 3 people, 2 adults, 4 travelers)
  let travelers = defaultParams.travelers;
  const travelersMatch = text.match(/(\d+)\s*(?:people|travelers|passengers|persons|members)/i);
  if (travelersMatch) {
    const count = parseInt(travelersMatch[1], 10);
    if (count > 0) travelers = count;
  }

  // Date extraction
  let departureDate = defaultParams.departureDate;
  const dateMatch = text.match(/(?:september|sept|october|oct|november|nov|december|dec|january|jan|february|feb|march|mar|april|apr|may|june|jun|july|jul|august|aug)\s*\d{1,2}/i) ||
                    text.match(/\d{1,2}\s*(?:september|sept|october|oct|november|nov|december|dec|january|jan|february|feb|march|mar|april|apr|may|june|jun|july|jul|august|aug)/i) ||
                    text.match(/\d{4}-\d{2}-\d{2}/);
  if (dateMatch) {
    const parsedDate = new Date(dateMatch[0] + " 2026");
    if (!isNaN(parsedDate.getTime())) {
      departureDate = parsedDate.toISOString().split("T")[0];
    }
  }

  // Preferred transport detection
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
  if (textLower.includes("non-ac") || textLower.includes("non ac")) {
    acPreference = "Non-AC";
  } else if (textLower.includes("ac")) {
    acPreference = "AC";
  }

  // Direct trip
  let directOnly = defaultParams.directOnly;
  if (textLower.includes("direct") || textLower.includes("no transfers") || textLower.includes("non-stop")) {
    directOnly = true;
  }

  // Comfort vs Cheap preference weighting
  let priority = "balanced";
  if (textLower.includes("cheap") || textLower.includes("budget friendly") || textLower.includes("lowest price")) {
    priority = "cheapest";
  } else if (textLower.includes("comfort") || textLower.includes("luxury") || textLower.includes("premium")) {
    priority = "comfort";
  } else if (textLower.includes("fast") || textLower.includes("quickest")) {
    priority = "fastest";
  }

  const result = {
    origin: origin || "Ghaziabad",
    destination: destination || "Jaipur",
    departureDate: departureDate || "",
    returnDate: defaultParams.returnDate || "",
    travelers,
    adults: travelers,
    children: 0,
    travelType: defaultParams.travelType,
    budget,
    preferredTransport,
    preferredDepartureTime: defaultParams.preferredDepartureTime,
    maxDurationHours: defaultParams.maxDurationHours,
    seatPreference: textLower.includes("sleeper") ? "Sleeper" : textLower.includes("seater") ? "Seater" : defaultParams.seatPreference,
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
    priority,
    confidenceScore: 0.96,
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
