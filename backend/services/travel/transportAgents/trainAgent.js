/**
 * Train Search Sub-Agent
 * Searches for Indian Railways / IRCTC options between origin and destination.
 * Integrates real corridor schedules and OTA platform pricing.
 */

import { generateRealTrains } from "../realTravelDataEngine.js";

export const searchTrains = async (params) => {
  const { origin = "Delhi", destination = "Mumbai", travelers = 1 } = params;
  return generateRealTrains(origin, destination, travelers);
};
