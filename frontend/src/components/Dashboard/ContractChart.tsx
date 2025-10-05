import React from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { Bar } from 'react-chartjs-2';
import { ChartOptions } from 'chart.js';

const ContractChart: React.FC = () => {

  // Contract Report Chart Data
  const contractChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Sold',
        data: [15, 20, 25, 30, 25, 20, 15, 25, 30, 35, 30, 20],
        backgroundColor: 'rgb(245, 102, 146)',
        borderColor: 'rgb(245, 102, 146)',
        borderWidth: 1,
        barPercentage: 0.4,
        categoryPercentage: 0.5,
      },
      {
        label: 'Unsold',
        data: [25, 30, 15, 35, 15, 25, 30, 20, 25, 40, 35, 25],
        backgroundColor: 'rgb(4, 35, 125)',
        borderColor: 'rgb(4, 35, 125)',
        borderWidth: 1,
        barPercentage: 0.4,
        categoryPercentage: 0.5,
      },
      {
        label: 'Pending',
        data: [10, 15, 20, 15, 20, 15, 25, 15, 10, 10, 15, 20],
        backgroundColor: 'rgb(249, 117, 106)',
        borderColor: 'rgb(249, 117, 106)',
        borderWidth: 1,
        barPercentage: 0.4,
        categoryPercentage: 0.5,
      },
    ],
  };

  const contractChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        stacked: true,
        grid: {
          display: false,
        }
      },
      y: {
        stacked: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        }
      }
    },
    plugins: {
      legend: {
        position: 'top',
        align: 'start',
        labels: {
          usePointStyle: false,
          boxWidth: 6,
          boxHeight: 6,
        }
      },
    },
  };

  return (
    <div className="card bg-white rounded-lg shadow p-6">
       <div className="flex justify-between items-center mb-6 mt-2">
       <h3 className="card-header text-xl">Contract Report</h3>
        <button className="text-gray-500 hover:bg-gray-100 p-1 rounded">
          <SlidersHorizontal size={18} />
        </button>
      </div>
      <div className="h-64">
        <Bar id='v0' data={contractChartData} options={contractChartOptions} />
      </div>
    </div>
  );
};

export default ContractChart;