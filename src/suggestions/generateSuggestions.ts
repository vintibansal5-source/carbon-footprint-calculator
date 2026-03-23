import type { FootprintResult, UserInputs, Suggestion } from '../types/index';

// Suggestion templates per category with savings as a fraction of category contribution
const transportSuggestions = (transportKg: number, inputs: UserInputs): Suggestion[] => {
  const suggestions: Suggestion[] = [];

  if (inputs.transport.fuelType === 'petrol' || inputs.transport.fuelType === 'diesel') {
    suggestions.push({
      category: 'transport',
      text: 'Switch to an electric or hybrid vehicle to significantly cut your driving emissions.',
      estimatedSavingKgCo2ePerYear: Math.round(transportKg * 0.45),
    });
  }

  if (inputs.transport.weeklyCarKm > 0) {
    suggestions.push({
      category: 'transport',
      text: 'Replace short car trips with cycling or walking — even 20% fewer car km makes a real difference.',
      estimatedSavingKgCo2ePerYear: Math.round(transportKg * 0.20),
    });
  }

  if (inputs.transport.flightsPerYear > 1) {
    suggestions.push({
      category: 'transport',
      text: 'Reduce flights by one per year or choose economy class to lower your aviation footprint.',
      estimatedSavingKgCo2ePerYear: Math.round(transportKg * 0.25),
    });
  }

  if (inputs.transport.weeklyPublicTransportKm === 0 && inputs.transport.weeklyCarKm > 0) {
    suggestions.push({
      category: 'transport',
      text: 'Use public transport for commuting instead of driving to cut transport emissions by up to 30%.',
      estimatedSavingKgCo2ePerYear: Math.round(transportKg * 0.30),
    });
  }

  // Always ensure at least one transport suggestion exists
  if (suggestions.length === 0) {
    suggestions.push({
      category: 'transport',
      text: 'Combine trips and carpool when possible to reduce your overall transport emissions.',
      estimatedSavingKgCo2ePerYear: Math.round(transportKg * 0.10),
    });
  }

  return suggestions;
};

const electricitySuggestions = (electricityKg: number, inputs: UserInputs): Suggestion[] => {
  const suggestions: Suggestion[] = [];

  if (inputs.electricity.energySource === 'grid') {
    suggestions.push({
      category: 'electricity',
      text: 'Switch to a renewable energy tariff or install solar panels to dramatically reduce electricity emissions.',
      estimatedSavingKgCo2ePerYear: Math.round(electricityKg * 0.60),
    });
  }

  if (inputs.electricity.monthlyKwh > 200) {
    suggestions.push({
      category: 'electricity',
      text: 'Upgrade to energy-efficient appliances (A+++ rated) and LED lighting to cut electricity use by ~20%.',
      estimatedSavingKgCo2ePerYear: Math.round(electricityKg * 0.20),
    });
  }

  if (inputs.electricity.energySource === 'mixed') {
    suggestions.push({
      category: 'electricity',
      text: 'Transition fully to renewable energy sources to halve your electricity carbon footprint.',
      estimatedSavingKgCo2ePerYear: Math.round(electricityKg * 0.50),
    });
  }

  // Always ensure at least one electricity suggestion exists
  if (suggestions.length === 0) {
    suggestions.push({
      category: 'electricity',
      text: 'Reduce standby power consumption and optimise heating/cooling schedules to lower electricity use.',
      estimatedSavingKgCo2ePerYear: Math.round(electricityKg * 0.10),
    });
  }

  return suggestions;
};

