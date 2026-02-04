import { NextResponse } from "next/server";
import { getDividends } from "../../../lib/getDividends";

export async function GET() {
    try {
        const data = await getDividends();
        
        if (!data) {
            return NextResponse.json({ error: "No data found" }, { status: 404 });
        }

        return NextResponse.json(data);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}