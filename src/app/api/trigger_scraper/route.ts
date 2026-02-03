import { NextResponse } from "next/server";

export async function POST() {
    const GITHUB_TOKEN=process.env.GITHUB_PAT;
    const REPO_OWNER=process.env.REPO_OWNER;
    const REPO_NAME=process.env.REPO_NAME;

    if (!GITHUB_TOKEN || !REPO_NAME || !REPO_NAME) {
        return NextResponse.json({ error: "Server configuration missing" }, { status: 500 });
    }

    try {
        const response = await fetch(
            `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/dispatches`,
            {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${GITHUB_TOKEN}`,
                    Accept: 'application/vnd.github.v3+json',
                },
                body: JSON.stringify({
                    event_type: 'remote_trigger',
                })
            }
        )

        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`GitHub API failed: ${response.status} ${errorBody}`);
        }

        return NextResponse.json({ message: 'Scraper started' })
    } catch (error: any) {
        return NextResponse.json({error: error.message}, {status: 500});
    }
}
