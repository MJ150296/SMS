import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

// Register required components for the chart
ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
  Filler
);

const MonthlyRegistrationsChart = ({ monthlyData }) => {
  const {
    months,
    studentRegistrations,
    teacherRegistrations,
    adminRegistrations,
  } = monthlyData;

  const data = {
    labels: months, // X-axis labels (months)
    datasets: [
      {
        label: "Students",
        data: studentRegistrations, // Data for student registrations
        borderColor: "#36a2eb",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        fill: true,
        tension: 0.1,
        pointRadius: 5,
      },
      {
        label: "Teachers",
        data: teacherRegistrations, // Data for teacher registrations
        borderColor: "#4caf50",
        backgroundColor: "rgba(76, 175, 80, 0.2)",
        fill: true,
        tension: 0.1,
        pointRadius: 5,
      },
      {
        label: "Admins",
        data: adminRegistrations, // Data for admin registrations
        borderColor: "#ff6384",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        fill: true,
        tension: 0.1,
        pointRadius: 5,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        mode: "index",
        intersect: false,
      },
    },
    interaction: {
      mode: "index",
      intersect: false,
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Months",
        },
      },
      y: {
        title: {
          display: true,
          text: "Number of Registrations",
        },
      },
    },
  };

  return (
    <div className="w-full h-96">
      <Line data={data} options={options} />
    </div>
  );
};

export default MonthlyRegistrationsChart;
