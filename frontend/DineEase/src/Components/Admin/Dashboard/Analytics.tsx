import { ChartOne } from "./ChartOne";
import { ChartThree } from "./PieChart";

export function Analytics() {
  return (
    <div className="w-full px-4">
      <h1 className="font-serif font-bold text-3xl mt-4 mb-6 text-center text-brand-maroon">Analytics</h1>

      <div className="flex flex-col items-center justify-center gap-12 pb-32">
        <div className="w-full max-w-2xl rounded-2xl border border-brand-cream-dark shadow-card p-4 bg-white">
          <ChartThree />
        </div>

        <div className="w-full max-w-2xl h-full rounded-2xl border border-brand-cream-dark shadow-card p-4 bg-white">
          <ChartOne />
        </div>
      </div>
    </div>
  );
}
