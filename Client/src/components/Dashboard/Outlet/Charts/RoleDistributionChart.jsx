// RoleDistributionChart.jsx
import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
// Register required components for the chart
ChartJS.register(ArcElement, Tooltip, Legend);

const RoleDistributionChart = ({ roleCounts }) => {
  // Filtered data excluding superAdmin
  const filteredData = {
    labels: ["Students", "Teachers", "Admins"],
    datasets: [
      {
        label: "User Roles",
        data: [roleCounts.student, roleCounts.teacher, roleCounts.admin],
        backgroundColor: ["#36a2eb", "#4caf50", "#ff6384"],
        hoverBackgroundColor: ["#36a2eb", "#4caf50", "#ff6384"],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        position: "top",
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <div className="w-full h-72">
      <Doughnut data={filteredData} options={options} />
    </div>
  );
};

export default RoleDistributionChart;
