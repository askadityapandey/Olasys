// components/RepoStats.tsx

import React from "react";

interface RepoStatsProps {
  forks: number;
  issues: number;
  stars: number;
}

export const RepoStats: React.FC<RepoStatsProps> = ({ forks, issues, stars }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md w-full max-w-2xl mb-6">
      <h2 className="text-lg font-bold mb-2">Repository Statistics</h2>
      <div className="flex justify-between text-center">
        <div className="flex flex-col items-center">
          <span className="text-2xl font-semibold">{stars}</span>
          <span className="text-gray-600">Stars</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-2xl font-semibold">{forks}</span>
          <span className="text-gray-600">Forks</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-2xl font-semibold">{issues}</span>
          <span className="text-gray-600">Open Issues</span>
        </div>
      </div>
    </div>
  );
};
