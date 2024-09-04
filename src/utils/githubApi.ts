// utils/githubApi.ts

const GITHUB_TOKEN = process.env.GITHUB_TOKEN; // Ensure this token is set in your environment variables


export const fetchRepoDetails = async (owner: string, repo: string) => {
    try {
      const url = `https://api.github.com/repos/${owner}/${repo}`;
      console.log(`Fetching data from URL: ${url}`); // Debug URL
      const response = await fetch(url, {
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      console.log('API Response:', data); // Debug API Response
      return {
        stars: data.stargazers_count,
        created_at: data.created_at,
      };
    } catch (error) {
      console.error('Error fetching repository details:', error);
      return { stars: 0, created_at: '' };
    }
  };
  