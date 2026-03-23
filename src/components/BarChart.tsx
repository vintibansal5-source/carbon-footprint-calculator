import {
  BarController,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Tooltip,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import type { CategoryBreakdown } from '../types';

ChartJS.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

interface BarChartProps {
  breakdown: CategoryBreakdown;
}

const COLORS = ['#4CAF50', '#2196F3', '#FF9800'];

export default function BarChart({ breakdown }: BarChartProps) {
  const { transportKgCo2e, electricityKgCo2e, foodKgCo2e } = breakdown;

  const data = {
    labels: ['Transport', 'Electricity', 'Food'],
    datasets: [
      {
        label: 'kg CO₂e per year',
        data: [transportKgCo2e, electricityKgCo2e, foodKgCo2e],
        backgroundColor: COLORS,
        borderWidth: 1,
        borderColor: COLORS,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx: { raw: unknown }) => `${(ctx.raw as number).toFixed(1)} kg CO₂e`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'kg CO₂e / year',
        },
      },
    },
  };

  return (
    <div style={{ width: '320px', height: '240px', margin: '0 auto' }}>
      <Bar data={data} options={{ ...options, maintainAspectRatio: false }} />
    </div>
  );
}
