import React from "react"
import { Sidebar } from "./SideBar"
import { MainScreenHome } from "./MainScreenHome"
import { Routes,Route } from "react-router-dom"
import { MainScreenMenu } from "./MainScreenMenu"
export function AdminDashboard({children}){
    return (
        <div className="grid grid-cols-6 ">
            <div className="col-span-1 bg-red-500 ">
                <Sidebar></Sidebar>
            </div>
            <div className="col-span-5 bg-blue-500">
                {children}
           </div>
        </div>
    )
}