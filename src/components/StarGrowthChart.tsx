// components/StarGrowthChart.tsx

import React, { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { fetchRepoDetails } from '@/utils/githubApi'; // Adjust the path if necessary

interface StarGrowthChartProps {
  owner: string;
  repo: string;
}

export const StarGrowthChart: React.FC<StarGrowthChartProps> = ({ owner, repo }) => {
  const [currentStars, setCurrentStars] = useState<number>(0);
  const [initialStars, setInitialStars] = useState<number>(0);
  const [chartData, setChartData] = useState<{ date: string; stars: number }[]>([]);
  const [growthPercentage, setGrowthPercentage] = useState<number>(0);

  useEffect(() => {
    const loadStarData = async () => {
      const { stars, created_at } = await fetchRepoDetails(owner, repo);
      
      // Simulate historical data for demonstration
      const now = new Date();
      setCurrentStars(stars);
      setInitialStars(stars); // Normally, you would have historical data to compare

      setChartData([
        { date: new Date(created_at).toLocaleDateString(), stars: initialStars },
        { date: now.toLocaleDateString(), stars: currentStars },
      ]);

      // Calculate the growth percentage
      if (initialStars > 0) {
        const percentage = ((currentStars - initialStars) / initialStars) * 100;
        setGrowthPercentage(percentage);
      }
    };

    loadStarData();
  }, [owner, repo]);

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
