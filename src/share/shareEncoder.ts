import type { UserInputs, FootprintResult } from '../types/index';

interface SharePayload {
  inputs: UserInputs;
  result: FootprintResult;
}

function isValidInputs(inputs: unknown): inputs is UserInputs {
  if (!inputs || typeof inputs !== 'object') return false;
  const i = inputs as Record<string, unknown>;
  return (
    typeof i.transport === 'object' && i.transport !== null &&
    typeof i.electricity === 'object' && i.electricity !== null &&
    typeof i.food === 'object' && i.food !== null &&
    typeof i.selectedRegion === 'string'
  );
}

function isValidResult(result: unknown): result is FootprintResult {
  if (!result || typeof result !== 'object') return false;
  const r = result as Record<string, unknown>;
  return (
    typeof r.totalKgCo2ePerYear === 'number' &&
    typeof r.breakdown === 'object' && r.breakdown !== null &&
    typeof r.emissionFactorVersion === 'string'
  );
}

export function encodeShareUrl(inputs: UserInputs, result: FootprintResult): string {
  const payload: SharePayload = { inputs, result };
  const json = JSON.stringify(payload);
  const encoded = btoa(json);
  return '#' + encoded;
}

export function decodeShareUrl(hash: string): { inputs: UserInputs; result: FootprintResult } | null {
  try {
    const stripped = hash.startsWith('#') ? hash.slice(1) : hash;
    const json = atob(stripped);
    const payload = JSON.parse(json) as unknown;

    if (!payload || typeof payload !== 'object') return null;
    const p = payload as Record<string, unknown>;

    if (!isValidInputs(p.inputs) || !isValidResult(p.result)) return null;

    return { inputs: p.inputs, result: p.result };
  } catch {
    return null;
  }
}
