import { NextResponse } from 'next/server';

export async function GET() {
  const GITHUB_TOKEN = process.env.GITHUB_PAT!;
  const REPO_OWNER = process.env.REPO_OWNER!;
  const REPO_NAME = process.env.REPO_NAME!;


  try {
    // We call the basic repo GET endpoint to test credentials
    const response = await fetch(
      `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          Accept: 'application/vnd.github.v3+json',
        },
        cache: 'no-store',
      }
    );

    // Check for PAT validity
    if (response.status === 401) {
      return NextResponse.json({ 
        connected: false, 
        error: "Invalid GITHUB_PAT. Check your Vercel/Local env variables." 
      }, { status: 401 });
    }

    // Check repo existence
    if (response.status === 404) {
      return NextResponse.json({ 
        connected: false, 
        error: "Repository not found. Check REPO_OWNER and REPO_NAME." 
      }, { status: 404 });
    }

    const data = await response.json();

    return NextResponse.json({ 
      connected: true, 
      repository: data.full_name,
      permissions: data.permissions // Shows if you have 'push' or 'admin' access
    });

  } catch (error: any) {
    return NextResponse.json({ connected: false, error: error.message }, { status: 500 });
  }
}