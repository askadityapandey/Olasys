// app/dashboard/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { StarGrowthChart } from "@/components/StarGrowthChart"; // This component should visualize star growth data
import { RepoStats } from "@/components/RepoStats"; // Example component for displaying repo stats

interface RepoData {
  name: string;
  forks_count: number;
  open_issues_count: number;
  stargazers_count: number;
}

interface StarData {
  date: string;
  stars: number;
}

export default function Dashboard() {
  const searchParams = useSearchParams();
  const repo = searchParams.get('repo');
  
  const [repoData, setRepoData] = useState<RepoData | null>(null);
  const [starGrowthData, setStarGrowthData] = useState<StarData[]>([]); // New state for star growth data
  const [growthPercentage, setGrowthPercentage] = useState<number>(0); // State for growth percentage
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (repo) {
      fetch(`/api/githubRepo?repo=${encodeURIComponent(repo)}`)
        .then(response => response.json())
        .then(data => {
          if (data.error) {
            setError(data.error);
          } else {
            setRepoData(data);
            fetchStarGrowthData(repo); // Fetch star growth data
          }
        })
        .catch(err => setError('Failed to fetch repository data'));
    }
  }, [repo]);

  // Function to fetch and process star growth data
  const fetchStarGrowthData = async (repoName: string) => {
    try {
      const response = await fetch(`/api/githubStars?repo=${encodeURIComponent(repoName)}`);
      const starData = await response.json();
      if (starData.error) {
        setError(starData.error);
      } else {
        const processedData = processStarData(starData); // Process star data to fit the chart format
        setStarGrowthData(processedData.chartData);
        setGrowthPercentage(processedData.growthPercentage);
      }
    } catch (error) {
      setError('Failed to fetch star growth data');
    }
  };

  // Example function to process raw star growth data
  const processStarData = (data: any) => {
    // Transform data into the format required by StarGrowthChart
    // This is a placeholder function and should be replaced with real data processing logic
    const chartData: StarData[] = data.map((entry: any) => ({
      date: new Date(entry.date).toLocaleDateString('en-GB', {
        month: 'short',
        year: 'numeric',
      }),
      stars: entry.stars,
    }));

    const totalStars = data[data.length - 1].stars;
    const initialStars = data[0].stars;
    const growthPercentage = ((totalStars - initialStars) / initialStars) * 100;

    return { chartData, growthPercentage };
  };

  if (error) {
    return <div className="text-red-500 text-center mt-4">Error: {error}</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {repoData ? (
        <>
          <h1 className="text-2xl font-bold mb-4">{repoData.name}</h1>
          <RepoStats 
            forks={repoData.forks_count} 
            issues={repoData.open_issues_count} 
            stars={repoData.stargazers_count} 
          />
          <div className="w-full max-w-3xl p-4 bg-white shadow-md rounded-lg">
            <StarGrowthChart chartData={starGrowthData} growthPercentage={growthPercentage} />
          </div>
        </>
      ) : (
        <p className="text-gray-500">Loading repository data...</p>
      )}
    </div>
  );
}
