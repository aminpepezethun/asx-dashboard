import { S3Client, HeadBucketCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";

export async function GET() {
    const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME;
    const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
    const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
    const AWS_REGION = process.env.AWS_REGION;

    if (!AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY) {
        return NextResponse.json({
            error: "MISSING CREDENTIALS",
            details: "AWS_ACCESS_KEY_ID or AWS_SECRET_ACCESS_KEY is not defined in .env",
        }, {status: 400});
    }

    // Intialise client
    const s3Client = new S3Client({
        region: AWS_REGION!,
        credentials: {
            accessKeyId: AWS_ACCESS_KEY_ID!,
            secretAccessKey: AWS_SECRET_ACCESS_KEY!,
        },
    });

    const results = {
        region: AWS_REGION,
        bucket: S3_BUCKET_NAME,
        connection: false,
        permissions: false,
        fileFound: false,
        error: null as any,
    };

    try {
        // 1. Test Connection & Bucket Existence
        const data = await s3Client.send(new ListObjectsV2Command({
            Bucket: S3_BUCKET_NAME,
            MaxKeys: 1
        }));

        results.connection = true;

        // Check for your specific file
        const listRes = await s3Client.send(new ListObjectsV2Command({ Bucket: S3_BUCKET_NAME }));
        results.fileFound = listRes.Contents?.some(obj => obj.Key === "latest_data.json") || false;

        return NextResponse.json(results);
    } catch (err: any) {
        console.error("S3 Test Error Details:", err);
        return NextResponse.json({
            ...results,
            error: err.name,
            message: err.message,
            stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
        }, { status: 500 });
    }
}