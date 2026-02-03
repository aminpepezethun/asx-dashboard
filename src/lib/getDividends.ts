import dummy_dividends from '@/src/mock/dummy_dividends.json';
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
    region: process.env.AWS_REGION!,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
});

export async function getDividends() {
    // 1. Check for Mock Mode
    let useMock = true;
    if (useMock) {
        console.log("🛠️ Returning Mock Data");
        return dummy_dividends;
    }

    // 2. Real S3 Logic
    try {
        const command = new GetObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: "latest_data.json",
        });

        const response = await s3Client.send(command);
        const bodyContents = await response.Body?.transformToString();

        return bodyContents ? JSON.parse(bodyContents) : [];
    } catch (error) {
        console.error("❌ S3 Error:", error);
        return []; // Return empty array so the UI doesn't crash
    }
}