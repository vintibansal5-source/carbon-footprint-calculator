import { describe, it, expect } from 'vitest';
import { validateInputs } from './validateInputs';
import type { UserInputs } from '../types';

const validInputs: UserInputs = {
  transport: {
    weeklyCarKm: 100,
    fuelType: 'petrol',
    weeklyPublicTransportKm: 50,
    flightsPerYear: 2,
  },
  electricity: {
    monthlyKwh: 300,
    energySource: 'grid',
  },
  food: {
    dietType: 'omnivore',
    weeklyFoodWasteKg: 1,
  },
  selectedRegion: 'global',
};

describe('validateInputs', () => {
  it('returns valid for complete, correct inputs', () => {
    const result = validateInputs(validInputs);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('returns errors for missing transport section', () => {
    const result = validateInputs({ ...validInputs, transport: undefined as any });
    expect(result.valid).toBe(false);
    const fields = result.errors.map(e => e.field);
    expect(fields).toContain('transport.weeklyCarKm');
    expect(fields).toContain('transport.fuelType');
    expect(fields).toContain('transport.weeklyPublicTransportKm');
    expect(fields).toContain('transport.flightsPerYear');
  });

  it('returns error for negative weeklyCarKm', () => {
    const result = validateInputs({ ...validInputs, transport: { ...validInputs.transport, weeklyCarKm: -1 } });
    expect(result.valid).toBe(false);
    expect(result.errors[0].field).toBe('transport.weeklyCarKm');
  });

  it('returns error for invalid fuelType', () => {
    const result = validateInputs({ ...validInputs, transport: { ...validInputs.transport, fuelType: 'gas' as any } });
    expect(result.valid).toBe(false);
    expect(result.errors[0].field).toBe('transport.fuelType');
  });

  it('returns error for negative flightsPerYear', () => {
    const result = validateInputs({ ...validInputs, transport: { ...validInputs.transport, flightsPerYear: -5 } });
    expect(result.valid).toBe(false);
    expect(result.errors[0].field).toBe('transport.flightsPerYear');
  });

  it('returns error for negative monthlyKwh', () => {
    const result = validateInputs({ ...validInputs, electricity: { ...validInputs.electricity, monthlyKwh: -10 } });
    expect(result.valid).toBe(false);
    expect(result.errors[0].field).toBe('electricity.monthlyKwh');
  });

  it('returns error for invalid energySource', () => {
    const result = validateInputs({ ...validInputs, electricity: { ...validInputs.electricity, energySource: 'solar' as any } });
    expect(result.valid).toBe(false);
    expect(result.errors[0].field).toBe('electricity.energySource');
  });

  it('returns error for invalid dietType', () => {
    const result = validateInputs({ ...validInputs, food: { ...validInputs.food, dietType: 'keto' as any } });
    expect(result.valid).toBe(false);
    expect(result.errors[0].field).toBe('food.dietType');
  });

  it('returns error for negative weeklyFoodWasteKg', () => {
    const result = validateInputs({ ...validInputs, food: { ...validInputs.food, weeklyFoodWasteKg: -2 } });
    expect(result.valid).toBe(false);
    expect(result.errors[0].field).toBe('food.weeklyFoodWasteKg');
  });

  it('returns error for missing selectedRegion', () => {
    const result = validateInputs({ ...validInputs, selectedRegion: '' });
    expect(result.valid).toBe(false);
    expect(result.errors[0].field).toBe('selectedRegion');
  });

  it('returns error for NaN numeric field', () => {
    const result = validateInputs({ ...validInputs, transport: { ...validInputs.transport, weeklyCarKm: NaN } });
    expect(result.valid).toBe(false);
    expect(result.errors[0].field).toBe('transport.weeklyCarKm');
  });

  it('accepts zero values for all numeric fields', () => {
    const zeroInputs: UserInputs = {
      transport: { weeklyCarKm: 0, fuelType: 'electric', weeklyPublicTransportKm: 0, flightsPerYear: 0 },
      electricity: { monthlyKwh: 0, energySource: 'renewable' },
      food: { dietType: 'vegan', weeklyFoodWasteKg: 0 },
      selectedRegion: 'global',
    };
    const result = validateInputs(zeroInputs);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });
});
