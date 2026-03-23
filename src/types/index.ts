// ─── Input Types ─────────────────────────────────────────────────────────────

export interface TransportInput {
  weeklyCarKm: number;
  fuelType: 'petrol' | 'diesel' | 'electric' | 'hybrid';
  weeklyPublicTransportKm: number;
  flightsPerYear: number;
}

export interface ElectricityInput {
  monthlyKwh: number;
  energySource: 'grid' | 'renewable' | 'mixed';
}

export interface FoodInput {
  dietType: 'meat-heavy' | 'omnivore' | 'vegetarian' | 'vegan';
  weeklyFoodWasteKg: number;
}

export interface UserInputs {
  transport: TransportInput;
  electricity: ElectricityInput;
  food: FoodInput;
  selectedRegion: string;
}

// ─── Result Types ─────────────────────────────────────────────────────────────

export interface CategoryBreakdown {
  transportKgCo2e: number;
  electricityKgCo2e: number;
  foodKgCo2e: number;
}

export interface FootprintResult {
  totalKgCo2ePerYear: number;
  breakdown: CategoryBreakdown;
  emissionFactorVersion: string;
}

// ─── Emission Factor Types ────────────────────────────────────────────────────

export interface EmissionFactor {
  id: string;
  value: number;
  unit: string;
  source: string;
  version: string;
}

export interface EmissionFactorDataset {
  version: string;
  factors: Record<string, EmissionFactor>;
}

// ─── Dataset Average Types ────────────────────────────────────────────────────

export interface DatasetAverage {
  region: string;
  kgCo2ePerYear: number;
  source: string;
}

// ─── Suggestion Types ─────────────────────────────────────────────────────────

export interface Suggestion {
  category: 'transport' | 'electricity' | 'food';
  text: string;
  estimatedSavingKgCo2ePerYear: number;
}

// ─── Validation Types ─────────────────────────────────────────────────────────

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}
