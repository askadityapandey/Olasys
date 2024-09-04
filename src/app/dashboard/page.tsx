// app/dashboard/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { StarGrowthChart } from "@/components/StarGrowthChart";

const Dashboard = () => {
  const router = useRouter();
  const [owner, setOwner] = useState<string | null>(null);
  const [repo, setRepo] = useState<string | null>(null);

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const repoLink = query.get("repo");
    if (repoLink) {
      const parts = repoLink.split("/");
      if (parts.length >= 5) {
        setOwner(parts[3]);
        setRepo(parts[4]);
      }
    }
  }, [router]);

  if (!owner || !repo) {
    return <div className="text-center text-white">Invalid repository link.</div>;
  }

  return (
    <div className="p-4 bg-black min-h-screen">
      <h1 className="text-4xl text-white mb-8 text-center">Repository Stats</h1>
      <StarGrowthChart owner={owner} repo={repo} />
    </div>
  );
};

export default Dashboard;
