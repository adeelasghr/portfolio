import { Doughnut } from 'react-chartjs-2';
import { SlidersHorizontal } from 'lucide-react';
import { Chart, ArcElement } from 'chart.js';

const CountryChart = () => {

    if (!Chart.registry.elements.get(ArcElement.id)) {
        Chart.register(ArcElement);
      }
      
  // Like By Country Chart Data
  const countryChartData = {
    labels: ['Sedan', 'SUV', 'Vans'],
    datasets: [
      {
        data: [45, 30, 15],
        backgroundColor: [
          'rgb(236, 114, 147)', // Pink for United States
          'rgb(25, 25, 112)',   // Dark blue for Australia
          'rgb(231, 129, 109)'
        ],
        borderColor: [
          'rgb(236, 114, 147)',
          'rgb(25, 25, 112)',
          'rgb(231, 129, 109)'
        ],
        borderWidth: 1,
        cutout: '60%',
        hoverOffset: 5
      },
    ],
  };

  const countryChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        align: 'start' as const,
        labels: {
          usePointStyle: true,
          boxWidth: 6,
          boxHeight: 6,
          padding: 20,
          font: {
            size: 14
          }
        }
      },
      tooltip: {
       
      }
    },
  };

  return (
    <div className="lg:col-span-3 bg-white rounded-lg shadow p-6 card">
      <div className="flex justify-between items-center mb-6 mt-2">
      <h3 className="card-header text-xl">Vehicle Report</h3>
        <button className="text-gray-500 hover:bg-gray-100 p-1 rounded">
          <SlidersHorizontal size={18} />
        </button>
      </div>
      <div className="h-80">
        <Doughnut id="v1" data={countryChartData} options={countryChartOptions} />
      </div>
    </div>
  );
};

export default CountryChart;