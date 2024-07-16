import { memo } from "react";
import useSWR from "swr"
interface result{
    total:number;
}
interface inputprops{
    type1:string;
    title:string;
    color:string;
}
async function fetcher(url:string):Promise<result>{
    let token=localStorage.getItem("token");
    if (!token) throw Error;
    let result=await fetch(url,{
        headers:{
            authorization:token
        }
    })
    return result.json();
}
export const GeneralSales=memo(function ({type1,color,title}:inputprops){
    const {data,error,isLoading} =useSWR<result>("http://localhost:3000/api/v1/admin/"+type1,fetcher);
    if (error || !data){
        console.log(error);
        return;
    }
    // '#EE741F'
    else{
        return (
            <div className="w-1/2 md:w-1/3  h-full flex flex-col items-center gap-4 p-2" style={{backgroundColor:color}}>
                <div className="text-xl">{title}</div>
                 {(!isLoading)?<div className="text-3xl">${(!data.total)?0:data.total}</div>:""}
            </div>
        )   
    }
})