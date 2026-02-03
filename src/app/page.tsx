import DividendTable from "../components/DividendTable";
import { getDividends } from "../lib/getDividends";

export default async function Page() {
    // Direct function call - no HTTP request needed!
    const data = await getDividends();

    return (
        <main className="p-8">
            <h1 className="text-2xl font-bold mb-6">ASX Dividend Tracker</h1>
            <DividendTable initialData={data} />
        </main>
    );
}