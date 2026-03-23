import type { CalculationRecord } from '../api/calculations';

interface Props {
  history: CalculationRecord[];
  onDelete: (id: number) => void;
  onRestore: (record: CalculationRecord) => void;
}

export default function CalculationHistory({ history, onDelete, onRestore }: Props) {
  if (history.length === 0) return null;

  return (
    <div style={{ marginTop: '2.5rem' }}>
      <h2 style={{ fontSize: '1.1rem', marginBottom: '0.75rem' }}>Past Calculations</h2>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {history.map((rec) => (
          <li
            key={rec.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: '#f5f5f5',
              border: '1px solid #e0e0e0',
              borderRadius: 6,
              padding: '0.6rem 1rem',
              gap: '1rem',
              flexWrap: 'wrap',
            }}
          >
            <div>
              <span style={{ fontWeight: 600 }}>
                {rec.result.totalKgCo2ePerYear.toFixed(0)} kg CO₂e/year
              </span>
              <span style={{ fontSize: '0.8rem', color: '#888', marginLeft: '0.75rem' }}>
                {new Date(rec.timestamp).toLocaleString()}
              </span>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={() => onRestore(rec)}
                style={{
                  padding: '0.3rem 0.75rem',
                  fontSize: '0.8rem',
                  background: '#2563eb',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 4,
                  cursor: 'pointer',
                }}
              >
                View
              </button>
              <button
                onClick={() => onDelete(rec.id)}
                style={{
                  padding: '0.3rem 0.75rem',
                  fontSize: '0.8rem',
                  background: '#fff',
                  color: '#dc2626',
                  border: '1px solid #dc2626',
                  borderRadius: 4,
                  cursor: 'pointer',
                }}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
