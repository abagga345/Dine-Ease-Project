import { ApexOptions } from "apexcharts";
import { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";


interface ChartThreeState {
  series: number[];
  labels: string[];
}

export const getOrderCount = async () => {
  try {
    let token=localStorage.getItem("token");
    if (token===undefined || token===null){
      throw new Error("Unauthorized please signin again");
    }
    const url= import.meta.env.VITE_API_URL || import.meta.env.VITE_DOCKER_URL || 'https://dine-ease.coderspro.xyz/';
    const response = await fetch(`${url}api/v1/admin/ordercounts`,{
      headers:{
        Authorization:token
      }
    }); 


    if (!response.ok) {
      throw new Error("Failed to fetch order counts");
    }
    const data = await response.json();
    let unconfirmed=0,processing=0,dispatched=0,delivered=0,rejected=0;
    for(let i=0;i<data.orderCounts.length;i++){
      if (data.orderCounts[i].status=="Unconfirmed"){
        unconfirmed=data.orderCounts[i]["_count"]["id"];
      }
      else if  (data.orderCounts[i].status=="Processing"){
        processing=data.orderCounts[i]["_count"]["id"];
      }
      else if (data.orderCounts[i].status=="Dispatched"){
        dispatched=data.orderCounts[i]["_count"]["id"];
      }
      else if  (data.orderCounts[i].status=="Delivered"){
        delivered=data.orderCounts[i]["_count"]["id"];
      }
      else if  (data.orderCounts[i].status=="Rejected"){
        rejected=data.orderCounts[i]["_count"]["id"];
      }
    }

    // Return the counts mapped to status labels
    return {
      Unconfirmed: unconfirmed,
      Processing: processing,
      Dispatched: dispatched,
      Delivered: delivered,
      Rejected: rejected,
    };
  } catch (error) {
    console.error("Error fetching order counts:", error);
    return {};
  }
};

const options: ApexOptions = {
  chart: {
    fontFamily: "Satoshi, sans-serif",
    type: "donut",
  },
  colors: ["#C75B2A", "#E0A500", "#7B1E1E", "#6B8E23", "#5C4F42"],
  // labels: ['Desktop', 'Tablet', 'Mobile', 'Unknown'],
  legend: {
    show: false,
    position: "bottom",
  },

  plotOptions: {
    pie: {
      donut: {
        size: "65%",
        background: "transparent",
      },
    },
  },
  dataLabels: {
    enabled: false,
  },
  responsive: [
    {
      breakpoint: 2600,
      options: {
        chart: {
          width: 380,
        },
      },
    },
    {
      breakpoint: 640,
      options: {
        chart: {
          width: 200,
        },
      },
    },
  ],
};

export const ChartThree: React.FC = () => {
  const [state, setState] = useState<ChartThreeState>({
    series: [],
    labels: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const orderCounts = await getOrderCount();

        const labels = Object.keys(orderCounts);
        const series = Object.values(orderCounts);

        setState({
          series,
          labels,
        });
      } catch (error) {
        console.error("Error updating chart data", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="sm:px-7.5 col-span-12 border border-brand-cream-dark bg-white px-5 pb-5 pt-7.5 shadow-card xl:col-span-5 rounded-2xl">
      <div className="mb-3 justify-between gap-4 sm:flex">
        <div>
          <h5 className="text-xl font-serif font-semibold text-brand-maroon">
            Order Status
          </h5>
        </div>
      </div>

      <div className="mb-2">
        <div id="chartThree" className="mx-auto flex justify-center">
        {state.series.length > 0 && (
          <ReactApexChart
          options={{ ...options, labels: state.labels }}
          series={state.series}
          type="donut"
          />
      )}
        </div>
      </div>

      <div className="-mx-8 flex flex-wrap items-center gap-y-3">
        {state.labels.map((label, index) => (
          <div className="sm:w-1/2 w-full px-8" key={index}>
            <div className="flex w-full items-center">
              <span
                className="mr-2 block h-3 w-full max-w-3 rounded-full"
                style={{
                  backgroundColor:
                  options.colors![index % options.colors!.length],
                }}
              ></span>
              <p className="flex w-full justify-between text-sm font-medium">
                <span>{label}</span>
                <span>{state.series[index]}</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};


