import { memo, useEffect, useState } from "react";
import useSWR from "swr"
import { OrderComponent } from "./OrderComponent";
import { useNavigate } from "react-router-dom";
import { PageChanger } from "./PageChanger";
interface OrderType{
    id:number;
    timestamp:string;
    amount:number;
    status:"Pending" | "Cancelled" | "Completed"
}
interface AllOrders{
    orders:OrderType[];
}

async function fetcher(url:string):Promise<AllOrders>{
    let token=localStorage.getItem("token");
    if (!token) throw Error;
    let response=await fetch(url,{
        headers:{
            "authorization":token,
        }
    });
    return response.json();
}

function MappingOrders({orders}:AllOrders){
    return (
        <div className="flex flex-col h-full w-full gap-2">
         {orders.map((element:OrderType)=>{
                return (
                    <OrderComponent key={element.id} OrderId={element.id} Total={element.amount} Status={element.status} Date={element.timestamp.split("T")[0]}></OrderComponent>
                )
            })}
        </div>
    )
}
export const AllOrders=memo(function (){
    const navigate=useNavigate();
    const [skipcnt,setSkipCnt]=useState(1);
    let token=localStorage.getItem("token");
    if (token===null){
        navigate("/admin/signin");
        return;
    }
    const {data,error,isLoading} =useSWR<AllOrders>(`http://localhost:3000/api/v1/admin/allorders?skipcnt=${skipcnt}`,fetcher);
    if (error){
        navigate("/admin/notfound");
    }
    else if (isLoading){
        
    }
    else{
    return (
    <>
        <div className="grid grid-cols-4 justify-items-center border-b-2">
            <div className="justify-self-start font-bold">Order Id</div>
            <div className="font-bold">Status</div>
            <div className="font-bold">Date</div>
            <div className="justify-self-end font-bold">Total</div>
        </div>
        <div className="flex flex-col justify-between h-full">
            <div className="mt-1 h-full w-full">
                {(data !== undefined) ? <MappingOrders orders={data.orders}></MappingOrders> : ""}
            </div>
            <div className="flex justify-center mt-2 mb-3">
                <PageChanger skipcnt={skipcnt} setSkipCnt={setSkipCnt}></PageChanger>
            </div>
        </div>
    </>

        
    )
    }
})


