import type { UserInputs, ValidationResult, ValidationError } from '../types';

const FUEL_TYPES = ['petrol', 'diesel', 'electric', 'hybrid'] as const;
const ENERGY_SOURCES = ['grid', 'renewable', 'mixed'] as const;
const DIET_TYPES = ['meat-heavy', 'omnivore', 'vegetarian', 'vegan'] as const;

function isMissing(value: unknown): boolean {
  return value === undefined || value === null || (typeof value === 'number' && isNaN(value));
}

export function validateInputs(inputs: Partial<UserInputs>): ValidationResult {
  const errors: ValidationError[] = [];

  // Transport validation
  const transport = inputs.transport;

  if (!transport || isMissing(transport.weeklyCarKm)) {
    errors.push({ field: 'transport.weeklyCarKm', message: 'Weekly car distance (km) is required.' });
  } else if (transport.weeklyCarKm < 0) {
    errors.push({ field: 'transport.weeklyCarKm', message: 'Weekly car distance must be zero or greater.' });
  }

  if (!transport || isMissing(transport.fuelType)) {
    errors.push({ field: 'transport.fuelType', message: 'Fuel type is required.' });
  } else if (!FUEL_TYPES.includes(transport.fuelType as typeof FUEL_TYPES[number])) {
    errors.push({ field: 'transport.fuelType', message: `Fuel type must be one of: ${FUEL_TYPES.join(', ')}.` });
  }

  if (!transport || isMissing(transport.weeklyPublicTransportKm)) {
    errors.push({ field: 'transport.weeklyPublicTransportKm', message: 'Weekly public transport distance (km) is required.' });
  } else if (transport.weeklyPublicTransportKm < 0) {
    errors.push({ field: 'transport.weeklyPublicTransportKm', message: 'Weekly public transport distance must be zero or greater.' });
  }

  if (!transport || isMissing(transport.flightsPerYear)) {
    errors.push({ field: 'transport.flightsPerYear', message: 'Flights per year is required.' });
  } else if (transport.flightsPerYear < 0) {
    errors.push({ field: 'transport.flightsPerYear', message: 'Flights per year must be zero or greater.' });
  }

  // Electricity validation
  const electricity = inputs.electricity;

  if (!electricity || isMissing(electricity.monthlyKwh)) {
    errors.push({ field: 'electricity.monthlyKwh', message: 'Monthly electricity consumption (kWh) is required.' });
  } else if (electricity.monthlyKwh < 0) {
    errors.push({ field: 'electricity.monthlyKwh', message: 'Monthly electricity consumption must be zero or greater.' });
  }

  if (!electricity || isMissing(electricity.energySource)) {
    errors.push({ field: 'electricity.energySource', message: 'Energy source is required.' });
  } else if (!ENERGY_SOURCES.includes(electricity.energySource as typeof ENERGY_SOURCES[number])) {
    errors.push({ field: 'electricity.energySource', message: `Energy source must be one of: ${ENERGY_SOURCES.join(', ')}.` });
  }

  // Food validation
  const food = inputs.food;

  if (!food || isMissing(food.dietType)) {
    errors.push({ field: 'food.dietType', message: 'Diet type is required.' });
  } else if (!DIET_TYPES.includes(food.dietType as typeof DIET_TYPES[number])) {
    errors.push({ field: 'food.dietType', message: `Diet type must be one of: ${DIET_TYPES.join(', ')}.` });
  }

  if (!food || isMissing(food.weeklyFoodWasteKg)) {
    errors.push({ field: 'food.weeklyFoodWasteKg', message: 'Weekly food waste (kg) is required.' });
  } else if (food.weeklyFoodWasteKg < 0) {
    errors.push({ field: 'food.weeklyFoodWasteKg', message: 'Weekly food waste must be zero or greater.' });
  }

  // Region validation
  if (isMissing(inputs.selectedRegion) || inputs.selectedRegion === '') {
    errors.push({ field: 'selectedRegion', message: 'Selected region is required.' });
  }

  return { valid: errors.length === 0, errors };
}
