"use client";

import { useEffect, useState } from 'react';
import { DividendData } from '../types/dividends';

export default function DividendTable({ initialData, isLoading }: { initialData: DividendData[]; isLoading: boolean; }) {
  // Client render for timestamp conversion
  const [isClient, setIsClient] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    setIsClient(true);
  }, []);

  const filteredData = initialData.filter(item => 
    item.Code.toLowerCase().includes(search.toLowerCase()) ||
    item.Company.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative overflow-x-auto">
      {/* Visual Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 z-10 bg-white/60 backdrop-blur-[2px] flex flex-col items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-2"></div>
          <p className="text-blue-700 font-semibold animate-pulse">Updating from ASX...</p>
        </div>
      )}
      
      <input 
        type="text" 
        placeholder="Filter by Ticker or Name..." 
        className="mb-4 p-2 border rounded w-full max-w-sm"
        onChange={(e) => setSearch(e.target.value)}
      />
      <table className="min-w-full bg-white border border-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 border">Code</th>
            <th className="px-4 py-2 border">Company</th>
            <th className="px-4 py-2 border">Ex Date</th>
            <th className="px-4 py-2 border">Pay Date</th>
            <th className="px-4 py-2 border">Amount</th>
            <th className="px-4 py-2 border">Yield</th>
            <th className="px-4 py-2 border">Price</th>
            <th className="px-4 py-2 border">4w Volume</th>
            <th className="px-4 py-2 border">Total Value</th>
            <th className="px-4 py-2 border">Last Updated</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((row, idx) => (
            <tr key={idx} className="hover:bg-gray-50 transition-colors">
              <td className="px-4 py-2 border font-mono font-bold text-blue-600">{row.Code}</td>
              <td className="px-4 py-2 border text-sm">{row.Company}</td>
              <td className="px-4 py-2 border text-sm">{row["Ex Date"]}</td>
              <td className="px-4 py-2 border text-sm">{row["Pay Date"]}</td>
              <td className="px-4 py-2 border font-medium text-green-700">${row.Amount?.toFixed(2) ?? "0.00"}</td>
              <td className="px-4 py-2 border text-sm">{row.Yield}%</td>
              <td className="px-4 py-2 border text-sm">{row.Price}$</td>
              <td className="px-4 py-2 border text-sm">{row["4w Volume"]?.toLocaleString('de-DE') ?? "0"}$</td>
              <td className="px-4 py-2 border text-sm">{row["Total Value"]?.toLocaleString('de-DE') ?? "0"}$</td>
              <td className="px-4 py-2 border text-xs text-gray-400">
                {isClient ? new Date(row["Last Updated"]).toLocaleString([], {
                  dateStyle: 'short',
                  timeStyle: 'short'
                }) : "---"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}