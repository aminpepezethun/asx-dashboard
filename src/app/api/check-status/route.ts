import { NextResponse } from "next/server";
import { getDividends } from "../../../lib/getDividends";

export async function GET() {
    try {
        const data = await getDividends();
        // Just return the timestamp of the first item as a 'version' ID
        return NextResponse.json({ 
            lastUpdated: data[0]?.["Last Updated"] || null 
        });
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch status" }, { status: 500 });
    }
}