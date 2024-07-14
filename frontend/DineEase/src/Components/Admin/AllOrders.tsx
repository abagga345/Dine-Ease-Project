import { useEffect, useState } from "react";
import useSWR from "swr"
import { OrderComponent } from "./OrderComponent";
import { useNavigate } from "react-router-dom";
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
    if (!token) return new Promise(()=>{});
    let response=await fetch(url,{
        headers:{
            "authorization":token,
        }
    });
    return response.json();
}

function MappingOrders({orders}:AllOrders){
    return (
        <div>
            {orders.map((element:OrderType)=>{
                return (
                    <OrderComponent OrderId={element.id} Total={element.amount} Status={element.status} Date={element.timestamp.split("T")[0]}></OrderComponent>
                )
            })}
        </div>
    )
}
export function AllOrders(){
    const navigate=useNavigate();
    const [skipcnt,setSkipCnt]=useState(1);
    let token=localStorage.getItem("token");
    if (token===null){
        navigate("/admin/signin");
        return;
    }
    const {data,error,isLoading} =useSWR<AllOrders>(`http://localhost:3000/api/v1/admin/allorders?skipcnt=${skipcnt}`,fetcher);
    if (error){

    }
    else if (isLoading){

    }
    else{
    return (
        <div>
            <div>
                {(data!==undefined)?<MappingOrders orders={data.orders}></MappingOrders>:""}
            </div>
            <div className="flex justify-end">
                <button>Previous</button>
                <button>Next</button>
            </div>
        </div>
    )
    }
}


