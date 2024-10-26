import React from "react";

const StatisticCard = ({ title, value }) => {
  return (
    <div className="bg-white shadow rounded-lg p-4">
      <h2 className="text-lg font-bold mb-2">{title}</h2>
      <p className="text-lg">{value}</p>
    </div>
  );
};

export default StatisticCard;
