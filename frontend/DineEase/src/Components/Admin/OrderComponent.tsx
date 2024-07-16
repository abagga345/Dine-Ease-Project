export interface OrderProps{
    OrderId:number;
    Status:"Pending" | "Completed" | "Cancelled";
    Date:string,
    Total:number
}
export function OrderComponent({OrderId,Status,Date,Total}:OrderProps){
    return (
        <div className="grid grid-cols-4 justify-items-center border-b-2">
            <div className="justify-self-start">#{OrderId}</div>
            <div>{Status}</div>
            <div>{Date}</div>
            <div className="justify-self-end">${Total}</div>
        </div>
    )
}