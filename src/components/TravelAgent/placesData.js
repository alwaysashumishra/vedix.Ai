/**
 * Comprehensive Database of Indian Cities, Railway Stations, Airports, and Bus Terminals
 * Supports intelligent multi-modal autocomplete for Flights, Trains, Buses, and Cabs.
 */

export const PLACES_DATABASE = [
  // =================== DELHI NCR ===================
  {
    id: "del-city",
    name: "Delhi",
    subText: "All Locations, Delhi NCR",
    city: "Delhi",
    state: "Delhi NCR",
    type: "city",
    code: "DEL",
    badge: "City",
    modes: ["train", "flight", "bus", "cab"],
    popular: true,
  },
  {
    id: "del-ndls",
    name: "New Delhi Railway Station",
    subText: "Ajmeri Gate / Paharganj, Delhi",
    city: "Delhi",
    state: "Delhi NCR",
    type: "station",
    code: "NDLS",
    badge: "Station",
    modes: ["train"],
    popular: true,
  },
  {
    id: "del-nzm",
    name: "Hazrat Nizamuddin",
    subText: "South Delhi, Delhi NCR",
    city: "Delhi",
    state: "Delhi NCR",
    type: "station",
    code: "NZM",
    badge: "Station",
    modes: ["train"],
  },
  {
    id: "del-anvt",
    name: "Anand Vihar Terminal",
    subText: "East Delhi, Delhi NCR",
    city: "Delhi",
    state: "Delhi NCR",
    type: "station",
    code: "ANVT",
    badge: "Station",
    modes: ["train"],
  },
  {
    id: "del-igi",
    name: "Indira Gandhi International Airport",
    subText: "Terminals T1, T2, T3 - New Delhi",
    city: "Delhi",
    state: "Delhi NCR",
    type: "airport",
    code: "DEL",
    badge: "Airport",
    modes: ["flight", "cab"],
    popular: true,
  },
  {
    id: "del-isbt-kashmere",
    name: "ISBT Kashmere Gate",
    subText: "North Delhi (Interstate Bus Terminal)",
    city: "Delhi",
    state: "Delhi NCR",
    type: "bus",
    code: "ISBT",
    badge: "Bus Stand",
    modes: ["bus"],
    popular: true,
  },
  {
    id: "del-isbt-anand",
    name: "Anand Vihar ISBT",
    subText: "East Delhi (Interstate Bus Terminal)",
    city: "Delhi",
    state: "Delhi NCR",
    type: "bus",
    code: "ISBT",
    badge: "Bus Stand",
    modes: ["bus"],
  },
  {
    id: "del-connaught",
    name: "Connaught Place",
    subText: "Central Delhi City Center",
    city: "Delhi",
    state: "Delhi NCR",
    type: "cab",
    code: "CP",
    badge: "Cab Hub",
    modes: ["cab"],
  },
  {
    id: "gurugram-cyberhub",
    name: "Gurugram, Haryana",
    subText: "Cyber Hub / DLF Phase 2 / IFFCO Chowk",
    city: "Gurugram",
    state: "Haryana",
    type: "city",
    code: "GGN",
    badge: "City",
    modes: ["cab", "bus"],
    popular: true,
  },
  {
    id: "noida-sec18",
    name: "Noida, Uttar Pradesh",
    subText: "Sector 18 / Pari Chowk / Expressway",
    city: "Noida",
    state: "Uttar Pradesh",
    type: "city",
    code: "NOIDA",
    badge: "City",
    modes: ["cab", "bus"],
  },

  // =================== MUMBAI ===================
  {
    id: "bom-city",
    name: "Mumbai",
    subText: "All Locations, Maharashtra",
    city: "Mumbai",
    state: "Maharashtra",
    type: "city",
    code: "BOM",
    badge: "City",
    modes: ["train", "flight", "bus", "cab"],
    popular: true,
  },
  {
    id: "bom-mmct",
    name: "Mumbai Central",
    subText: "South Mumbai Railway Terminus",
    city: "Mumbai",
    state: "Maharashtra",
    type: "station",
    code: "MMCT",
    badge: "Station",
    modes: ["train"],
    popular: true,
  },
  {
    id: "bom-csmt",
    name: "Chhatrapati Shivaji Maharaj Terminus",
    subText: "CSMT Mumbai (Heritage Terminus)",
    city: "Mumbai",
    state: "Maharashtra",
    type: "station",
    code: "CSMT",
    badge: "Station",
    modes: ["train"],
  },
  {
    id: "bom-bdts",
    name: "Bandra Terminus",
    subText: "Bandra West, Mumbai",
    city: "Mumbai",
    state: "Maharashtra",
    type: "station",
    code: "BDTS",
    badge: "Station",
    modes: ["train"],
  },
  {
    id: "bom-airport",
    name: "Chhatrapati Shivaji Maharaj Airport",
    subText: "Terminals T1 & T2, Mumbai",
    city: "Mumbai",
    state: "Maharashtra",
    type: "airport",
    code: "BOM",
    badge: "Airport",
    modes: ["flight", "cab"],
    popular: true,
  },
  {
    id: "bom-borivali-bus",
    name: "Borivali (East) Bus Stand",
    subText: "Western Express Highway, Mumbai",
    city: "Mumbai",
    state: "Maharashtra",
    type: "bus",
    code: "BUS",
    badge: "Bus Stand",
    modes: ["bus"],
  },
  {
    id: "bom-dadar-bus",
    name: "Dadar Asiad Bus Stand",
    subText: "Central Mumbai Intercity Point",
    city: "Mumbai",
    state: "Maharashtra",
    type: "bus",
    code: "BUS",
    badge: "Bus Stand",
    modes: ["bus"],
  },
  {
    id: "bom-bkc",
    name: "Bandra Kurla Complex (BKC)",
    subText: "Mumbai Prime Business District",
    city: "Mumbai",
    state: "Maharashtra",
    type: "cab",
    code: "BKC",
    badge: "Cab Hub",
    modes: ["cab"],
  },

  // =================== BENGALURU ===================
  {
    id: "blr-city",
    name: "Bengaluru",
    subText: "All Locations, Karnataka",
    city: "Bengaluru",
    state: "Karnataka",
    type: "city",
    code: "BLR",
    badge: "City",
    modes: ["train", "flight", "bus", "cab"],
    popular: true,
  },
  {
    id: "blr-sbc",
    name: "KSR Bengaluru Railway Station",
    subText: "Bangalore City Junction (Majestic)",
    city: "Bengaluru",
    state: "Karnataka",
    type: "station",
    code: "SBC",
    badge: "Station",
    modes: ["train"],
    popular: true,
  },
  {
    id: "blr-ypr",
    name: "Yesvantpur Junction",
    subText: "North Bengaluru",
    city: "Bengaluru",
    state: "Karnataka",
    type: "station",
    code: "YPR",
    badge: "Station",
    modes: ["train"],
  },
  {
    id: "blr-airport",
    name: "Kempegowda International Airport",
    subText: "Terminals T1 & T2, Devanahalli",
    city: "Bengaluru",
    state: "Karnataka",
    type: "airport",
    code: "BLR",
    badge: "Airport",
    modes: ["flight", "cab"],
    popular: true,
  },
  {
    id: "blr-majestic-bus",
    name: "Majestic (Kempegowda Bus Station)",
    subText: "Central Bengaluru KSRTC Hub",
    city: "Bengaluru",
    state: "Karnataka",
    type: "bus",
    code: "KBS",
    badge: "Bus Stand",
    modes: ["bus"],
    popular: true,
  },
  {
    id: "blr-electronic-city",
    name: "Electronic City Phase 1",
    subText: "South Bengaluru Tech Corridor",
    city: "Bengaluru",
    state: "Karnataka",
    type: "cab",
    code: "ECITY",
    badge: "Cab Hub",
    modes: ["cab"],
  },

  // =================== LUCKNOW ===================
  {
    id: "lko-city",
    name: "Lucknow",
    subText: "All Locations, Uttar Pradesh",
    city: "Lucknow",
    state: "Uttar Pradesh",
    type: "city",
    code: "LKO",
    badge: "City",
    modes: ["train", "flight", "bus", "cab"],
    popular: true,
  },
  {
    id: "lko-charbagh",
    name: "Lucknow Charbagh Railway Station",
    subText: "Charbagh Main Terminus",
    city: "Lucknow",
    state: "Uttar Pradesh",
    type: "station",
    code: "LKO",
    badge: "Station",
    modes: ["train"],
    popular: true,
  },
  {
    id: "lko-junction",
    name: "Lucknow Junction",
    subText: "NER Charbagh Terminal",
    city: "Lucknow",
    state: "Uttar Pradesh",
    type: "station",
    code: "LJN",
    badge: "Station",
    modes: ["train"],
  },
  {
    id: "lko-airport",
    name: "Chaudhary Charan Singh International Airport",
    subText: "Amausi Airport (T2 & T3)",
    city: "Lucknow",
    state: "Uttar Pradesh",
    type: "airport",
    code: "LKO",
    badge: "Airport",
    modes: ["flight", "cab"],
    popular: true,
  },
  {
    id: "lko-bus-charbagh",
    name: "Charbagh Bus Station",
    subText: "UPSRTC Interstate Terminal, Lucknow",
    city: "Lucknow",
    state: "Uttar Pradesh",
    type: "bus",
    code: "BUS",
    badge: "Bus Stand",
    modes: ["bus"],
    popular: true,
  },
  {
    id: "lko-bus-alambagh",
    name: "Alambagh Bus Terminal",
    subText: "Modern AC Interstate Bus Port",
    city: "Lucknow",
    state: "Uttar Pradesh",
    type: "bus",
    code: "BUS",
    badge: "Bus Stand",
    modes: ["bus"],
  },
  {
    id: "lko-hazratganj",
    name: "Hazratganj",
    subText: "Central Lucknow Heritage & Shopping",
    city: "Lucknow",
    state: "Uttar Pradesh",
    type: "cab",
    code: "HGANJ",
    badge: "Cab Hub",
    modes: ["cab"],
  },

  // =================== JAIPUR ===================
  {
    id: "jai-city",
    name: "Jaipur",
    subText: "Pink City, Rajasthan",
    city: "Jaipur",
    state: "Rajasthan",
    type: "city",
    code: "JAI",
    badge: "City",
    modes: ["train", "flight", "bus", "cab"],
    popular: true,
  },
  {
    id: "jai-jp",
    name: "Jaipur Junction",
    subText: "Railway Station Road, Jaipur",
    city: "Jaipur",
    state: "Rajasthan",
    type: "station",
    code: "JP",
    badge: "Station",
    modes: ["train"],
    popular: true,
  },
  {
    id: "jai-airport",
    name: "Jaipur International Airport",
    subText: "Sanganer, Jaipur",
    city: "Jaipur",
    state: "Rajasthan",
    type: "airport",
    code: "JAI",
    badge: "Airport",
    modes: ["flight", "cab"],
    popular: true,
  },
  {
    id: "jai-sindhicamp",
    name: "Sindhi Camp Bus Stand",
    subText: "Central Interstate Bus Terminal",
    city: "Jaipur",
    state: "Rajasthan",
    type: "bus",
    code: "BUS",
    badge: "Bus Stand",
    modes: ["bus"],
    popular: true,
  },

  // =================== HYDERABAD ===================
  {
    id: "hyd-city",
    name: "Hyderabad",
    subText: "All Locations, Telangana",
    city: "Hyderabad",
    state: "Telangana",
    type: "city",
    code: "HYD",
    badge: "City",
    modes: ["train", "flight", "bus", "cab"],
    popular: true,
  },
  {
    id: "hyd-sc",
    name: "Secunderabad Junction",
    subText: "Secunderabad Main Station",
    city: "Hyderabad",
    state: "Telangana",
    type: "station",
    code: "SC",
    badge: "Station",
    modes: ["train"],
    popular: true,
  },
  {
    id: "hyd-airport",
    name: "Rajiv Gandhi International Airport",
    subText: "Shamshabad, Hyderabad",
    city: "Hyderabad",
    state: "Telangana",
    type: "airport",
    code: "HYD",
    badge: "Airport",
    modes: ["flight", "cab"],
    popular: true,
  },
  {
    id: "hyd-mgbs",
    name: "MGBS (Imlibun Bus Station)",
    subText: "TSRTC Central Interstate Terminal",
    city: "Hyderabad",
    state: "Telangana",
    type: "bus",
    code: "MGBS",
    badge: "Bus Stand",
    modes: ["bus"],
  },

  // =================== CHENNAI ===================
  {
    id: "maa-city",
    name: "Chennai",
    subText: "All Locations, Tamil Nadu",
    city: "Chennai",
    state: "Tamil Nadu",
    type: "city",
    code: "MAA",
    badge: "City",
    modes: ["train", "flight", "bus", "cab"],
    popular: true,
  },
  {
    id: "maa-mas",
    name: "MGR Chennai Central",
    subText: "Chennai Central Railway Station",
    city: "Chennai",
    state: "Tamil Nadu",
    type: "station",
    code: "MAS",
    badge: "Station",
    modes: ["train"],
    popular: true,
  },
  {
    id: "maa-airport",
    name: "Chennai International Airport",
    subText: "Meenambakkam, Chennai",
    city: "Chennai",
    state: "Tamil Nadu",
    type: "airport",
    code: "MAA",
    badge: "Airport",
    modes: ["flight", "cab"],
    popular: true,
  },
  {
    id: "maa-cmbt",
    name: "Koyambedu (CMBT)",
    subText: "Chennai Mofussil Bus Terminus",
    city: "Chennai",
    state: "Tamil Nadu",
    type: "bus",
    code: "CMBT",
    badge: "Bus Stand",
    modes: ["bus"],
  },

  // =================== KOLKATA ===================
  {
    id: "ccu-city",
    name: "Kolkata",
    subText: "All Locations, West Bengal",
    city: "Kolkata",
    state: "West Bengal",
    type: "city",
    code: "CCU",
    badge: "City",
    modes: ["train", "flight", "bus", "cab"],
    popular: true,
  },
  {
    id: "ccu-hwh",
    name: "Howrah Junction",
    subText: "Howrah Railway Station",
    city: "Kolkata",
    state: "West Bengal",
    type: "station",
    code: "HWH",
    badge: "Station",
    modes: ["train"],
    popular: true,
  },
  {
    id: "ccu-airport",
    name: "Netaji Subhash Chandra Bose Airport",
    subText: "Dum Dum, Kolkata",
    city: "Kolkata",
    state: "West Bengal",
    type: "airport",
    code: "CCU",
    badge: "Airport",
    modes: ["flight", "cab"],
    popular: true,
  },

  // =================== PUNE ===================
  {
    id: "pnq-city",
    name: "Pune",
    subText: "All Locations, Maharashtra",
    city: "Pune",
    state: "Maharashtra",
    type: "city",
    code: "PUNE",
    badge: "City",
    modes: ["train", "flight", "bus", "cab"],
    popular: true,
  },
  {
    id: "pnq-station",
    name: "Pune Junction",
    subText: "Pune Central Railway Station",
    city: "Pune",
    state: "Maharashtra",
    type: "station",
    code: "PUNE",
    badge: "Station",
    modes: ["train"],
  },
  {
    id: "pnq-airport",
    name: "Pune International Airport",
    subText: "Lohegaon, Pune",
    city: "Pune",
    state: "Maharashtra",
    type: "airport",
    code: "PNQ",
    badge: "Airport",
    modes: ["flight", "cab"],
  },
  {
    id: "pnq-swargate",
    name: "Swargate Bus Stand",
    subText: "MSRTC Central Hub, Pune",
    city: "Pune",
    state: "Maharashtra",
    type: "bus",
    code: "BUS",
    badge: "Bus Stand",
    modes: ["bus"],
  },

  // =================== AHMEDABAD ===================
  {
    id: "amd-city",
    name: "Ahmedabad",
    subText: "All Locations, Gujarat",
    city: "Ahmedabad",
    state: "Gujarat",
    type: "city",
    code: "AMD",
    badge: "City",
    modes: ["train", "flight", "bus", "cab"],
    popular: true,
  },
  {
    id: "amd-adi",
    name: "Ahmedabad Junction (Kalupur)",
    subText: "Kalupur Station, Ahmedabad",
    city: "Ahmedabad",
    state: "Gujarat",
    type: "station",
    code: "ADI",
    badge: "Station",
    modes: ["train"],
  },
  {
    id: "amd-airport",
    name: "Sardar Vallabhbhai Patel Airport",
    subText: "Hansol, Ahmedabad",
    city: "Ahmedabad",
    state: "Gujarat",
    type: "airport",
    code: "AMD",
    badge: "Airport",
    modes: ["flight", "cab"],
  },

  // =================== GOA ===================
  {
    id: "goa-city",
    name: "Goa",
    subText: "Panaji / Madgaon / Calangute",
    city: "Goa",
    state: "Goa",
    type: "city",
    code: "GOI",
    badge: "City",
    modes: ["train", "flight", "bus", "cab"],
    popular: true,
  },
  {
    id: "goa-mao",
    name: "Madgaon Junction",
    subText: "South Goa Railway Junction",
    city: "Goa",
    state: "Goa",
    type: "station",
    code: "MAO",
    badge: "Station",
    modes: ["train"],
    popular: true,
  },
  {
    id: "goa-airport",
    name: "Dabolim / Manohar Mopa Airport",
    subText: "Goa International Airports (GOI / GOX)",
    city: "Goa",
    state: "Goa",
    type: "airport",
    code: "GOI",
    badge: "Airport",
    modes: ["flight", "cab"],
    popular: true,
  },

  // =================== CHANDIGARH ===================
  {
    id: "cdg-city",
    name: "Chandigarh",
    subText: "The City Beautiful, Punjab / HR",
    city: "Chandigarh",
    state: "Punjab / Haryana",
    type: "city",
    code: "CDG",
    badge: "City",
    modes: ["train", "flight", "bus", "cab"],
    popular: true,
  },
  {
    id: "cdg-cdg",
    name: "Chandigarh Junction",
    subText: "Daria, Chandigarh",
    city: "Chandigarh",
    state: "Punjab / Haryana",
    type: "station",
    code: "CDG",
    badge: "Station",
    modes: ["train"],
  },
  {
    id: "cdg-isbt43",
    name: "ISBT Sector 43",
    subText: "Interstate Bus Terminal, Chandigarh",
    city: "Chandigarh",
    state: "Punjab / Haryana",
    type: "bus",
    code: "ISBT",
    badge: "Bus Stand",
    modes: ["bus"],
  },

  // =================== VARANASI ===================
  {
    id: "vns-city",
    name: "Varanasi (Kashi)",
    subText: "Spiritual Capital, Uttar Pradesh",
    city: "Varanasi",
    state: "Uttar Pradesh",
    type: "city",
    code: "BSB",
    badge: "City",
    modes: ["train", "flight", "bus", "cab"],
    popular: true,
  },
  {
    id: "vns-bsb",
    name: "Varanasi Junction (Cantt)",
    subText: "Varanasi Central Station",
    city: "Varanasi",
    state: "Uttar Pradesh",
    type: "station",
    code: "BSB",
    badge: "Station",
    modes: ["train"],
  },
  {
    id: "vns-airport",
    name: "Lal Bahadur Shastri Airport",
    subText: "Babatpur, Varanasi",
    city: "Varanasi",
    state: "Uttar Pradesh",
    type: "airport",
    code: "VNS",
    badge: "Airport",
    modes: ["flight", "cab"],
  },

  // =================== AGRA ===================
  {
    id: "agr-city",
    name: "Agra",
    subText: "City of Taj Mahal, Uttar Pradesh",
    city: "Agra",
    state: "Uttar Pradesh",
    type: "city",
    code: "AGC",
    badge: "City",
    modes: ["train", "bus", "cab"],
    popular: true,
  },
  {
    id: "agr-agc",
    name: "Agra Cantt Railway Station",
    subText: "Agra Cantt, Uttar Pradesh",
    city: "Agra",
    state: "Uttar Pradesh",
    type: "station",
    code: "AGC",
    badge: "Station",
    modes: ["train"],
  },

  // =================== AMRITSAR ===================
  {
    id: "asr-city",
    name: "Amritsar",
    subText: "Golden Temple City, Punjab",
    city: "Amritsar",
    state: "Punjab",
    type: "city",
    code: "ASR",
    badge: "City",
    modes: ["train", "flight", "bus", "cab"],
  },

  // =================== DEHRADUN & RISHIKESH ===================
  {
    id: "ddn-city",
    name: "Dehradun",
    subText: "Capital of Uttarakhand",
    city: "Dehradun",
    state: "Uttarakhand",
    type: "city",
    code: "DDN",
    badge: "City",
    modes: ["train", "flight", "bus", "cab"],
  },
  {
    id: "rsh-city",
    name: "Rishikesh / Haridwar",
    subText: "Ganga Ghats, Uttarakhand",
    city: "Rishikesh",
    state: "Uttarakhand",
    type: "city",
    code: "HW",
    badge: "City",
    modes: ["train", "bus", "cab"],
  },

  // =================== SHIMLA & MANALI ===================
  {
    id: "sml-city",
    name: "Shimla",
    subText: "Mall Road / Hills, Himachal Pradesh",
    city: "Shimla",
    state: "Himachal Pradesh",
    type: "city",
    code: "SML",
    badge: "Hills",
    modes: ["bus", "cab"],
  },
  {
    id: "mnl-city",
    name: "Manali",
    subText: "Old Manali / Solang Valley, Himachal Pradesh",
    city: "Manali",
    state: "Himachal Pradesh",
    type: "city",
    code: "MNL",
    badge: "Hills",
    modes: ["bus", "cab"],
  },

  // =================== UDAIPUR ===================
  {
    id: "udr-city",
    name: "Udaipur",
    subText: "City of Lakes, Rajasthan",
    city: "Udaipur",
    state: "Rajasthan",
    type: "city",
    code: "UDZ",
    badge: "City",
    modes: ["train", "flight", "bus", "cab"],
  },

  // =================== KOCHI (COCHIN) ===================
  {
    id: "cok-city",
    name: "Kochi (Cochin)",
    subText: "Ernakulam / Fort Kochi, Kerala",
    city: "Kochi",
    state: "Kerala",
    type: "city",
    code: "COK",
    badge: "City",
    modes: ["train", "flight", "bus", "cab"],
  },
];

