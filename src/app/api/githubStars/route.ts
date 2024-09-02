// app/api/githubRepo/route.ts

import { NextResponse } from "next/server";

// Define the GET method to handle API requests
export async function GET(request: Request) {
  // Extract search parameters from the request URL
  const { searchParams } = new URL(request.url);
  const repo = searchParams.get('repo');

  // Return an error response if the 'repo' parameter is not provided
  if (!repo) {
    return NextResponse.json({ error: 'Repository name is required' }, { status: 400 });
  }

  try {
    // Construct the URL for GitHub API request
    const response = await fetch(`https://api.github.com/repos/${repo}`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        // Optionally, add your GitHub personal access token here if you have one
        // 'Authorization': 'token YOUR_PERSONAL_ACCESS_TOKEN',
      }
    });

    // Check if the response is successful
    if (!response.ok) {
      throw new Error('Failed to fetch repository data');
    }

    // Parse the response as JSON
    const data = await response.json();

    // Return the parsed data as a JSON response with a 200 status code
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    // Return an error response with the error message and a 500 status code
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
