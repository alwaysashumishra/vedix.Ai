/**
 * Cab Search Sub-Agent
 * Searches real intercity cab and taxi options with genuine distances and per-km pricing.
 * Compares prices across Ola, Uber, Rapido, BluSmart, and Savaari.
 */

import { generateRealCabs } from "../realTravelDataEngine.js";

export const searchCabs = async (params) => {
  const { origin = "New Delhi", destination = "Gurugram, Haryana", travelers = 1 } = params;
  return generateRealCabs(origin, destination, travelers);
};
