import { columns } from "./columns"
import { DataTable } from "@/components/ui/data-table"

async function getData() {
  // Replace with your actual local or production URL
  const res = await fetch('http://localhost:3000/api/dividends', { cache: 'no-store' });
  
  if (!res.ok) throw new Error("Failed to fetch data");
  return res.json();
}

export default async function DemoPage() {
  const data = await getData()

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold tracking-tight">ASX Dividends</h1>
      </div>
      <DataTable columns={columns} data={data} />
    </div>
  )
}