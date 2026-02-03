import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";

import dummy_dividends from '@/src/mock/dummy_dividends.json';

// Client initialisation (warm start)
const s3Client = new S3Client({
    region: process.env.AWS_REGION!,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
});

const BUCKET_NAME = process.env.AWS_BUCKET_NAME;
const OBJECT_KEY = "latest_data.json";

export async function fetch_data_from_s3() {
    try {
        const command = new GetObjectCommand({
            Bucket: BUCKET_NAME,
            Key: OBJECT_KEY,
        });

        const response = await s3Client.send(command);
        const bodyContents = await response.Body?.transformToString();  // stream to string

        if (!bodyContents) {
            return NextResponse.json({error: "No data found"}, {status:404});
        }

        return NextResponse.json(
            JSON.parse(bodyContents), 
            {
                status: 200, 
                headers: {
                    'Cache-Control': 'no-store, max-age=0', // prevent caching data 
                },
            }
        );
    } catch (error: any) {
        console.error("❌ S3 Fetch Error: ", error.message);
        return NextResponse.json({error: error.message}, {status:500});
    }
}

export async function fetch_mock_data() {
    console.log("🛠️ Serving Mock Data for Frontend Testing");
    return NextResponse.json(dummy_dividends);
}

export async function GET() {
    const useMock = true;

    if (useMock) {
        return fetch_mock_data();
    }

    return fetch_data_from_s3()
}