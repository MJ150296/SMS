// src/components/UserStatistics.js

import React from "react";

const UserStatistics = () => {
  return (
    <div className="grid grid-cols-4 gap-4 p-4">
      <div className="bg-white shadow rounded-lg p-4">
        <h2 className="text-lg font-bold">Students</h2>
        <p className="text-2xl">1,234</p>
      </div>
      <div className="bg-white shadow rounded-lg p-4">
        <h2 className="text-lg font-bold">Teachers</h2>
        <p className="text-2xl">98</p>
      </div>
      <div className="bg-white shadow rounded-lg p-4">
        <h2 className="text-lg font-bold">Pending Approvals</h2>
        <p className="text-2xl">54</p>
      </div>
      <div className="bg-white shadow rounded-lg p-4">
        <h2 className="text-lg font-bold">Events</h2>
        <p className="text-2xl">45</p>
      </div>
    </div>
  );
};

export default UserStatistics;
