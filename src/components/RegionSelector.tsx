import type { DatasetAverage } from '../types';

interface RegionSelectorProps {
  selectedRegion: string;
  onChange: (region: string) => void;
  averages: DatasetAverage[];
}

export default function RegionSelector({ selectedRegion, onChange, averages }: RegionSelectorProps) {
  return (
    <div style={{ marginBottom: '1rem' }}>
      <label htmlFor="region-select" style={{ marginRight: '0.5rem', fontWeight: 500 }}>
        Compare with region:
      </label>
      <select
        id="region-select"
        value={selectedRegion}
        onChange={(e) => onChange(e.target.value)}
      >
        {averages.map((avg) => (
          <option key={avg.region} value={avg.region}>
            {avg.region}
          </option>
        ))}
      </select>
    </div>
  );
}
