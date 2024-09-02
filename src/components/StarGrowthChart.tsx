import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface StarGrowthChartProps {
  chartData: { date: string; stars: number }[];
  growthPercentage: number;
}

export const StarGrowthChart: React.FC<StarGrowthChartProps> = ({
  chartData,
  growthPercentage,
}) => {
  return (
    <div className="p-4 bg-white rounded shadow-lg">
      <h2 className="text-lg font-bold mb-2">Star Growth Over Time</h2>
      <p className="text-gray-600 mb-4">
        Growth Rate: {growthPercentage.toFixed(2)}%
      </p>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="stars" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
