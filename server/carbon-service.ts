/**
 * Carbon Credit Calculation Service
 * Calculates environmental impact and carbon credits earned from by-product reuse
 */

interface CarbonFactors {
  // kg CO2 prevented per kg of by-product reused
  [key: string]: number;
}

// Carbon emission factors for different by-products
const CARBON_FACTORS: CarbonFactors = {
  soymeal: 0.0025, // 2.5g CO2 per kg
  sunflower_cake: 0.0022,
  cottonseed_cake: 0.0020,
  mustard_cake: 0.0023,
  groundnut_cake: 0.0028,
  husk: 0.0015,
};

// Conversion factor: 1 carbon credit = 1 ton CO2 equivalent
const CREDIT_PER_TON = 1;

/**
 * Calculate carbon credits earned from a transaction
 * @param quantity - Amount of by-product in kg
 * @param byproductType - Type of by-product
 * @returns Carbon credits earned (in tons CO2 equivalent)
 */
export function calculateCarbonCredits(
  quantity: number,
  byproductType: string
): number {
  const factor = CARBON_FACTORS[byproductType] || 0.002;
  
  // Calculate total CO2 prevented in kg
  const co2Prevented = quantity * factor;
  
  // Convert to tons and apply credit multiplier
  const credits = (co2Prevented / 1000) * CREDIT_PER_TON;
  
  return parseFloat(credits.toFixed(4));
}

/**
 * Calculate total waste reduction impact
 * @param transactions - Array of transaction quantities
 * @returns Total waste reduced in tons
 */
export function calculateWasteReduction(quantities: number[]): number {
  const totalKg = quantities.reduce((sum, qty) => sum + qty, 0);
  return totalKg / 1000; // Convert to tons
}

/**
 * Calculate transport emissions saved through route optimization
 * @param distanceSaved - Distance saved in km
 * @returns CO2 emissions saved in kg
 */
export function calculateTransportSavings(distanceSaved: number): number {
  // Average truck emission: 0.1 kg CO2 per km
  const TRUCK_EMISSION_FACTOR = 0.1;
  return distanceSaved * TRUCK_EMISSION_FACTOR;
}

/**
 * Get circular economy impact metrics
 * @param byproductType - Type of by-product
 * @param quantity - Amount in kg
 * @returns Impact metrics
 */
export function getCircularEconomyImpact(
  byproductType: string,
  quantity: number
) {
  const reuseRate = getReuseRate(byproductType);
  const actualReused = (quantity * reuseRate) / 100;
  
  return {
    byproductType,
    totalQuantity: quantity,
    reuseRate,
    quantityReused: actualReused,
    carbonCredits: calculateCarbonCredits(actualReused, byproductType),
    environmentalImpact: {
      wasteReduced: actualReused / 1000, // in tons
      landfillAvoided: actualReused / 1000,
      resourcesSaved: getResourcesSaved(byproductType, actualReused),
    },
  };
}

/**
 * Get typical reuse rate for a by-product type
 */
function getReuseRate(byproductType: string): number {
  const reuseRates: Record<string, number> = {
    soymeal: 85,
    sunflower_cake: 72,
    cottonseed_cake: 68,
    mustard_cake: 75,
    groundnut_cake: 80,
    husk: 60,
  };
  return reuseRates[byproductType] || 70;
}

/**
 * Calculate resources saved from by-product reuse
 */
function getResourcesSaved(byproductType: string, quantity: number) {
  // Simplified calculation - in production, this would be more sophisticated
  return {
    water: Math.round(quantity * 0.5), // liters
    energy: Math.round(quantity * 0.3), // kWh
    rawMaterials: Math.round(quantity * 0.8), // kg
  };
}

/**
 * Generate sustainability report
 */
export function generateSustainabilityReport(transactions: any[]) {
  const totalCredits = transactions.reduce(
    (sum, t) => sum + parseFloat(t.carbonCredits || "0"),
    0
  );

  const totalQuantity = transactions.reduce(
    (sum, t) => sum + (t.quantity || 0),
    0
  );

  return {
    totalCarbonCredits: totalCredits.toFixed(2),
    totalByproductsTraded: totalQuantity,
    wasteReduction: (totalQuantity / 1000).toFixed(2) + " tons",
    co2Prevented: (totalCredits * 1000).toFixed(2) + " kg",
    equivalentTrees: Math.round(totalCredits * 50), // Rough estimate
    ranking: calculateUserRanking(totalCredits),
  };
}

function calculateUserRanking(credits: number): string {
  if (credits >= 5000) return "Platinum Contributor";
  if (credits >= 1000) return "Gold Contributor";
  if (credits >= 500) return "Silver Contributor";
  if (credits >= 100) return "Bronze Contributor";
  return "Green Participant";
}
