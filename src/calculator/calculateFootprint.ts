import type { UserInputs, EmissionFactorDataset, FootprintResult } from '../types';

export function calculateFootprint(inputs: UserInputs, factors: EmissionFactorDataset): FootprintResult {
  const { transport, electricity, food } = inputs;

  // Transport contributions
  const carKgCo2e = transport.weeklyCarKm * 52 * factors.factors[`car.${transport.fuelType}`].value;
  const publicTransportKgCo2e = transport.weeklyPublicTransportKm * 52 * factors.factors['publicTransport'].value;
  const flightsKgCo2e = transport.flightsPerYear * factors.factors['flight'].value;
  const transportKgCo2e = carKgCo2e + publicTransportKgCo2e + flightsKgCo2e;

  // Electricity contribution
  const electricityKgCo2e = electricity.monthlyKwh * 12 * factors.factors[`electricity.${electricity.energySource}`].value;

  // Food contribution
  const foodKgCo2e =
    factors.factors[`diet.${food.dietType}`].value +
    food.weeklyFoodWasteKg * 52 * factors.factors['foodWaste'].value;

  const totalKgCo2ePerYear = transportKgCo2e + electricityKgCo2e + foodKgCo2e;

  return {
    totalKgCo2ePerYear,
    breakdown: {
      transportKgCo2e,
      electricityKgCo2e,
      foodKgCo2e,
    },
    emissionFactorVersion: factors.version,
  };
}
