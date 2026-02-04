import { getDividends } from "../lib/getDividends";
import { getScraperStatus } from "../lib/getScraperStatus";
import DividendContainer from "../components/DividendContainer";

export default async function Page() {
    // Check data and job status in parallel
    const [data, isCurrentlyScraping] = await Promise.all([
        getDividends(),
        getScraperStatus()
    ]);

    return (
      <main className="p-8 max-w-7xl mx-auto">
        {/* Pass the server-checked status as the initial loading state */}
        <DividendContainer initialData={data} isInitiallyLoading={isCurrentlyScraping} />
      </main>
    );
}