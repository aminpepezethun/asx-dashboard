"use client";

import { useState, useEffect, useMemo } from 'react';
import DividendTable from "./DividendTable";
import RefreshButton from "./RefreshButton";
import DownloadCsvButton from "./DownloadCsvButton";
import { DividendData } from "../types/dividends";
import { processDataToSydneyTimezone } from '../lib/processDataToSydneyTimezone';

export default function DividendContainer({ initialData, isInitiallyLoading }: { initialData: DividendData[]; isInitiallyLoading: boolean; }) {
  const [data, setData] = useState<DividendData[]>(() => processDataToSydneyTimezone(initialData));
  const [isUpdating, setIsUpdating] = useState(isInitiallyLoading);
  const [currentTimestamp, setCurrentTimestamp] = useState(initialData[0]?.["Last Updated"]);

  // Logic to get the display timestamp from the processed data
  const lastUpdatedDisplay = data.length > 0 ? data[0]["Last Updated"] : "N/A";

  // Calculate "Today in Sydney" as YYYY-MM-DD string
  const todaySydney = useMemo(() => {
    return new Intl.DateTimeFormat("en-CA", {
      timeZone: "Australia/Sydney",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date());
  }, []);

  // Filter data: Ex-Date must be Today or in the Future
  const filteredData = useMemo(() => {
    return data.filter(item => item["Ex Date"] > todaySydney);
  }, [data, todaySydney]);


  useEffect(() => {
    let interval: NodeJS.Timeout;
    let initialDelay: NodeJS.Timeout;
    const MAX_WAIT_MS = 15 * 60 * 1000; // 15 minutes
    const startTime = Date.now();

    const updateLocalData = async () => {
      try {
        const res = await fetch('/api/all-dividends');
        if (res.ok) {
          const freshData = await res.json();
          setData(processDataToSydneyTimezone(freshData));
          setCurrentTimestamp(freshData[0]?.["Last Updated"]);
        }
      } catch (err) {
        console.error("Backoff fetch failed:", err);
      } finally {
        setIsUpdating(false);
      }
    };

    if (isUpdating) {
      // 1. Define the polling function
      const startPolling = () => {
        console.log("🔄 Polling started...");
        interval = setInterval(async () => {
          if (Date.now() - startTime > MAX_WAIT_MS) {
            clearInterval(interval);
            await updateLocalData();
            return;
          }
          try {
            const res = await fetch('/api/check-status');
            const status = await res.json();
            
            if (status.lastUpdated && status.lastUpdated !== currentTimestamp) {
              await updateLocalData();
              clearInterval(interval);
              alert("✅ Data successfully updated!");
            }
          } catch (e) {
            console.error("Polling error:", e);
          }
        }, 10000);
      };

      // 2. Decide: Wait 2 mins (if new trigger) OR Start Now (if page refreshed)
      if (isInitiallyLoading) {
        startPolling();
      } else {
        console.log("⏳ New trigger detected. Waiting 2 minutes...");
        initialDelay = setTimeout(startPolling, 120000);
      }
    }

    return () => {
      clearInterval(interval);
      clearTimeout(initialDelay);
    };
    // Add isInitiallyLoading to the dependency array
  }, [isUpdating, currentTimestamp, isInitiallyLoading]);

  return (
    <>
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 leading-tight">
            ASX Dividend Tracker
          </h1>
          {/* Last Updated display below the Title */}
          <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
            <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            Last Updated: <span className="font-medium text-gray-700">{lastUpdatedDisplay}</span>
          </p>
        </div>
        
        <div className="flex gap-4">
          <RefreshButton 
            onTrigger={() => setIsUpdating(true)
               
            } isUpdating={isUpdating} />
          <DownloadCsvButton data={filteredData} />
        </div>
      </div>

      <div className="bg-white shadow-sm border border-gray-200 rounded-lg">
        <DividendTable initialData={filteredData} isLoading={isUpdating} />
      </div>
    </>
  );
}