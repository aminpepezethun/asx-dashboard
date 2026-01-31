import { NextResponse } from "next/server";

export async function POST() {
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
    const REPO = "Hminh0306/asx-dividend-scraper" // Hard-coded the repo

    try {
        const response = await fetch(`http://api.github.com/repos/${REPO}/dispatches`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${GITHUB_TOKEN}`,
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                event_type: 'remote_trigger',
            }),
        });

        if (response.status === 204) {
            return NextResponse.json({ message: "🚀 Scraper triggered successfully!" });
        } else {
            const errorData = await response.json();
            return NextResponse.json({ error: errorData }, {status: response.status });
        }

    } catch (error: any) {
        return NextResponse.json({error: error.message}, {status: 500});
    }
}