"use client";

import jsonToCsv from "../lib/jsonToCsv";
import downloadFile from "../lib/downloadFile";

export default function DownloadCsvButton({ data }: { data: any[] }) {
    const handleDownload = () => {
        if (!data || data.length == 0) return;
        
        const csv = jsonToCsv(data);
        const timestamp = data[0]["Last Updated"];
        const filename = `asx-dividend-${timestamp}.csv`;

        // Download file
        downloadFile(csv, filename);
    }

    return (
        <button
            onClick={handleDownload}
            className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
            Download CSV
        </button>
    );
}