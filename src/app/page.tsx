// app/page.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [repoLink, setRepoLink] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (repoLink) {
      router.push(`/dashboard?repo=${encodeURIComponent(repoLink)}`);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-black">
      <form onSubmit={handleSubmit} className="text-center">
        <h1 className="text-4xl text-white mb-8">Olasys: Spy on Your Projects</h1>
        <input
          type="text"
          value={repoLink}
          onChange={(e) => setRepoLink(e.target.value)}
          className="px-4 py-2 rounded-lg w-80 text-black"
          placeholder="https://github.com/user/repo"
        />
        <button
          type="submit"
          className="ml-4 px-6 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-700 border-2 border-transparent hover:border-blue-500 transition-all"
        >
          Lessss goo!
        </button>
      </form>
    </div>
  );
}
