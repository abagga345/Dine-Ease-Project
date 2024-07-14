export interface OrderProps{
    OrderId:number;
    Status:"Pending" | "Completed" | "Cancelled";
    Date:string,
    Total:number
}
export function OrderComponent({OrderId,Status,Date,Total}:OrderProps){
    return (
        <div className="flex justify-between">
            <div>{OrderId}</div>
            <div>{Status}</div>
            <div>{Date}</div>
            <div>{Total}</div>
        </div>
    )
}