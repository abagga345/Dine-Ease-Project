import useSWR from "swr"

import { AnOrder } from "./AnOrder";
import { DashboardWrapper } from "./DashboardWrapper";
interface Order{
    id: number;
    amount: number;
    description: string;
    status: "Pending" | "Cancelled" | "Completed";
    username: string;
    timestamp: string;
    items : Items[];
}
interface Details {
    title : string,
}
interface Items {
  id : number,
  quantity : number,
  itemId : number,
  orderId : number,
  item : Details
}
interface resultdata{
  orders:Order[]
}

async function fetcher(url:string):Promise<resultdata>{
  let token=localStorage.getItem("token");
  if (token===null) throw Error;
  let result1=await fetch(url,{
    headers:{
      authorization:token
    }
  })
  return result1.json();
}



export function AdminOrders() {
  const {data,error,isLoading}=useSWR<resultdata>('http://localhost:3000/api/v1/admin/pendingorders',fetcher);
  
  if (error || data===undefined){
    //404 page

    return;
  }
  else if (isLoading){

    return;
  }
  else{
    return (
    <DashboardWrapper>
      <div className="grid grid-cols-1 sm:grid-cols-2 justify-items-center">
        {data.orders.map((item:Order)=>{
          return <AnOrder description={item.description} id={item.id} timestamp={item.timestamp} amount={item.amount} username={item.username} status={item.status} items={item.items}></AnOrder>
        })}
      </div>
      </DashboardWrapper>
    )
  }
}
