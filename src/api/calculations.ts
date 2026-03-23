import type { UserInputs, FootprintResult } from '../types';

const BASE = `${import.meta.env.VITE_API_URL ?? 'http://localhost:3001'}/api`;

export interface CalculationRecord {
  id: number;
  timestamp: string;
  inputs: UserInputs;
  result: FootprintResult;
}

export async function saveCalculation(inputs: UserInputs, result: FootprintResult): Promise<void> {
  await fetch(`${BASE}/calculations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ inputs, result }),
  });
}

export async function fetchCalculations(): Promise<CalculationRecord[]> {
  const res = await fetch(`${BASE}/calculations`);
  if (!res.ok) return [];
  return res.json();
}

export async function deleteCalculation(id: number): Promise<void> {
  await fetch(`${BASE}/calculations/${id}`, { method: 'DELETE' });
}
