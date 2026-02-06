import { DividendData } from "../types/dividends";

/**
 * Converts the "Last Updated" timestamp of all dividend items 
 * to a formatted Sydney/Australia time string.
 */
export function convertDataToAEDT(data: DividendData[]): DividendData[] {
  if (!data || data.length === 0) return [];

  return data.map((item) => {
    const date = new Date(item["Last Updated"]);

    // Format to Sydney Time
    const sydneyTimeStr = new Intl.DateTimeFormat("en-AU", {
      timeZone: "Australia/Sydney",
      dateStyle: "short",
      timeStyle: "short",
      hour12: false, // 24-hour format
    }).format(date);

    return {
      ...item,
      // We append " (AEST/AEDT)" or just " (Sydney)" for clarity
      "Last Updated": `${sydneyTimeStr} (Sydney Time)`,
    };
  });
}