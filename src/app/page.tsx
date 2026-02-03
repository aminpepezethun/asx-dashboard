import { getDividends } from "../lib/getDividends";
import DividendContainer from "../components/DividendContainer";

export default async function Page() {
    // Server-side fetch
    const data = await getDividends();

    return (
      <main className="p-8 max-w-7xl mx-auto">
        <DividendContainer initialData={data} />
      </main>
    );
}