import { NextResponse } from "next/server";
import { getDividends } from "@/src/lib/getDividends";

// This API helps to Search/ Filter without refreshing the whole page - frontend call API URL to execute
// It also helps to check data easier using curl or POSTMAN without opening the browser
// Future development could use this API (Mobile App) to fetch JSON directly from this endpoint

export async function GET() {
    try {
        const data = await getDividends();

        return NextResponse.json(data, {
            status: 200,
            headers: {
                'Cache-Control': 'no-store, max-age=0',
            },
        });
    } catch (error: any) {
        return NextResponse.json({error: error.message}, {status: 500});
    }
}