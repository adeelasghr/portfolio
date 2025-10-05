import React from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import { ChartOptions } from 'chart.js';

const SalesChart: React.FC = () => {
  // Monthly Sales Report Chart Data
  const salesChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
    datasets: [
      {
        label: 'Annual Sales',
        data: [60, 40, 85, 70, 55, 45, 65, 85, 90],
        borderColor: 'rgb(248, 113, 113)',
        backgroundColor: 'rgba(248, 113, 113, 0.1)',
        tension: 0.4,
      },
      {
        label: 'Annual Revenue',
        data: [40, 55, 75, 60, 65, 80, 30, 55, 55],
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const salesChartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: false,
        min: 20,
        max: 100,
        ticks: {
          callback: function(value) {
            return '$' + value;
          }
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        }
      },
      x: {
        grid: {
          display: false,
        }
      }
    },
    plugins: {
      legend: {
        position: 'top',
        align: 'start',
        labels: {
          usePointStyle: true,
          boxWidth: 6,
          boxHeight: 6,
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += '$' + context.parsed.y;
            }
            return label;
          }
        }
      }
    },
  };

  return (
    <div className="card bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6 mt-2">
        <h3 className="card-header text-xl">Monthly Sales Report</h3>
        <button className="text-gray-500 hover:bg-gray-100 p-1 rounded">
          <SlidersHorizontal size={18} />
        </button>
      </div>
      <div className="h-64">
        <Line data={salesChartData} options={salesChartOptions} />
      </div>
    </div>
  );
};

export default SalesChart;