import { ChartOne } from "./ChartOne";
import { ChartThree } from "./PieChart";

export function Analytics() {
  return (
    <div className="w-full px-4">
      <p className="font-semibold text-3xl mt-4 mb-6 text-center">Analytics</p>
      
      <div className="flex flex-col items-center justify-center gap-12 pb-32">
        <div className="w-full max-w-2xl rounded-xl shadow-md p-4 bg-white">
          <ChartThree />
        </div>
        
        <div className="w-full max-w-2xl h-full shadow-md rounded-xl p-4 bg-white">
          <ChartOne />
        </div>
      </div>
    </div>
  );
}
