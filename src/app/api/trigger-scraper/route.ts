import { NextResponse } from "next/server";
import { getDividends } from "../../../lib/getDividends";

export async function POST() {
    const GITHUB_TOKEN=process.env.GITHUB_PAT;
    const REPO_OWNER=process.env.REPO_OWNER;
    const REPO_NAME=process.env.REPO_NAME;

    if (!GITHUB_TOKEN || !REPO_NAME || !REPO_OWNER) {
        return NextResponse.json({ error: "Server configuration missing" }, { status: 500 });
    }

    try {
        // Fetch current data to check for timestamp
        const data = await getDividends();
        const COOLDOWN_MINUTES = 0;

        if (data && data.length > 0) {
            const lastUpdated = data[0]["Last Updated"];
            
            // Append 'Z' suffix if missing to force UTC parsing
            const normalizedDate = lastUpdated.endsWith('Z') 
                            ? lastUpdated 
                            : `${lastUpdated}Z`;

            // Get lastUpdatedMs and nowMs in the same UTC 
            const lastUpdatedMs = new Date(normalizedDate).getTime();
            const nowMs = Date.now();

            // Calculate difference in minutes
            const diffInMinutes = (nowMs - lastUpdatedMs) / (1000 * 60);

            // Gatekeepr
            if (diffInMinutes < COOLDOWN_MINUTES) {
                const waitMinutes = Math.max(1, Math.ceil(COOLDOWN_MINUTES - diffInMinutes));

                return NextResponse.json({
                    message: `Free tier has a ${COOLDOWN_MINUTES} minutes refresh wait time. Please wait for ${waitMinutes} minute(s) before refreshing. To use up to 30 refresh per hours, please upgrade to higher tiers.`,
                    isRateLimited: true
                }, { status: 429 }
                );
            }
            
        }

        // 3. Trigger GitHub Action if check passes
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
        );

        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`GitHub API failed: ${response.status} ${errorBody}`);
        }

        return NextResponse.json({ message: 'Scraper started successfully.' });
    } catch (error: any) {
        return NextResponse.json({error: error.message}, {status: 500});
    }
}