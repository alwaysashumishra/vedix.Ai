/**
 * Bus Search Sub-Agent
 * Searches for real intercity bus routes and operators.
 * Compares prices across redBus, Abhibus, IntrCity, and MakeMyTrip.
 */

import { generateRealBuses } from "../realTravelDataEngine.js";

export const searchBuses = async (params) => {
  const { origin = "Delhi", destination = "Lucknow", travelers = 1 } = params;
  return generateRealBuses(origin, destination, travelers);
};
