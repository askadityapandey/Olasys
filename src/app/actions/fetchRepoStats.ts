'use server'

import { Octokit } from '@octokit/rest'

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN })

export async function fetchRepoStats(repoUrl: string) {
  const [owner, repo] = repoUrl.split('/').slice(-2)

  try {
    const [repoData, languagesData, contributorsData] = await Promise.all([
      octokit.repos.get({ owner, repo }),
      octokit.repos.listLanguages({ owner, repo }),
      octokit.repos.getContributorsStats({ owner, repo }),
    ])

    const starsOverTime = await fetchStarsOverTime(owner, repo)

    const languages = Object.entries(languagesData.data).map(([name, bytes]) => ({
      name,
      percentage: (bytes as number / Object.values(languagesData.data).reduce((a, b) => a + (b as number), 0)) * 100,
    }))

    const contributions = contributorsData.data
      .sort((a, b) => b.total - a.total)
      .slice(0, 5)
      .map((contributor) => ({
        author: contributor.author.login,
        commits: contributor.total,
      }))

    return {
      stars: repoData.data.stargazers_count,
      forks: repoData.data.forks_count,
      languages,
      contributions,
      starsOverTime,
    }
  } catch (error) {
    console.error('Error fetching repo stats:', error)
    throw new Error('Failed to fetch repository statistics')
  }
}

async function fetchStarsOverTime(owner: string, repo: string) {
  const stargazers = await octokit.paginate(octokit.activity.listStargazersForRepo, {
    owner,
    repo,
    per_page: 100,
  })

  const starsOverTime = stargazers.reduce((acc, stargazer) => {
    const date = new Date(stargazer.starred_at).toISOString().split('T')[0]
    acc[date] = (acc[date] || 0) + 1
    return acc
  }, {})

  return Object.entries(starsOverTime).map(([date, stars]) => ({ date, stars }))
}