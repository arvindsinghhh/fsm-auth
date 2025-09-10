import React from "react";

type StatsCardProps = {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
};

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon }) => {
  return (
    <div className="p-4 rounded-xl shadow bg-white flex items-center space-x-3">
      {icon && <div className="text-blue-500">{icon}</div>}
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-xl font-semibold">{value}</p>
      </div>
    </div>
  );
};

export default StatsCard;