const foodSuggestions = (foodKg: number, inputs: UserInputs): Suggestion[] => {
  const suggestions: Suggestion[] = [];

  if (inputs.food.dietType === 'meat-heavy') {
    suggestions.push({
      category: 'food',
      text: 'Shift to an omnivore or vegetarian diet — reducing red meat consumption can save ~800 kg CO₂e per year.',
      estimatedSavingKgCo2ePerYear: Math.round(foodKg * 0.25),
    });
  }

  if (inputs.food.dietType === 'omnivore') {
    suggestions.push({
      category: 'food',
      text: 'Try meat-free days each week — a vegetarian diet saves around 800 kg CO₂e per year compared to omnivore.',
      estimatedSavingKgCo2ePerYear: Math.round(foodKg * 0.15),
    });
  }

  if (inputs.food.weeklyFoodWasteKg > 1) {
    suggestions.push({
      category: 'food',
      text: 'Plan meals and use leftovers to halve your food waste — each kg of waste saved reduces ~130 kg CO₂e/year.',
      estimatedSavingKgCo2ePerYear: Math.round(inputs.food.weeklyFoodWasteKg * 52 * 2.5 * 0.5),
    });
  }

  if (inputs.food.dietType === 'vegetarian') {
    suggestions.push({
      category: 'food',
      text: 'Consider transitioning to a vegan diet to further reduce your food-related emissions by ~200 kg CO₂e/year.',
      estimatedSavingKgCo2ePerYear: Math.round(foodKg * 0.12),
    });
  }

  // Always ensure at least one food suggestion exists
  if (suggestions.length === 0) {
    suggestions.push({
      category: 'food',
      text: 'Buy locally sourced and seasonal produce to reduce food transport and storage emissions.',
      estimatedSavingKgCo2ePerYear: Math.round(foodKg * 0.05),
    });
  }

  return suggestions;
};

export function generateSuggestions(result: FootprintResult, inputs: UserInputs): Suggestion[] {
  const { breakdown, totalKgCo2ePerYear } = result;
  const { transportKgCo2e, electricityKgCo2e, foodKgCo2e } = breakdown;

  const transportOver50 = totalKgCo2ePerYear > 0 && transportKgCo2e / totalKgCo2ePerYear > 0.5;
  const electricityOver50 = totalKgCo2ePerYear > 0 && electricityKgCo2e / totalKgCo2ePerYear > 0.5;
  const foodOver50 = totalKgCo2ePerYear > 0 && foodKgCo2e / totalKgCo2ePerYear > 0.5;

  const tSuggestions = transportSuggestions(transportKgCo2e, inputs);
  const eSuggestions = electricitySuggestions(electricityKgCo2e, inputs);
  const fSuggestions = foodSuggestions(foodKgCo2e, inputs);

  // Ensure dominant categories are represented
  const selected: Suggestion[] = [];

  if (transportOver50) {
    selected.push(tSuggestions[0]);
  }
  if (electricityOver50) {
    selected.push(eSuggestions[0]);
  }
  if (foodOver50) {
    selected.push(fSuggestions[0]);
  }

  // Build a pool of all remaining suggestions (excluding already selected)
  const selectedTexts = new Set(selected.map(s => s.text));
  const pool: Suggestion[] = [
    ...tSuggestions.filter(s => !selectedTexts.has(s.text)),
    ...eSuggestions.filter(s => !selectedTexts.has(s.text)),
    ...fSuggestions.filter(s => !selectedTexts.has(s.text)),
  ];

  // Sort pool by saving descending and fill up to at least 3 suggestions
  pool.sort((a, b) => b.estimatedSavingKgCo2ePerYear - a.estimatedSavingKgCo2ePerYear);

  for (const suggestion of pool) {
    if (selected.length >= 3) break;
    selected.push(suggestion);
  }

  // If still < 3 (edge case: all pools exhausted), add remaining from pool
  if (selected.length < 3) {
    for (const suggestion of pool) {
      if (!selectedTexts.has(suggestion.text)) {
        selected.push(suggestion);
        if (selected.length >= 3) break;
      }
    }
  }

  // Final sort by estimatedSavingKgCo2ePerYear descending
  selected.sort((a, b) => b.estimatedSavingKgCo2ePerYear - a.estimatedSavingKgCo2ePerYear);

  return selected;
}
