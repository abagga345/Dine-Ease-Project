import React from "react"
import { AllOrders } from "./AllOrders"
import { AdminDashboard } from "./AdminDashboard"
export function MainScreenHome(){
    return (
    <AdminDashboard>
        <div>
            <div>
                Orders
            </div>

            <div>

            </div>

            <div>
                <div>

                </div>

                <div>
                    <div className="flex justify-between">
                        <div>Order Id</div>
                        <div>Status</div>
                        <div>Date</div>
                        <div>Total</div>
                    </div>
                    <AllOrders></AllOrders>
                </div>
            </div>
            
        </div>
    </AdminDashboard>
    )
}