/**
 * Filter places intelligently based on user search query and current transport mode
 * @param {string} query Search input string
 * @param {string} mode Transport mode ("train" | "flight" | "bus" | "cab")
 * @returns {Array} List of matching place items
 */
export function searchPlaces(query = "", mode = "") {
  const cleanQ = query.toLowerCase().trim();
  const selectedMode = mode ? mode.toLowerCase() : "";

  // Filter by matching mode first if mode is active
  let pool = PLACES_DATABASE;

  if (selectedMode) {
    // Mode priority: prioritize items tagged with this mode
    pool = PLACES_DATABASE.filter((p) => {
      if (p.modes.includes(selectedMode)) return true;
      if (p.type === "city") return true; // Cities are universal
      return false;
    });
  }

  // If query is empty, return top popular recommendations
  if (!cleanQ) {
    // Filter popular places for this mode
    const popularList = pool.filter((p) => p.popular);
    return popularList.length > 0 ? popularList.slice(0, 8) : pool.slice(0, 8);
  }

  // Perform weighted matching
  const matches = [];

  for (const place of pool) {
    const nameLower = place.name.toLowerCase();
    const cityLower = place.city.toLowerCase();
    const codeLower = (place.code || "").toLowerCase();
    const stateLower = (place.state || "").toLowerCase();
    const subTextLower = (place.subText || "").toLowerCase();

    let score = 0;

    // Exact matches
    if (codeLower === cleanQ) score += 100;
    else if (nameLower === cleanQ || cityLower === cleanQ) score += 80;
    // Prefix matches
    else if (nameLower.startsWith(cleanQ)) score += 60;
    else if (cityLower.startsWith(cleanQ)) score += 50;
    else if (codeLower.startsWith(cleanQ)) score += 45;
    // Substring matches
    else if (nameLower.includes(cleanQ)) score += 30;
    else if (cityLower.includes(cleanQ)) score += 25;
    else if (subTextLower.includes(cleanQ)) score += 20;
    else if (stateLower.includes(cleanQ)) score += 15;

    // Boost items specifically matching mode
    if (selectedMode && place.modes.includes(selectedMode)) {
      score += 10;
    }

    if (score > 0) {
      matches.push({ ...place, matchScore: score });
    }
  }

  // Sort by highest match score
  matches.sort((a, b) => b.matchScore - a.matchScore);

  return matches.slice(0, 10);
}

