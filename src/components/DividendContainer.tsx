"use client";

import { useState, useEffect } from 'react';
import DividendTable from "./DividendTable";
import RefreshButton from "./RefreshButton";
import DownloadCsvButton from "./DownloadCsvButton";
import { DividendData } from "../types/dividends";

export default function DividendContainer({ initialData }: { initialData: DividendData[] }) {
  const [data, setData] = useState<DividendData[]>(initialData);
  const [isUpdating, setIsUpdating] = useState(false);
  const [currentTimestamp, setCurrentTimestamp] = useState(initialData[0]?.["Last Updated"]);

  useEffect(() => {
        let interval: NodeJS.Timeout;
        let initialDelay: NodeJS.Timeout;

        if (isUpdating) {
        console.log("⏳ Scraper triggered. Waiting 2 minutes before polling...");

        // Wait 2 minutes before starting polling for 10 seconds
        initialDelay = setTimeout(() => {
        console.log("🔄 Starting status polling...");

        // Poll every 10 seconds
        interval = setInterval(async () => {
            try {
                const res = await fetch('/api/check-status');
                const status = await res.json();

                if (status.lastUpdated && status.lastUpdated !== currentTimestamp) {
                    // Pull the fresh data
                    const finalDataRes = await fetch('/api/all-dividends');
                    const finalData = await finalDataRes.json();

                    setData(finalData);
                    setCurrentTimestamp(status.lastUpdated);
                    setIsUpdating(false);

                    clearInterval(interval);
                    alert("✅ Data successfully updated!");
                    }
            } catch (e) {
                console.error("Polling error:", e);
            }
            }, 10000);
        }, 120000); // 2 minutes
    }

    return () => clearInterval(interval);
  }, [isUpdating, currentTimestamp]);

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">ASX Dividend Tracker</h1>
        <div className="flex gap-4">
          <RefreshButton onTrigger={() => setIsUpdating(true)} />
          <DownloadCsvButton data={data} />
        </div>
      </div>

      <div className="bg-white shadow-sm border border-gray-200 rounded-lg">
        <DividendTable initialData={data} isLoading={isUpdating} />
      </div>
    </>
  );
}