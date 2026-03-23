import { ArcElement, DoughnutController, Legend, Tooltip, Chart as ChartJS } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import type { CategoryBreakdown } from '../types';

ChartJS.register(ArcElement, DoughnutController, Tooltip, Legend);

interface DonutChartProps {
  breakdown: CategoryBreakdown;
  total: number;
}

const COLORS = ['#4CAF50', '#2196F3', '#FF9800'];

export default function DonutChart({ breakdown, total }: DonutChartProps) {
  const { transportKgCo2e, electricityKgCo2e, foodKgCo2e } = breakdown;

  const data = {
    labels: [
      `Transport (${transportKgCo2e.toFixed(0)} kg CO₂e)`,
      `Electricity (${electricityKgCo2e.toFixed(0)} kg CO₂e)`,
      `Food (${foodKgCo2e.toFixed(0)} kg CO₂e)`,
    ],
    datasets: [
      {
        data: [transportKgCo2e, electricityKgCo2e, foodKgCo2e],
        backgroundColor: COLORS,
        borderWidth: 2,
        borderColor: '#fff',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      tooltip: {
        callbacks: {
          label: (ctx: { label: string; raw: unknown }) => {
            const value = ctx.raw as number;
            const pct = total > 0 ? ((value / total) * 100).toFixed(1) : '0.0';
            return `${ctx.label}: ${pct}%`;
          },
        },
      },
    },
  };

  return (
    <div style={{ width: '240px', height: '240px', margin: '0 auto' }}>
      <Doughnut data={data} options={{ ...options, maintainAspectRatio: false }} />
    </div>
  );
}
