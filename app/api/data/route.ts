import { BigQuery } from "@google-cloud/bigquery";
import fs from "fs";

let PRIVATE_KEY: string | undefined;
let CLIENT_MAIL: string | undefined;

// Check if exist local file path (Local Developement)
if (process.env.GOOGLE_CREDENTIALS_PATH && fs.existsSync(process.env.GOOGLE_CREDENTIALS_PATH)) {
    const file_content = JSON.parse(fs.readFileSync(process.env.GOOGLE_CREDENTIALS_PATH, 'utf8'));
    PRIVATE_KEY = file_content.private_key;
    CLIENT_MAIL = file_content.client_email;
} else { // Raw string
    PRIVATE_KEY = process.env.BQ_PRIVATE_KEY?.replace(/\\n/g, '\n');
    CLIENT_MAIL = process.env.GOOGLE_EMAIL;
}

export const bqClient = new BigQuery({
    projectId: process.env.BQ_PROJECT_ID,
    credentials: {
        client_email: CLIENT_MAIL,
        private_key: PRIVATE_KEY,
    }
})

