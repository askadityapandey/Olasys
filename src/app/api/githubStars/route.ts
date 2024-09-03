// app/api/githubRepo/route.ts

import { NextResponse } from "next/server";

export async function GET(request: Request) {
  // Extract search parameters from the request URL
  const { searchParams } = new URL(request.url);
  const repo = searchParams.get('repo');

  if (!repo) {
    return NextResponse.json({ error: 'Repository name is required' }, { status: 400 });
  }

  try {
    
    const response = await fetch(`https://api.github.com/repos/${repo}`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
       
      }
    });

   
    if (!response.ok) {
      throw new Error('Failed to fetch repository data');
    }

    const data = await response.json();

    
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
