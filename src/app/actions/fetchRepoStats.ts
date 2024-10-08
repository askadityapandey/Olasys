"use server";

import { Octokit } from "@octokit/rest";

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

export async function fetchRepoStats(repoUrl: string) {
  const [owner, repo] = repoUrl.split("/").slice(-2);

  try {
    const [
      repoData,
      languagesData,
      contributorsData,
      commitsData,
      contentsData,
      pullRequestsData,
    ] = await Promise.all([
      octokit.repos.get({ owner, repo }),
      octokit.repos.listLanguages({ owner, repo }),
      octokit.repos.getContributorsStats({ owner, repo }),
      octokit.repos.getCommitActivityStats({ owner, repo }),
      octokit.repos.getContent({ owner, repo, path: "" }),
      octokit.pulls.list({ owner, repo, state: "all", per_page: 100 }),
    ]);

    const starsOverTime = await fetchStarsOverTime(owner, repo);
    const forksOverTime = await fetchForksOverTime(owner, repo);
    const codeComplexity = await analyzeCodeComplexity(
      owner,
      repo,
      contentsData.data
    );

    console.log("Code Complexity Data:", codeComplexity);

    const languages = Object.entries(languagesData.data).map(
      ([name, bytes]) => ({
        name,
        percentage:
          ((bytes as number) /
            Object.values(languagesData.data).reduce(
              (a, b) => a + (b as number),
              0
            )) *
          100,
      })
    );

    const contributions = contributorsData.data
      ? contributorsData.data
          .sort((a, b) => b.total - a.total)
          .slice(0, 5)
          .map((contributor) => ({
            author: contributor.author.login,
            commits: contributor.total,
          }))
      : [];

    const contributionHeatmap = commitsData.data
      ? commitsData.data.flatMap((week) =>
          week.days.map((count, index) => ({
            date: new Date(week.week * 1000 + index * 86400000)
              .toISOString()
              .split("T")[0],
            count,
          }))
        )
      : [];

    const pullRequests = pullRequestsData.data.map((pr) => ({
      number: pr.number,
      title: pr.title,
      state: pr.state,
      createdAt: pr.created_at,
      closedAt: pr.closed_at,
    }));

    const prStats = {
      total: pullRequests.length,
      open: pullRequests.filter((pr) => pr.state === "open").length,
      closed: pullRequests.filter((pr) => pr.state === "closed").length,
      mergeTime: calculateAverageMergeTime(pullRequests),
    };

    return {
      stars: repoData.data.stargazers_count,
      forks: repoData.data.forks_count,
      languages,
      contributions,
      starsOverTime,
      forksOverTime,
      contributionHeatmap,
      codeComplexity,
      pullRequests: prStats,
    };
  } catch (error) {
    console.error("Error fetching repo stats:", error);
    throw new Error("Failed to fetch repository statistics");
  }
}

async function fetchStarsOverTime(owner: string, repo: string) {
  try {
    const stargazers = await octokit.paginate(
      octokit.activity.listStargazersForRepo,
      {
        owner,
        repo,
        per_page: 100,
      }
    );

    const starsOverTime = stargazers.reduce((acc, stargazer) => {
      if (stargazer.starred_at) {
        const date = new Date(stargazer.starred_at).toISOString().split("T")[0];
        acc[date] = (acc[date] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(starsOverTime)
      .map(([date, stars]) => ({ date, stars }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  } catch (error) {
    console.error("Error fetching stars over time:", error);
    return [];
  }
}

async function fetchForksOverTime(owner: string, repo: string) {
  try {
    const forks = await octokit.paginate(octokit.repos.listForks, {
      owner,
      repo,
      per_page: 100,
    });

    const forksOverTime = forks.reduce((acc, fork) => {
      const date = new Date(fork.created_at).toISOString().split("T")[0];
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(forksOverTime)
      .map(([date, forks]) => ({ date, forks }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  } catch (error) {
    console.error("Error fetching forks over time:", error);
    return [];
  }
}

async function analyzeCodeComplexity(
  owner: string,
  repo: string,
  contents: any[]
) {
  const fileComplexities = await Promise.all(
    contents
      .filter((item: any) => item.type === "file" && item.name.endsWith(".js"))
      .map(async (file: any) => {
        try {
          const fileContent = await octokit.repos.getContent({
            owner,
            repo,
            path: file.path,
          });
          const content = Buffer.from(
            fileContent.data.content,
            "base64"
          ).toString("utf-8");
          const complexity = calculateComplexity(content);
          return { name: file.name, complexity };
        } catch (error) {
          console.error(`Error analyzing file ${file.name}:`, error);
          return null;
        }
      })
  );

  const validComplexities = fileComplexities.filter((item) => item !== null);
  console.log("Valid complexities:", validComplexities);

  return validComplexities
    .sort((a, b) => b.complexity - a.complexity)
    .slice(0, 10);
}

function calculateComplexity(code: string) {
  const controlStructures = (code.match(/(if|for|while|switch|catch)/g) || [])
    .length;
  const functions = (code.match(/function/g) || []).length;
  return controlStructures + functions;
}

function calculateAverageMergeTime(pullRequests) {
  const mergedPRs = pullRequests.filter(
    (pr) => pr.state === "closed" && pr.closedAt
  );
  if (mergedPRs.length === 0) return 0;

  const totalMergeTime = mergedPRs.reduce((sum, pr) => {
    const createDate = new Date(pr.createdAt);
    const closeDate = new Date(pr.closedAt);
    return sum + (closeDate.getTime() - createDate.getTime());
  }, 0);

  return totalMergeTime / mergedPRs.length / (1000 * 60 * 60); // Convert to hours
}
