"use client";

import { useState } from 'react';
import { DividendData } from '../types/dividends';

export default function DividendTable({ initialData }: { initialData: DividendData[] }) {
  const [search, setSearch] = useState('');

  const filteredData = initialData.filter(item => 
    item.code.toLowerCase().includes(search.toLowerCase()) ||
    item.company.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="overflow-x-auto">
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
            <th className="px-4 py-2 border">4W Volume</th>
            <th className="px-4 py-2 border">Total Value</th>
            <th className="px-4 py-2 border">Last Update</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((row, idx) => (
            <tr key={idx} className="hover:bg-gray-50 transition-colors">
              <td className="px-4 py-2 border font-mono font-bold text-blue-600">{row.code}</td>
              <td className="px-4 py-2 border text-sm">{row.company}</td>
              <td className="px-4 py-2 border text-sm">{row.ex_date}</td>
              <td className="px-4 py-2 border text-sm">{row.pay_date}</td>
              <td className="px-4 py-2 border font-medium text-green-700">${row.amount.toFixed(2)}</td>
              <td className="px-4 py-2 border text-sm">{row.yield}%</td>
              <td className="px-4 py-2 border text-sm">{row.price}%</td>
              <td className="px-4 py-2 border text-sm">{row.fw_volume}%</td>
              <td className="px-4 py-2 border text-sm">{row.total_value}%</td>
              <td className="px-4 py-2 border text-xs text-gray-400">
                {new Date(row.last_update).toLocaleString([], {
                  dateStyle: 'short',
                  timeStyle: 'short'
                })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}