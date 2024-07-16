import React from "react"
import { AllOrders } from "./AllOrders"
import { AdminDashboard } from "./AdminDashboard"
import { MonthlySales } from "./MonthlySales"
import { TodaySales } from "./TodaySales"
import { GeneralSales } from "./GeneralSales"
import PersistentDrawerLeft from "./Dashboard"
import Dashboard from "./Dashboard"
export function MainScreenHome(){
    return (
        <Dashboard></Dashboard>
    )
    return (
    <AdminDashboard>
        <div className="h-full w-full p-4 flex flex-col gap-10">
            <div className="border w-full">
                <h2 className="font-bold text-3xl">Orders</h2>
            </div>

            <div className="flex gap-3 w-full h-2/6">
                <GeneralSales title={"Today Sales"} type1={"totaldaysales"} color={"#EE741F"}></GeneralSales>
                <GeneralSales title={"Monthly Sales"} type1={"totalmonthlysales"} color={"#17B31B"}></GeneralSales>
            </div>

            <div className="border h-5/6">
                {/* <div className="border">
                    
                </div> */}

                
                <div className="grid grid-cols-4 justify-items-center">
                    <div className="justify-self-start">Order Id</div>
                    <div>Status</div>
                    <div>Date</div>
                    <div className="justify-self-end">Total</div>
                    </div>
                    <AllOrders></AllOrders>
                </div>
            
        </div>
    </AdminDashboard>
    )
}