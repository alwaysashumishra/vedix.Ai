/**
 * Flight Search Sub-Agent
 * Searches for real flight transportation options between origin and destination.
 * Compares prices across MakeMyTrip, Skyscanner, EaseMyTrip, and Cleartrip.
 */

import { generateRealFlights } from "../realTravelDataEngine.js";

export const searchFlights = async (params) => {
  const { origin = "Delhi", destination = "Bengaluru", travelers = 1 } = params;
  return generateRealFlights(origin, destination, travelers);
};
